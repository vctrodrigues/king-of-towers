export enum DeffenseTowerType {
  Archer = "archer",
  Mage = "mage",
  Trap = "trap",
}

export type DeffenseTower = {
  type: DeffenseTowerType;
  level: number;
};

export type DeffenseTowerAttributes = {
  damage: number;
  range: number;
  price: number;
};

export type KingTower = {
  level: number;
  life: number;
};

export type KingTowerAttributes = {
  life: number;
  spawn: number;
  regeneration: number;
  cooldown: number;
  price: number;
};
