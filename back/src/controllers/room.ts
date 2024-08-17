import WebSocket from "ws";
import crypto from "crypto";

import { roomService } from "../service/room";
import { DBService } from "../service/db";
import { serialize } from "../utils/serialize";

import { EventName } from "../enums/event";

import type { Room } from "../types/room";
import type { User } from "../types/user";

export const roomController = (ws: WebSocket, dbService: DBService<Room>) => {
  const _roomService = roomService(dbService);

  return {
    create: ({ user }: { user: User }) => {
      console.log(`> Creating room`);

      if (!user) {
        console.log(`> User not found`);
        ws.send(
          serialize(EventName.RoomCreate, { error: "User not found" }, false)
        );
        return;
      }

      const uid = crypto
        .createHmac("sha256", `${new Date().toUTCString()}`)
        .update(user.session)
        .digest("hex")
        .replace(/[^0-9]/gm, "")
        .substring(0, 6);

      try {
        const room = _roomService.create(uid, user);

        console.log(`> Room created: ${room.uid}`);
        ws.send(serialize(EventName.RoomCreate, room));

        return room;
      } catch (error) {
        console.log(`> Error creating room for user [${user.session}]`);
        ws.send(
          serialize(EventName.RoomCreate, { error: error.message }, false)
        );
      }
    },

    join: ({ user, uid }: { user: User; uid: string }) => {
      console.log(`> Joining room [${uid}]`);

      try {
        const room = _roomService.join(uid, user);

        console.log(`> Room joined: ${room.uid}`);
        ws.send(serialize(EventName.RoomJoin, room));

        return room;
      } catch (error) {
        console.log(`> Error joining room [${uid}]`);
        ws.send(serialize(EventName.RoomJoin, { error: error.message }, false));
      }
    },

    ready: ({ uid, user }: { uid: string; user: User }) => {
      console.log(`> Updating [${user.name}] state in [${uid}]`);

      try {
        const room = _roomService.ready(uid, user);

        console.log(`> User [${user.name}] is ready in room [${room.uid}]`);
        ws.send(serialize(EventName.RoomUpdate, room));

        return room;
      } catch (error) {
        console.log(`> Error readying in room [${uid}]`);
        ws.send(
          serialize(EventName.RoomReady, { error: error.message }, false)
        );
      }
    },

    start: ({ uid }: { uid: string }) => {
      console.log(`> Starting room [${uid}]`);

      try {
        const room = _roomService.start(uid);

        console.log(`> Room [${room.uid}] started`);

        return room;
      } catch (error) {
        console.log(`> Error starting room [${uid}]`);
        ws.send(
          serialize(EventName.RoomStart, { error: error.message }, false)
        );
      }
    },

    finish: ({ uid }: { uid: string }) => {
      console.log(`> Finishing room [${uid}]`);

      try {
        const room = _roomService.finish(uid);

        console.log(`> Room [${room.uid}] finished`);

        return room;
      } catch (error) {
        console.log(`> Error finishing room [${uid}]`);
        ws.send(
          serialize(EventName.RoomFinish, { error: error.message }, false)
        );
      }
    },

    destroy: ({ uid }: { uid: string }) => {
      console.log(`> Destroying room [${uid}]`);

      try {
        _roomService.destroy(uid);

        console.log(`> Room [${uid}] destroyed`);
      } catch (error) {
        console.log(`> Error destroying room [${uid}]`);
        ws.send(
          serialize(EventName.RoomDestroy, { error: error.message }, false)
        );
      }
    },

    findByUserSession: (session: string) => {
      console.log(`> Finding room from user [${session}]`);

      try {
        const room = _roomService.findByUserSession(session);

        console.log(`> Room found from user [${session}]`);

        return room;
      } catch (error) {
        console.log(`> None room found from user [${session}]`);
      }
    },
  };
};
