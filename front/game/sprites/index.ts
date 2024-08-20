import { ImageSource, Loader } from "excalibur";

export const loadSprites = () => {
  const resources = {
    blank: new ImageSource("/sprites/black.png"),
  };

  const loader = new Loader(Object.values(resources));

  const sprites = Object.entries(resources).reduce(
    (sprites, [key, value]) => ({ ...sprites, [key]: value.toSprite() }),
    {}
  );

  return { loader, resources, sprites };
};
