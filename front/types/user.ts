import { DefenseTower, KingTower } from "./towers";
import { Mob } from "./mobs";

export interface User {
  code: string;
  name: string;
  session: string;
}

export type UserAttributes = {
  coins: number;
  kingTower: KingTower;
  defenses: Record<string, DefenseTower>;
  mobs: Record<string, Mob>;
};
