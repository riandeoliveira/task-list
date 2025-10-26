import { create } from "zustand";

type LoaderStore = {
  isLoading: boolean;
  start(): void;
  stop(): void;
};

export const useLoaderStore = create<LoaderStore>()((set) => ({
  isLoading: false,

  start() {
    set(() => ({ isLoading: true }));
  },

  stop() {
    set(() => ({ isLoading: false }));
  },
}));
