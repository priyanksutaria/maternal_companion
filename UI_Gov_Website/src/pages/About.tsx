import React from 'react';
import { Shield, Users, Activity, Heart, Phone, Mail, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-2 py-2">
        {/* Header Section */}
        <div className="bg-white p-3 border border-gray-200 mb-2">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('about.headerTitle')}</h1>
          <p className="text-lg text-gray-600">
            {t('about.headerSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-2">
            <div className="bg-white p-2 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('about.projectOverviewTitle')}</h2>
              <p className="text-gray-700 mb-4">
                {t('about.projectOverviewP1')}
              </p>
              <p className="text-gray-700 mb-4">
                {t('about.projectOverviewP2')}
              </p>
              <p className="text-gray-700">
                {t('about.projectOverviewP3')}
              </p>
            </div>

            <div className="bg-white p-2 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('about.keyFeaturesTitle')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600 text-white p-2 rounded">
                    <Users size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{t('about.feature1Title')}</h3>
                    <p className="text-sm text-gray-600">{t('about.feature1Desc')}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-600 text-white p-2 rounded">
                    <Activity size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{t('about.feature2Title')}</h3>
                    <p className="text-sm text-gray-600">{t('about.feature2Desc')}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600 text-white p-2 rounded">
                    <Heart size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{t('about.feature3Title')}</h3>
                    <p className="text-sm text-gray-600">{t('about.feature3Desc')}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-600 text-white p-2 rounded">
                    <Shield size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{t('about.feature4Title')}</h3>
                    <p className="text-sm text-gray-600">{t('about.feature4Desc')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-2 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('about.technicalSpecsTitle')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">{t('about.systemArchTitle')}</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• {t('about.systemArch1')}</li>
                    <li>• {t('about.systemArch2')}</li>
                    <li>• {t('about.systemArch3')}</li>
                    <li>• {t('about.systemArch4')}</li>
                    <li>• {t('about.systemArch5')}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">{t('about.securityTitle')}</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• {t('about.security1')}</li>
                    <li>• {t('about.security2')}</li>
                    <li>• {t('about.security3')}</li>
                    <li>• {t('about.security4')}</li>
                    <li>• {t('about.security5')}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white p-2 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('about.implementationStatusTitle')}</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200">
                  <span className="font-medium text-blue-900">{t('about.phase1')}</span>
                  <span className="bg-blue-600 text-white px-3 py-1 text-sm font-medium">{t('about.completed')}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200">
                  <span className="font-medium text-orange-900">{t('about.phase2')}</span>
                  <span className="bg-orange-600 text-white px-3 py-1 text-sm font-medium">{t('about.inProgress')}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200">
                  <span className="font-medium text-gray-700">{t('about.phase3')}</span>
                  <span className="bg-gray-400 text-white px-3 py-1 text-sm font-medium">{t('about.planned')}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200">
                  <span className="font-medium text-gray-700">{t('about.phase4')}</span>
                  <span className="bg-gray-400 text-white px-3 py-1 text-sm font-medium">{t('about.planned')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-2">
            <div className="bg-white p-2 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('about.statsTitle')}</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">{t('about.statesCovered')}</span>
                    <span className="text-sm font-medium">28/28</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2">
                    <div className="bg-blue-600 h-2" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">{t('about.districtsActive')}</span>
                    <span className="text-sm font-medium">650/750</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2">
                    <div className="bg-orange-600 h-2" style={{ width: '87%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">{t('about.healthcareWorkers')}</span>
                    <span className="text-sm font-medium">45,000+</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2">
                    <div className="bg-blue-600 h-2" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-2 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('about.contactTitle')}</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="text-blue-600" size={20} />
                  <div>
                    <p className="font-medium text-gray-900">{t('about.technicalSupport')}</p>
                    <p className="text-sm text-gray-600">1800-XXX-XXXX</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="text-orange-600" size={20} />
                  <div>
                    <p className="font-medium text-gray-900">{t('about.emailSupport')}</p>
                    <p className="text-sm text-gray-600">support@maternal.gov.in</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="text-blue-600" size={20} />
                  <div>
                    <p className="font-medium text-gray-900">{t('about.headOffice')}</p>
                    <p className="text-sm text-gray-600">{t('about.headOfficeAddress')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-2 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">{t('about.awardsTitle')}</h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• {t('about.award1')}</li>
                <li>• {t('about.award2')}</li>
                <li>• {t('about.award3')}</li>
                <li>• {t('about.award4')}</li>
              </ul>
            </div>

            <div className="bg-orange-50 p-2 border border-orange-200">
              <h3 className="text-lg font-semibold text-orange-900 mb-4">{t('about.partnersTitle')}</h3>
              <ul className="text-sm text-orange-800 space-y-1">
                <li>• {t('about.partner1')}</li>
                <li>• {t('about.partner2')}</li>
                <li>• {t('about.partner3')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}