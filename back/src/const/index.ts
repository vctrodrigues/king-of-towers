import { MobAttributes } from "../types/mobs";
import {
  DeffenseTowerAttributes,
  DeffenseTowerType,
  KingTowerAttributes,
} from "../types/towers";

export const SECOND_IN_MILLIS = 1000;
export const TIMEOUT_LIMIT = 15;

export const PATH_SIZE = 40;
export const INITIAL_COINS = 200;

export const MAX_KING_TOWER_LEVEL = 5;
export const MAX_DEFFENSE_TOWER_LEVEL = 3;

export const UPDATING_INTERVAL = 1000;

export const deffenseTowerAttributes: {
  [key in DeffenseTowerType]: DeffenseTowerAttributes[];
} = {
  [DeffenseTowerType.Archer]: [
    { damage: 40, range: 4, price: 100 },
    { damage: 50, range: 5, price: 50 },
    { damage: 60, range: 6, price: 75 },
  ],
  [DeffenseTowerType.Mage]: [
    { damage: 50, range: 3, price: 125 },
    { damage: 60, range: 4, price: 75 },
    { damage: 70, range: 5, price: 90 },
  ],
  [DeffenseTowerType.Trap]: [
    { damage: 20, range: 10, price: 50 },
    { damage: 30, range: 11, price: 20 },
    { damage: 40, range: 12, price: 30 },
  ],
};

export const kingTowerAttributes: KingTowerAttributes[] = [
  { life: 200, spawn: 4, regeneration: 5, cooldown: 10, price: 0 },
  { life: 220, spawn: 6, regeneration: 7, cooldown: 8, price: 200 },
  { life: 300, spawn: 8, regeneration: 9, cooldown: 6, price: 200 },
  { life: 360, spawn: 10, regeneration: 11, cooldown: 5, price: 200 },
  { life: 400, spawn: 12, regeneration: 13, cooldown: 4, price: 200 },
];

export const mobAttributes: MobAttributes[] = [
  { life: 40, coins: 5, speed: 3, damage: 10 },
  { life: 50, coins: 10, speed: 3, damage: 12 },
  { life: 60, coins: 20, speed: 4, damage: 15 },
  { life: 70, coins: 30, speed: 5, damage: 20 },
  { life: 80, coins: 40, speed: 7, damage: 30 },
];
