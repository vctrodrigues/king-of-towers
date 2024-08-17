import WebSocket, { WebSocketServer } from "ws";
import { IncomingMessage } from "http";

import { appController } from "./controllers/app";
import { userController } from "./controllers/user";
import { roomController } from "./controllers/room";

import { dbService } from "./service/db";

import { compose } from "./utils/compose";
import { interceptor } from "./utils/interceptor";
import { deserialize, serialize } from "./utils/serialize";

import { EventName } from "./enums/event";

import { SECOND_IN_MILLIS, TIMEOUT_LIMIT } from "./const";

import type { User } from "./types/user";
import type { Room } from "./types/room";
import { RoomState } from "./enums/room";
import { UserRole } from "./enums/role";

const wss = new WebSocketServer({ port: 8080 });

console.log("> Server started");

const userDB = dbService<User>("code");
const roomDB = dbService<Room>("uid");

console.log("> User DB initialized");

const pool: Record<
  string,
  {
    ws: WebSocket;
    user: User;
    timeout: NodeJS.Timeout;
  }
> = {};

wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
  const url = new URL(`localhost:8080${req.url}`);
  const session = url.searchParams.get("session") ?? "";

  const _appController = appController(ws);
  const _userController = userController(ws, userDB);
  const _roomController = roomController(ws, roomDB);

  if (pool[session]) {
    console.log(`> Reconnected [${session}]`);
    clearTimeout(pool[session].timeout);
    pool[session].ws = ws;
    pool[session].user = _userController.getBySession({ session });
  } else {
    console.log("> New client connected");
  }

  pool[session] = {
    ws,
    user: null,
    timeout: null,
  };

  const EVENTS = {
    [EventName.UserRetrieve]: interceptor<{ session: string }>(({ session }) =>
      compose(() => _userController.getBySession({ session }))
    ),

    [EventName.UserCreate]: interceptor<{ name: string }>(({ name }) => {
      const user = _userController.create({ name, session });

      pool[session].user = user;
    }),

    [EventName.UserDelete]: interceptor<{ code: string }>(
      _userController.delete
    ),

    [EventName.RoomJoin]: interceptor<{ user: User; uid: string }>(
      ({ user, uid }) => {
        const room = _roomController.join({ user, uid });

        room.users.forEach(({ session }) => {
          if (session === user.session) {
            return;
          }

          pool[session].ws.send(serialize(EventName.RoomUpdate, room));
        });
      }
    ),

    [EventName.RoomInviteAnswer]: interceptor<{
      room: Room;
      accepted: boolean;
    }>(({ room, accepted }) => {
      console.log(`> Room [${room.uid}] invite answer [${accepted}]`);

      const host = room.users[0].session;

      pool[host].ws.send(serialize(EventName.RoomInviteAnswer, {}));
    }),

    [EventName.RoomCreate]: interceptor<{ user: User }>(({ user }) => {
      const room = _roomController.create({ user });

      pool[session].ws.send(serialize(EventName.RoomCreate, room));
    }),

    [EventName.RoomReady]: interceptor<{ uid: string; user: User }>(
      ({ uid, user }) => {
        const room = _roomController.ready({ uid, user });

        room.users.forEach(({ session }) => {
          if (session === user.session) {
            return;
          }

          pool[session].ws.send(serialize(EventName.RoomUpdate, room));
        });

        if (
          room.users.every(
            ({ role, state }) =>
              role === UserRole.Player && state === RoomState.Ready
          )
        ) {
          _roomController.start({ uid: room.uid });

          room.users.forEach(({ session }) => {
            pool[session].ws.send(serialize(EventName.RoomStart, room));
          });
        }
      }
    ),
  };

  ws.on("message", (payload: string) => {
    const { event, data } = deserialize(payload);

    console.log(`> Received message [${event}]`);

    EVENTS[event as keyof typeof EVENTS]?.(data);
  });

  ws.on(
    "close",
    () =>
      (pool[session].timeout = setTimeout(() => {
        compose(
          () => _userController.deleteBySession({ session }),
          () => {
            const room = _roomController.findByUserSession(session);

            if (room) {
              _roomController.destroy({ uid: room.uid });

              room.users.forEach(({ session: _session }) => {
                if (session === _session) {
                  return;
                }

                pool[_session].ws.send(
                  serialize(EventName.RoomFinish, {
                    room: {},
                    loser: session,
                    winner: room.users.find(
                      (user) =>
                        user.session !== _session &&
                        user.role === UserRole.Player
                    ),
                  })
                );
              });
            }
          },
          _appController.close
        );
      }, SECOND_IN_MILLIS * TIMEOUT_LIMIT))
  );
});
