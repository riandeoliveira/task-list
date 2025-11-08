import { Icon } from "@/assets";
import { CredentialsForm } from "@/components/forms/credentials-form";
import { PersonalDataForm } from "@/components/forms/personal-data-form";
import { Button } from "@/components/shared/button";
import { Card } from "@/components/shared/card";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Tooltip } from "@/components/shared/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { useHttp } from "@/hooks/use-http";
import { useI18n } from "@/hooks/use-i18n";
import { useToast } from "@/hooks/use-toast";
import { useDialogStore } from "@/stores/dialog-store";
import { useLoaderStore } from "@/stores/loader-store";

export const AccountPage = () => {
  const dialogStore = useDialogStore();
  const loaderStore = useLoaderStore();
  const toast = useToast();

  const { t } = useI18n();
  const { request } = useHttp();
  const { endUserSession } = useAuth(request);

  const handleSignOutUser = async () => {
    loaderStore.start();

    await request("POST", "/users/sign-out", {
      retryToAuth: true,
      onSuccess: () => {
        dialogStore.close("sign-out");

        endUserSession();
      },
      onError: (error) => {
        toast.error(error.detail);
      },
    });

    loaderStore.stop();
  };

  const handleDeleteUser = async () => {
    loaderStore.start();

    await request("DELETE", "/users/me", {
      retryToAuth: true,
      onSuccess: () => {
        dialogStore.close("delete-user");

        endUserSession();
      },
      onError: (error) => {
        toast.error(error.detail);
      },
    });

    loaderStore.stop();
  };

  return (
    <>
      <div className="flex justify-center min-h-screen items-start">
        <Card className="w-3xl m-4 flex flex-col gap-6 p-0 relative">
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <a href="/" className="absolute right-2 top-2">
                <Button variant="ghost" className="p-2 rounded-full">
                  <Icon.ListTodo className="text-zinc-400 size-8" />
                </Button>
              </a>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <span>{t("go_to_task_list_page")}</span>
            </Tooltip.Content>
          </Tooltip.Root>
          <header className="rounded-xl mt-6 px-6">
            <h1 className="text-center font-semibold text-3xl">
              {t("account_settings")}
            </h1>
          </header>
          <main className="flex flex-col gap-6 mb-6">
            <PersonalDataForm />
            <CredentialsForm />
            <div className="grid grid-cols-2 gap-6 px-6 max-s-840:grid-cols-1">
              <div className="rounded-xl flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h2 className="font-semibold text-2xl">{t("session")}</h2>
                  <p className="text-sm text-zinc-400">
                    {t("session_description")}
                  </p>
                </div>
                <div className="flex flex-col">
                  <Button
                    variant="secondary"
                    onClick={() => dialogStore.open("sign-out")}
                  >
                    {t("sign_out")}
                  </Button>
                </div>
              </div>
              <div className="rounded-xl flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h2 className="font-semibold text-2xl text-red-400">
                    {t("danger_zone")}
                  </h2>
                  <p className="text-sm text-zinc-400">
                    {t("danger_zone_description")}
                  </p>
                </div>
                <div className="flex flex-col">
                  <Button
                    variant="alert"
                    onClick={() => dialogStore.open("delete-user")}
                  >
                    {t("delete_account")}
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </Card>
      </div>
      <ConfirmDialog
        description={t("sign_out_user_confirmation")}
        isOpen={dialogStore.isOpen("sign-out")}
        onClose={() => dialogStore.close("sign-out")}
        onConfirm={handleSignOutUser}
      />
      <ConfirmDialog
        description={`${t("delete_user_confirmation")} ${t("this_action_cannot_be_undone")}`}
        isOpen={dialogStore.isOpen("delete-user")}
        onClose={() => dialogStore.close("delete-user")}
        onConfirm={handleDeleteUser}
      />
    </>
  );
};
