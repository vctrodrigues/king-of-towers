"use client";

import { Button, Flex, Text } from "@radix-ui/themes";
import { useCallback } from "react";
import { GameEngine } from "./game/GameEngine";

export const GameBoard = () => {
  // const onResign = useCallback(() => {}, []);

  return (
    <Flex
      direction="column"
      width="100%"
      align="center"
      gap="8"
      className="overflow-auto"
    >
      <GameEngine />
      <Flex direction="row" width="100%" align="center" justify="between">
        {/* <Button
          variant="classic"
          size="2"
          className="font-game max-w-[200px]"
          onClick={onResign}
        >
          Abandonar partida
        </Button> */}
      </Flex>
    </Flex>
  );
};
