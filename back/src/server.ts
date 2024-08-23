import WebSocket, { WebSocketServer } from "ws";
import { IncomingMessage } from "http";

import { appController } from "./controllers/app";
import { userController } from "./controllers/user";
import { roomController } from "./controllers/room";
import { gameController } from "./controllers/game";

import { dbService } from "./service/db";

import { compose } from "./utils/compose";
import { interceptor } from "./utils/interceptor";
import { deserialize, serialize } from "./utils/serialize";

import { EventName } from "./enums/event";

import {
  COINS_FARM_RATE,
  SECOND_IN_MILLIS,
  TIMEOUT_LIMIT,
  UPDATING_INTERVAL,
} from "./const";

import { RoomState } from "./enums/room";
import { UserRole } from "./enums/role";

import type { User } from "./types/user";
import type { Room } from "./types/room";
import type { Game } from "./types/game";
import type { DefenseTowerType } from "./types/towers";
import { Message } from "chat";
import { chatController } from "./controllers/chat";

const wss = new WebSocketServer({ port: 8080 });

console.log("> Server started");

const userDB = dbService<User>("code");
console.log("> User DB initialized");

const roomDB = dbService<Room>("uid");
console.log("> Room DB initialized");

const gameDB = dbService<Game>("room");
console.log("> Game DB initialized");

const chatDB = dbService<Message>("date");
console.log("> Chat DB initialized");

const pool: Record<
  string,
  {
    ws: WebSocket;
    user: User;
    timeout: NodeJS.Timeout;
    _gameController: ReturnType<typeof gameController>;
    interval: NodeJS.Timeout;
  }
> = {};

wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
  const url = new URL(`localhost:8080${req.url}`);
  const session = url.searchParams.get("session") ?? "";

  const _appController = appController(ws);
  const _userController = userController(ws, userDB);
  const _roomController = roomController(ws, roomDB);
  const _gameController = gameController(ws, gameDB);
  const _chatController = chatController(ws, chatDB);

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
    _gameController,
    interval: null,
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

          const game = _gameController.create({
            room: room.uid,
            users: room.users,
          });

          room.users.forEach(({ session }) => {
            pool[session].ws.send(serialize(EventName.RoomStart, room));
            pool[session].ws.send(serialize(EventName.GameCreate, game));
          });

          let interval: NodeJS.Timeout = null;

          interval = setInterval(() => {
            const [user1, user2] = room.users.filter(
              ({ role }) => role === UserRole.Player
            );

            let _game = pool[user1.session]._gameController.earn({
              game,
              user: user1.session,
              amount: COINS_FARM_RATE,
            });

            pool[user1.session].ws.send(
              serialize(EventName.GameEarn, {
                game: _game,
                user: user1,
                amount: COINS_FARM_RATE,
              })
            );

            _game = pool[user2.session]._gameController.earn({
              game,
              user: user2.session,
              amount: COINS_FARM_RATE,
            });

            pool[user2.session].ws.send(
              serialize(EventName.GameEarn, {
                game: _game,
                user: user2,
                amount: COINS_FARM_RATE,
              })
            );

            pool[user1.session].interval = interval;
            pool[user2.session].interval = interval;
          }, UPDATING_INTERVAL);
        }
      }
    ),

    [EventName.GameBuy]: interceptor<{
      uid: string;
      user: User;
      slot: number;
      type: DefenseTowerType;
    }>(({ uid, user, slot, type }) => {
      const room = _roomController.findByUserSession(user.session);
      let game = _gameController.get({ room: uid });
      const payload = _gameController.buyDefenseTower({
        game,
        user: user.session,
        slot,
        type,
      });

      if (!payload) {
        return;
      }

      room.users.forEach(({ session }) => {
        pool[session].ws.send(
          serialize(EventName.GameBuy, {
            ...payload,
            isOpponent: session !== user.session,
          })
        );
      });
    }),

    [EventName.GameAttack]: interceptor<{
      uid: string;
      user: User;
      damage: number;
    }>(({ uid, user, damage }) => {
      const room = _roomController.findByUserSession(user.session);
      let game = _gameController.get({ room: uid });

      const opponent = room.users.find(
        ({ session }) => session !== user.session
      );

      if (!opponent) {
        return;
      }

      const payload = _gameController.attack({
        game,
        opponent: opponent.session,
        damage,
      });

      if (!payload) {
        return;
      }

      room.users.forEach(({ session }) => {
        pool[session].ws.send(
          serialize(EventName.GameAttack, {
            ...payload,
            damage,
            isOpponent: session !== user.session,
          })
        );
      });

      // check if game is over
      const [user1, user2] = room.users.filter(
        (user) => user.role === UserRole.Player
      );

      let loser = null;
      let winner = null;

      if (payload.game.users[user1.session].kingTower.life <= 0) {
        loser = user1.session;
        winner = user2.session;
      } else if (payload.game.users[user2.session].kingTower.life <= 0) {
        loser = user2.session;
        winner = user1.session;
      }

      if (winner) {
        pool[user1.session].ws.send(
          serialize(EventName.GameOver, {
            room,
            win: user1.session === winner,
            winner,
            loser,
          })
        );

        pool[user2.session].ws.send(
          serialize(EventName.GameOver, {
            room,
            win: user2.session === winner,
            winner,
            loser,
          })
        );

        _gameController.destroy({ room: room.uid });
        clearInterval(pool[user1.session].interval);
        clearInterval(pool[user2.session].interval);
      }
    }),

    [EventName.GameUpgradeDefense]: interceptor<{
      uid: string;
      user: User;
      slot: number;
    }>(({ uid, user, slot }) => {
      const room = _roomController.findByUserSession(user.session);
      let game = _gameController.get({ room: uid });
      const payload = _gameController.upgradeDefenseTower({
        game,
        user: user.session,
        slot,
      });

      if (!payload) {
        return;
      }

      room.users.forEach(({ session }) => {
        pool[session].ws.send(
          serialize(EventName.GameUpgradeDefense, {
            ...payload,
            isOpponent: session !== user.session,
          })
        );
      });
    }),

    [EventName.GameUpgradeKing]: interceptor<{
      uid: string;
      user: User;
    }>(({ uid, user }) => {
      const room = _roomController.findByUserSession(user.session);
      let game = _gameController.get({ room: uid });
      const payload = _gameController.upgradeKingTower({
        game,
        user: user.session,
      });

      if (!payload) {
        return;
      }

      room.users.forEach(({ session }) => {
        pool[session].ws.send(
          serialize(EventName.GameUpgradeKing, {
            ...payload,
            isOpponent: session !== user.session,
          })
        );
      });
    }),

    [EventName.ChatMessage]: interceptor<{
      user: User;
      text: string;
    }>(({ user, text }) => {
      const message = _chatController.create({ user, text });

      Object.keys(pool).forEach((session) => {
        pool[session].ws.send(serialize(EventName.ChatMessage, message));
      });
    }),
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
