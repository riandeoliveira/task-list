import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useHttp } from "@/hooks/use-http";
import { useI18n } from "@/hooks/use-i18n";
import { useTask } from "@/hooks/use-task";
import { useToast } from "@/hooks/use-toast";
import { useDialogStore } from "@/stores/dialog-store";
import { useLoaderStore } from "@/stores/loader-store";
import { useTaskStore } from "@/stores/task-store";
import { Dialog } from "../shared/dialog";
import { Input } from "../shared/input";

export const EditTaskDialog = () => {
  const loaderStore = useLoaderStore();
  const toast = useToast();
  const dialogStore = useDialogStore();
  const taskStore = useTaskStore();

  const { t } = useI18n();
  const { request } = useHttp();
  const { getTasks } = useTask();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateTaskFormSchema),
    values: taskStore.selectedTask,
  });

  const handleUpdateTask = async (body: UpdateTaskFormSchema) => {
    loaderStore.start();

    await request("PATCH", `/tasks/${taskStore.selectedTask.id}`, {
      body,
      retryToAuth: true,
      onSuccess: async () => {
        toast.success(t("update_task_success"));

        dialogStore.close("edit-task");

        await getTasks();
      },
      onError: (error) => {
        toast.error(error.detail);
      },
    });

    loaderStore.stop();
  };

  return (
    <Dialog.Root
      isOpen={dialogStore.isOpen("edit-task")}
      onClose={() => dialogStore.close("edit-task")}
      onExited={() => taskStore.resetSelectedTask()}
    >
      <Dialog.Header>{t("task_edit")}</Dialog.Header>
      <Dialog.Content>
        <form className="flex flex-col gap-4">
          <Input.Root hasErrors={!!errors.title}>
            <Input.Text placeholder={t("task_title")} {...register("title")} />
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
        </form>
      </Dialog.Content>
      <Dialog.Footer>
        <Dialog.CancelAction className="w-24">
          {t("cancel")}
        </Dialog.CancelAction>
        <Dialog.ConfirmAction
          onClick={handleSubmit(handleUpdateTask)}
          className="w-24 bg-green-600 enabled:hover:bg-green-600/80 text-zinc-100"
        >
          {t("confirm")}
        </Dialog.ConfirmAction>
      </Dialog.Footer>
    </Dialog.Root>
  );
};

const updateTaskFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "required_field")
    .min(4, "min_field_length")
    .max(128, "max_field_length"),

  description: z.string().trim().max(1024, "max_field_length").optional(),
});

type UpdateTaskFormSchema = z.infer<typeof updateTaskFormSchema>;
