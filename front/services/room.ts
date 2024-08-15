"use client";

import { WebSocketService } from "./ws";
import { RoomEvents } from "@/enums/events/room";

import type { Room } from "@/types/room";
import type { WebSocketData } from "@/types/ws";
import type { User } from "@/types/user";

interface RoomServiceConfig {
  ws: WebSocketService;
  setRoom: (room?: Room) => void;
}

export class RoomService {
  constructor(private config: RoomServiceConfig) {
    this.config = config;

    const setRoom = (data: WebSocketData<Room>) => {
      if (!data.success) {
        console.error(data.error);
        return;
      }

      this.config.setRoom(data.data as Room);
    };

    this.config.ws.on(RoomEvents.Join, setRoom);
    this.config.ws.on(RoomEvents.Create, setRoom);
  }

  create(user: User) {
    this.config.ws.send(RoomEvents.Create, { user });
  }

  join(code: string) {
    this.config.ws.send(RoomEvents.Join, { code });
  }
}
