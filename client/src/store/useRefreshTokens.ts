import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { storeResetFns } from "./useGlobalStore";

type IRefreshTokenState = {
  isRefreshing: boolean;
  accessToken?: string;
  refreshToken?: string;
};

type IRefreshActions = {
  setRefreshState: (props: IRefreshTokenState) => void;
  setIsRefreshing: (isRefreshing: boolean) => void;
  reset: () => void;
};
const INITIAL_STATE: IRefreshTokenState = {
  isRefreshing: false,
  accessToken: undefined,
  refreshToken: undefined,
};
const useRefreshStore = create<IRefreshActions & IRefreshTokenState>()(
  immer((set) => {
    storeResetFns.add(() => set(INITIAL_STATE));
    return {
      ...INITIAL_STATE,
      setRefreshState(props) {
        set((state) => {
          state.isRefreshing = props.isRefreshing;
          state.accessToken = props.accessToken;
          state.refreshToken = props.refreshToken;
        });
      },
      setIsRefreshing(isRefreshing) {
        set((state) => {
          state.isRefreshing = isRefreshing;
        });
      },

      reset() {
        set(INITIAL_STATE);
      },
    };
  })
);

export default useRefreshStore;

export const useRefreshStoreActions = () => ({
  setTokenState: useRefreshStore((state) => state.setRefreshState),
  setIsRefreshing: useRefreshStore((state) => state.setIsRefreshing),
  reset: useRefreshStore((state) => state.reset),
});
export const useRefreshStoreIsRefreshing = () =>
  useRefreshStore((state) => state.isRefreshing);
export const useRefreshStoreGetTokens = () => useRefreshStore((state) => state);
