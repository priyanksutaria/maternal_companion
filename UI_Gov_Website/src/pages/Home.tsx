import React from 'react';
import Carousel from '../components/Carousel';
import { Users, Shield, Heart, Activity, Phone, MapPin, ArrowRight, CheckCircle, Star, Award } from 'lucide-react';
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
    name: 'Dr. Rajesh Kumar',
    title: 'Healthcare Director',
    img: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Dr. Anjali Mehra',
    title: 'Director, Maternal Health',
    img: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'Dr. Sunita Sharma',
    title: 'Senior Health Coordinator',
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-green-50">
      <Carousel />



      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Information */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/90 backdrop-blur-sm p-8 border border-yellow-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <h2 className="text-4xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-yellow-600 to-green-600 bg-clip-text text-transparent">{t('home.aboutTitle')}</h2>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                {t('home.aboutParagraph1')}
              </p>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                {t('home.aboutParagraph2')}
              </p>
              <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="text-green-500 mr-2" size={24} />
                {t('home.keyObjectives')}
              </h4>
              <ul className="list-none mb-8 space-y-3 text-lg text-gray-700">
                <li className="flex items-start">
                  <Star className="text-yellow-500 mr-3 mt-1 flex-shrink-0" size={20} />
                  <span>{t('home.objective1')}</span>
                </li>
                <li className="flex items-start">
                  <Star className="text-yellow-500 mr-3 mt-1 flex-shrink-0" size={20} />
                  <span>{t('home.objective2')}</span>
                </li>
                <li className="flex items-start">
                  <Star className="text-yellow-500 mr-3 mt-1 flex-shrink-0" size={20} />
                  <span>{t('home.objective3')}</span>
                </li>
                <li className="flex items-start">
                  <Star className="text-yellow-500 mr-3 mt-1 flex-shrink-0" size={20} />
                  <span>{t('home.objective4')}</span>
                </li>
                <li className="flex items-start">
                  <Star className="text-yellow-500 mr-3 mt-1 flex-shrink-0" size={20} />
                  <span>{t('home.objective5')}</span>
                </li>
              </ul>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 border border-yellow-200 rounded-xl">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center">
                    <Award className="text-yellow-600 mr-2" size={20} />
                    {t('home.keyFeaturesTitle')}
                  </h3>
                  <ul className="text-sm text-yellow-800 space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="text-yellow-600 mr-2" size={16} />
                      {t('home.feature1')}
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-yellow-600 mr-2" size={16} />
                      {t('home.feature2')}
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-yellow-600 mr-2" size={16} />
                      {t('home.feature3')}
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-yellow-600 mr-2" size={16} />
                      {t('home.feature4')}
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-yellow-600 mr-2" size={16} />
                      {t('home.feature5')}
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-yellow-600 mr-2" size={16} />
                      {t('home.feature6')}
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-yellow-600 mr-2" size={16} />
                      {t('home.feature7')}
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-yellow-600 mr-2" size={16} />
                      {t('home.feature8')}
                    </li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 border border-green-200 rounded-xl">
                  <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                    <Heart className="text-green-600 mr-2" size={20} />
                    {t('home.benefitsTitle')}
                  </h3>
                  <ul className="text-sm text-green-800 space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="text-green-600 mr-2" size={16} />
                      {t('home.benefit1')}
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-green-600 mr-2" size={16} />
                      {t('home.benefit2')}
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-green-600 mr-2" size={16} />
                      {t('home.benefit3')}
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-green-600 mr-2" size={16} />
                      {t('home.benefit4')}
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-green-600 mr-2" size={16} />
                      {t('home.benefit5')}
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-green-600 mr-2" size={16} />
                      {t('home.benefit6')}
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-green-600 mr-2" size={16} />
                      {t('home.benefit7')}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-8 border border-yellow-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{t('home.registrationProcessTitle')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center group">
                  <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <span className="font-bold text-2xl">1</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-4 text-xl">{t('home.registrationStep1Title')}</h3>
                  <p className="text-gray-600 leading-relaxed">{t('home.registrationStep1Desc')}</p>
                </div>
                <div className="text-center group">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 text-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <span className="font-bold text-2xl">2</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-4 text-xl">{t('home.registrationStep2Title')}</h3>
                  <p className="text-gray-600 leading-relaxed">{t('home.registrationStep2Desc')}</p>
                </div>
                <div className="text-center group">
                  <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <span className="font-bold text-2xl">3</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-4 text-xl">{t('home.registrationStep3Title')}</h3>
                  <p className="text-gray-600 leading-relaxed">{t('home.registrationStep3Desc')}</p>
                </div>
              </div>
            </div>

            {/* Why Maternal Health Monitoring Matters Section */}
            <div className="bg-white/90 backdrop-blur-sm p-8 border border-yellow-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <h2 className="text-3xl font-bold text-green-900 mb-6 text-center">{t('home.whyMattersTitle')}</h2>
              <p className="mb-6 text-lg leading-relaxed text-gray-700 text-center">{t('home.whyMattersDesc')}</p>
              <ul className="space-y-4 text-lg text-gray-700">
                <li className="flex items-start bg-gradient-to-r from-yellow-50 to-transparent p-4 rounded-lg">
                  <CheckCircle className="text-green-500 mr-4 mt-1 flex-shrink-0" size={24} />
                  <span>{t('home.whyMatters1')}</span>
                </li>
                <li className="flex items-start bg-gradient-to-r from-green-50 to-transparent p-4 rounded-lg">
                  <CheckCircle className="text-green-500 mr-4 mt-1 flex-shrink-0" size={24} />
                  <span>{t('home.whyMatters2')}</span>
                </li>
                <li className="flex items-start bg-gradient-to-r from-yellow-50 to-transparent p-4 rounded-lg">
                  <CheckCircle className="text-green-500 mr-4 mt-1 flex-shrink-0" size={24} />
                  <span>{t('home.whyMatters3')}</span>
                </li>
                <li className="flex items-start bg-gradient-to-r from-green-50 to-transparent p-4 rounded-lg">
                  <CheckCircle className="text-green-500 mr-4 mt-1 flex-shrink-0" size={24} />
                  <span>{t('home.whyMatters4')}</span>
                </li>
                <li className="flex items-start bg-gradient-to-r from-yellow-50 to-transparent p-4 rounded-lg">
                  <CheckCircle className="text-green-500 mr-4 mt-1 flex-shrink-0" size={24} />
                  <span>{t('home.whyMatters5')}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Quick Links & Information */}
          <div className="space-y-8">
            <div className="bg-white/90 backdrop-blur-sm p-6 border border-yellow-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">{t('home.quickLinksTitle')}</h3>
              <div className="space-y-4">
                <a href="/register" className="block bg-gradient-to-r from-yellow-600 to-yellow-700 text-white p-4 text-center hover:from-yellow-700 hover:to-yellow-800 transition-all duration-300 text-sm font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105">
                  {t('home.quickLinkRegister')}
                </a>
                <a href="/schemes" className="block bg-gradient-to-r from-green-600 to-green-700 text-white p-4 text-center hover:from-green-700 hover:to-green-800 transition-all duration-300 text-sm font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105">
                  {t('home.quickLinkSchemes')}
                </a>
                <a href="/anc-centers" className="block bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 text-center hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 text-sm font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105">
                  {t('home.quickLinkCenters')}
                </a>
                <a href="/about" className="block bg-gradient-to-r from-green-500 to-green-600 text-white p-4 text-center hover:from-green-600 hover:to-green-700 transition-all duration-300 text-sm font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105">
                  {t('home.quickLinkAbout')}
                </a>
                <a href="/contact" className="block bg-gradient-to-r from-yellow-400 to-yellow-500 text-white p-4 text-center hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 text-sm font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105">
                  {t('home.quickLinkContact')}
                </a>
              </div>
            </div>
            
            {/* Registration Tips Card */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 border border-yellow-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-semibold text-yellow-900 mb-4 flex items-center">
                <Award className="text-yellow-600 mr-2" size={20} />
                {t('home.registrationTipsTitle')}
              </h3>
              <ul className="space-y-3 text-yellow-800">
                <li className="flex items-start">
                  <CheckCircle className="text-yellow-600 mr-2 mt-1 flex-shrink-0" size={16} />
                  <span className="text-sm">{t('home.registrationTip1')}</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-yellow-600 mr-2 mt-1 flex-shrink-0" size={16} />
                  <span className="text-sm">{t('home.registrationTip2')}</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-yellow-600 mr-2 mt-1 flex-shrink-0" size={16} />
                  <span className="text-sm">{t('home.registrationTip3')}</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-yellow-600 mr-2 mt-1 flex-shrink-0" size={16} />
                  <span className="text-sm">{t('home.registrationTip4')}</span>
                </li>
              </ul>
            </div>
            
            {/* Did You Know Card */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 border border-green-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-semibold text-green-900 mb-4 flex items-center">
                <Star className="text-green-600 mr-2" size={20} />
                {t('home.didYouKnowTitle')}
              </h3>
              <ul className="space-y-3 text-green-800">
                <li className="flex items-start">
                  <CheckCircle className="text-green-600 mr-2 mt-1 flex-shrink-0" size={16} />
                  <span className="text-sm">{t('home.didYouKnow1')}</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-600 mr-2 mt-1 flex-shrink-0" size={16} />
                  <span className="text-sm">{t('home.didYouKnow2')}</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-600 mr-2 mt-1 flex-shrink-0" size={16} />
                  <span className="text-sm">{t('home.didYouKnow3')}</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-600 mr-2 mt-1 flex-shrink-0" size={16} />
                  <span className="text-sm">{t('home.didYouKnow4')}</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-6 border border-yellow-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">{t('home.emergencyContactsTitle')}</h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-red-50 rounded-xl border border-red-200">
                  <Phone className="text-red-600" size={24} />
                  <div>
                    <p className="font-medium text-gray-900">{t('home.emergencyHelpline')}</p>
                    <p className="text-gray-600">{t('home.emergencyHelplineDesc')}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <Phone className="text-yellow-600" size={24} />
                  <div>
                    <p className="font-medium text-gray-900">{t('home.maternalHelpline')}</p>
                    <p className="text-gray-600">{t('home.maternalHelplineDesc')}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl border border-green-200">
                  <MapPin className="text-green-600" size={24} />
                  <div>
                    <p className="font-medium text-gray-900">{t('home.nearestCenter')}</p>
                    <p className="text-gray-600">{t('home.nearestCenterDesc')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 border border-yellow-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-semibold text-yellow-900 mb-4 flex items-center">
                <Shield className="text-yellow-600 mr-2" size={20} />
                {t('home.importantNoticeTitle')}
              </h3>
              <p className="text-sm text-yellow-800 mb-4 leading-relaxed">
                {t('home.importantNotice1')}
              </p>
              <p className="text-sm text-yellow-800 leading-relaxed">
                {t('home.importantNotice2')}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 border border-green-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-semibold text-green-900 mb-4 flex items-center">
                <CheckCircle className="text-green-600 mr-2" size={20} />
                {t('home.requiredDocumentsTitle')}
              </h3>
              <ul className="text-sm text-green-800 space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="text-green-600 mr-2" size={16} />
                  {t('home.doc1')}
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-600 mr-2" size={16} />
                  {t('home.doc2')}
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-600 mr-2" size={16} />
                  {t('home.doc3')}
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-600 mr-2" size={16} />
                  {t('home.doc4')}
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-600 mr-2" size={16} />
                  {t('home.doc5')}
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-600 mr-2" size={16} />
                  {t('home.doc6')}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}