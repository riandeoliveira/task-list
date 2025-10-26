export type PaginationData<TItem> = {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  items: TItem[];
};
