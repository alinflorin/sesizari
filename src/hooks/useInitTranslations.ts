import { useCallback } from "react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

export default function useInitTranslations(savedLanguage: string | undefined = undefined) {
  const init = useCallback(async () => {
    await i18n
      .use(Backend)
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        fallbackLng: "ro",
        lng: savedLanguage,
        debug: false,
        interpolation: {
          escapeValue: false,
        },
      });
  }, [savedLanguage]);

  return init;
}
