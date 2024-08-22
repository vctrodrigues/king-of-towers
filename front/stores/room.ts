import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import type {} from "@redux-devtools/extension";
import { Room, UserRoomConfig } from "@/types/room";
import { User } from "@/types/user";
import { UserRoomState } from "@/enums/room";
import { UserRole } from "@/enums/role";

interface RoomState {
  room: Room;
  isStarted: boolean;

  setRoom: (room: Room) => void;
  updateRoom: (room: Partial<Room>) => void;
  start: () => void;
  finish: () => void;

  userState: (user?: User) => UserRoomState;
  oponents: (user?: User) => UserRoomConfig[];
  spectators: () => UserRoomConfig[];
}

export const useRoomStore = create<RoomState>()(
  devtools(
    persist(
      (set, get) => ({
        room: {} as Room,
        isStarted: false,
        setRoom: (room) => set({ room }),
        updateRoom: (room) =>
          set((state) =>
            state.room ? { room: { ...state.room, ...room } } : state
          ),
        start: () => set({ isStarted: true }),
        finish: () => set({ isStarted: false }),
        userState: (user?: User) =>
          user
            ? get().room?.users?.find(({ code }) => code === user.code)
                ?.state ?? UserRoomState.Waiting
            : UserRoomState.Waiting,
        spectators: () =>
          get().room?.users?.filter(
            ({ role }) => role === UserRole.Spectator
          ) ?? [],
        oponents: (user?: User) =>
          user
            ? get().room?.users?.filter(
                ({ code, role }) =>
                  user.code !== code && role === UserRole.Player
              ) ?? []
            : [],
      }),
      {
        name: "room-storage",
      }
    )
  )
);
