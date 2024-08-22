import {
  Actor,
  CollisionType,
  Color,
  Engine,
  EngineEvents,
  EngineOptions,
  EventEmitter,
  Font,
  Label,
  Polygon,
  Scene,
  Sprite,
  TextAlign,
  vec,
  Vector,
} from "excalibur";
import { DefenseTower, DefenseTowerType, KingTower } from "./towers";
import { User, UserAttributes } from "./user";
import { GameEvents } from "@/enums/events/game";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  defenseTowerAttributes,
  INITIAL_COINS,
  kingTowerAttributes,
} from "@/game/const";

export type Game = {
  room: string;
  users: Record<string, UserAttributes>;
};

export interface GameEarnPayload {
  game: Game;
  user: User;
  amount: number;
}

export interface GameEarnResponse {
  game: Game;
  user: User;
  amount: number;
}

export interface GameEarnEvent extends GameEarnResponse {}

export interface GameBuyPayload {
  game: Game;
  user: User;
  slot: number;
  type: DefenseTowerType;
}

export interface GameBuyResponse {
  game: Game;
  defenseId: string;
  defense: DefenseTower;
  slot: number;
  price: number;
  isOpponent: boolean;
}

export interface GameBuyEvent extends GameBuyResponse {}

export interface GameUpgradeKingTowerPayload {
  game: Game;
  user: User;
}

export interface GameUpgradeKingTowerResponse {
  game: Game;
  kingTower: KingTower;
  price: number;
  isOpponent: boolean;
}

export interface GameUpgradeKingTowerEvent
  extends GameUpgradeKingTowerResponse {}

export interface GameUpgradeDefenseTowerPayload {
  game: Game;
  user: User;
  slot: number;
}

export interface GameUpgradeDefenseTowerResponse {
  game: Game;
  defenseId: string;
  defenseTower: DefenseTower;
  slot: number;
  price: number;
  isOpponent: boolean;
}

export interface GameUpgradeDefenseTowerEvent
  extends GameUpgradeDefenseTowerResponse {}

export interface GameAttackPayload {
  game: Game;
  user: string;
  damage: number;
}

export interface GameAttackResponse {
  game: Game;
  damage: number;
  kingTower: KingTower;
  isOpponent: boolean;
}

export interface GameAttackEvent extends GameAttackResponse {}

export interface GameOverPayload {
  winner: string;
  loser: string;
}

export interface GameOverResponse {
  win: boolean;
  winner: User;
  loser: User;
}

export interface GameOverEvent extends GameOverResponse {}

export interface GameFireEvent {
  slot: number;
  damage: number;
  isOpponent: boolean;
}

export interface GameStoreEvents {
  startEngine: (game: KOTEngine) => void;
  earn: (payload: Partial<GameEarnPayload>) => void;
  buy: (payload: Partial<GameBuyPayload>) => void;
  attack: (payload: Partial<GameAttackPayload>) => void;
  upgradeKingTower: (payload: Partial<GameUpgradeKingTowerPayload>) => void;
  upgradeDefenseTower: (
    payload: Partial<GameUpgradeDefenseTowerPayload>
  ) => void;
}

export interface GameEngineEvents {
  [GameEvents.Earn]: GameEarnEvent;
  [GameEvents.Buy]: GameBuyEvent;
  [GameEvents.Attack]: GameAttackEvent;
  [GameEvents.UpgradeKing]: GameUpgradeKingTowerEvent;
  [GameEvents.UpgradeDefense]: GameUpgradeDefenseTowerEvent;
  [GameEvents.Fire]: GameFireEvent;
  [GameEvents.Over]: GameOverEvent;
}

const INITIAL_USER_ATTRS: UserAttributes = {
  coins: INITIAL_COINS,
  kingTower: {
    level: 1,
    life: kingTowerAttributes[0].life,
  },
  defenses: {},
  mobs: {},
};

export class KOTEngine extends Engine {
  public sprites: Record<string, Sprite> = {};

  public isShopOpen = false;
  public shopType: DefenseTowerType = DefenseTowerType.Archer;

  public user: UserAttributes = { ...INITIAL_USER_ATTRS };
  public defenses: Record<number, DefenseTower> = {};
  public defenseAttack: Record<number, NodeJS.Timeout> = {};

  public opponent: UserAttributes = { ...INITIAL_USER_ATTRS };
  public opponentDefenses: Record<number, DefenseTower> = {};
  public opponentDefenseAttack: Record<number, NodeJS.Timeout> = {};

  public events = new EventEmitter<EngineEvents & GameEngineEvents>();
  public actors: Record<string, Actor> = {};
  public callbacks: Record<string, Function> = {};

  constructor(options: EngineOptions) {
    super(options);

    this.user = { ...INITIAL_USER_ATTRS };
    this.opponent = { ...INITIAL_USER_ATTRS };
  }

  private _updateCoins() {
    (this.actors.coins as Label).text = this.user.coins.toString();
  }

  addCoins(amount: number) {
    this.user.coins += amount;
    this._updateCoins();
  }

  removeCoins(amount: number) {
    this.user.coins -= amount;
    this._updateCoins();
  }

  registerActor(id: string, actor: Actor) {
    this.actors[id] = actor;
  }

  unregisterActor(id: string) {
    delete this.actors[id];
  }

  getActor(id: string) {
    return this.actors[id];
  }

  registerCallback(id: string, callback: Function) {
    this.callbacks[id] = callback;
  }

  unregisterCallback(id: string) {
    delete this.callbacks[id];
  }

  getCallback(id: string) {
    return this.callbacks[id];
  }

  buyTower(type: DefenseTowerType, slot: number) {
    const actorId = [
      ,
      "firstTower",
      "secondTower",
      "thirdTower",
      "fourthTower",
    ][slot];

    if (!actorId) {
      return;
    }

    const sprite = {
      [DefenseTowerType.Archer]: this.sprites.acherTower,
      [DefenseTowerType.Mage]: this.sprites.mageTower,
      [DefenseTowerType.Trap]: this.sprites.canonTower,
    }[type];

    sprite.width = 40;
    sprite.height = 40;

    this.getActor(actorId).graphics.use(sprite);

    this.setDefense(slot, {
      type,
      level: 1,
    });
  }

  buyOpponentTower(type: DefenseTowerType, slot: number) {
    const actorId = [
      ,
      "opponentFirstTower",
      "opponentSecondTower",
      "opponentThirdTower",
      "opponentFourthTower",
    ][slot];

    if (!actorId) {
      return;
    }

    const sprite = {
      [DefenseTowerType.Archer]: this.sprites.acherTower,
      [DefenseTowerType.Mage]: this.sprites.mageTower,
      [DefenseTowerType.Trap]: this.sprites.canonTower,
    }[type];

    sprite.width = 40;
    sprite.height = 40;

    this.getActor(actorId).graphics.use(sprite);

    this.setOpponentDefense(slot, {
      type,
      level: 1,
    });
  }

  toggleShop(type: DefenseTowerType) {
    this.isShopOpen = !this.isShopOpen;
    this.shopType = type;
  }

  upgradeDefense(slot: number) {
    this.setDefense(slot, {
      ...this.defenses[slot],
      level: this.defenses[slot].level + 1,
    });
  }

  upgradeOpponentDefense(slot: number) {
    this.setOpponentDefense(slot, {
      ...this.opponentDefenses[slot],
      level: this.opponentDefenses[slot].level + 1,
    });
  }

  private setDefense(defenseId: number, defense: DefenseTower) {
    this.defenses[defenseId] = defense;

    const towerAttrs = defenseTowerAttributes[defense.type][defense.level - 1];

    const interval = setInterval(() => {
      this.events.emit(GameEvents.Fire, {
        slot: defenseId,
        damage: towerAttrs.damage,
        isOpponent: false,
      });
    }, 4000);

    clearInterval(this.defenseAttack[defenseId]);
    this.defenseAttack[defenseId] = interval;
  }

  private setOpponentDefense(defenseId: number, defense: DefenseTower) {
    this.opponentDefenses[defenseId] = defense;

    const towerAttrs = defenseTowerAttributes[defense.type][defense.level - 1];

    const interval = setInterval(() => {
      this.events.emit(GameEvents.Fire, {
        slot: defenseId,
        damage: towerAttrs.damage,
        isOpponent: true,
      });
    }, 4000);

    clearInterval(this.opponentDefenseAttack[defenseId]);
    this.opponentDefenseAttack[defenseId] = interval;
  }

  getDefense(defenseId: number) {
    return this.defenses[defenseId];
  }

  getOpponentDefense(defenseId: number) {
    return this.opponentDefenses[defenseId];
  }

  attack(damage: number) {
    const oldLife = this.opponent.kingTower.life;
    this.opponent.kingTower.life -= damage;
    const newLife = this.opponent.kingTower.life;

    const ratio = newLife / oldLife;

    this.getCallback("reduceOpponentsLife")(ratio);
  }

  receiveAttack(damage: number) {
    const oldLife = this.user.kingTower.life;
    this.user.kingTower.life -= damage;
    const newLife = this.user.kingTower.life;

    const ratio = newLife / oldLife;

    this.getCallback("reduceLife")(ratio);
  }

  upgradeKingTower() {
    const nextLevel = this.user.kingTower.level + 1;

    this.user.kingTower = {
      level: nextLevel,
      life: kingTowerAttributes[nextLevel - 1].life,
    };

    this.getCallback("restoreLife")();
  }

  upgradeOpponentKingTower() {
    const nextLevel = this.opponent.kingTower.level + 1;

    this.opponent.kingTower = {
      level: nextLevel,
      life: kingTowerAttributes[nextLevel - 1].life,
    };

    this.getCallback("restoreOpponentsLife")();
  }

  win() {
    [1, 2, 3, 4].forEach((slot) => {
      clearInterval(this.defenseAttack[slot]);
      clearInterval(this.opponentDefenseAttack[slot]);
    });
    this.goToScene("win");
  }

  lose() {
    [1, 2, 3, 4].forEach((slot) => {
      clearInterval(this.defenseAttack[slot]);
      clearInterval(this.opponentDefenseAttack[slot]);
    });
    this.goToScene("lose");
  }

  setupScenes() {
    this.add("win", new WinScene(this.sprites));
    this.add("lose", new LoseScene(this.sprites));
  }
}

class WinScene extends Scene {
  public sprites: Record<string, Sprite> = {};

  constructor(sprites: Record<string, Sprite>) {
    super();
    this.sprites = sprites;
  }

  onInitialize() {
    const bg = new Actor({
      x: 0,
      y: 0,
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      z: -99,
      anchor: Vector.Zero,
      collisionType: CollisionType.PreventCollision,
    });

    const background = this.sprites.background;
    background.destSize.width = CANVAS_WIDTH;
    background.destSize.height = CANVAS_HEIGHT;

    bg.graphics.use(background);
    this.add(bg);

    const label = new Label({
      text: "Você ganhou!",
      font: new Font({
        size: 48,
        bold: true,
        textAlign: TextAlign.Center,
      }),
      color: Color.Black,
      anchor: vec(0.5, 0.5),
    });

    label.pos = vec(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

    this.add(label);
  }
}

class LoseScene extends Scene {
  public sprites: Record<string, Sprite> = {};

  constructor(sprites: Record<string, Sprite>) {
    super();
    this.sprites = sprites;
  }

  onInitialize() {
    const bg = new Actor({
      x: 0,
      y: 0,
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      z: -99,
      anchor: Vector.Zero,
      collisionType: CollisionType.PreventCollision,
    });

    const background = this.sprites.background;
    background.destSize.width = CANVAS_WIDTH;
    background.destSize.height = CANVAS_HEIGHT;

    bg.graphics.use(background);
    this.add(bg);

    const label = new Label({
      text: "Você Perdeu!",
      font: new Font({
        size: 48,
        bold: true,
        textAlign: TextAlign.Center,
      }),
      color: Color.Black,
      anchor: vec(0.5, 0.5),
    });

    label.pos = vec(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

    this.add(label);
  }
}
