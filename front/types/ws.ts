export type WebSocketResponse<Data> = {
  event: string;
  success: boolean;
  data?: Data;
  error?: string;
};

export type WebSocketData<Data> = Omit<WebSocketResponse<Data>, "event">;
