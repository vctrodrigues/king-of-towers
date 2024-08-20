import {
  GameAttackPayload,
  GameBuyPayload,
  GameOverPayload,
  GameEarnPayload,
  GameUpgradeDefenseTowerPayload,
  GameUpgradeKingTowerPayload,
  GameEarnResponse,
  GameBuyResponse,
  GameUpgradeKingTowerResponse,
  GameUpgradeDefenseTowerResponse,
  GameAttackResponse,
  GameOverResponse,
} from "@/types/game";
import { WebSocketService } from "./ws";
import { WebSocketData } from "@/types/ws";
import { GameEvents } from "@/enums/events/game";
import { User } from "@/types/user";
import { DefenseTowerType } from "@/types/towers";

interface GameServiceConfig {
  ws: WebSocketService;
  uid: string;
  user: User;
  earn: (response: Partial<GameEarnResponse>) => void;
  buy: (response: Partial<GameBuyResponse>) => void;
  upgradeKingTower: (response: Partial<GameUpgradeKingTowerResponse>) => void;
  upgradeDefenseTower: (
    response: Partial<GameUpgradeDefenseTowerResponse>
  ) => void;
  attack: (response: Partial<GameAttackResponse>) => void;
  gameOver: (response: Partial<GameOverResponse>) => void;
}

export class GameService {
  constructor(private config: GameServiceConfig) {
    this.config = config;

    const earnCoins = (data: WebSocketData<GameEarnPayload>) => {
      if (!data.success) {
        console.error(data.error);
        return;
      }

      if (!data.data) {
        return;
      }

      this.config.earn(data.data);
    };

    const attack = (data: WebSocketData<GameAttackPayload>) => {
      if (!data.success) {
        console.error(data.error);
        return;
      }

      if (!data.data) {
        return;
      }

      this.config.attack(data.data);
    };

    const upgradeKingTower = (
      data: WebSocketData<GameUpgradeKingTowerPayload>
    ) => {
      if (!data.success) {
        console.error(data.error);
        return;
      }

      if (!data.data) {
        return;
      }

      this.config.upgradeKingTower(data.data);
    };

    const upgradeDefenseTower = (
      data: WebSocketData<GameUpgradeDefenseTowerPayload>
    ) => {
      if (!data.success) {
        console.error(data.error);
        return;
      }

      if (!data.data) {
        return;
      }

      this.config.upgradeDefenseTower(data.data);
    };

    const buy = (data: WebSocketData<GameBuyPayload>) => {
      if (!data.success) {
        console.error(data.error);
        return;
      }

      if (!data.data) {
        return;
      }

      this.config.buy(data.data);
    };

    const gameOver = (data: WebSocketData<GameOverResponse>) => {
      if (!data.success) {
        console.error(data.error);
        return;
      }

      if (!data.data) {
        return;
      }

      this.config.gameOver(data.data);
    };

    this.config.ws.on(GameEvents.Over, gameOver);

    this.config.ws.on(GameEvents.Earn, earnCoins);
    this.config.ws.on(GameEvents.Attack, attack);
    this.config.ws.on(GameEvents.UpgradeKing, upgradeKingTower);
    this.config.ws.on(GameEvents.UpgradeDefense, upgradeDefenseTower);
    this.config.ws.on(GameEvents.Buy, buy);
  }

  upgradeKingTower() {
    this.config.ws.send(GameEvents.UpgradeKing, {
      uid: this.config.uid,
      user: this.config.user,
    });
  }

  upgradeDefenseTower(slot: number) {
    this.config.ws.send(GameEvents.UpgradeDefense, {
      uid: this.config.uid,
      user: this.config.user,
      slot,
    });
  }

  buy(slot: number, type: DefenseTowerType) {
    this.config.ws.send(GameEvents.Buy, {
      uid: this.config.uid,
      user: this.config.user,
      type,
      slot,
    });
  }

  attack(damage: number) {
    this.config.ws.send(GameEvents.Attack, {
      uid: this.config.uid,
      user: this.config.user,
      damage,
    });
  }
}
