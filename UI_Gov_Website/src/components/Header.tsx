import React from 'react';
import Logo from '../assets/Logo.png';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="bg-blue-900 text-white py-4 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-3">
            <img src={Logo} alt="Logo" className="h-16 w-16 -my-2" />
            <div className="text-left">
              <h2 className="text-lg font-semibold">{t('appTitle')}</h2>
              <p className="text-sm text-blue-200">{t('appSubtitle')}</p>
            </div>
          </div>
          <div className="flex flex-row items-center gap-2">
            <span className="text-sm text-blue-200">{t('language')}:</span>
            <button
              onClick={() => changeLanguage('en')}
              className={`px-2 py-1 rounded ${i18n.language === 'en' ? 'bg-white text-blue-900 font-bold' : 'bg-blue-800 text-white'}`}
            >
              {t('english')}
            </button>
            <button
              onClick={() => changeLanguage('mr')}
              className={`px-2 py-1 rounded ${i18n.language === 'mr' ? 'bg-white text-blue-900 font-bold' : 'bg-blue-800 text-white'}`}
            >
              {t('marathi')}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}