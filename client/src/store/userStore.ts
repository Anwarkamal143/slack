import { IAccount, IProfile, IUser } from "@/schema/user";
import { create } from "zustand";

type IUserState = {
  user?: IUser;
  profiles?: IProfile[];
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
  profiles: [],
  accounts: [],
  isAuthenticated: false,
  isLoggedIn: false,
};
const useUserStore = create<IUserActions & IUserState>()((set) => ({
  ...INITIAL_STATE,
  setUser(props) {
    set({ ...props });
  },

  reset: () => set({ ...INITIAL_STATE }),
}));

export default useUserStore;
