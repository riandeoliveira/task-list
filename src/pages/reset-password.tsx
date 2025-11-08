import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router";
import { z } from "zod";
import { Button } from "@/components/shared/button";
import { Card } from "@/components/shared/card";
import { Input } from "@/components/shared/input";
import { useHttp } from "@/hooks/use-http";
import { useI18n } from "@/hooks/use-i18n";
import { useToast } from "@/hooks/use-toast";
import { useLoaderStore } from "@/stores/loader-store";

export const ResetPasswordPage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const loaderStore = useLoaderStore();

  const { t } = useI18n();
  const { request } = useHttp();

  const [searchParams] = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetUserPasswordFormSchema),
  });

  const handleResetUserPassword = async (body: ResetUserPasswordFormSchema) => {
    loaderStore.start();

    await request("POST", "/users/reset-password", {
      body: {
        ...body,
        token: searchParams.get("token") ?? "",
      },
      onSuccess: () => {
        navigate("/");
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
          onSubmit={handleSubmit(handleResetUserPassword)}
          className="flex flex-col gap-8"
        >
          <h1 className="text-center font-semibold text-3xl">
            {t("reset_your_password")}
          </h1>
          <Input.Root hasErrors={!!errors.password}>
            <Input.Label htmlFor="password">{t("new_password")}</Input.Label>
            <Input.Password
              placeholder={t("enter_your_password")}
              {...register("password")}
            />
            {errors.password?.message && (
              <Input.ErrorMessage>
                {t(errors.password.message, { min: 8, max: 64 })}
              </Input.ErrorMessage>
            )}
          </Input.Root>
          <Input.Root hasErrors={!!errors.passwordConfirmation}>
            <Input.Label htmlFor="passwordConfirmation">
              {t("new_password_confirmation")}
            </Input.Label>
            <Input.Password
              placeholder={t("enter_your_password")}
              {...register("passwordConfirmation")}
            />
            {errors.passwordConfirmation?.message && (
              <Input.ErrorMessage>
                {t(errors.passwordConfirmation.message, { min: 8, max: 64 })}
              </Input.ErrorMessage>
            )}
          </Input.Root>
          <Button type="submit">{t("reset_password")}</Button>
        </form>
      </Card>
    </div>
  );
};

const resetUserPasswordFormSchema = z
  .object({
    password: z
      .string()
      .trim()
      .min(1, "required_field")
      .min(8, "min_field_length")
      .max(64, "max_field_length"),

    passwordConfirmation: z
      .string()
      .trim()
      .min(1, "required_field")
      .min(8, "min_field_length")
      .max(64, "max_field_length"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "the_passwords_must_be_equivalent",
    path: ["passwordConfirmation"],
  });

type ResetUserPasswordFormSchema = z.infer<typeof resetUserPasswordFormSchema>;
