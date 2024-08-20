import { Actor, Color, Sprite, vec, Vector } from "excalibur";
import { GameService } from "@/services/game";

import { CANVAS_HEIGHT } from "../const";

import { KOTEngine } from "@/types/game";
import { DefenseTowerType } from "@/types/towers";

export const setupShop = (
  game: KOTEngine,
  sprites: Record<string, Sprite>,
  gameService: GameService
) => {
  const MARGIN_BOTTOM = 130;
  const GAP = 20;
  const HEIGHT = 50;
  const BOTTOM = CANVAS_HEIGHT - MARGIN_BOTTOM - HEIGHT;
  const LEFT = 20;

  const archerTower = new Actor({
    x: LEFT,
    y: BOTTOM,
    width: 50,
    height: HEIGHT,
    color: Color.Blue,
    anchor: Vector.Zero,
  });

  archerTower.on("pointerdown", () => {});

  const mageTower = new Actor({
    x: LEFT,
    y: BOTTOM - HEIGHT - GAP,
    width: 50,
    height: HEIGHT,
    color: Color.Red,
    anchor: Vector.Zero,
  });

  const trapTower = new Actor({
    x: LEFT,
    y: BOTTOM - 2 * (HEIGHT + GAP),
    width: 50,
    height: HEIGHT,
    color: Color.Yellow,
    anchor: Vector.Zero,
  });

  const mainTower = new Actor({
    x: LEFT,
    y: BOTTOM - 3 * (HEIGHT + GAP),
    width: 50,
    height: HEIGHT,
    color: Color.Orange,
    anchor: Vector.Zero,
  });

  const selector = new Actor({
    x: LEFT,
    y: BOTTOM,
    radius: 10,
    color: Color.Green,
    anchor: Vector.Zero,
  });

  game.add(archerTower);
  game.add(mageTower);
  game.add(trapTower);
  game.add(mainTower);

  const [
    firstSlotSelector,
    secondSlotSelector,
    thirdSlotSelector,
    fourthSlotSelector,
  ] = [1, 2, 3, 4].map(
    () =>
      new Actor({
        x: 0,
        y: 0,
        radius: 10,
        color: Color.Green,
        anchor: vec(0.5, 0.5),
      })
  );

  const toggleSelector = (pos: number) => {
    if (game.isShopOpen) {
      game.remove(firstSlotSelector);
      game.remove(secondSlotSelector);
      game.remove(thirdSlotSelector);
      game.remove(fourthSlotSelector);
      return;
    }

    let origin = { x: 0, y: 0 };

    switch (pos) {
      case 1:
        origin = {
          x: archerTower.pos.x,
          y: archerTower.pos.y,
        };
        break;
      case 2:
        origin = {
          x: mageTower.pos.x,
          y: mageTower.pos.y,
        };
        break;
      case 3:
        origin = {
          x: trapTower.pos.x,
          y: trapTower.pos.y,
        };
        break;
    }

    firstSlotSelector.pos = vec(origin.x + 70, origin.y + 25);
    secondSlotSelector.pos = vec(origin.x + 100, origin.y + 25);
    thirdSlotSelector.pos = vec(origin.x + 130, origin.y + 25);
    fourthSlotSelector.pos = vec(origin.x + 160, origin.y + 25);

    game.add(firstSlotSelector);
    game.add(secondSlotSelector);
    game.add(thirdSlotSelector);
    game.add(fourthSlotSelector);
  };

  archerTower.events.on("pointerdown", () => {
    toggleSelector(1);
    game.toggleShop(DefenseTowerType.Archer);
  });

  mageTower.events.on("pointerdown", () => {
    toggleSelector(2);
    game.toggleShop(DefenseTowerType.Mage);
  });

  trapTower.events.on("pointerdown", () => {
    toggleSelector(3);
    game.toggleShop(DefenseTowerType.Trap);
  });

  mainTower.events.on("pointerdown", () => {
    gameService.upgradeKingTower();

    if (game.isShopOpen) {
      toggleSelector(1);
    }
  });

  firstSlotSelector.on("pointerdown", () => {
    gameService.buy(1, game.shopType);
    toggleSelector(1);
  });

  secondSlotSelector.on("pointerdown", () => {
    gameService.buy(2, game.shopType);
    toggleSelector(1);
  });

  thirdSlotSelector.on("pointerdown", () => {
    gameService.buy(3, game.shopType);
    toggleSelector(1);
  });

  fourthSlotSelector.on("pointerdown", () => {
    gameService.buy(4, game.shopType);
    toggleSelector(1);
  });

  game.registerActor("shopArcherTower", archerTower);
  game.registerActor("shopMageTower", mageTower);
  game.registerActor("shopTrapTower", trapTower);
};
