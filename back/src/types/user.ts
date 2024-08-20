import { Mob } from "mobs";
import { DefenseTower, KingTower } from "towers";

export type User = {
  session: string;
  code: string;
  name: string;
};

export type UserAttributes = {
  coins: number;
  kingTower: KingTower;
  defenses: Record<string, DefenseTower>;
  mobs: Record<string, Mob>;
};
