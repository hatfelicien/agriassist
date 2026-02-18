import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './i18n/config';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { registerSW } from 'virtual:pwa-register';
import { requestNotificationPermission } from './lib/notifications';

console.log('🚀 AgriAssist: Application starting');
console.log('🚀 Environment:', import.meta.env.MODE);

console.log('🚀 Registering service worker');
registerSW({ immediate: true });

console.log('🚀 Requesting notification permission');
requestNotificationPermission();

console.log('🚀 Rendering React app');
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AuthProvider>
  </React.StrictMode>
);

console.log('🚀 AgriAssist: Application initialized');
