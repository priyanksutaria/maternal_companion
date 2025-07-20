import React from 'react';
import Carousel from '../components/Carousel';
import { Users, Shield, Heart, Activity, Phone, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const doctors = [
  {
    name: 'Dr. Pramod A. Naik',
    title: 'Chief Medical Officer',
    img: 'https://randomuser.me/api/portraits/men/21.jpg',
    text: 'The Maternal Health System is committed to providing the highest quality care to every mother. Our digital platform ensures timely interventions, risk assessment, and continuous support throughout pregnancy.'
  },
  {
    name: 'Dr. Anjali Rao',
    title: 'Senior Gynecologist',
    img: 'https://randomuser.me/api/portraits/women/22.jpg',
    text: 'We encourage all expectant mothers to register early and attend regular ANC visits. Our team is dedicated to your health and well-being.'
  },
  {
    name: 'Dr. Vivek Sharma',
    title: 'Public Health Specialist',
    img: 'https://randomuser.me/api/portraits/men/23.jpg',
    text: 'Digital health records and real-time monitoring are transforming maternal care. Let us work together for a healthier future.'
  }
];

const officials = [
  {
    name: 'Shri Rajesh Kumar',
    title: 'Union Health Secretary',
    img: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Dr. Anjali Mehra',
    title: 'Director, Maternal Health',
    img: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'Smt. Sunita Sharma',
    title: 'Joint Secretary, NHM',
    img: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    name: 'Dr. Vivek Singh',
    title: 'Chief Medical Officer',
    img: 'https://randomuser.me/api/portraits/men/65.jpg',
  },
];

export default function Home() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gray-50">
      <Carousel />

      {/* Quick Stats Section */}
      <div className="bg-white py-8 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">2.5M+</h3>
              <p className="text-gray-600 text-sm font-medium">{t('home.registeredMothers')}</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">15,000+</h3>
              <p className="text-gray-600 text-sm font-medium">{t('home.healthcareCenters')}</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">98.5%</h3>
              <p className="text-gray-600 text-sm font-medium">{t('home.safeDeliveries')}</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">24/7</h3>
              <p className="text-gray-600 text-sm font-medium">{t('home.monitoringSystem')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('home.aboutTitle')}</h2>
              <p className="text-gray-700 mb-4 text-base leading-relaxed">
                {t('home.aboutParagraph1')}
              </p>
              <p className="text-gray-700 mb-4 text-base leading-relaxed">
                {t('home.aboutParagraph2')}
              </p>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">{t('home.keyObjectives')}</h4>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-base text-gray-700">
                <li>{t('home.objective1')}</li>
                <li>{t('home.objective2')}</li>
                <li>{t('home.objective3')}</li>
                <li>{t('home.objective4')}</li>
                <li>{t('home.objective5')}</li>
              </ul>
              <div className="bg-blue-50 p-4 border border-blue-200 rounded-lg mt-4">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">{t('home.keyFeaturesTitle')}</h3>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• {t('home.feature1')}</li>
                  <li>• {t('home.feature2')}</li>
                  <li>• {t('home.feature3')}</li>
                  <li>• {t('home.feature4')}</li>
                  <li>• {t('home.feature5')}</li>
                  <li>• {t('home.feature6')}</li>
                  <li>• {t('home.feature7')}</li>
                  <li>• {t('home.feature8')}</li>
                </ul>
              </div>
              <div className="bg-orange-50 p-4 border border-orange-200 rounded-lg mt-4">
                <h3 className="text-lg font-semibold text-orange-900 mb-3">{t('home.benefitsTitle')}</h3>
                <ul className="text-sm text-orange-800 space-y-2">
                  <li>• {t('home.benefit1')}</li>
                  <li>• {t('home.benefit2')}</li>
                  <li>• {t('home.benefit3')}</li>
                  <li>• {t('home.benefit4')}</li>
                  <li>• {t('home.benefit5')}</li>
                  <li>• {t('home.benefit6')}</li>
                  <li>• {t('home.benefit7')}</li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('home.registrationProcessTitle')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="font-bold text-xl">1</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-3 text-lg">{t('home.registrationStep1Title')}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{t('home.registrationStep1Desc')}</p>
                </div>
                <div className="text-center">
                  <div className="bg-orange-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="font-bold text-xl">2</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-3 text-lg">{t('home.registrationStep2Title')}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{t('home.registrationStep2Desc')}</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="font-bold text-xl">3</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-3 text-lg">{t('home.registrationStep3Title')}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{t('home.registrationStep3Desc')}</p>
                </div>
              </div>
            </div>

            {/* Why Maternal Health Monitoring Matters Section */}
            <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">{t('home.whyMattersTitle')}</h2>
              <p className="mb-4 text-base leading-relaxed text-gray-700">{t('home.whyMattersDesc')}</p>
              <ul className="list-disc pl-6 space-y-2 text-base text-gray-700">
                <li>{t('home.whyMatters1')}</li>
                <li>{t('home.whyMatters2')}</li>
                <li>{t('home.whyMatters3')}</li>
                <li>{t('home.whyMatters4')}</li>
                <li>{t('home.whyMatters5')}</li>
              </ul>
            </div>
          </div>

          {/* Right Column - Quick Links & Information */}
          <div className="space-y-6 flex flex-col">
            <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('home.quickLinksTitle')}</h3>
              <div className="space-y-3">
                <a href="/register" className="block bg-blue-600 text-white p-3 text-center hover:bg-blue-700 transition-colors text-sm font-medium rounded-lg">
                  {t('home.quickLinkRegister')}
                </a>
                <a href="/schemes" className="block bg-orange-600 text-white p-3 text-center hover:bg-orange-700 transition-colors text-sm font-medium rounded-lg">
                  {t('home.quickLinkSchemes')}
                </a>
                <a href="/anc-centers" className="block bg-blue-600 text-white p-3 text-center hover:bg-blue-700 transition-colors text-sm font-medium rounded-lg">
                  {t('home.quickLinkCenters')}
                </a>
                <a href="/about" className="block bg-gray-200 text-blue-800 p-3 text-center hover:bg-gray-300 transition-colors text-sm font-medium rounded-lg">
                  {t('home.quickLinkAbout')}
                </a>
                <a href="/contact" className="block bg-gray-200 text-blue-800 p-3 text-center hover:bg-gray-300 transition-colors text-sm font-medium rounded-lg">
                  {t('home.quickLinkContact')}
                </a>
              </div>
            </div>
            
            {/* Registration Tips Card */}
            <div className="bg-blue-50 p-4 border border-blue-200 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">{t('home.registrationTipsTitle')}</h3>
              <ul className="list-disc pl-5 text-sm space-y-2 text-blue-800">
                <li>{t('home.registrationTip1')}</li>
                <li>{t('home.registrationTip2')}</li>
                <li>{t('home.registrationTip3')}</li>
                <li>{t('home.registrationTip4')}</li>
              </ul>
            </div>
            
            {/* Did You Know Card */}
            <div className="bg-orange-50 p-4 border border-orange-200 rounded-lg">
              <h3 className="text-lg font-semibold text-orange-900 mb-3">{t('home.didYouKnowTitle')}</h3>
              <ul className="list-disc pl-5 text-sm space-y-2 text-orange-800">
                <li>{t('home.didYouKnow1')}</li>
                <li>{t('home.didYouKnow2')}</li>
                <li>{t('home.didYouKnow3')}</li>
                <li>{t('home.didYouKnow4')}</li>
              </ul>
            </div>

            <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('home.emergencyContactsTitle')}</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="text-red-600" size={20} />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{t('home.emergencyHelpline')}</p>
                    <p className="text-sm text-gray-600">{t('home.emergencyHelplineDesc')}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="text-blue-600" size={20} />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{t('home.maternalHelpline')}</p>
                    <p className="text-sm text-gray-600">{t('home.maternalHelplineDesc')}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="text-orange-600" size={20} />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{t('home.nearestCenter')}</p>
                    <p className="text-sm text-gray-600">{t('home.nearestCenterDesc')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 border border-blue-200 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">{t('home.importantNoticeTitle')}</h3>
              <p className="text-sm text-blue-800 mb-3 leading-relaxed">
                {t('home.importantNotice1')}
              </p>
              <p className="text-sm text-blue-800 leading-relaxed">
                {t('home.importantNotice2')}
              </p>
            </div>

            <div className="bg-orange-50 p-4 border border-orange-200 rounded-lg">
              <h3 className="text-lg font-semibold text-orange-900 mb-3">{t('home.requiredDocumentsTitle')}</h3>
              <ul className="text-sm text-orange-800 space-y-2">
                <li>• {t('home.doc1')}</li>
                <li>• {t('home.doc2')}</li>
                <li>• {t('home.doc3')}</li>
                <li>• {t('home.doc4')}</li>
                <li>• {t('home.doc5')}</li>
                <li>• {t('home.doc6')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}