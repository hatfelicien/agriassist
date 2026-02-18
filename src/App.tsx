import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './contexts/AuthContext';
import { useUnreadCount } from './hooks/useUnreadCount';
import { useDarkMode } from './hooks/useDarkMode';
import IconNav from './components/IconNav';
import LanguageToggle from './components/LanguageToggle';
import OfflineIndicator from './components/OfflineIndicator';
import WeatherView from './components/WeatherView';
import PestAlerts from './components/PestAlerts';
import MarketPrices from './components/MarketPrices';
import Chat from './components/Chat';
import Login from './pages/Login';
import OfficerDashboard from './pages/OfficerDashboard';

export default function App() {
  console.log('🌱 App: Component rendered');
  const { t, i18n } = useTranslation();
  const { user, userRole, loading, logout } = useAuth();
  const { unreadCount, markAsRead } = useUnreadCount();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [currentView, setCurrentView] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  console.log('🌱 App: State', { user: user?.id, userRole, loading, currentView, unreadCount, darkMode });

  if (loading) {
    console.log('🌱 App: Loading state');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold text-primary">{t('loading')}</div>
      </div>
    );
  }

  if (!user) {
    console.log('🌱 App: No user, showing Login');
    return <Login />;
  }

  if (userRole === 'officer' || userRole === 'admin') {
    console.log('🌱 App: Officer/Admin role, showing Dashboard');
    return <OfficerDashboard />;
  }

  console.log('🌱 App: Farmer view, rendering:', currentView);

  const renderView = () => {
    switch (currentView) {
      case 'weather':
        return (
          <>
            <button onClick={() => setCurrentView('home')} className="mb-3 sm:mb-4 flex items-center gap-2 text-primary font-semibold text-sm sm:text-base">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t('back_home')}
            </button>
            <WeatherView />
          </>
        );
      case 'market':
        return (
          <>
            <button onClick={() => setCurrentView('home')} className="mb-3 sm:mb-4 flex items-center gap-2 text-primary font-semibold text-sm sm:text-base">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t('back_home')}
            </button>
            <MarketPrices />
          </>
        );
      case 'advisories':
        return (
          <>
            <button onClick={() => setCurrentView('home')} className="mb-3 sm:mb-4 flex items-center gap-2 text-primary font-semibold text-sm sm:text-base">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t('back_home')}
            </button>
            <PestAlerts />
          </>
        );
      case 'chat':
        return (
          <>
            <button onClick={() => setCurrentView('home')} className="mb-3 sm:mb-4 flex items-center gap-2 text-primary font-semibold text-sm sm:text-base">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t('back_home')}
            </button>
            <Chat />
          </>
        );
      default:
        return (
          <>
            <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-2xl p-3 sm:p-6 mb-3 sm:mb-6 shadow-lg">
              <h2 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">
                {i18n.language === 'rw' ? 'Murakaza neza kuri AgriAssist' : 'Welcome to AgriAssist'}
              </h2>
              <p className="text-sm sm:text-lg opacity-90">
                {i18n.language === 'rw' 
                  ? 'Amakuru y\'ubuhinzi ku bihingwa, amatungo, ibihe n\'isoko'
                  : 'Agricultural information for crops, livestock, weather and markets'}
              </p>
            </div>
            
            <button
              onClick={() => { setCurrentView('chat'); markAsRead(); }}
              className="w-full mb-3 sm:mb-6 bg-accent text-gray-900 p-3 sm:p-4 rounded-xl shadow-lg font-bold text-sm sm:text-lg flex items-center justify-center gap-2 relative"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" />
              </svg>
              {t('chat_with_officers')}
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            
            <IconNav onNavigate={setCurrentView} />
          </>
        );
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <OfflineIndicator />
      
      <header className="bg-primary text-white p-3 sm:p-4 shadow-lg sticky top-0 z-40">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <button 
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-1 sm:gap-2"
          >
            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <h1 className="text-lg sm:text-2xl font-bold">{t('app_name')}</h1>
          </button>
          
          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center gap-2">
            <button onClick={toggleDarkMode} className="p-2 bg-white text-primary rounded-lg">
              {darkMode ? '☀️' : '🌙'}
            </button>
            <LanguageToggle />
            <button onClick={logout} className="px-4 py-2 bg-white text-primary rounded-lg font-semibold">
              {t('logout')}
            </button>
          </div>
          
          {/* Mobile Burger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="sm:hidden p-2 bg-white text-primary rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {menuOpen && (
          <div className="sm:hidden mt-3 bg-white rounded-lg shadow-lg overflow-hidden">
            <button onClick={() => { toggleDarkMode(); setMenuOpen(false); }} className="w-full p-3 text-left text-gray-800 hover:bg-gray-100 flex items-center gap-2">
              <span className="text-xl">{darkMode ? '☀️' : '🌙'}</span>
              <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <div className="border-t border-gray-200">
              <LanguageToggle />
            </div>
            <button onClick={() => { logout(); setMenuOpen(false); }} className="w-full p-3 text-left text-red-600 hover:bg-gray-100 font-semibold border-t border-gray-200">
              {t('logout')}
            </button>
          </div>
        )}
      </header>

      <main className="max-w-4xl mx-auto p-2 sm:p-4 pb-12 sm:pb-20">
        {renderView()}
      </main>
    </div>
  );
}
