import { IAccount, IUser } from "@/schema/user";
import { create } from "zustand";
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
const useUserStore = create<IUserActions & IUserState>()((set) => ({
  ...INITIAL_STATE,
  setUser(props) {
    set({ ...props });
  },

  reset() {
    set({ ...INITIAL_STATE });
    storeResetFns.add(() => set({ ...INITIAL_STATE }));
  },
}));

export default useUserStore;
