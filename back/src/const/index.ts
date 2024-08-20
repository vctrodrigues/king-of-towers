import { MobAttributes } from "../types/mobs";
import {
  DefenseTowerAttributes,
  DefenseTowerType,
  KingTowerAttributes,
} from "../types/towers";

export const SECOND_IN_MILLIS = 1000;
export const TIMEOUT_LIMIT = 15;

export const PATH_SIZE = 40;
export const INITIAL_COINS = 200;

export const MAX_KING_TOWER_LEVEL = 5;
export const MAX_DEFFENSE_TOWER_LEVEL = 3;

export const UPDATING_INTERVAL = 5000;
export const COINS_FARM_RATE = 200;

export const defenseTowerAttributes: {
  [key in DefenseTowerType]: DefenseTowerAttributes[];
} = {
  [DefenseTowerType.Archer]: [
    { damage: 10, range: 4, price: 100 },
    { damage: 20, range: 5, price: 50 },
    { damage: 30, range: 6, price: 75 },
  ],
  [DefenseTowerType.Mage]: [
    { damage: 15, range: 3, price: 125 },
    { damage: 30, range: 4, price: 75 },
    { damage: 40, range: 5, price: 90 },
  ],
  [DefenseTowerType.Trap]: [
    { damage: 5, range: 10, price: 50 },
    { damage: 15, range: 11, price: 20 },
    { damage: 25, range: 12, price: 30 },
  ],
};

export const kingTowerAttributes: KingTowerAttributes[] = [
  { life: 400, spawn: 1, regeneration: 5, cooldown: 10, price: 0 },
  { life: 520, spawn: 2, regeneration: 7, cooldown: 8, price: 200 },
  { life: 600, spawn: 3, regeneration: 9, cooldown: 6, price: 600 },
  { life: 760, spawn: 4, regeneration: 11, cooldown: 5, price: 800 },
  { life: 900, spawn: 5, regeneration: 13, cooldown: 4, price: 1000 },
];
