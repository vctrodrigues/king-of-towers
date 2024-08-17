import { createContext, useContext } from "react";
import { WebSocketService } from "@/services/ws";

interface WebSocketContextState {
  ws: WebSocketService;
}

export const WebSocketContext = createContext<WebSocketContextState>({
  ws: {} as WebSocketService,
});

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
