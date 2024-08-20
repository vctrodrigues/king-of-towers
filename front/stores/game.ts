import { create } from "zustand";
import { devtools } from "zustand/middleware";

import {
  GameAttackResponse,
  GameBuyResponse,
  GameEarnResponse,
  GameOverResponse,
  GameUpgradeDefenseTowerResponse,
  GameUpgradeKingTowerResponse,
  KOTEngine,
} from "@/types/game";
import { GameEvents } from "@/enums/events/game";

interface GameState {
  engine: KOTEngine;
  isEnded: boolean;

  startEngine: (engine: KOTEngine) => void;

  earn: (response: Partial<GameEarnResponse>) => void;
  buy: (response: Partial<GameBuyResponse>) => void;
  upgradeKingTower: (response: Partial<GameUpgradeKingTowerResponse>) => void;
  upgradeDefenseTower: (
    response: Partial<GameUpgradeDefenseTowerResponse>
  ) => void;
  attack: (response: Partial<GameAttackResponse>) => void;
  gameOver: (response: Partial<GameOverResponse>) => void;
}

export const useGameStore = create<GameState>()(
  devtools((set, get) => ({
    isEnded: false,
    engine: {} as KOTEngine,

    startEngine(engine: KOTEngine) {
      set((state) => {
        return {
          ...state,
          engine,
        };
      });
    },

    earn: (response) => {
      if (!get().engine.ready) {
        console.warn("Engine not ready");
        return;
      }

      get().engine.events.emit(GameEvents.Earn, response);
    },

    buy: (response) => {
      if (!get().engine.ready) {
        console.warn("Engine not ready");
        return;
      }

      get().engine.events.emit(GameEvents.Buy, response);
    },

    upgradeKingTower: (response) => {
      if (!get().engine.ready) {
        console.warn("Engine not ready");
        return;
      }

      get().engine.events.emit(GameEvents.UpgradeKing, response);
    },

    upgradeDefenseTower: (response) => {
      if (!get().engine.ready) {
        console.warn("Engine not ready");
        return;
      }

      get().engine.events.emit(GameEvents.UpgradeDefense, response);
    },

    attack: (response) => {
      if (!get().engine.ready) {
        console.warn("Engine not ready");
        return;
      }

      get().engine.events.emit(GameEvents.Attack, response);
    },

    gameOver: (response) => {
      if (!get().engine.ready) {
        console.warn("Engine not ready");
        return;
      }

      get().engine.events.emit(GameEvents.Over, response);
      set((state) => {
        return {
          ...state,
          isEnded: true,
        };
      });
    },
  }))
);
