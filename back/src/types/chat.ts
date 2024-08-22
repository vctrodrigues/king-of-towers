import { User } from "./user";

export type Message = {
  user: User;
  text: string;
  date: number;
};
