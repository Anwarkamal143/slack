export const isArray = (args: any) => Array.isArray(args);

export const wait = async (time: number = 0) => {
  setTimeout(() => {
    return Promise.resolve();
  }, time);
};
