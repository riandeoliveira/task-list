import { create } from "zustand";

type DialogStore = {
  dialogs: Record<string, { isOpen: boolean }>;
  open(key: string): void;
  close(key: string): void;
  isOpen(key: string): boolean;
};

export const useDialogStore = create<DialogStore>((set, get) => ({
  dialogs: {},

  open(key) {
    set(() => ({
      dialogs: {
        [key]: { isOpen: true },
      },
    }));
  },

  close(key) {
    set(() => ({
      dialogs: {
        [key]: { isOpen: false },
      },
    }));
  },

  isOpen(key) {
    return get().dialogs[key]?.isOpen || false;
  },
}));
