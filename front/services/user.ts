"use client";

import { ws } from "./ws";
import { UserEvents } from "@/enums/events/user";

import type { User } from "@/types/user";
import type { WebSocketData } from "@/types/ws";

interface UserServiceConfig {
  session?: string;
  setUser: (user?: User) => void;
}

export const userService = {
  create: (name: string) => {
    ws.send(UserEvents.Create, { name });
  },

  delete: (code: string) => {
    ws.send(UserEvents.Delete, { code });
  },

  initialize: (config: UserServiceConfig) => {
    const createUser = <Data = User>(data: WebSocketData<Data>) => {
      if (!data.success) {
        console.error(data.error);
        return;
      }

      config.setUser(data.data as User);
    };

    const retrieveUser = <Data = User>(data: WebSocketData<Data>) => {
      if (!data.success) {
        config.setUser(undefined);
        return;
      }

      config.setUser(data.data as User);
    };

    ws.initialize(config.session);

    ws.on(UserEvents.Get, retrieveUser);
    ws.on(UserEvents.Create, createUser);
  },
};
