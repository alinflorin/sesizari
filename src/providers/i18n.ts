import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

export const supportedLanguages = [
  { code: "ro", name: "Română", default: true },
  { code: "en", name: "English", default: false },
];

const ld = new LanguageDetector(undefined, {
  convertDetectedLanguage: l => {
    if (!l) {
      return "ro";
    }
    if (l.indexOf("-") === -1) {
      return l;
    }
    return l.substring(0, l.indexOf("-"));
  }
});

i18n
  .use(Backend)
  .use(ld)
  .use(initReactI18next)
  .init({
    fallbackLng: "ro",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });