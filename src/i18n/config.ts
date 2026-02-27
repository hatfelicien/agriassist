import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const resources = {
  en: {
    translation: {
      app_name: 'AgriAssist',
      welcome: 'Welcome to AgriAssist',
      welcome_subtitle: 'Agricultural information for farmers',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      email: 'Email',
      password: 'Password',
      name: 'Name',
      need_account: 'Need an account? Register',
      have_account: 'Have an account? Login',
      weather: 'Weather',
      market: 'Market',
      pests: 'Pests',
      market_prices: 'Market Prices',
      pest_alerts: 'Pest & Disease Alerts',
      chat_with_officers: 'Chat with Officers',
      back_home: 'Back',
      treatment: 'Treatment',
      type_message: 'Type a message...',
      send: 'Send',
      officer_dashboard: 'Officer Dashboard',
      analytics: 'Analytics',
      messages: 'Messages',
      loading: 'Loading...',
      overview: 'Overview',
      post_weather: 'Post Weather Update',
      report_pest: 'Report Pest Alert',
      update_prices: 'Update Market Prices',
      farmers: 'Farmers',
      no_farmers: 'No farmers have messaged yet',
      tap_to_chat: 'Tap to chat'
    }
  },
  rw: {
    translation: {
      app_name: 'AgriAssist',
      welcome: 'Murakaza neza kuri AgriAssist',
      welcome_subtitle: 'Amakuru y\'ubuhinzi ku bahinzi',
      login: 'Injira',
      register: 'Iyandikishe',
      logout: 'Sohoka',
      email: 'Imeri',
      password: 'Ijambo ryibanga',
      name: 'Izina',
      need_account: 'Ntufite konti? Iyandikishe',
      have_account: 'Ufite konti? Injira',
      weather: 'Ibihe',
      market: 'Isoko',
      pests: 'Ibyonnyi',
      market_prices: 'Ibiciro by\'isoko',
      pest_alerts: 'Ibyonnyi n\'indwara',
      chat_with_officers: 'Ganira n\'abajyanama',
      back_home: 'Subira',
      treatment: 'Umuti',
      type_message: 'Andika ubutumwa...',
      send: 'Ohereza',
      officer_dashboard: 'Ikibaho cy\'umujyanama',
      analytics: 'Imibare',
      messages: 'Ubutumwa',
      loading: 'Biratunganywa...',
      overview: 'Incamake',
      post_weather: 'Tanga amakuru y\'ibihe',
      report_pest: 'Tanga amakuru y\'ibyonnyi',
      update_prices: 'Kuvugurura ibiciro',
      farmers: 'Abahinzi',
      no_farmers: 'Nta bahinzi bohereje ubutumwa',
      tap_to_chat: 'Kanda kugira ngo uganire'
    }
  }
};

// Load saved language
AsyncStorage.getItem('language').then(lang => {
  if (lang) i18n.changeLanguage(lang);
});

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'rw', // Default to Kinyarwanda
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    compatibilityJSON: 'v3',
    react: {
      useSuspense: false
    }
  });

export default i18n;
