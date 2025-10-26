import { useLoaderStore } from "@/stores/loader-store";
import { usePaginationStore } from "@/stores/pagination-store";
import { useTaskStore } from "@/stores/task-store";
import type { PaginationData } from "@/types/pagination-data";
import type { Task } from "@/types/task";
import { useHttpRequest } from "./use-http-request";
import { useToast } from "./use-toast";

export const useTask = () => {
  const toast = useToast();
  const loaderStore = useLoaderStore();
  const taskStore = useTaskStore();

  const { request } = useHttpRequest();

  const getTasks = async () => {
    loaderStore.start();

    const { pageNumber, pageSize } = usePaginationStore.getState();
    const { filterType } = useTaskStore.getState();

    await request<null, PaginationData<Task>>("GET", "/tasks", {
      retryToAuth: true,
      params: {
        page_number: pageNumber.toString(),
        page_size: pageSize.toString(),
        status: filterType === "all" ? "" : filterType,
      },
      onSuccess: (data) => {
        taskStore.setTasks(data.items);
        taskStore.setTotalTasks(data.totalItems);
      },
      onError: (error) => {
        toast.error(error.detail);
      },
    });

    loaderStore.stop();
  };

  return {
    getTasks,
  };
};
