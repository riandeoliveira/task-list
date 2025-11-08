import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import { useHttp } from "@/hooks/use-http";
import { useI18n } from "@/hooks/use-i18n";
import { useToast } from "@/hooks/use-toast";
import { useLoaderStore } from "@/stores/loader-store";

export const CredentialsForm = () => {
  const loaderStore = useLoaderStore();
  const toast = useToast();

  const { t } = useI18n();
  const { request } = useHttp();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(credentialsFormSchema),
  });

  const handleUpdateCredentials = async (body: CredentialsFormSchema) => {
    loaderStore.start();

    await request("PATCH", "/users/me", {
      body,
      retryToAuth: true,
      onSuccess: () => {
        reset();

        toast.success(t("update_password_success"));
      },
      onError: (error) => {
        toast.error(error.detail);
      },
    });

    loaderStore.stop();
  };

  return (
    <form
      onSubmit={handleSubmit(handleUpdateCredentials)}
      className="rounded-xl flex flex-col gap-4 px-6"
    >
      <div className="flex flex-col gap-1">
        <h2 className="font-semibold text-2xl">{t("security")}</h2>
        <p className="text-sm text-zinc-400">{t("security_description")}</p>
      </div>
      <div className="flex flex-col gap-2">
        <Input.Root hasErrors={!!errors.password}>
          <Input.Password
            placeholder={t("current_password")}
            {...register("password")}
          />
          {errors.password?.message && (
            <Input.ErrorMessage>
              {t(errors.password.message, { min: 8, max: 64 })}
            </Input.ErrorMessage>
          )}
        </Input.Root>
        <Input.Root hasErrors={!!errors.newPassword}>
          <Input.Password
            placeholder={t("new_password")}
            {...register("newPassword")}
          />
          {errors.newPassword?.message && (
            <Input.ErrorMessage>
              {t(errors.newPassword.message, { min: 8, max: 64 })}
            </Input.ErrorMessage>
          )}
        </Input.Root>
        <Input.Root hasErrors={!!errors.newPasswordConfirmation}>
          <Input.Password
            placeholder={t("new_password_confirmation")}
            {...register("newPasswordConfirmation")}
          />
          {errors.newPasswordConfirmation?.message && (
            <Input.ErrorMessage>
              {t(errors.newPasswordConfirmation.message, {
                min: 8,
                max: 64,
              })}
            </Input.ErrorMessage>
          )}
        </Input.Root>
      </div>
      <Button type="submit">{t("update_password")}</Button>
    </form>
  );
};

const credentialsFormSchema = z
  .object({
    password: z
      .string()
      .trim()
      .min(1, "required_field")
      .min(8, "min_field_length")
      .max(64, "max_field_length"),

    newPassword: z
      .string()
      .trim()
      .min(1, "required_field")
      .min(8, "min_field_length")
      .max(64, "max_field_length"),

    newPasswordConfirmation: z
      .string()
      .trim()
      .min(1, "required_field")
      .min(8, "min_field_length")
      .max(64, "max_field_length"),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirmation, {
    message: "the_passwords_must_be_equivalent",
    path: ["newPasswordConfirmation"],
  });

type CredentialsFormSchema = z.infer<typeof credentialsFormSchema>;
