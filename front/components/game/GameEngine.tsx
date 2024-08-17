"use client";

import { useEffect, useRef } from "react";
import { Engine, Color } from "excalibur";
import { useLifeBar } from "@/game/actors/life";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "@/game/const";
import { useCoins } from "@/game/actors/coins";

function initialize(canvasElement: HTMLCanvasElement) {
  return new Engine({
    canvasElement,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    backgroundColor: Color.Black,
  });
}

async function start(game: Engine) {
  useLifeBar(game);
  useCoins(game);
  game.start();
}

export const GameEngine = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Engine>();

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    gameRef.current = initialize(canvasRef.current);
    start(gameRef.current);
  }, []);

  return <canvas ref={canvasRef}></canvas>;
};
