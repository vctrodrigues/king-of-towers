import { Color, Font, Label, vec } from "excalibur";
import { CANVAS_HEIGHT, INITIAL_COINS } from "../const";
import { KOTEngine } from "@/types/game";

export const setupCoins = (game: KOTEngine) => {
  const MARGIN_BOTTOM = 96;
  const BOTTOM = CANVAS_HEIGHT - MARGIN_BOTTOM;
  const LEFT = 32;

  const coins = new Label({
    pos: vec(LEFT, BOTTOM),
    text: INITIAL_COINS.toString(),
    font: new Font({ size: 30, color: Color.Black, bold: true }),
  });

  game.add(coins);

  game.registerActor("coins", coins);
};
