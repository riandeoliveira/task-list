import type { ComponentProps } from "react";
import { Icon } from "@/assets";
import { useI18n } from "@/hooks/use-i18n";
import { usePaginationStore } from "@/stores/pagination-store";
import { cn } from "@/utils/cn";
import { Button } from "./button";

type PaginationProps = ComponentProps<"div"> & {
  totalItems: number;
  onPaginate: () => Promise<void>;
};

export const Pagination = ({
  totalItems,
  onPaginate,
  className,
  ...props
}: PaginationProps) => {
  const paginationStore = usePaginationStore();

  const { t } = useI18n();

  const totalPages = Math.ceil(totalItems / paginationStore.pageSize);

  const handlePreviousPage = async () => {
    if (paginationStore.pageNumber > 1) {
      paginationStore.setPageNumber(paginationStore.pageNumber - 1);

      await onPaginate();
    }
  };

  const handleNextPage = async () => {
    if (paginationStore.pageNumber < totalPages) {
      paginationStore.setPageNumber(paginationStore.pageNumber + 1);

      await onPaginate();
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <Button
        variant="ghost"
        className="rounded-full p-2"
        disabled={paginationStore.pageNumber === 1}
        onClick={handlePreviousPage}
      >
        <Icon.ChevronLeft className="text-zinc-500" />
      </Button>
      <span className="text-sm text-zinc-400">
        {t("page")}{" "}
        <strong className="font-semibold">{paginationStore.pageNumber}</strong>{" "}
        {t("of")} <strong className="font-semibold">{totalPages || 1}</strong>
      </span>
      <Button
        variant="ghost"
        className="rounded-full p-2"
        disabled={paginationStore.pageNumber === totalPages || totalPages === 0}
        onClick={handleNextPage}
      >
        <Icon.ChevronRight className="text-zinc-500" />
      </Button>
    </div>
  );
};
