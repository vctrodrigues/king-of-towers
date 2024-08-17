import { DBService } from "./db";

import {
  deffenseTowerAttributes,
  MAX_DEFFENSE_TOWER_LEVEL,
  mobAttributes,
  PATH_SIZE,
} from "../const";
import { INITIAL_COINS } from "../const";
import { kingTowerAttributes } from "../const";

import { User, UserAttributes } from "../types/user";
import { Block, Game } from "../types/game";
import { DeffenseTowerType } from "../types/towers";

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
            deffenses: {},
            mobs: {},
            path: {
              blocks: Array.from<Block>({ length: PATH_SIZE })
                .fill({
                  index: 0,
                  mobs: [],
                  deffenses: [],
                  isEnd: false,
                })
                .map((block, index) => ({
                  ...block,
                  index,
                  isEnd: index === PATH_SIZE - 1,
                })),
            },
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

  spawn: (game: Game, user: string, opponent: string) => {
    const mobId = `${user}-${new Date().getTime()}`;
    const mobLevel = game.users[user].kingTower.level;
    const mob = {
      level: mobLevel,
      life: mobAttributes[mobLevel - 1].life,
      damage: mobAttributes[mobLevel - 1].damage,
    };

    game.users[user].mobs[mobId] = mob;
    game.users[opponent].path.blocks[0].mobs.push(mobId);

    dbService.update(game, { room: game.room });

    return game;
  },

  move: (game: Game, user: string, opponent: string) => {
    for (let blockIndex = 0; blockIndex < PATH_SIZE; blockIndex++) {
      const block = game.users[user].path.blocks[blockIndex];

      block.mobs.forEach((mobId) => {
        const mob = game.users[user].mobs[mobId];
        const mobAttrs = mobAttributes[mob.level - 1];
        const speed = mobAttrs.speed;

        if (block.isEnd) {
          return;
        }

        game.users[opponent].path.blocks[blockIndex + speed].mobs.push(mobId);
        delete game.users[user].path.blocks[blockIndex].mobs;
      });
    }

    dbService.update(game, { room: game.room });

    return game;
  },

  deffend: (game: Game, user: string, opponent: string) => {
    for (let deffenseId in game.users[user].deffenses) {
      const deffense = game.users[user].deffenses[deffenseId];

      const defAttrs =
        deffenseTowerAttributes[deffense.type][deffense.level - 1];

      const range = defAttrs.range;
      const damage = defAttrs.damage;

      const [startIndex, endIndex] = [PATH_SIZE - range, PATH_SIZE];

      game.users[user].path.blocks
        .slice(startIndex, endIndex)
        .forEach((block) => {
          block.mobs.forEach((mobId) => {
            const mobAttrs =
              mobAttributes[game.users[opponent].mobs[mobId].level - 1];

            game.users[opponent].mobs[mobId].life -= damage;

            if (game.users[opponent].mobs[mobId].life <= 0) {
              game.users[user].coins += mobAttrs.coins;
              delete game.users[user].mobs[mobId];
            }
          });
        });
    }

    dbService.update(game, { room: game.room });

    return game;
  },

  attack: (game: Game, user: string, opponent: string) => {
    const towerBlock = game.users[opponent].path.blocks[PATH_SIZE - 1];

    towerBlock.mobs.forEach((mobId) => {
      const mob = game.users[user].mobs[mobId];
      const mobAttrs = mobAttributes[mob.level - 1];

      const damage = mobAttrs.damage;

      game.users[opponent].kingTower.life -= damage;
    });

    dbService.update(game, { room: game.room });

    return game;
  },

  buyDeffenseTower: (
    game: Game,
    user: string,
    type: DeffenseTowerType,
    slot: number
  ) => {
    const deffenseId = `${user}-${slot}`;
    const price = deffenseTowerAttributes[type][0].price;

    if (game.users[user].coins < price) {
      return game;
    }

    game.users[user].coins -= price;

    game.users[user].deffenses[deffenseId] = {
      type,
      level: 1,
    };

    dbService.update(game, { room: game.room });

    return game;
  },

  upgradeDeffenseTower: (game: Game, user: string, slot: number) => {
    const deffenseId = `${user}-${slot}`;
    const deffense = game.users[user].deffenses[deffenseId];

    if (!deffense) {
      return game;
    }

    if (deffense.level >= MAX_DEFFENSE_TOWER_LEVEL) {
      return game;
    }

    const nextLevel = deffense.level + 1;
    const price = deffenseTowerAttributes[deffense.type][nextLevel].price;

    if (game.users[user].coins < price) {
      return game;
    }

    game.users[user].coins -= price;
    game.users[user].deffenses[deffenseId].level = nextLevel;

    dbService.update(game, { room: game.room });

    return game;
  },

  upgradeKingTower: (game: Game, user: string) => {
    const kingTower = game.users[user].kingTower;

    if (kingTower.level >= MAX_DEFFENSE_TOWER_LEVEL) {
      return game;
    }

    const nextLevel = kingTower.level + 1;
    const price = kingTowerAttributes[nextLevel].price;

    if (game.users[user].coins < price) {
      return game;
    }

    game.users[user].coins -= price;
    game.users[user].kingTower.level = nextLevel;
    game.users[user].kingTower.life = kingTowerAttributes[nextLevel].life;

    dbService.update(game, { room: game.room });

    return game;
  },

  findByRoom: (room: string) => {
    return dbService.find({ room });
  },
});
