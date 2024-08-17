import { Color, Engine, Font, Label, vec } from "excalibur";
import { CANVAS_HEIGHT } from "../const";

export const useCoins = (game: Engine) => {
  const MARGIN_TITLE = 8;
  const MARGIN_BOTTOM = 82;
  const THICKNESS = 10;
  const BOTTOM = CANVAS_HEIGHT - MARGIN_BOTTOM;
  const LEFT = 20;
  const WIDTH = 200;

  const coins = new Label({
    pos: vec(LEFT, BOTTOM),
    text: "0",
    font: new Font({ size: 20, color: Color.White }),
  });

  const title = new Label({
    pos: vec(LEFT, BOTTOM - THICKNESS - MARGIN_TITLE),
    text: "Moedas",
    font: new Font({ size: 12, color: Color.White }),
  });

  game.add(title);
  game.add(coins);
};
