import {
  Actor,
  ActorArgs,
  Circle,
  CircleCollider,
  Collider,
  CollisionContact,
  CollisionType,
  Color,
  GraphicsGroup,
  Line,
  Side,
  Sprite,
  vec,
} from "excalibur";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../const";
import { KOTEngine } from "@/types/game";
import { Mob } from "@/types/mobs";
import { GameEvents } from "@/enums/events/game";

export class MobActor extends Actor {
  uid: string = "";
  level: number = 1;
  life: number = 0;
  radius: number = 10;

  isOpponent: boolean = false;

  constructor(uid: string, mob: Mob, isOpponent = false, options?: ActorArgs) {
    super(options);
    this.uid = uid;
    this.level = mob.level;
    this.life = mob.life;
    this.isOpponent = isOpponent;

    this.vel = vec(0, isOpponent ? 200 : -200);
    this.anchor = vec(0.5, 0.5);
    this.color = isOpponent ? Color.Red : Color.Green;
  }

  receiveDamage(damage: number) {
    this.life -= damage;
  }
}

export const setupMob = (
  game: KOTEngine,
  tower: Actor,
  opponentTower: Actor,
  sprites: Record<string, Sprite>
) => {
  const createMob = (
    game: KOTEngine,
    tower: Actor,
    sprites: Record<string, Sprite>,
    uid: string,
    mob: Mob,
    isOpponent = false
  ) => {
    const _mob = new MobActor(uid, mob, isOpponent, {
      x: isOpponent ? CANVAS_WIDTH / 2 - 20 : CANVAS_WIDTH / 2 + 20,
      y: isOpponent ? 90 : CANVAS_HEIGHT - 110,
      collisionType: CollisionType.Passive,
      collider: new CircleCollider({
        radius: 10,
      }),
    });

    _mob.graphics.add(
      new GraphicsGroup({
        members: [
          {
            graphic: new Circle({
              radius: 10,
              color: isOpponent ? Color.Red : Color.Green,
            }),
            offset: vec(0, 0),
          },
          {
            graphic: new Line({
              start: vec(0, 0),
              end: vec(0, 20),
              thickness: 3,
              color: isOpponent ? Color.Red : Color.Green,
            }),
            offset: vec(isOpponent ? -4 : 28, 2),
          },
        ],
      })
    );

    game.add(_mob);
  };

  const addMob = (
    game: KOTEngine,
    tower: Actor,
    sprites: Record<string, Sprite>,
    uid: string,
    mob: Mob
  ) => {
    createMob(game, tower, sprites, uid, mob);
  };

  const addOpponentMob = (
    game: KOTEngine,
    tower: Actor,
    sprites: Record<string, Sprite>,
    uid: string,
    mob: Mob
  ) => {
    createMob(game, tower, sprites, uid, mob, true);
  };
};
