import { Link } from "@/components/shared/link";
import { useI18n } from "@/hooks/use-i18n";

export const NotFoundPage = () => {
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex justify-center">
      <div className="flex flex-col gap-4 items-center justify-center">
        <h1 className="text-4xl font-semibold max-s-480:text-2xl text-center">
          404 - {t("page_not_found")}
        </h1>
        <Link href="/">{t("go_back_to_home")}</Link>
      </div>
    </div>
  );
};
