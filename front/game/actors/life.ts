import { Actor, Color, Font, Line, Label, Vector, vec } from "excalibur";
import { CANVAS_HEIGHT } from "../const";
import { KOTEngine } from "@/types/game";

export const setupLifeBar = (game: KOTEngine) => {
  const MARGIN_BOTTOM = 31;
  const THICKNESS = 6;
  const BOTTOM = CANVAS_HEIGHT - MARGIN_BOTTOM;
  const LEFT = 30;
  const WIDTH = 140;

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

  const restoreLife = () => {
    const lifeSpan = game.getActor("lifeSpan");
    const end = (lifeSpan.graphics.current as Line).end;
    const newEnd = vec(WIDTH, end.y);

    lifeSpan.graphics.use(
      new Line({
        start: vec(0, 0),
        end: newEnd,
        color: Color.Green,
        thickness: THICKNESS,
      })
    );
  };

  game.registerCallback("restoreLife", restoreLife);
  game.registerCallback("reduceLife", reduceLife);
  game.registerActor("lifeSpan", lifeSpan);
};

export const setupOpponentsLifeBar = (game: KOTEngine) => {
  const MARGIN_TOP = 30;
  const THICKNESS = 6;
  const TOP = MARGIN_TOP;
  const LEFT = 30;
  const WIDTH = 140;

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
      color: Color.Green,
      thickness: THICKNESS,
    })
  );

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
        color: Color.Green,
        thickness: THICKNESS,
      })
    );
  };

  const restoreLife = () => {
    const lifeSpan = game.getActor("lifeSpan");
    const end = (lifeSpan.graphics.current as Line).end;
    const newEnd = vec(WIDTH, end.y);

    lifeSpan.graphics.use(
      new Line({
        start: vec(0, 0),
        end: newEnd,
        color: Color.Green,
        thickness: THICKNESS,
      })
    );
  };

  game.registerCallback("restoreOpponentsLife", restoreLife);
  game.registerCallback("reduceOpponentsLife", reduceLife);
  game.registerActor("opponentsLifeSpan", lifeSpan);
};
