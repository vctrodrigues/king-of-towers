import {
  GameEarnResponse,
  GameBuyResponse,
  GameUpgradeKingTowerResponse,
  GameUpgradeDefenseTowerResponse,
  GameAttackResponse,
  GameOverResponse,
} from "@/types/game";
import { WebSocketService } from "./ws";
import { WebSockerError, WebSocketData } from "@/types/ws";
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

    const earnCoins = (data: WebSocketData<GameEarnResponse>) => {
      if (!data.success) {
        console.error((data.data as WebSockerError).error);
        return;
      }

      if ((data.data as WebSockerError).error) {
        return;
      }

      this.config.earn(data.data as GameEarnResponse);
    };

    const attack = (data: WebSocketData<GameAttackResponse>) => {
      if (!data.success) {
        console.error((data.data as WebSockerError).error);
        return;
      }

      if ((data.data as WebSockerError).error) {
        return;
      }

      this.config.attack(data.data as GameAttackResponse);
    };

    const upgradeKingTower = (
      data: WebSocketData<GameUpgradeKingTowerResponse>
    ) => {
      if (!data.success) {
        console.error((data.data as WebSockerError).error);
        return;
      }

      if ((data.data as WebSockerError).error) {
        return;
      }

      this.config.upgradeKingTower(data.data as GameUpgradeKingTowerResponse);
    };

    const upgradeDefenseTower = (
      data: WebSocketData<GameUpgradeDefenseTowerResponse>
    ) => {
      if (!data.success) {
        console.error((data.data as WebSockerError).error);
        return;
      }

      if ((data.data as WebSockerError).error) {
        return;
      }

      this.config.upgradeDefenseTower(
        data.data as GameUpgradeDefenseTowerResponse
      );
    };

    const buy = (data: WebSocketData<GameBuyResponse>) => {
      if (!data.success) {
        console.error((data.data as WebSockerError).error);
        return;
      }

      if ((data.data as WebSockerError).error) {
        return;
      }

      this.config.buy(data.data as GameBuyResponse);
    };

    const gameOver = (data: WebSocketData<GameOverResponse>) => {
      if (!data.success) {
        console.error((data.data as WebSockerError).error);
        return;
      }

      if ((data.data as WebSockerError).error) {
        return;
      }

      this.config.gameOver(data.data as GameOverResponse);
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
