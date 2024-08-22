import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import type {} from "@redux-devtools/extension";
import { Message } from "@/types/chat";

interface ChatState {
  chat: Array<Message>;
  addMessage: (message: Message) => void;
}

export const useChatStore = create<ChatState>()(
  devtools(
    persist(
      (set, get) => ({
        chat: [],
        addMessage: (message) => set({ chat: [...get().chat, message] }),
      }),
      {
        name: "chat-storage",
      }
    )
  )
);
