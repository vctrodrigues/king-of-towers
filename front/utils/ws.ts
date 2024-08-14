import type { WebSocketResponse } from "@/types/ws";

export const serialize = <Data>(event: string, obj: Data) => {
  return JSON.stringify({ event, data: obj });
};

export const deserialize = <Data>(str: string) => {
  return JSON.parse(str) as WebSocketResponse<Data>;
};
