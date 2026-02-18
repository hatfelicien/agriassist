import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import rw from './locales/rw.json';
import en from './locales/en.json';

i18n.use(initReactI18next).init({
  resources: {
    rw: { translation: rw },
    en: { translation: en }
  },
  lng: localStorage.getItem('language') || 'rw',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

export default i18n;
