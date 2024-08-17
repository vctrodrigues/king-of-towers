import {
  Actor,
  Color,
  Engine,
  Font,
  Line,
  Label,
  Vector,
  vec,
} from "excalibur";
import { CANVAS_HEIGHT } from "../const";

export const useLifeBar = (game: Engine) => {
  const MARGIN_TITLE = 12;
  const MARGIN_BOTTOM = 20;
  const THICKNESS = 10;
  const BOTTOM = CANVAS_HEIGHT - MARGIN_BOTTOM;
  const LEFT = 20;
  const WIDTH = 200;

  const lifeBar = new Actor({
    pos: vec(LEFT, BOTTOM),
  });

  lifeBar.graphics.anchor = Vector.Zero;
  lifeBar.graphics.use(
    new Line({
      start: vec(0, 0),
      end: vec(WIDTH, 0),
      color: Color.Red,
      thickness: THICKNESS,
    })
  );

  const title = new Label({
    pos: vec(LEFT, BOTTOM - THICKNESS - MARGIN_TITLE),
    text: "HP",
    font: new Font({ size: 12, color: Color.White }),
  });

  game.add(title);
  game.add(lifeBar);
};
