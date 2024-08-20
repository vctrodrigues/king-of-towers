import { KOTEngine } from "@/types/game";
import {
  Actor,
  CircleCollider,
  CollisionType,
  Color,
  Sprite,
  vec,
} from "excalibur";

export const setupFire = (game: KOTEngine, sprites: Record<string, Sprite>) => {
  const archerFire = new Actor({
    x: 0,
    y: 0,
    radius: 10,
    color: Color.Blue,
    anchor: vec(0.5, 0.5),
    collisionType: CollisionType.Active,
    collider: new CircleCollider({
      radius: 10,
    }),
  });

  const mageFire = new Actor({
    x: 0,
    y: 0,
    radius: 10,
    color: Color.Red,
    anchor: vec(0.5, 0.5),
    collisionType: CollisionType.Active,
    collider: new CircleCollider({
      radius: 10,
    }),
  });

  const trapFire = new Actor({
    x: 0,
    y: 0,
    radius: 10,
    color: Color.Yellow,
    anchor: vec(0.5, 0.5),
    collisionType: CollisionType.Active,
    collider: new CircleCollider({
      radius: 10,
    }),
  });

  game.registerActor("archerFire", archerFire);
  game.registerActor("mageFire", mageFire);
  game.registerActor("trapFire", trapFire);
};
