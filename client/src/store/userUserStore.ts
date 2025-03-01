import { IAccount, IUser } from "@/schema/user";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { storeResetFns } from "./useGlobalStore";

type IUserState = {
  user?: IUser;
  accounts?: IAccount[];
  isAuthenticated?: boolean;
  isLoggedIn?: boolean;
};

type IUserActions = {
  setUser: (props: IUserState) => void;
  reset: () => void;
};
const INITIAL_STATE = {
  user: undefined,
  accounts: [],
  isAuthenticated: false,
  isLoggedIn: false,
};
const useUserStore = create<IUserActions & IUserState>()(
  immer((set) => {
    storeResetFns.add(() => set(INITIAL_STATE));

    return {
      ...INITIAL_STATE,
      setUser(props) {
        set(props);
      },

      reset() {
        set(INITIAL_STATE);
      },
    };
  })
);

export default useUserStore;

export const useUserStoreIsAuthenticated = () =>
  useUserStore((state) => state.isAuthenticated);
export const useUserStoreIsLoggedIn = () =>
  useUserStore((state) => state.isLoggedIn);
export const useUserStoreUserAccounts = () =>
  useUserStore((state) => state.accounts);
export const useUserStoreStoreUser = () => useUserStore((state) => state.user);

export const useUserStoreActions = () => ({
  setUser: useUserStore((state) => state.setUser),
  reset: useUserStore((state) => state.reset),
});
