import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { v4 as uuid } from "uuid";

import type {} from "@redux-devtools/extension";

interface SessionState {
  session: string;
}

export const useSessionStore = create<SessionState>()(
  devtools(
    persist(
      () => ({
        session: uuid(),
      }),
      {
        name: "session-storage",
      }
    )
  )
);
