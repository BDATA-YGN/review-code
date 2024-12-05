import i18next from "i18next";
import en from "./en";
import mm from "./mm";

i18next.init({
  compatibilityJSON: 'v3',
  fallbackLng: 'en',
  lng: 'en',
  debug: true,

  resources: {
    en: {
      translation: en,
    },
    mm: {
      translation: mm,
    },
  },

  react: {
    wait: false, 
    nsMode: 'default',
  },
});

export default i18next;
