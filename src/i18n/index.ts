import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import enUs from "@/locales/en-us.json";
import ptBr from "@/locales/pt-br.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    detection: {
      caches: ["localStorage"],
      lookupLocalStorage: "locale",
      order: ["localStorage", "navigator"],
    },
    fallbackLng: "en-US",
    resources: {
      "en-US": { translation: enUs },
      "pt-BR": { translation: ptBr },
    },
    supportedLngs: ["en-US", "pt-BR"],
  });

export default i18n;
