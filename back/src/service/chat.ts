import { DBService } from "./db";

import { User } from "../types/user";
import { Message } from "chat";

export const chatService = (dbService: DBService<Message>) => ({
  create: (user: User, text: string) => {
    const chat: Message = {
      user,
      text,
      date: new Date().getTime(),
    };

    dbService.save(chat);

    return chat;
  },

  destroy: (date: number) => {
    dbService.delete({ date });
  },

  list: () => {
    return dbService.findAll();
  },
});
