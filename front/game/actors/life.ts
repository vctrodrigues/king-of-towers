import { Actor, Color, Font, Line, Label, Vector, vec } from "excalibur";
import { CANVAS_HEIGHT } from "../const";
import { KOTEngine } from "@/types/game";

export const setupLifeBar = (game: KOTEngine) => {
  const MARGIN_TITLE = 12;
  const MARGIN_BOTTOM = 20;
  const THICKNESS = 10;
  const BOTTOM = CANVAS_HEIGHT - MARGIN_BOTTOM;
  const LEFT = 20;
  const WIDTH = 200;

  const lifeBar = new Actor({
    pos: vec(LEFT, BOTTOM),
    anchor: Vector.Zero,
  });

  lifeBar.graphics.use(
    new Line({
      start: vec(0, 0),
      end: vec(WIDTH, 0),
      color: Color.Black,
      thickness: THICKNESS,
    })
  );

  const lifeSpan = new Actor({
    pos: vec(LEFT, BOTTOM),
    anchor: Vector.Zero,
  });

  lifeSpan.graphics.use(
    new Line({
      start: vec(0, 0),
      end: vec(WIDTH, 0),
      color: Color.Green,
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
  game.add(lifeSpan);

  game.registerActor("lifeSpan", lifeSpan);

  const reduceLife = (ratio: number) => {
    const lifeSpan = game.getActor("lifeSpan");
    const end = (lifeSpan.graphics.current as Line).end;
    const newEnd = vec(end.x * ratio, end.y);

    lifeSpan.graphics.use(
      new Line({
        start: vec(0, 0),
        end: newEnd,
        color: Color.Green,
        thickness: THICKNESS,
      })
    );
  };

  game.registerCallback("reduceLife", reduceLife);
  game.registerActor("lifeSpan", lifeSpan);
};

export const setupOpponentsLifeBar = (game: KOTEngine) => {
  const MARGIN_TITLE = 22;
  const MARGIN_TOP = 20;
  const THICKNESS = 10;
  const TOP = MARGIN_TOP;
  const LEFT = 20;
  const WIDTH = 200;

  const lifeBar = new Actor({
    pos: vec(LEFT, TOP),
    anchor: Vector.Zero,
  });

  lifeBar.graphics.use(
    new Line({
      start: vec(0, 0),
      end: vec(WIDTH, 0),
      color: Color.Black,
      thickness: THICKNESS,
    })
  );

  const lifeSpan = new Actor({
    pos: vec(LEFT, TOP),
    anchor: Vector.Zero,
  });

  lifeSpan.graphics.use(
    new Line({
      start: vec(0, 0),
      end: vec(WIDTH, 0),
      color: Color.Red,
      thickness: THICKNESS,
    })
  );

  const title = new Label({
    pos: vec(LEFT, TOP - THICKNESS + MARGIN_TITLE),
    text: "HP",
    font: new Font({ size: 12, color: Color.White }),
  });

  game.add(title);
  game.add(lifeBar);
  game.add(lifeSpan);

  const reduceLife = (ratio: number) => {
    const lifeSpan = game.getActor("opponentsLifeSpan");
    const end = (lifeSpan.graphics.current as Line).end;
    const newEnd = vec(end.x * ratio, end.y);

    lifeSpan.graphics.use(
      new Line({
        start: vec(0, 0),
        end: newEnd,
        color: Color.Red,
        thickness: THICKNESS,
      })
    );
  };

  game.registerCallback("reduceOpponentsLife", reduceLife);
  game.registerActor("opponentsLifeSpan", lifeSpan);
};
