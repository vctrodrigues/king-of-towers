interface WebSocketMessage<Type> {
  event: string;
  data: Type;
}

export const serialize = <Type>(
  event: string,
  data: Type,
  success: boolean = true
) => {
  return JSON.stringify({ event, success, data });
};

export const deserialize = <Type>(data: string): WebSocketMessage<Type> => {
  return JSON.parse(data);
};
