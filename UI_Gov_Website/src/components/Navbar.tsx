import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface NavbarProps {
  onLoginClick: () => void;
}

export default function Navbar({ onLoginClick }: NavbarProps) {
  const { t } = useTranslation();
  return (
    <nav className="bg-gradient-to-r from-yellow-100 via-white to-green-100 text-green-900 border-b-2 border-yellow-200 shadow-md sticky top-0 z-50 m-0 p-0">
      <div className="w-full px-4">
        <div className="flex justify-between items-center h-14">
          <div className="flex space-x-2">
            <Link to="/" className="uppercase tracking-wider font-bold px-4 py-2 text-sm hover:bg-yellow-600 transition-colors">
              {t('navbar.home')}
            </Link>
            <Link to="/about" className="uppercase tracking-wider font-bold px-4 py-2 text-sm hover:bg-yellow-600 transition-colors">
              {t('navbar.about')}
            </Link>
            <Link to="/schemes" className="uppercase tracking-wider font-bold px-4 py-2 text-sm hover:bg-yellow-600 transition-colors">
              {t('navbar.schemes')}
            </Link>
            <Link to="/register" className="uppercase tracking-wider font-bold px-4 py-2 text-sm hover:bg-yellow-600 transition-colors">
              {t('navbar.register')}
            </Link>
            <Link to="/anc-centers" className="uppercase tracking-wider font-bold px-4 py-2 text-sm hover:bg-yellow-600 transition-colors">
              {t('navbar.ancCenters')}
            </Link>
            <Link to="/contact" className="uppercase tracking-wider font-bold px-4 py-2 text-sm hover:bg-yellow-600 transition-colors">
              {t('navbar.contact')}
            </Link>
          </div>
          <button
            onClick={onLoginClick}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors"
          >
            <LogIn size={16} />
            <span>{t('navbar.login')}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}