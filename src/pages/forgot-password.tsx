import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/shared/button";
import { Card } from "@/components/shared/card";
import { Input } from "@/components/shared/input";
import { emailRegex, usernameRegex } from "@/constants/regex";
import { useHttp } from "@/hooks/use-http";
import { useI18n } from "@/hooks/use-i18n";
import { useToast } from "@/hooks/use-toast";
import { useLoaderStore } from "@/stores/loader-store";

export const ForgotPasswordPage = () => {
  const toast = useToast();
  const loaderStore = useLoaderStore();

  const { t } = useI18n();
  const { request } = useHttp();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotUserPasswordFormSchema),
  });

  const handleForgotUserPassword = async (
    body: ForgotUserPasswordFormSchema,
  ) => {
    loaderStore.start();

    await request("POST", "/users/forgot-password", {
      body,
      onSuccess: () => {
        toast.success(t("forgot_user_password_success"));
      },
      onError: (error) => {
        toast.error(error.detail);
      },
    });

    loaderStore.stop();
  };

  return (
    <div className="flex justify-center min-h-screen items-center">
      <Card className="w-xl m-4">
        <form
          onSubmit={handleSubmit(handleForgotUserPassword)}
          className="flex flex-col gap-8"
        >
          <h1 className="text-center font-semibold text-3xl">
            {t("recover_your_password")}
          </h1>
          <Input.Root hasErrors={!!errors.usernameOrEmail}>
            <Input.Label htmlFor="name">{t("username_or_email")}</Input.Label>
            <Input.Text
              placeholder={t("enter_your_username_or_email")}
              {...register("usernameOrEmail")}
            />
            {errors.usernameOrEmail?.message && (
              <Input.ErrorMessage>
                {t(errors.usernameOrEmail.message)}
              </Input.ErrorMessage>
            )}
          </Input.Root>
          <Button type="submit">{t("recover_password")}</Button>
        </form>
      </Card>
    </div>
  );
};

const forgotUserPasswordFormSchema = z.object({
  usernameOrEmail: z
    .string()
    .trim()
    .min(1, "required_field")
    .refine((value) => {
      if (value.includes("@")) {
        return (
          emailRegex.test(value) && value.length >= 8 && value.length <= 64
        );
      }

      return (
        usernameRegex.test(value) && value.length >= 4 && value.length <= 32
      );
    }, "the_username_or_email_must_be_valid"),
});

type ForgotUserPasswordFormSchema = z.infer<
  typeof forgotUserPasswordFormSchema
>;
