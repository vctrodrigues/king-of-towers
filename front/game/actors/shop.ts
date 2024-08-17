import { Color, Engine, Font, ImageSource, Label, vec } from "excalibur";
import { CANVAS_HEIGHT } from "../const";

export const useShop = (game: Engine) => {
  const MARGIN_TITLE = 8;
  const MARGIN_BOTTOM = 82;
  const THICKNESS = 10;
  const BOTTOM = CANVAS_HEIGHT - MARGIN_BOTTOM;
  const LEFT = 20;
  const WIDTH = 200;

  const tower = new ImageSource("/sprites/black.png");

  game.add(title);
  game.add(coins);
};
