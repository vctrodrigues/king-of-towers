"use client";

import { deserialize, serialize } from "@/utils/ws";

interface WebSocketService {
  socket?: WebSocket;
  callbacks: Map<string, Function>;
  initialize: (session?: string) => void;
  on: (event: string, callback: Function) => void;
  send: <Data>(event: string, data: Data) => void;
  close: () => void;
}

export const ws: WebSocketService = {
  socket: undefined,
  callbacks: new Map<string, Function>(),

  initialize: (session?: string) => {
    ws.socket = new WebSocket(
      `ws://localhost:8080${session ? `?session=${session}` : ""}`
    );
  },

  on: (event: string, callback: Function) => {
    if (!ws.socket) {
      console.error("Socket not initialized");
      return;
    }

    ws.callbacks.set(event, callback);

    ws.socket.onmessage = (payload) => {
      const { event, ...data } = deserialize(payload.data);

      if (!ws.callbacks.has(event)) {
        console.error(`No callback for event: ${event}`);
      }

      ws.callbacks.get(event)?.(data);
    };
  },

  send: <Data>(event: string, data: Data) => {
    if (!ws.socket) {
      console.error("Socket not initialized");
      return;
    }

    ws.socket.send(serialize(event, data));
  },

  close: () => {
    if (!ws.socket) {
      console.error("Socket not initialized");
      return;
    }

    ws.socket.close();
  },
};
