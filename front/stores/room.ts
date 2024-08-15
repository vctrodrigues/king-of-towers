import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import type {} from "@redux-devtools/extension";
import { Room } from "@/types/room";

interface RoomState {
  room?: Room;
  setRoom: (room?: Room) => void;
  updateRoom: (room: Partial<Room>) => void;
}

export const useRoomStore = create<RoomState>()(
  devtools(
    persist(
      (set) => ({
        setRoom: (room) => set({ room }),
        updateRoom: (room) =>
          set((state) =>
            state.room ? { room: { ...state.room, ...room } } : state
          ),
      }),
      {
        name: "room-storage",
      }
    )
  )
);
