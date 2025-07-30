import React from 'react';
import { Shield, Users, Activity, Heart, Phone, Mail, MapPin, GraduationCap, Code, Database, Globe, CheckCircle, Star, Award, BookOpen, Lightbulb, Target, BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white/90 backdrop-blur-sm p-8 border border-yellow-200/50 rounded-2xl shadow-lg mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-yellow-600 to-green-600 bg-clip-text text-transparent">{t('about.headerTitle')}</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            {t('about.headerSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/90 backdrop-blur-sm p-8 border border-yellow-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <BookOpen className="text-yellow-600 mr-3" size={32} />
                {t('about.projectOverviewTitle')}
              </h2>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                {t('about.projectOverviewP1')}
              </p>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                {t('about.projectOverviewP2')}
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                {t('about.projectOverviewP3')}
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-8 border border-yellow-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                <Target className="text-green-600 mr-3" size={32} />
                {t('about.keyFeaturesTitle')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-start space-x-4 group">
                  <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <Users size={28} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 text-xl">{t('about.feature1Title')}</h3>
                    <p className="text-gray-600 leading-relaxed">{t('about.feature1Desc')}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 group">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <Activity size={28} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 text-xl">{t('about.feature2Title')}</h3>
                    <p className="text-gray-600 leading-relaxed">{t('about.feature2Desc')}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 group">
                  <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-white p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <Heart size={28} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 text-xl">{t('about.feature3Title')}</h3>
                    <p className="text-gray-600 leading-relaxed">{t('about.feature3Desc')}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 group">
                  <div className="bg-gradient-to-br from-green-400 to-green-500 text-white p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <Shield size={28} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 text-xl">{t('about.feature4Title')}</h3>
                    <p className="text-gray-600 leading-relaxed">{t('about.feature4Desc')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-8 border border-yellow-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                <Code className="text-green-600 mr-3" size={32} />
                {t('about.technicalSpecsTitle')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 border border-yellow-200 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-4 text-xl flex items-center">
                    <Database className="text-yellow-600 mr-2" size={24} />
                    {t('about.systemArchTitle')}
                  </h3>
                  <ul className="text-gray-700 space-y-3">
                    <li className="flex items-center">
                      <CheckCircle className="text-yellow-600 mr-3" size={20} />
                      {t('about.systemArch1')}
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-yellow-600 mr-3" size={20} />
                      {t('about.systemArch2')}
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-yellow-600 mr-3" size={20} />
                      {t('about.systemArch3')}
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-yellow-600 mr-3" size={20} />
                      {t('about.systemArch4')}
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-yellow-600 mr-3" size={20} />
                      {t('about.systemArch5')}
                    </li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 border border-green-200 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-4 text-xl flex items-center">
                    <Shield className="text-green-600 mr-2" size={24} />
                    {t('about.securityTitle')}
                  </h3>
                  <ul className="text-gray-700 space-y-3">
                    <li className="flex items-center">
                      <CheckCircle className="text-green-600 mr-3" size={20} />
                      {t('about.security1')}
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-green-600 mr-3" size={20} />
                      {t('about.security2')}
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-green-600 mr-3" size={20} />
                      {t('about.security3')}
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-green-600 mr-3" size={20} />
                      {t('about.security4')}
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-green-600 mr-3" size={20} />
                      {t('about.security5')}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-8 border border-yellow-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                <Activity className="text-green-600 mr-3" size={32} />
                {t('about.implementationStatusTitle')}
              </h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl">
                  <span className="font-medium text-green-900 text-lg">{t('about.phase1')}</span>
                  <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 text-sm font-medium rounded-full shadow-lg">{t('about.completed')}</span>
                </div>
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl">
                  <span className="font-medium text-green-900 text-lg">{t('about.phase2')}</span>
                  <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 text-sm font-medium rounded-full shadow-lg">{t('about.completed')}</span>
                </div>
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl">
                  <span className="font-medium text-green-900 text-lg">{t('about.phase3')}</span>
                  <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 text-sm font-medium rounded-full shadow-lg">{t('about.completed')}</span>
                </div>
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl">
                  <span className="font-medium text-green-900 text-lg">{t('about.phase4')}</span>
                  <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 text-sm font-medium rounded-full shadow-lg">{t('about.completed')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">


            <div className="bg-white/90 backdrop-blur-sm p-6 border border-yellow-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <Phone className="text-green-600 mr-2" size={24} />
                {t('about.contactTitle')}
              </h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <Phone className="text-yellow-600" size={24} />
                  <div>
                    <p className="font-medium text-gray-900">{t('about.technicalSupport')}</p>
                    <p className="text-gray-600">1800-XXX-XXXX</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl border border-green-200">
                  <Mail className="text-green-600" size={24} />
                  <div>
                    <p className="font-medium text-gray-900">{t('about.emailSupport')}</p>
                    <p className="text-gray-600">support@maternal.gov.in</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <MapPin className="text-yellow-600" size={24} />
                  <div>
                    <p className="font-medium text-gray-900">{t('about.headOffice')}</p>
                    <p className="text-gray-600">{t('about.headOfficeAddress')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* College Partnership Section - Replacing Awards */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 border border-yellow-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <GraduationCap className="text-yellow-600" size={28} />
                <h3 className="text-xl font-semibold text-yellow-900">{t('about.collegePartnershipTitle')}</h3>
              </div>
              <p className="text-yellow-800 mb-6 leading-relaxed">
                {t('about.collegePartnershipDesc')}
              </p>
              
              <div className="space-y-4">
      <div className="bg-white/80 p-4 rounded-xl border border-yellow-200">
        <h4 className="font-medium text-yellow-900 mb-3 flex items-center">
          <Code className="text-yellow-600 mr-2" size={20} />
          {t('about.department.title')}
        </h4>
        <p className="text-yellow-800 mb-3 text-sm leading-relaxed">
          {t('about.department.description')}
        </p>
        <ul className="text-yellow-800 space-y-2">
          <li className="flex items-center text-sm">
            <CheckCircle className="text-yellow-600 mr-2" size={16} />
            {t('about.department.features.aiml')}
          </li>
          <li className="flex items-center text-sm">
            <CheckCircle className="text-yellow-600 mr-2" size={16} />
            {t('about.department.features.analytics')}
          </li>
          <li className="flex items-center text-sm">
            <CheckCircle className="text-yellow-600 mr-2" size={16} />
            {t('about.department.features.responsive')}
          </li>
          <li className="flex items-center text-sm">
            <CheckCircle className="text-yellow-600 mr-2" size={16} />
            {t('about.department.features.multilingual')}
          </li>
        </ul>
      </div>
      
      <div className="bg-white/80 p-4 rounded-xl border border-yellow-200">
        <h4 className="font-medium text-yellow-900 mb-3 flex items-center">
          <Database className="text-yellow-600 mr-2" size={20} />
          {t('about.innovation.title')}
        </h4>
        <ul className="text-yellow-800 space-y-2">
          <li className="flex items-center text-sm">
            <CheckCircle className="text-yellow-600 mr-2" size={16} />
            {t('about.innovation.features.api')}
          </li>
          <li className="flex items-center text-sm">
            <CheckCircle className="text-yellow-600 mr-2" size={16} />
            {t('about.innovation.features.security')}
          </li>
          <li className="flex items-center text-sm">
            <CheckCircle className="text-yellow-600 mr-2" size={16} />
            {t('about.innovation.features.architecture')}
          </li>
          <li className="flex items-center text-sm">
            <CheckCircle className="text-yellow-600 mr-2" size={16} />
            {t('about.innovation.features.interface')}
          </li>
        </ul>
      </div>
      
      <div className="bg-white/80 p-4 rounded-xl border border-yellow-200">
        <h4 className="font-medium text-yellow-900 mb-3 flex items-center">
          <Globe className="text-yellow-600 mr-2" size={20} />
          {t('about.academic.title')}
        </h4>
        <p className="text-yellow-800 text-sm leading-relaxed">
          {t('about.academic.description')}
        </p>
      </div>
    </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 border border-green-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-semibold text-green-900 mb-4 flex items-center">
                <Users className="text-green-600 mr-2" size={24} />
                {t('about.partnersTitle')}
              </h3>
              <ul className="text-green-800 space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="text-green-600 mr-2" size={20} />
                  {t('about.partner1')}
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-600 mr-2" size={20} />
                  {t('about.partner2')}
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-600 mr-2" size={20} />
                  {t('about.partner3')}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}