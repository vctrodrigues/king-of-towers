import {
  Actor,
  CollisionType,
  ImageSource,
  Loader,
  Sprite,
  Vector,
} from "excalibur";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../const";
import { KOTEngine } from "@/types/game";

export const loadSprites = () => {
  const resources = {
    blank: new ImageSource("/sprites/black.png"),
    background: new ImageSource("/sprites/background.png"),
    backgroundArena: new ImageSource("/sprites/background-arena.png"),
    archer: new ImageSource("/sprites/archer.png"),
    mage: new ImageSource("/sprites/mage.png"),
    canon: new ImageSource("/sprites/canon.png"),
    king: new ImageSource("/sprites/king-tower.png"),
    kingTower: new ImageSource("/sprites/king-tower.png"),
    acherTower: new ImageSource("/sprites/archer-tower.png"),
    canonTower: new ImageSource("/sprites/canon-tower.png"),
    mageTower: new ImageSource("/sprites/mage-tower.png"),
    one: new ImageSource("/sprites/1.png"),
    two: new ImageSource("/sprites/2.png"),
    three: new ImageSource("/sprites/3.png"),
    four: new ImageSource("/sprites/4.png"),
    fire: new ImageSource("/sprites/fire.png"),
  };

  const loader = new Loader(Object.values(resources));

  const sprites = Object.entries(resources).reduce(
    (sprites, [key, value]) => ({ ...sprites, [key]: value.toSprite() }),
    {}
  );

  return { loader, resources, sprites };
};

export const setupBackground = (
  game: KOTEngine,
  sprites: Record<string, Sprite>
) => {
  const bg = new Actor({
    x: 0,
    y: 0,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    z: -99,
    anchor: Vector.Zero,
    collisionType: CollisionType.PreventCollision,
  });

  const background = sprites.backgroundArena;
  background.destSize.width = CANVAS_WIDTH;
  background.destSize.height = CANVAS_HEIGHT;

  bg.graphics.use(background);
  game.add(bg);
};
