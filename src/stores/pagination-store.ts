import { create } from "zustand";

type PaginationStore = {
  pageNumber: number;
  pageSize: number;
  setPageNumber(pageNumber: number): void;
  setPageSize(pageSize: number): void;
};

export const usePaginationStore = create<PaginationStore>()((set) => ({
  pageNumber: 1,
  pageSize: 10,

  setPageNumber(pageNumber) {
    set(() => ({ pageNumber }));
  },

  setPageSize(pageSize) {
    set(() => ({ pageSize }));
  },
}));
