export const interceptor = <Payload>(
  cb: (data: Payload) => void
): ((data: unknown) => void) => {
  return (data: unknown) => {
    cb(data as Payload);
  };
};
