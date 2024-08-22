export type WebSocketResponse<Data> = {
  event: string;
  success: boolean;
  data: Data | WebSockerError;
};

export type WebSockerError = {
  error: string;
};

export type WebSocketData<Data> = Omit<WebSocketResponse<Data>, "event">;
