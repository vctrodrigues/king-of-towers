import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import type {} from "@redux-devtools/extension";
import type { User } from "@/types/user";

interface UserState {
  user?: User;
  setUser: (user?: User) => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        setUser: (user) => set({ user }),
      }),
      {
        name: "user-storage",
      }
    )
  )
);
