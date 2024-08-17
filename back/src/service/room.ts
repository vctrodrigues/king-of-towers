import { DBService } from "./db";

import { UserRole } from "../enums/role";
import { RoomState } from "../enums/room";

import type { Room } from "../types/room";
import type { User } from "../types/user";

export const roomService = (dbService: DBService<Room>) => ({
  create: (uid: string, user: User) => {
    const room: Room = {
      uid,
      users: [
        {
          ...user,
          role: UserRole.Player,
          state: RoomState.Waiting,
        },
      ],
    };

    dbService.save(room);

    return room;
  },

  join: (uid: string, user: User) => {
    const room = dbService.find({ uid });

    if (!room) {
      throw new Error("Room not found");
    }

    if (
      room.users.filter((user) => user.role === UserRole.Player).length === 2
    ) {
      throw new Error("Room is full");
    }

    room.users.push({
      ...user,
      role: UserRole.Player,
      state: RoomState.Waiting,
    });

    dbService.update(room, { uid });

    return room;
  },

  ready: (uid: string, user: User) => {
    const room = dbService.find({ uid });

    if (!room) {
      throw new Error("Room not found");
    }

    const userIndex = room.users.findIndex(
      (_user) => _user.session === user.session
    );

    if (userIndex === -1) {
      throw new Error("User not found");
    }

    room.users[userIndex].state = RoomState.Ready;

    dbService.update(room, { uid });

    return room;
  },

  start: (uid: string) => {
    const room = dbService.find({ uid });

    if (!room) {
      throw new Error("Room not found");
    }

    room.users.forEach((user) => {
      user.state = RoomState.Playing;
    });

    dbService.update(room, { uid });

    return room;
  },

  finish: (uid: string) => {
    const room = dbService.find({ uid });

    if (!room) {
      throw new Error("Room not found");
    }

    room.users.forEach((user) => {
      user.state = RoomState.Finished;
    });

    dbService.update(room, { uid });

    return room;
  },

  destroy: (uid: string) => {
    dbService.delete({ uid });
  },

  findByUserSession: (session: string) => {
    return dbService
      .findAll()
      .find((room) => room.users.some((user) => user.session === session));
  },
});
