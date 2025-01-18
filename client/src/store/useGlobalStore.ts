import { create } from "zustand";

type IUserActions = {
  reset: () => void;
};
const INITIAL_STATE = {};
export const storeResetFns = new Set<() => void>();
export const resetAllStores = () => {
  storeResetFns.forEach((resetFn) => {
    resetFn();
  });
};
const useUserStore = create<IUserActions>()((set) => ({
  ...INITIAL_STATE,

  reset() {
    set({ ...INITIAL_STATE });
    storeResetFns.add(() => set({ ...INITIAL_STATE }));
  },
}));

export default useUserStore;
