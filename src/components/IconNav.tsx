import { useTranslation } from 'react-i18next';

interface NavItem {
  key: string;
  icon: JSX.Element;
}

export default function IconNav({ onNavigate }: { onNavigate: (key: string) => void }) {
  const { t } = useTranslation();

  const navItems: NavItem[] = [
    {
      key: 'weather',
      icon: (
        <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      )
    },
    {
      key: 'market',
      icon: (
        <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      key: 'advisories',
      icon: (
        <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ];

  return (
    <nav className="grid grid-cols-2 gap-3 p-3">
      {navItems.map(item => (
        <button
          key={item.key}
          onClick={() => onNavigate(item.key)}
          className="flex flex-col items-center justify-center p-4 sm:p-6 bg-white rounded-2xl shadow-lg active:scale-95 transition-transform border-2 border-transparent hover:border-primary"
        >
          <div className="text-primary mb-2">{item.icon}</div>
          <span className="text-base sm:text-lg font-bold text-gray-800">{t(item.key)}</span>
        </button>
      ))}
    </nav>
  );
}
