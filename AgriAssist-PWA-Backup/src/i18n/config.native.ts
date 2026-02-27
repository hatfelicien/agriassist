import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

const resources = {
  en: {
    translation: {
      app_name: 'AgriAssist',
      welcome: 'Welcome to AgriAssist',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      phone: 'Phone Number',
      password: 'Password',
      name: 'Name',
      need_account: 'Need an account? Register',
      have_account: 'Have an account? Login',
      weather: 'Weather',
      market_prices: 'Market Prices',
      pest_alerts: 'Pest & Disease Alerts',
      livestock: 'Livestock',
      chat_with_officers: 'Chat with Officers',
      back_home: 'Back to Home',
      treatment: 'Treatment',
      type_message: 'Type a message...',
      officer_dashboard: 'Officer Dashboard',
      analytics: 'Analytics',
      messages: 'Messages',
      view_farmer_activity: 'View farmer activity and statistics',
      respond_to_farmers: 'Respond to farmer inquiries',
      loading: 'Loading...'
    }
  },
  rw: {
    translation: {
      app_name: 'AgriAssist',
      welcome: 'Murakaza neza kuri AgriAssist',
      login: 'Injira',
      register: 'Iyandikishe',
      logout: 'Sohoka',
      phone: 'Nimero ya Telefoni',
      password: 'Ijambo ryibanga',
      name: 'Izina',
      need_account: 'Ufite konti? Iyandikishe',
      have_account: 'Ufite konti? Injira',
      weather: 'Ibihe',
      market_prices: 'Ibiciro byamasoko',
      pest_alerts: 'Udukoko n\'indwara',
      livestock: 'Amatungo',
      chat_with_officers: 'Ganira n\'abakozi',
      back_home: 'Subira ahabanza',
      treatment: 'Umuti',
      type_message: 'Andika ubutumwa...',
      officer_dashboard: 'Ikibaho cy\'umukozi',
      analytics: 'Imibare',
      messages: 'Ubutumwa',
      view_farmer_activity: 'Reba ibikorwa by\'abahinzi',
      respond_to_farmers: 'Subiza ibibazo by\'abahinzi',
      loading: 'Biratunganywa...'
    }
  }
};

const initI18n = async () => {
  const savedLanguage = await AsyncStorage.getItem('language');
  const deviceLanguage = Localization.locale.split('-')[0];
  
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: savedLanguage || (deviceLanguage === 'rw' ? 'rw' : 'en'),
      fallbackLng: 'en',
      interpolation: { escapeValue: false }
    });
};

initI18n();

export default i18n;
