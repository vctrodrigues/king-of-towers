import WebSocket from "ws";
import { Game } from "game";
import { User } from "user";

import { DBService } from "../service/db";
import { gameService } from "../service/game";

import { serialize } from "../utils/serialize";

import { EventName } from "../enums/event";
import { DefenseTowerType } from "towers";

export const gameController = (ws: WebSocket, dbService: DBService<Game>) => {
  const _gameService = gameService(dbService);
  const attackIntervals = new Map<string, NodeJS.Timeout>();

  return {
    create: ({ room, users }: { room: string; users: User[] }) => {
      console.log(`> Creating game`);

      try {
        const game = _gameService.create(room, users);

        console.log(`> Game created: ${game.room}`);

        return game;
      } catch (error) {
        console.log(`> Error creating game`);
        ws.send(
          serialize(EventName.GameCreate, { error: error.message }, false)
        );
      }
    },

    get: ({ room }: { room: string }) => {
      console.log(`> Getting game`);

      try {
        const game = _gameService.findByRoom(room);
        console.log(`> Game fetched: ${game.room}`);

        return game;
      } catch (error) {
        console.log(`> Error getting game`);
      }
    },

    // defend: ({
    //   game,
    //   opponent,
    //   damage,
    //   mobs,
    // }: {
    //   game: Game;
    //   opponent: string;
    //   damage: number;
    //   mobs: string[];
    // }) => {
    //   console.log(`> Defending tower`);

    //   try {
    //     const { game: _game, killedMobs } = _gameService.defend(
    //       game,
    //       opponent,
    //       damage,
    //       mobs
    //     );

    //     console.log(`> Tower defended: ${game.room}`);

    //     return { game: _game, killedMobs };
    //   } catch (error) {
    //     console.log(`> Error defending game`);
    //     ws.send(
    //       serialize(EventName.GameDefend, { error: error.message }, false)
    //     );
    //   }
    // },

    earn: ({
      game,
      user,
      amount,
    }: {
      game: Game;
      user: string;
      amount: number;
    }) => {
      console.log(`> Earning coins`);

      try {
        const updatedGame = _gameService.earn(game, user, amount);

        console.log(`> Coins earned: ${game.room}`);

        return updatedGame;
      } catch (error) {
        console.log(`> Error earning coins`);
        ws.send(serialize(EventName.GameEarn, { error: error.message }, false));
      }
    },

    // spawn: ({ game, user }: { game: Game; user: string }) => {
    //   console.log(`> Spawning mob`);

    //   try {
    //     const { game: updatedGame, mobs } = _gameService.spawn(game, user);

    //     console.log(`> Mob spawned: ${game.room}`);

    //     return { updatedGame, mobs };
    //   } catch (error) {
    //     console.log(`> Error spawning mob`);
    //     ws.send(
    //       serialize(EventName.GameSpawn, { error: error.message }, false)
    //     );
    //   }
    // },

    attack: ({
      game,
      opponent,
      damage,
    }: {
      game: Game;
      opponent: string;
      damage: number;
    }) => {
      console.log(`> Attacking tower`);

      try {
        const payload = _gameService.attack(game, opponent, damage);

        console.log(`> Tower attacked: ${game.room}`);

        return payload;
      } catch (error) {
        console.log(`> Error attacking game`);
        ws.send(
          serialize(EventName.GameAttack, { error: error.message }, false)
        );
      }
    },

    destroy: ({ room }: { room: string }) => {
      console.log(`> Destroying game`);

      try {
        _gameService.destroy(room);

        console.log(`> Game destroyed: ${room}`);
      } catch (error) {
        console.log(`> Error destroying game`);
        ws.send(
          serialize(EventName.GameDestroy, { error: error.message }, false)
        );
      }
    },

    upgradeKingTower: ({ game, user }: { game: Game; user: string }) => {
      console.log(`> Upgrading king tower`);

      try {
        const payload = _gameService.upgradeKingTower(game, user);

        console.log(`> King tower upgraded: ${game.room}`);

        return payload;
      } catch (error) {
        console.log(`> Error upgrading king tower`);
        ws.send(
          serialize(EventName.GameUpgradeKing, { error: error.message }, false)
        );
      }
    },

    upgradeDefenseTower: ({
      game,
      user,
      slot,
    }: {
      game: Game;
      user: string;
      slot: number;
    }) => {
      console.log(`> Upgrading defense tower`);

      try {
        const payload = _gameService.upgradeDefenseTower(game, user, slot);

        console.log(`> Defense tower upgraded: ${game.room}`);

        return payload;
      } catch (error) {
        console.log(`> Error upgrading defense tower`);
        ws.send(
          serialize(
            EventName.GameUpgradeDefense,
            { error: error.message },
            false
          )
        );
      }
    },

    buyDefenseTower: ({
      game,
      user,
      type,
      slot,
    }: {
      game: Game;
      user: string;
      type: DefenseTowerType;
      slot: number;
    }) => {
      console.log(`> Buying defense tower`);

      try {
        const payload = _gameService.buyDefenseTower(game, user, type, slot);

        console.log(`> Defense tower bought: ${game.room}`);

        return payload;
      } catch (error) {
        console.log(`> Error buying defense tower`);
        ws.send(serialize(EventName.GameBuy, { error: error.message }, false));
      }
    },
  };
};
