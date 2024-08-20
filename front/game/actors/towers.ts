import { Actor, CollisionType, Color, Engine, Sprite, vec } from "excalibur";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../const";
import { DefenseTowerType } from "@/types/towers";
import { KOTEngine } from "@/types/game";
import { GameService } from "@/services/game";

const WIDTH = 40;
const HEIGHT = 40;

const MARGIN_BOTTOM = 60;
const GAP = 10;

const TOP = 40;
const BOTTOM = CANVAS_HEIGHT - MARGIN_BOTTOM;
const CENTER = CANVAS_WIDTH / 2;

const getTowerPosition = (slot: number, isOpponent = false) => {
  switch (slot) {
    case 1:
      return { x: CENTER - WIDTH - GAP, y: isOpponent ? TOP : BOTTOM };
    case 2:
      return { x: CENTER + WIDTH + GAP, y: isOpponent ? TOP : BOTTOM };
    case 3:
      return { x: CENTER - 2 * (WIDTH + GAP), y: isOpponent ? TOP : BOTTOM };
    case 4:
      return { x: CENTER + 2 * (WIDTH + GAP), y: isOpponent ? TOP : BOTTOM };
  }

  return { x: CENTER, y: isOpponent ? TOP : BOTTOM };
};

export const addTower = (
  game: Engine,
  sprites: Record<string, Sprite>,
  isOpponent = false,
  slot?: number,
  type?: DefenseTowerType
) => {
  const position = getTowerPosition(slot ?? 0, isOpponent);

  const tower = new Actor({
    x: position.x,
    y: position.y,
    width: WIDTH,
    height: HEIGHT,
    color: slot ? Color.Black : Color.Green,
    anchor: vec(0.5, isOpponent ? 0 : 1),
    collisionType: CollisionType.Fixed,
  });

  game.add(tower);

  return tower;
};

export const setupTowers = (
  game: KOTEngine,
  sprites: Record<string, Sprite>,
  gameService: GameService
) => {
  const kingTower = addTower(game, sprites, false);

  sprites.king.width = WIDTH;
  sprites.king.height = HEIGHT;
  kingTower.graphics.use(sprites.king);

  const firstTower = addTower(game, sprites, false, 1);
  const secondTower = addTower(game, sprites, false, 2);
  const thirdTower = addTower(game, sprites, false, 3);
  const fourthTower = addTower(game, sprites, false, 4);

  game.registerActor("kingTower", kingTower);
  game.registerActor("firstTower", firstTower);
  game.registerActor("secondTower", secondTower);
  game.registerActor("thirdTower", thirdTower);
  game.registerActor("fourthTower", fourthTower);

  firstTower.events.on("pointerdown", () => {
    gameService.upgradeDefenseTower(1);
  });

  secondTower.events.on("pointerdown", () => {
    gameService.upgradeDefenseTower(2);
  });

  thirdTower.events.on("pointerdown", () => {
    gameService.upgradeDefenseTower(3);
  });

  fourthTower.events.on("pointerdown", () => {
    gameService.upgradeDefenseTower(4);
  });
};

export const setupOpponentTowers = (
  game: KOTEngine,
  sprites: Record<string, Sprite>
) => {
  const kingTower = addTower(game, sprites, true);

  kingTower.graphics.use(sprites.king);

  const firstTower = addTower(game, sprites, true, 1);
  const secondTower = addTower(game, sprites, true, 2);
  const thirdTower = addTower(game, sprites, true, 3);
  const fourthTower = addTower(game, sprites, true, 4);

  game.registerActor("opponentKingTower", kingTower);
  game.registerActor("opponentFirstTower", firstTower);
  game.registerActor("opponentSecondTower", secondTower);
  game.registerActor("opponentThirdTower", thirdTower);
  game.registerActor("opponentFourthTower", fourthTower);
};
