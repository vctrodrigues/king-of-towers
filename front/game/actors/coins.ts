import { Color, Font, Label, vec } from "excalibur";
import { CANVAS_HEIGHT, INITIAL_COINS } from "../const";
import { KOTEngine } from "@/types/game";
import { GameEvents } from "@/enums/events/game";

export const setupCoins = (game: KOTEngine) => {
  const MARGIN_TITLE = 18;
  const MARGIN_BOTTOM = 82;
  const BOTTOM = CANVAS_HEIGHT - MARGIN_BOTTOM;
  const LEFT = 20;

  const coins = new Label({
    pos: vec(LEFT, BOTTOM),
    text: INITIAL_COINS.toString(),
    font: new Font({ size: 20, color: Color.White }),
  });

  const title = new Label({
    pos: vec(LEFT, BOTTOM - MARGIN_TITLE),
    text: "Moedas",
    font: new Font({ size: 12, color: Color.White }),
  });

  game.add(title);
  game.add(coins);

  game.registerActor("coins", coins);
};
