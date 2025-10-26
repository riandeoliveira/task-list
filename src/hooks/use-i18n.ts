import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

export type LanguageType = "en-US" | "pt-BR";

export const useI18n = () => {
  const { t } = useTranslation();

  const language = i18n.language as LanguageType;

  const changeLanguageTo = (language: LanguageType) => {
    i18n.changeLanguage(language);
  };

  return {
    changeLanguageTo,
    language,
    t,
  };
};
