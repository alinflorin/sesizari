import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";

export const supportedLanguages = [
  { code: "ro", name: "Română", default: true },
  { code: "en", name: "English", default: false },
];

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: "ro",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });