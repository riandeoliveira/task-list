import "i18next";
import type enUs from "@/locales/en-us.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: {
      translation: typeof enUs;
    };
  }

  interface TFunction {
    (key: keyof typeof enUs, options?: Record<string, unknown>): string;
    (key: string, options?: Record<string, unknown>): string;
  }
}
