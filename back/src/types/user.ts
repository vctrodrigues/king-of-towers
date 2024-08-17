import { Mob } from "mobs";
import { Path } from "game";
import { DeffenseTower, KingTower } from "towers";

export type User = {
  session: string;
  code: string;
  name: string;
};

export type UserAttributes = {
  coins: number;
  path: Path;
  kingTower: KingTower;
  deffenses: Record<string, DeffenseTower>;
  mobs: Record<string, Mob>;
};
