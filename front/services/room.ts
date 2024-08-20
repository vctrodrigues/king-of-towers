"use client";

import { WebSocketService } from "./ws";
import { RoomEvents } from "@/enums/events/room";

import type { Room } from "@/types/room";
import type { WebSocketData } from "@/types/ws";
import type { User } from "@/types/user";

interface RoomServiceConfig {
  ws: WebSocketService;
  setRoom: (room: Room) => void;
  start: () => void;
  finish: () => void;
}

export class RoomService {
  constructor(private config: RoomServiceConfig) {
    this.config = config;

    const setRoom = (data: WebSocketData<Room>) => {
      if (!data.success) {
        console.error(data.error);
        return;
      }

      if (!data.data) {
        return;
      }

      this.config.setRoom(data.data);
    };

    const startRoom = (data: WebSocketData<Room>) => {
      if (!data.success) {
        console.error(data.error);
        return;
      }

      if (!data.data) {
        return;
      }

      this.config.setRoom(data.data);
      this.config.start();
    };

    this.config.ws.on(RoomEvents.Join, setRoom);
    this.config.ws.on(RoomEvents.Create, setRoom);
    this.config.ws.on(RoomEvents.Update, setRoom);
    this.config.ws.on(RoomEvents.Start, startRoom);
  }

  create(user: User) {
    this.config.ws.send(RoomEvents.Create, { user });
  }

  join(user: User, uid: string) {
    this.config.ws.send(RoomEvents.Join, { user, uid });
  }

  ready(user: User, uid: string) {
    this.config.ws.send(RoomEvents.Ready, { user, uid });
  }
}
