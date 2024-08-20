import { UserAttributes } from "user";

export type Game = {
  room: string;
  users: Record<string, UserAttributes>;
};
