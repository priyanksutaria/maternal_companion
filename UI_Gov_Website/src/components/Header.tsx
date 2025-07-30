import React from 'react';
import Logo from '../assets/Logo.png';
import BannerBg from '../assets/banner_bg.png';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header 
      className="text-white py-6 sticky top-0 z-40 relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(253, 224, 71, 0.6), rgba(34, 197, 94, 0.4)), url(${BannerBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-4">
            <img src={Logo} alt="Logo" className="h-20 w-20 -my-2" />
            <div className="text-left">
              <h2 className="text-2xl font-bold">{t('appTitle')}</h2>
              <p className="text-base text-white font-semibold drop-shadow-lg">{t('appSubtitle')}</p>
            </div>
          </div>
          <div className="flex flex-row items-center gap-2">
            <span className="text-sm text-white font-semibold drop-shadow-lg">{t('language')}:</span>
            <button
              onClick={() => changeLanguage('en')}
              className={`px-2 py-1 rounded font-bold border transition-colors duration-200 ${i18n.language === 'en' ? 'bg-green-400 text-green-900 border-green-600' : 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200'}`}
            >
              {t('english')}
            </button>
            <button
              onClick={() => changeLanguage('mr')}
              className={`px-2 py-1 rounded font-bold border transition-colors duration-200 ${i18n.language === 'mr' ? 'bg-yellow-300 text-yellow-900 border-yellow-600' : 'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200'}`}
            >
              {t('marathi')}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}