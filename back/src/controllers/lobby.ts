import { Message } from "chat";
import { lobbyService } from "../service/lobby";
import { DBService } from "../service/db";
import { User } from "user";

export const lobbyController = (ws: WebSocket, dbService: DBService<Message>) => {
    const _lobbyService = lobbyService(dbService);

    // estrutura dos demais controllers

}