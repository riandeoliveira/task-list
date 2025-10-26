import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Icon } from "@/assets";
import { TaskCard } from "@/components/cards/task-card";
import { EditTaskDialog } from "@/components/dialogs/edit-task-dialog";
import { Button } from "@/components/shared/button";
import { Card } from "@/components/shared/card";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Input } from "@/components/shared/input";
import { Pagination } from "@/components/shared/pagination";
import { Select } from "@/components/shared/select";
import { Tooltip } from "@/components/shared/tooltip";
import { useHttpRequest } from "@/hooks/use-http-request";
import { useI18n } from "@/hooks/use-i18n";
import { useTask } from "@/hooks/use-task";
import { useToast } from "@/hooks/use-toast";
import { useDialogStore } from "@/stores/dialog-store";
import { useLoaderStore } from "@/stores/loader-store";
import { usePaginationStore } from "@/stores/pagination-store";
import { useTaskStore } from "@/stores/task-store";
import type { FilterType } from "@/types/task";
import { cn } from "@/utils/cn";

export const HomePage = () => {
  const toast = useToast();
  const loaderStore = useLoaderStore();
  const taskStore = useTaskStore();
  const paginationStore = usePaginationStore();
  const dialogStore = useDialogStore();

  const { t } = useI18n();
  const { request } = useHttpRequest();
  const { getTasks } = useTask();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(createTaskSchema),
  });

  const taskListElementRef = useRef<HTMLDivElement>(null);

  const [hasScroll, setHasScroll] = useState(false);

  const handleCreateTask = async (body: CreateTaskSchema) => {
    loaderStore.start();

    await request("POST", "/tasks", {
      body,
      retryToAuth: true,
      onSuccess: async () => {
        reset();

        toast.success(t("create_task_success"));

        await getTasks();
      },
      onError: (error) => {
        toast.error(error.detail);
      },
    });

    loaderStore.stop();
  };

  const handleDeleteTask = async () => {
    loaderStore.start();

    await request("DELETE", `/tasks/${taskStore.selectedTask.id}`, {
      retryToAuth: true,
      onSuccess: async () => {
        toast.success(t("delete_task_success"));

        dialogStore.close("delete-task");

        await getTasks();
      },
      onError: (error) => {
        toast.error(error.detail);
      },
    });

    loaderStore.stop();
  };

  const handleSelectFilterType = async (value: FilterType) => {
    taskStore.setFilterType(value);

    await getTasks();
  };

  const handleSelectItemsPerPage = async (itemsPerPage: string) => {
    paginationStore.setPageNumber(1);
    paginationStore.setPageSize(Number(itemsPerPage));

    await getTasks();
  };

  useEffect(() => {
    getTasks();
  }, []);

  useEffect(() => {
    const element = taskListElementRef.current;

    if (!element) return;

    const checkScroll = () => {
      const verticalScroll = element.scrollHeight > element.clientHeight;

      setHasScroll(verticalScroll);
    };

    checkScroll();

    const observer = new ResizeObserver(checkScroll);

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="flex justify-center max-h-screen max-s-840:max-h-none">
        <Card className="w-6xl m-4 flex flex-col gap-6 p-0 relative max-h-[calc(100vh-2rem)] max-s-840:max-h-none">
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <a href="/account" className="absolute right-2 top-2">
                <Button variant="ghost" className="p-2 rounded-full">
                  <Icon.CircleUser className="text-zinc-400 size-8" />
                </Button>
              </a>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <span>{t("go_to_account_settings_page")}</span>
            </Tooltip.Content>
          </Tooltip.Root>
          <header className="rounded-xl mt-6 px-6">
            <h1 className="text-center font-semibold text-3xl">
              {t("task_list")}
            </h1>
          </header>
          <main className="flex flex-col gap-6 overflow-hidden max-s-840:overflow-visible">
            <form
              onSubmit={handleSubmit(handleCreateTask)}
              className="rounded-xl flex flex-col gap-4 px-6"
            >
              <h2 className="font-semibold text-2xl">{t("new_task")}</h2>
              <Input.Root hasErrors={!!errors.title}>
                <Input.Text
                  placeholder={t("task_title")}
                  {...register("title")}
                />
                {errors.title?.message && (
                  <Input.ErrorMessage>
                    {t(errors.title.message, { min: 4, max: 128 })}
                  </Input.ErrorMessage>
                )}
              </Input.Root>
              <Input.Root hasErrors={!!errors.description}>
                <Input.TextArea
                  placeholder={t("task_description")}
                  className="text-justify"
                  {...register("description")}
                />
                {errors.description?.message && (
                  <Input.ErrorMessage>
                    {t(errors.description.message, { max: 1024 })}
                  </Input.ErrorMessage>
                )}
              </Input.Root>
              <Button type="submit">{t("add")}</Button>
            </form>
            <div className="border border-zinc-800" />
            <section className="rounded-xl flex flex-col gap-4 px-6 mb-6 overflow-hidden max-s-840:overflow-visible">
              <div className="flex justify-between gap-4 max-s-840:flex-col">
                <div className="flex items-center gap-3">
                  <h2 className="font-semibold text-2xl">{t("your_tasks")}</h2>
                  <span className="bg-zinc-800 translate-y-0.5 font-semibold rounded-full text-center py-0.5 px-2.5">
                    {taskStore.totalTasks}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Select.Root className="w-64 max-s-840:w-full">
                    <Select.Area onValueChange={handleSelectFilterType}>
                      <Select.Trigger>
                        <Select.Value placeholder={t("status")} />
                      </Select.Trigger>
                      <Select.Content>
                        <Select.Item value="all">{t("all")}</Select.Item>
                        <Select.Item value="completed">
                          {t("completed")}
                        </Select.Item>
                        <Select.Item value="pending">
                          {t("pending")}
                        </Select.Item>
                      </Select.Content>
                    </Select.Area>
                  </Select.Root>
                  <Select.Root className="w-64 max-s-840:w-full">
                    <Select.Area onValueChange={handleSelectItemsPerPage}>
                      <Select.Trigger>
                        <Select.Value placeholder={t("items_per_page")} />
                      </Select.Trigger>
                      <Select.Content>
                        <Select.Item value="5">5</Select.Item>
                        <Select.Item value="10">10</Select.Item>
                        <Select.Item value="25">25</Select.Item>
                        <Select.Item value="50">50</Select.Item>
                        <Select.Item value="100">100</Select.Item>
                      </Select.Content>
                    </Select.Area>
                  </Select.Root>
                </div>
              </div>
              <div
                ref={taskListElementRef}
                className={cn(
                  "flex flex-col gap-2 overflow-y-auto max-s-840:overflow-y-hidden",
                  hasScroll && "pr-2 max-s-840:pr-0",
                )}
              >
                {taskStore.tasks.length === 0 ? (
                  <p className="text-center text-zinc-400 my-4">
                    {t("no_tasks_found")}
                  </p>
                ) : (
                  taskStore.tasks.map((item) => (
                    <TaskCard {...item} key={item.id} />
                  ))
                )}
              </div>
              <div className="flex justify-end">
                <Pagination
                  totalItems={taskStore.totalTasks}
                  onPaginate={getTasks}
                />
              </div>
            </section>
          </main>
        </Card>
      </div>
      <EditTaskDialog />
      <ConfirmDialog
        description={`${t("delete_task_confirmation")} ${t("this_action_cannot_be_undone")}`}
        isOpen={dialogStore.isOpen("delete-task")}
        onClose={() => dialogStore.close("delete-task")}
        onConfirm={handleDeleteTask}
        onExited={() => taskStore.resetSelectedTask()}
      />
    </>
  );
};

const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "required_field")
    .min(4, "min_field_length")
    .max(128, "max_field_length"),

  description: z.string().trim().max(1024, "max_field_length").optional(),
});

type CreateTaskSchema = z.infer<typeof createTaskSchema>;
