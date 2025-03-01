import { storeResetFns } from "@/store/useGlobalStore";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type ICreateWorkspaceModalState = {
  isOpen: boolean;
};

type ICreateWorkspaceModalActions = {
  setModalOpen: (isOpen: boolean) => void;
  reset: () => void;
};
const INITIAL_STATE = {
  isOpen: false,
};
const useCreateWorkspaceModalStore = create<
  ICreateWorkspaceModalActions & ICreateWorkspaceModalState
>()(
  immer((set) => {
    storeResetFns.add(() => set(INITIAL_STATE));
    return {
      ...INITIAL_STATE,
      setModalOpen(isOpen) {
        set((state) => {
          state.isOpen = isOpen;
        });
      },

      reset() {
        set(INITIAL_STATE);
      },
    };
  })
);

export default useCreateWorkspaceModalStore;

export const useCreateWorkspaceModalStoreIsOpen = () =>
  useCreateWorkspaceModalStore((state) => state.isOpen);

export const useCreateWorkspaceModalStoreActions = () => ({
  setModalOpen: useCreateWorkspaceModalStore((state) => state.setModalOpen),
  reset: useCreateWorkspaceModalStore((state) => state.reset),
});
