"use client";

import { WebSocketService } from "./ws";
import { UserEvents } from "@/enums/events/user";

import type { User } from "@/types/user";
import type { WebSocketData } from "@/types/ws";

interface UserServiceConfig {
  ws: WebSocketService;
  setUser: (user: User) => void;
}

export class UserService {
  constructor(private config: UserServiceConfig) {
    this.config = config;

    const createUser = (data: WebSocketData<User>) => {
      if (!data.success) {
        console.error(data.error);
        return;
      }

      this.config.setUser(data.data as User);
    };

    const retrieveUser = (data: WebSocketData<User>) => {
      if (!data.success) {
        this.config.setUser({} as User);
        return;
      }

      this.config.setUser(data.data as User);
    };

    const deleteUser = (data: WebSocketData<User>) => {
      if (!data.success) {
        console.error(data.error);
        return;
      }

      this.config.setUser({} as User);
    };

    this.config.ws.on(UserEvents.Get, retrieveUser);
    this.config.ws.on(UserEvents.Create, createUser);
    this.config.ws.on(UserEvents.Delete, deleteUser);
  }

  create(name: string) {
    this.config.ws.send(UserEvents.Create, { name });
  }

  delete(code: string) {
    this.config.ws.send(UserEvents.Delete, { code });
  }
}
