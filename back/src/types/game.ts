import { UserAttributes } from "user";

export type Block = {
  index: number;
  mobs: Array<string>;
  deffenses: Array<string>;
  isEnd: boolean;
};

export type Path = {
  blocks: Block[];
};

export type Game = {
  room: string;
  users: Record<string, UserAttributes>;
};
