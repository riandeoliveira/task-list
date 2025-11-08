import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { Button } from "@/components/shared/button";
import { Card } from "@/components/shared/card";
import { Input } from "@/components/shared/input";
import { Link } from "@/components/shared/link";
import { emailRegex, usernameRegex } from "@/constants/regex";
import { useAuth } from "@/hooks/use-auth";
import { useHttp } from "@/hooks/use-http";
import { useI18n } from "@/hooks/use-i18n";
import { useToast } from "@/hooks/use-toast";
import { useLoaderStore } from "@/stores/loader-store";

export const SignInPage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const loaderStore = useLoaderStore();

  const { t } = useI18n();
  const { request } = useHttp();
  const { setHasUserSession } = useAuth(request);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signInUserFormSchema),
  });

  const handleSignInUser = async (body: SignInUserFormSchema) => {
    loaderStore.start();

    await request("POST", "/users/sign-in", {
      body,
      onSuccess: () => {
        setHasUserSession(true);

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
          onSubmit={handleSubmit(handleSignInUser)}
          className="flex flex-col gap-8"
        >
          <h1 className="text-center font-semibold text-3xl">
            {t("sign_in_to_your_account")}
          </h1>
          <div className="flex flex-col gap-4">
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
            <Input.Root hasErrors={!!errors.password}>
              <Input.Label htmlFor="password">{t("password")}</Input.Label>
              <Input.Password
                placeholder={t("enter_your_password")}
                {...register("password")}
              />
              {errors.password?.message && (
                <Input.ErrorMessage>
                  {t(errors.password.message, { min: 8, max: 64 })}
                </Input.ErrorMessage>
              )}
              <Link href="/forgot-password" className="text-sm w-fit">
                {t("forgot_my_password")}
              </Link>
            </Input.Root>
          </div>
          <div className="flex flex-col gap-4">
            <Button type="submit">{t("log_in")}</Button>
            <div className="flex gap-1 justify-center">
              <span className="text-center">{t("dont_have_an_account")}</span>
              <Link href="/sign-up">{t("sign_up")}</Link>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

const signInUserFormSchema = z.object({
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

  password: z
    .string()
    .trim()
    .min(1, "required_field")
    .min(8, "min_field_length")
    .max(64, "max_field_length"),
});

type SignInUserFormSchema = z.infer<typeof signInUserFormSchema>;
