import type { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { ScreenLoader } from "@/components/shared/screen-loader";
import { Toaster } from "@/components/shared/toaster";
import { useI18n } from "@/hooks/use-i18n";

type AppProviderProps = {
  children: ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const { language, t } = useI18n();

  return (
    <>
      <Helmet htmlAttributes={{ lang: language }}>
        <meta name="description" content={t("meta_description")} />
      </Helmet>
      {children}
      <Toaster />
      <LanguageSwitcher />
      <ScreenLoader />
    </>
  );
};
