import { storeResetFns } from "@/store/useGlobalStore";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type ICreateWorkspaceChannelModalState = {
  isOpen: boolean;
};

type ICreateWorkspaceChannelModalActions = {
  setModalOpen: (isOpen: boolean) => void;
  reset: () => void;
};
const INITIAL_STATE = {
  isOpen: false,
};
const useCreateWorkspaceChannelModalStore = create<
  ICreateWorkspaceChannelModalActions & ICreateWorkspaceChannelModalState
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

export default useCreateWorkspaceChannelModalStore;

export const useCreateWorkspaceChannelModalStoreIsOpen = () =>
  useCreateWorkspaceChannelModalStore((state) => state.isOpen);

export const useCreateWorkspaceChannelModalStoreActions = () => ({
  setModalOpen: useCreateWorkspaceChannelModalStore(
    (state) => state.setModalOpen
  ),
  reset: useCreateWorkspaceChannelModalStore((state) => state.reset),
});
