import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { Button } from "@/components/shared/button";
import { Card } from "@/components/shared/card";
import { Input } from "@/components/shared/input";
import { Link } from "@/components/shared/link";
import { useAuth } from "@/hooks/use-auth";
import { useHttpRequest } from "@/hooks/use-http-request";
import { useI18n } from "@/hooks/use-i18n";
import { useToast } from "@/hooks/use-toast";
import { useLoaderStore } from "@/stores/loader-store";

export const SignUpPage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const loaderStore = useLoaderStore();

  const { t } = useI18n();
  const { request } = useHttpRequest();
  const { setHasUserSession } = useAuth(request);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpUserFormSchema),
  });

  const handleSignUpUser = async (body: SignUpUserFormSchema) => {
    loaderStore.start();

    await request("POST", "/users/sign-up", {
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
          onSubmit={handleSubmit(handleSignUpUser)}
          className="flex flex-col gap-8"
        >
          <h1 className="text-center font-semibold text-3xl">
            {t("create_your_account")}
          </h1>
          <div className="flex flex-col gap-4">
            <Input.Root hasErrors={!!errors.name}>
              <Input.Label htmlFor="name">{t("name")}</Input.Label>
              <Input.Text
                placeholder={t("enter_your_name")}
                {...register("name")}
              />
              {errors.name?.message && (
                <Input.ErrorMessage>
                  {t(errors.name.message, { min: 2, max: 64 })}
                </Input.ErrorMessage>
              )}
            </Input.Root>
            <Input.Root hasErrors={!!errors.username}>
              <Input.Label htmlFor="username">{t("username")}</Input.Label>
              <Input.Text
                placeholder={t("enter_your_username")}
                {...register("username")}
              />
              {errors.username?.message && (
                <Input.ErrorMessage>
                  {t(errors.username.message, { min: 4, max: 32 })}
                </Input.ErrorMessage>
              )}
            </Input.Root>
            <Input.Root hasErrors={!!errors.email}>
              <Input.Label htmlFor="email">{t("email")}</Input.Label>
              <Input.Email
                placeholder={t("enter_your_email")}
                {...register("email")}
              />
              {errors.email?.message && (
                <Input.ErrorMessage>
                  {t(errors.email.message, { min: 8, max: 64 })}
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
            </Input.Root>
            <Input.Root hasErrors={!!errors.passwordConfirmation}>
              <Input.Label htmlFor="passwordConfirmation">
                {t("password_confirmation")}
              </Input.Label>
              <Input.Password
                placeholder={t("enter_your_password")}
                {...register("passwordConfirmation")}
              />
              {errors.passwordConfirmation?.message && (
                <Input.ErrorMessage>
                  {t(errors.passwordConfirmation.message, {
                    min: 8,
                    max: 64,
                  })}
                </Input.ErrorMessage>
              )}
            </Input.Root>
          </div>
          <div className="flex flex-col gap-4">
            <Button type="submit">{t("register")}</Button>
            <div className="flex gap-1 justify-center">
              <span className="text-center">
                {t("already_have_an_account")}
              </span>
              <Link href="/sign-in">{t("sign_in")}</Link>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

const signUpUserFormSchema = z
  .object({
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

type SignUpUserFormSchema = z.infer<typeof signUpUserFormSchema>;
