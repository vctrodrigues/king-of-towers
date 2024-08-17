import { UserRoomState } from "../enums/room";
import { User } from "./user";

export type UserRoomConfig = {
  role: "player" | "spectator";
  state: UserRoomState;
} & User;

export type Room = {
  uid: string;
  turn: User["session"];
  users: UserRoomConfig[];
  winner?: User["session"];
};

export type Invite = {
  room: Room;
  host: string;
};
