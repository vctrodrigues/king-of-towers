import { DBService } from "./db";

import { defenseTowerAttributes, MAX_DEFFENSE_TOWER_LEVEL } from "../const";
import { INITIAL_COINS } from "../const";
import { kingTowerAttributes } from "../const";

import { User, UserAttributes } from "../types/user";
import { Game } from "../types/game";
import { DefenseTowerType } from "../types/towers";

export const gameService = (dbService: DBService<Game>) => ({
  create: (room: string, users: User[]) => {
    const game: Game = {
      room,
      users: users.reduce((usersMap: Record<string, UserAttributes>, user) => {
        return {
          ...usersMap,
          [user.session]: {
            coins: INITIAL_COINS,
            kingTower: {
              level: 1,
              life: kingTowerAttributes[0].life,
            },
            defenses: {},
            mobs: {},
          } as UserAttributes,
        };
      }, {}),
    };

    dbService.save(game);

    return game;
  },

  update: (game: Game) => {
    dbService.update(game, { room: game.room });

    return game;
  },

  destroy: (room: string) => {
    dbService.delete({ room });
  },

  earn: (game: Game, user: string, amount: number) => {
    game.users[user].coins += amount;

    dbService.update(game, { room: game.room });

    return game;
  },

  attack: (game: Game, opponent: string, damage: number) => {
    game.users[opponent].kingTower.life -= damage;

    dbService.update(game, { room: game.room });

    return {
      game,
      kingTower: game.users[opponent].kingTower,
    };
  },

  buyDefenseTower: (
    game: Game,
    user: string,
    type: DefenseTowerType,
    slot: number
  ) => {
    const defenseId = `${user}-${slot}`;
    const price = defenseTowerAttributes[type][0].price;

    if (game.users[user].coins < price) {
      throw new Error("Not enough coins");
    }

    game.users[user].coins -= price;

    game.users[user].defenses[defenseId] = {
      type,
      level: 1,
    };

    dbService.update(game, { room: game.room });

    return {
      game,
      defenseId,
      defense: game.users[user].defenses[defenseId],
      slot,
      price,
    };
  },

  upgradeDefenseTower: (game: Game, user: string, slot: number) => {
    const defenseId = `${user}-${slot}`;
    const defense = game.users[user].defenses[defenseId];

    if (!defense) {
      throw new Error("Defense tower not found");
    }

    if (defense.level >= MAX_DEFFENSE_TOWER_LEVEL) {
      throw new Error("Defense tower already at max level");
    }

    const nextLevel = defense.level + 1;
    const price = defenseTowerAttributes[defense.type][nextLevel - 1].price;

    if (game.users[user].coins < price) {
      throw new Error("Not enough coins");
    }

    game.users[user].coins -= price;
    game.users[user].defenses[defenseId].level = nextLevel;

    dbService.update(game, { room: game.room });

    return {
      game,
      defenseId,
      defense: game.users[user].defenses[defenseId],
      slot,
      price,
    };
  },

  upgradeKingTower: (game: Game, user: string) => {
    const kingTower = game.users[user].kingTower;

    if (kingTower.level >= MAX_DEFFENSE_TOWER_LEVEL) {
      throw new Error("King tower already at max level");
    }

    const nextLevel = kingTower.level + 1;
    const price = kingTowerAttributes[nextLevel].price;

    if (game.users[user].coins < price) {
      throw new Error("Not enough coins");
    }

    game.users[user].coins -= price;
    game.users[user].kingTower.level = nextLevel;
    game.users[user].kingTower.life = kingTowerAttributes[nextLevel].life;

    dbService.update(game, { room: game.room });

    return {
      game,
      kingTower: game.users[user].kingTower,
      price,
    };
  },

  findByRoom: (room: string) => {
    return dbService.find({ room });
  },
});
