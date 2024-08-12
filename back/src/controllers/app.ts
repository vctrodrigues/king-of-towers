import WebSocket from "ws";

export const appController = (ws: WebSocket) => {
  return {
    close: () => {
      console.log(`> Closing app`);
    },
  };
};
