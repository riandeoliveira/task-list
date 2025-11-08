import { Icon } from "@/assets";
import { dateHelper } from "@/helpers/date-helper";
import { useHttp } from "@/hooks/use-http";
import { useI18n } from "@/hooks/use-i18n";
import { useTask } from "@/hooks/use-task";
import { useToast } from "@/hooks/use-toast";
import { useDialogStore } from "@/stores/dialog-store";
import { useLoaderStore } from "@/stores/loader-store";
import { useTaskStore } from "@/stores/task-store";
import type { Task } from "@/types/task";
import { cn } from "@/utils/cn";
import { Button } from "../shared/button";
import { Card } from "../shared/card";

type TaskCardProps = Task;

export const TaskCard = ({
  id,
  title,
  description,
  createdAt,
  isCompleted,
}: TaskCardProps) => {
  const loaderStore = useLoaderStore();
  const toast = useToast();
  const dialogStore = useDialogStore();
  const taskStore = useTaskStore();

  const { request } = useHttp();
  const { t } = useI18n();
  const { getTasks } = useTask();

  const handleGetTask = async () => {
    loaderStore.start();

    await request<null, Task>("GET", `/tasks/${id}`, {
      retryToAuth: true,
      onSuccess: (data) => {
        taskStore.setSelectedTask(data);

        dialogStore.open("edit-task");
      },
      onError: (error) => {
        toast.error(error.detail);
      },
    });

    loaderStore.stop();
  };

  const handleToggleCompleteTask = async () => {
    loaderStore.start();

    await request<Pick<Task, "isCompleted">, Task>("PATCH", `/tasks/${id}`, {
      body: {
        isCompleted: !isCompleted,
      },
      retryToAuth: true,
      onSuccess: async (data) => {
        if (data.isCompleted) {
          toast.success(t("complete_task_success"));
        }

        await getTasks();
      },
      onError: (error) => {
        toast.error(error.detail);
      },
    });

    loaderStore.stop();
  };

  const handleOpenDeleteTaskDialog = (taskId: string) => {
    taskStore.setSelectedTask({
      ...taskStore.selectedTask,
      id: taskId,
    });

    dialogStore.open("delete-task");
  };

  return (
    <Card
      className={cn(
        "rounded-lg px-4 py-0 bg-input flex items-center bg-zinc-800 gap-4 hover:bg-zinc-800/80 transition-all",
        isCompleted && "border-l-12 border-l-green-500",
      )}
    >
      <button
        type="button"
        onClick={handleToggleCompleteTask}
        aria-label={
          isCompleted ? t("mark_task_as_pending") : t("mark_task_as_complete")
        }
        className="py-4 flex-1 text-start cursor-pointer"
      >
        <div className="flex flex-col gap-1">
          <p className="break-all">{title}</p>
          <p className="text-sm text-zinc-400 text-justify">{description}</p>
          <div className="flex items-center gap-1">
            <Icon.Clock className="text-zinc-500 size-4" />
            <span className="text-xs text-zinc-500">
              {dateHelper.formatDateTime(createdAt)}
            </span>
          </div>
        </div>
      </button>
      <div className="flex flex-col">
        <div className="flex justify-center">
          <Button
            variant="ghost"
            aria-label={t("edit_task")}
            onClick={handleGetTask}
            className="p-2 enabled:hover:bg-transparent group"
          >
            <Icon.Pencil className="text-zinc-400 transition-colors group-enabled:hover:text-blue-400" />
          </Button>
          <Button
            variant="ghost"
            aria-label={t("delete_task")}
            onClick={() => handleOpenDeleteTaskDialog(id)}
            className="p-2 enabled:hover:bg-transparent group"
          >
            <Icon.Trash2 className="text-zinc-400 transition-colors group-enabled:hover:text-red-400" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
