export enum DefenseTowerType {
  Archer = "archer",
  Mage = "mage",
  Trap = "trap",
}

export type DefenseTower = {
  type: DefenseTowerType;
  level: number;
};

export type DefenseTowerAttributes = {
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
