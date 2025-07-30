import React from 'react';
import { ExternalLink, Heart, Baby, Shield, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Schemes() {
  const { t } = useTranslation();

  const schemes = [
    {
      name: t('schemes.jsy.name'),
      description: t('schemes.jsy.description'),
      benefits: t('schemes.jsy.benefits'),
      eligibility: t('schemes.jsy.eligibility'),
      website: "#",
      icon: <Heart className="w-6 h-6" />,
      color: "bg-blue-600"
    },
    {
      name: t('schemes.pmmvy.name'),
      description: t('schemes.pmmvy.description'),
      benefits: t('schemes.pmmvy.benefits'),
      eligibility: t('schemes.pmmvy.eligibility'),
      website: "#",
      icon: <Baby className="w-6 h-6" />,
      color: "bg-orange-600"
    },
    {
      name: t('schemes.jssk.name'),
      description: t('schemes.jssk.description'),
      benefits: t('schemes.jssk.benefits'),
      eligibility: t('schemes.jssk.eligibility'),
      website: "#",
      icon: <Shield className="w-6 h-6" />,
      color: "bg-blue-600"
    },
    {
      name: t('schemes.rbsk.name'),
      description: t('schemes.rbsk.description'),
      benefits: t('schemes.rbsk.benefits'),
      eligibility: t('schemes.rbsk.eligibility'),
      website: "#",
      icon: <Users className="w-6 h-6" />,
      color: "bg-orange-600"
    },
    {
      name: t('schemes.pmsma.name'),
      description: t('schemes.pmsma.description'),
      benefits: t('schemes.pmsma.benefits'),
      eligibility: t('schemes.pmsma.eligibility'),
      website: "#",
      icon: <Heart className="w-6 h-6" />,
      color: "bg-blue-600"
    },
    {
      name: t('schemes.laqshya.name'),
      description: t('schemes.laqshya.description'),
      benefits: t('schemes.laqshya.benefits'),
      eligibility: t('schemes.laqshya.eligibility'),
      website: "#",
      icon: <Shield className="w-6 h-6" />,
      color: "bg-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white/90 backdrop-blur-sm p-8 border border-yellow-200/50 rounded-2xl shadow-lg mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-yellow-600 to-green-600 bg-clip-text text-transparent">{t('schemes.title')}</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            {t('schemes.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {schemes.map((scheme, index) => (
            <div key={index} className="bg-white/90 backdrop-blur-sm border border-yellow-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="p-8">
                <div className="flex items-start space-x-6">
                  <div className={`${scheme.color} text-white p-4 rounded-2xl flex-shrink-0 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                    {scheme.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{scheme.name}</h3>
                    <p className="text-gray-600 mb-6 text-lg leading-relaxed">{scheme.description}</p>
                    
                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 border border-yellow-200 rounded-xl">
                        <h4 className="font-semibold text-yellow-900 mb-2 flex items-center">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                          {t('schemes.benefits')}:
                        </h4>
                        <p className="text-sm text-yellow-800 leading-relaxed">{scheme.benefits}</p>
                      </div>
                      
                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 border border-green-200 rounded-xl">
                        <h4 className="font-semibold text-green-900 mb-2 flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          {t('schemes.eligibility')}:
                        </h4>
                        <p className="text-sm text-green-800 leading-relaxed">{scheme.eligibility}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-gray-200/50">
                      <a
                        href={scheme.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <span>{t('schemes.visitWebsite')}</span>
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-br from-blue-50 to-purple-50 p-8 border border-blue-200/50 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">{t('schemes.howToApply.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-lg">
            <div className="bg-white/80 p-6 rounded-xl border border-blue-200 text-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                1
              </div>
              <h3 className="font-semibold text-blue-900 mb-3">{t('schemes.howToApply.step1.title')}</h3>
              <p className="text-blue-700 leading-relaxed">{t('schemes.howToApply.step1.description')}</p>
            </div>
            <div className="bg-white/80 p-6 rounded-xl border border-blue-200 text-center">
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                2
              </div>
              <h3 className="font-semibold text-green-900 mb-3">{t('schemes.howToApply.step2.title')}</h3>
              <p className="text-green-700 leading-relaxed">{t('schemes.howToApply.step2.description')}</p>
            </div>
            <div className="bg-white/80 p-6 rounded-xl border border-blue-200 text-center">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                3
              </div>
              <h3 className="font-semibold text-purple-900 mb-3">{t('schemes.howToApply.step3.title')}</h3>
              <p className="text-purple-700 leading-relaxed">{t('schemes.howToApply.step3.description')}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-br from-orange-50 to-orange-100 p-8 border border-orange-200 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-orange-900 mb-6">{t('schemes.importantInfo.title')}</h2>
          <ul className="space-y-4 text-lg text-orange-800">
            <li className="flex items-start">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>{t('schemes.importantInfo.point1')}</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>{t('schemes.importantInfo.point2')}</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>{t('schemes.importantInfo.point3')}</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>{t('schemes.importantInfo.point4')}</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>{t('schemes.importantInfo.point5')}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}