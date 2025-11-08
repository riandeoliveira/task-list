import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import { useHttp } from "@/hooks/use-http";
import { useI18n } from "@/hooks/use-i18n";
import { useToast } from "@/hooks/use-toast";
import { useLoaderStore } from "@/stores/loader-store";
import { useUserStore } from "@/stores/user-store";

export const PersonalDataForm = () => {
  const loaderStore = useLoaderStore();
  const toast = useToast();
  const userStore = useUserStore();

  const { t } = useI18n();
  const { request } = useHttp();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(personalDataFormSchema),
    defaultValues: userStore.currentUser,
  });

  const handleUpdatePersonalData = async (body: PersonalDataFormSchema) => {
    loaderStore.start();

    await request("PATCH", "/users/me", {
      body,
      retryToAuth: true,
      onSuccess: () => {
        toast.success(t("update_user_success"));
      },
      onError: (error) => {
        toast.error(error.detail);
      },
    });

    loaderStore.stop();
  };

  return (
    <form
      onSubmit={handleSubmit(handleUpdatePersonalData)}
      className="rounded-xl flex flex-col gap-4 px-6"
    >
      <div className="flex flex-col gap-1">
        <h2 className="font-semibold text-2xl">{t("personal_data")}</h2>
        <p className="text-sm text-zinc-400">
          {t("personal_data_description")}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <Input.Root hasErrors={!!errors.name}>
          <Input.Text placeholder={t("name")} {...register("name")} />
          {errors.name?.message && (
            <Input.ErrorMessage>
              {t(errors.name.message, { min: 2, max: 64 })}
            </Input.ErrorMessage>
          )}
        </Input.Root>
        <Input.Root hasErrors={!!errors.username}>
          <Input.Text placeholder={t("username")} {...register("username")} />
          {errors.username?.message && (
            <Input.ErrorMessage>
              {t(errors.username.message, { min: 4, max: 32 })}
            </Input.ErrorMessage>
          )}
        </Input.Root>
        <Input.Root hasErrors={!!errors.email}>
          <Input.Email placeholder={t("email")} {...register("email")} />
          {errors.email?.message && (
            <Input.ErrorMessage>
              {t(errors.email.message, { min: 8, max: 64 })}
            </Input.ErrorMessage>
          )}
        </Input.Root>
      </div>
      <Button type="submit">{t("save_changes")}</Button>
    </form>
  );
};

const personalDataFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "required_field")
    .min(2, "min_field_length")
    .max(64, "max_field_length"),

  username: z
    .string()
    .trim()
    .min(1, "required_field")
    .min(4, "min_field_length")
    .max(32, "max_field_length")
    .regex(/^[a-zA-Z0-9_.-]+$/, "valid_username_format"),

  email: z
    .email("the_email_must_be_valid")
    .trim()
    .min(8, "min_field_length")
    .max(64, "max_field_length"),
});

type PersonalDataFormSchema = z.infer<typeof personalDataFormSchema>;
