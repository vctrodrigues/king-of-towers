"use client";

import { WebSocketService } from "./ws";
import { ChatEvents } from "@/enums/events/chat";

import type { Message } from "@/types/chat";
import type { WebSockerError, WebSocketData } from "@/types/ws";
import type { User } from "@/types/user";

interface ChatServiceConfig {
  ws: WebSocketService;
  addMessage: (message: Message) => void;
}

export class ChatService {
  constructor(private config: ChatServiceConfig) {
    this.config = config;

    const addMessage = (data: WebSocketData<Message>) => {
      if (!data.success) {
        console.error((data.data as WebSockerError).error);
        return;
      }

      if ((data.data as WebSockerError).error) {
        return;
      }

      this.config.addMessage(data.data as Message);
    };

    this.config.ws.on(ChatEvents.Message, addMessage);
  }

  sendMessage(text: string, user: User) {
    this.config.ws.send(ChatEvents.Message, { text, user });
  }
}
