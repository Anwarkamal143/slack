import { create } from "zustand";
import { storeResetFns } from "./useGlobalStore";

type IRefreshTokenState = {
  isRefreshing: boolean;
};

type IRefreshActions = {
  setIsRefreshing: (isRefreshing: boolean) => void;
  reset: () => void;
};
const INITIAL_STATE = {
  isRefreshing: false,
};
const useRefreshStore = create<IRefreshActions & IRefreshTokenState>()(
  (set) => ({
    ...INITIAL_STATE,
    setIsRefreshing(isRefreshing) {
      set({ isRefreshing });
    },

    reset() {
      set({ ...INITIAL_STATE });
      storeResetFns.add(() => set({ ...INITIAL_STATE }));
    },
  })
);

export default useRefreshStore;
