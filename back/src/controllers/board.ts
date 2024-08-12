import WebSocket from "ws";
import { boardService } from "../service/board";
import { serialize } from "../utils/serialize";
import { DBService } from "../service/db";
import { User } from "../types/user";
import { Board } from "../types/board";

export const boardController = (ws: WebSocket, dbService: DBService<User>) => {
  const _boardService = boardService(dbService);

  return {
    update: ({ userCode, board }: { userCode: string; board: Board }) => {
      console.log(`> Adding ship to user: ${userCode}`);

      try {
        const user = _boardService.update(userCode, board);

        console.log(`> Board updated [${user.name}]`);
        ws.send(serialize("board:update", user));
      } catch (error) {
        console.log(`> Error adding ship to user: ${userCode}`);
        ws.send(serialize("board:update", { error: error.message }, false));
      }
    },
  };
};
