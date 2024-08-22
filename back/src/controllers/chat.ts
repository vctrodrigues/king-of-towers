import WebSocket from "ws";

import { DBService } from "../service/db";
import { chatService } from "../service/chat";

import { serialize } from "../utils/serialize";

import { EventName } from "../enums/event";

import { User } from "../types/user";
import { Message } from "../types/chat";

export const chatController = (
  ws: WebSocket,
  dbService: DBService<Message>
) => {
  const _chatService = chatService(dbService);

  return {
    create: ({ user, text }: { user: User; text: string }) => {
      console.log(`> Sending message`);

      try {
        const message = _chatService.create(user, text);

        console.log(`> Message sent: ${message.text}`);

        return message;
      } catch (error) {
        console.log(`> Error sending message`);
        ws.send(
          serialize(EventName.ChatMessage, { error: error.message }, false)
        );
      }
    },
  };
};
