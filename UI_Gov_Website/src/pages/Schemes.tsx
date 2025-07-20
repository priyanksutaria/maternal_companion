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
      website: "https://nhm.gov.in/index1.php?lang=1&level=3&sublinkid=841&lid=309",
      icon: <Heart className="w-6 h-6" />,
      color: "bg-blue-600"
    },
    {
      name: t('schemes.pmmvy.name'),
      description: t('schemes.pmmvy.description'),
      benefits: t('schemes.pmmvy.benefits'),
      eligibility: t('schemes.pmmvy.eligibility'),
      website: "https://wcd.nic.in/schemes/pradhan-mantri-matru-vandana-yojana",
      icon: <Baby className="w-6 h-6" />,
      color: "bg-orange-600"
    },
    {
      name: t('schemes.jssk.name'),
      description: t('schemes.jssk.description'),
      benefits: t('schemes.jssk.benefits'),
      eligibility: t('schemes.jssk.eligibility'),
      website: "https://nhm.gov.in/index1.php?lang=1&level=3&sublinkid=842&lid=309",
      icon: <Shield className="w-6 h-6" />,
      color: "bg-blue-600"
    },
    {
      name: t('schemes.rbsk.name'),
      description: t('schemes.rbsk.description'),
      benefits: t('schemes.rbsk.benefits'),
      eligibility: t('schemes.rbsk.eligibility'),
      website: "https://nhm.gov.in/index1.php?lang=1&level=3&sublinkid=818&lid=168",
      icon: <Users className="w-6 h-6" />,
      color: "bg-orange-600"
    },
    {
      name: t('schemes.pmsma.name'),
      description: t('schemes.pmsma.description'),
      benefits: t('schemes.pmsma.benefits'),
      eligibility: t('schemes.pmsma.eligibility'),
      website: "https://pmsma.nhp.gov.in/",
      icon: <Heart className="w-6 h-6" />,
      color: "bg-blue-600"
    },
    {
      name: t('schemes.laqshya.name'),
      description: t('schemes.laqshya.description'),
      benefits: t('schemes.laqshya.benefits'),
      eligibility: t('schemes.laqshya.eligibility'),
      website: "https://nhm.gov.in/index1.php?lang=1&level=2&sublinkid=1048&lid=49",
      icon: <Shield className="w-6 h-6" />,
      color: "bg-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-2 py-2">
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('schemes.title')}</h1>
          <p className="text-lg text-gray-600">
            {t('schemes.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {schemes.map((scheme, index) => (
            <div key={index} className="bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-200">
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`${scheme.color} text-white p-3 rounded-lg flex-shrink-0`}>
                    {scheme.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{scheme.name}</h3>
                    <p className="text-gray-600 mb-4">{scheme.description}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">{t('schemes.benefits')}:</h4>
                        <p className="text-sm text-gray-600">{scheme.benefits}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">{t('schemes.eligibility')}:</h4>
                        <p className="text-sm text-gray-600">{scheme.eligibility}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <a
                        href={scheme.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
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

        <div className="mt-4 bg-blue-50 border border-blue-200 p-2">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">{t('schemes.howToApply.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h3 className="font-medium text-blue-800 mb-2">{t('schemes.howToApply.step1.title')}</h3>
              <p className="text-blue-700">{t('schemes.howToApply.step1.description')}</p>
            </div>
            <div>
              <h3 className="font-medium text-blue-800 mb-2">{t('schemes.howToApply.step2.title')}</h3>
              <p className="text-blue-700">{t('schemes.howToApply.step2.description')}</p>
            </div>
            <div>
              <h3 className="font-medium text-blue-800 mb-2">{t('schemes.howToApply.step3.title')}</h3>
              <p className="text-blue-700">{t('schemes.howToApply.step3.description')}</p>
            </div>
          </div>
        </div>

        <div className="mt-2 bg-orange-50 border border-orange-200 p-2">
          <h2 className="text-xl font-semibold text-orange-900 mb-4">{t('schemes.importantInfo.title')}</h2>
          <ul className="space-y-2 text-sm text-orange-800">
            <li>• {t('schemes.importantInfo.point1')}</li>
            <li>• {t('schemes.importantInfo.point2')}</li>
            <li>• {t('schemes.importantInfo.point3')}</li>
            <li>• {t('schemes.importantInfo.point4')}</li>
            <li>• {t('schemes.importantInfo.point5')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}