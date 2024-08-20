import {
  DefenseTowerAttributes,
  DefenseTowerType,
  KingTowerAttributes,
} from "@/types/towers";

export const CANVAS_HEIGHT = 600;
export const CANVAS_WIDTH = 1024;

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

export const INITIAL_COINS = 200;
