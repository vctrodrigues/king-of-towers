"use client";

import { useEffect, useRef } from "react";
import { Color } from "excalibur";

import { useWebSocket } from "@/context/WebSocketContext";

import { loadSprites, setupBackground } from "@/game/sprites";
import { setupLifeBar, setupOpponentsLifeBar } from "@/game/actors/life";
import { setupCoins } from "@/game/actors/coins";
import { setupShop } from "@/game/actors/shop";
import { setupOpponentTowers, setupTowers } from "@/game/actors/towers";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "@/game/const";

import { useGameStore } from "@/stores/game";

import { GameService } from "@/services/game";

import { Game, GameStoreEvents, KOTEngine } from "@/types/game";
import { setupEvents } from "@/game/events";
import { useUserStore } from "@/stores/user";
import { useRoomStore } from "@/stores/room";
import { setupFire } from "@/game/actors/fire";

function initialize(canvasElement: HTMLCanvasElement) {
  return new KOTEngine({
    canvasElement,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    backgroundColor: Color.Gray,
  });
}

async function start(
  game: KOTEngine,
  actions: GameStoreEvents,
  gameService: GameService
) {
  actions.startEngine(game);

  const { loader, resources, sprites } = loadSprites();

  await game.start(loader);
  game.sprites = sprites;

  setupBackground(game, sprites);
  setupLifeBar(game);
  setupOpponentsLifeBar(game);
  setupCoins(game);
  setupShop(game, sprites, gameService);
  setupFire(game, sprites);

  setupTowers(game, sprites, gameService);
  setupOpponentTowers(game, sprites);

  setupEvents(game, gameService);
}

export const GameEngine = () => {
  const { ws } = useWebSocket();
  const {
    startEngine,
    earn,
    buy,
    attack,
    upgradeKingTower,
    upgradeDefenseTower,
    gameOver,
  } = useGameStore();

  const user = useUserStore((state) => state.user);
  const room = useRoomStore((state) => state.room);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<KOTEngine>();

  const gameService = new GameService({
    uid: room.uid,
    user,
    ws,
    earn,
    buy,
    attack,
    upgradeKingTower,
    upgradeDefenseTower,
    gameOver,
  });

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    gameRef.current = initialize(canvasRef.current);

    start(
      gameRef.current,
      {
        startEngine,
        buy,
        earn,
        attack,
        upgradeKingTower,
        upgradeDefenseTower,
      },
      gameService
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={canvasRef}></canvas>;
};
