import React from 'react';
import { Phone, Mail, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Logo from '../assets/Logo_Footer.png';

export default function Footer() {
  const { t } = useTranslation();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-yellow-100 border-t border-yellow-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          
          {/* About Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-3">
              <Shield className="text-yellow-600 mr-2" size={20} />
              <h3 className="text-lg font-bold text-gray-900">SmartMatriConnect</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              A comprehensive digital platform dedicated to monitoring and supporting pregnant women, reducing maternal and infant mortality, and ensuring safe deliveries across the nation.
            </p>
          </div>

          {/* Quick Links */}
          <div className="pl-4">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/register" className="text-gray-600 hover:text-yellow-600 transition-colors text-sm">
                  Register New Pregnancy
                </a>
              </li>
              <li>
                <a href="/schemes" className="text-gray-600 hover:text-yellow-600 transition-colors text-sm">
                  Health Programs
                </a>
              </li>
              <li>
                <a href="/anc-centers" className="text-gray-600 hover:text-yellow-600 transition-colors text-sm">
                  Find ANC Centers
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-600 hover:text-yellow-600 transition-colors text-sm">
                  About the System
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-600 hover:text-yellow-600 transition-colors text-sm">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Emergency Contacts */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-3">Emergency Contacts</h3>
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <Phone className="text-red-500 mt-1" size={14} />
                <div>
                  <p className="text-gray-900 font-medium text-sm">Emergency Helpline</p>
                  <p className="text-gray-600 text-xs">108 (24/7 Available)</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Phone className="text-blue-600 mt-1" size={14} />
                <div>
                  <p className="text-gray-900 font-medium text-sm">Maternal Helpline</p>
                  <p className="text-gray-600 text-xs">104 (Health Queries)</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Mail className="text-orange-500 mt-1" size={14} />
                <div>
                  <p className="text-gray-900 font-medium text-sm">Email Support</p>
                  <p className="text-gray-600 text-xs">support@maternalhealth.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Project Logo */}
          <div>
            <div className="flex justify-center items-center h-full">
              <img src={Logo} alt="Maternal Health System Logo" className="h-48 w-48" />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-yellow-300 mt-6 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="text-gray-600 text-sm">
              © {currentYear} SmartMatriConnect. All rights reserved.
            </div>
            <div className="flex space-x-4 text-sm">
              <a href="/privacy" className="text-gray-600 hover:text-yellow-700 transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-600 hover:text-yellow-700 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 