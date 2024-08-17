import WebSocket from "ws";
import { Game } from "game";
import { User } from "user";

import { DBService } from "../service/db";
import { gameService } from "../service/game";

import { serialize } from "../utils/serialize";

import { EventName } from "../enums/event";

export const gameController = (ws: WebSocket, dbService: DBService<Game>) => {
  const _gameService = gameService(dbService);

  return {
    create: ({ room, users }: { room: string; users: User[] }) => {
      console.log(`> Creating game`);

      try {
        const game = _gameService.create(room, users);

        console.log(`> Game created: ${game.room}`);
        ws.send(serialize(EventName.GameCreate, game));

        return game;
      } catch (error) {
        console.log(`> Error creating game`);
        ws.send(
          serialize(EventName.GameCreate, { error: error.message }, false)
        );
      }
    },

    update: ({
      game,
      user,
      opponent,
    }: {
      game: Game;
      user: string;
      opponent: string;
    }) => {
      console.log(`> Updating game`);

      try {
        // spawn new mobs
        console.log(`> Spawning mobs for ${user}`);
        _gameService.spawn(game, user, opponent);
        ws.send(serialize(EventName.GameSpawn, { game }));

        // deffend
        console.log(`> Deffending for ${user}`);
        _gameService.deffend(game, user, opponent);
        ws.send(serialize(EventName.GameDeffend, { game }));

        // move mobs
        console.log(`> Moving mobs for ${user}`);
        _gameService.move(game, user, opponent);
        ws.send(serialize(EventName.GameMove, { game }));

        // attack
        console.log(`> Attacking for ${user}`);
        _gameService.attack(game, user, opponent);
        ws.send(serialize(EventName.GameAttack, game));

        return game;
      } catch (error) {
        console.log(`> Error updating game`);
        ws.send(
          serialize(EventName.GameUpdate, { error: error.message }, false)
        );
      }
    },

    destroy: ({ room }: { room: string }) => {
      console.log(`> Destroying game`);

      try {
        _gameService.destroy(room);

        console.log(`> Game destroyed: ${room}`);
        ws.send(serialize(EventName.GameDestroy, { room }));
      } catch (error) {
        console.log(`> Error destroying game`);
        ws.send(
          serialize(EventName.GameDestroy, { error: error.message }, false)
        );
      }
    },
  };
};
