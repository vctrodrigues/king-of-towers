import { vec } from "excalibur";
import { GameService } from "@/services/game";
import { GameEvents } from "@/enums/events/game";
import { GameEngineEvents, KOTEngine } from "@/types/game";
import { DefenseTowerType } from "@/types/towers";

export const setupEvents = (game: KOTEngine, gameService: GameService) => {
  const earn = (event: GameEngineEvents[GameEvents.Earn]) => {
    game.addCoins(event.amount);
  };

  const buyTower = (event: GameEngineEvents[GameEvents.Buy]) => {
    if (event.isOpponent) {
      game.buyOpponentTower(event.defense.type, event.slot);
      return;
    }

    game.removeCoins(event.price);
    game.buyTower(event.defense.type, event.slot);
  };

  const shot = (event: GameEngineEvents[GameEvents.Fire]) => {
    const slot = event.slot;
    const tower = event.isOpponent
      ? game.getOpponentDefense(slot)
      : game.getDefense(slot);

    if (!tower) {
      console.log("no tower");
      return;
    }

    const fire = game.getActor(
      {
        [DefenseTowerType.Archer]: "archerFire",
        [DefenseTowerType.Mage]: "mageFire",
        [DefenseTowerType.Trap]: "trapFire",
      }[tower.type]
    );

    const towerActor = game.getActor(
      (event.isOpponent
        ? [
            ,
            "opponentFirstTower",
            "opponentSecondTower",
            "opponentThirdTower",
            "opponentFourthTower",
          ]
        : [, "firstTower", "secondTower", "thirdTower", "fourthTower"])[slot] ??
        ""
    );

    if (!towerActor) {
      console.log("no tower actor");
      return;
    }

    const _fire = fire.clone();

    const direction = event.isOpponent ? 1 : -1;

    _fire.pos = vec(
      towerActor.pos.x + direction * 10,
      towerActor.pos.y + (event.isOpponent ? towerActor.height + 35 : -75)
    );

    _fire.vel = vec(0, direction * 300);

    _fire.onCollisionStart = () => {
      _fire.kill();
    };

    _fire.onPostKill = () => {
      if (event.isOpponent) {
        return;
      }

      gameService.attack(event.damage);
    };

    game.add(_fire);
  };

  const attackTower = (event: GameEngineEvents[GameEvents.Attack]) => {
    if (event.isOpponent) {
      game.receiveAttack(event.kingTower);
      return;
    }

    game.attack(event.kingTower);
  };

  const upgradeTower = (event: GameEngineEvents[GameEvents.UpgradeDefense]) => {
    const slot = event.slot;
    const tower = event.isOpponent
      ? game.getOpponentDefense(slot)
      : game.getDefense(slot);

    if (!tower) {
      return;
    }

    if (event.isOpponent) {
      game.upgradeOpponentDefense(slot);
      return;
    }

    game.removeCoins(event.price);
    game.upgradeDefense(slot);
  };

  const upgradeKing = (event: GameEngineEvents[GameEvents.UpgradeKing]) => {
    if (event.isOpponent) {
      game.upgradeOpponentKingTower();
      return;
    }

    game.removeCoins(event.price);
    game.upgradeKingTower();
  };

  const endGame = (event: GameEngineEvents[GameEvents.Over]) => {
    event.win ? game.win() : game.lose();
  };

  game.events.on(GameEvents.Earn, earn);
  game.events.on(GameEvents.Buy, buyTower);
  game.events.on(GameEvents.Fire, shot);
  game.events.on(GameEvents.Attack, attackTower);
  game.events.on(GameEvents.UpgradeDefense, upgradeTower);
  game.events.on(GameEvents.UpgradeKing, upgradeKing);
  game.events.on(GameEvents.Over, endGame);
};
