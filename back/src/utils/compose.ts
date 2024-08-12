export const compose = (...callbacks: (() => void)[]) => {
  callbacks.forEach((callback) => {
    if (typeof callback !== "function") {
      throw new Error("Callback is not a function");
    }

    callback();
  });
};
