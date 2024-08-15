"use client";

import { deserialize, serialize } from "@/utils/ws";

export class WebSocketService {
  socket?: WebSocket;
  callbacks: Map<string, Function>;

  constructor(private session?: string) {
    if (!session) {
      console.error("Session not provided");
    }

    this.callbacks = new Map<string, Function>();
    this.socket = new WebSocket(`ws://localhost:8080?session=${session}`);
  }

  on(event: string, callback: Function) {
    console.log(`Registering callback for event: ${event}`);

    if (!this.socket) {
      console.error("Socket not initialized");
      return;
    }

    this.callbacks.set(event, callback);

    this.socket.onmessage = (payload) => {
      const { event, ...data } = deserialize(payload.data);

      if (!this.callbacks.has(event)) {
        console.error(`No callback for event: ${event}`);
      }

      this.callbacks.get(event)?.(data);
    };
  }

  send<Data>(event: string, data: Data) {
    if (!this.socket) {
      console.error("Socket not initialized");
      return;
    }

    this.socket.send(serialize(event, data));
  }

  close() {
    if (!this.socket) {
      console.error("Socket not initialized");
      return;
    }

    this.socket.close();
  }
}
