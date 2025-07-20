import React, { useState } from 'react';
import { MapPin, Phone, Clock, Users, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ANCCenters() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');

  const centers = [
    {
      name: "Primary Health Centre - Sector 12",
      type: "PHC",
      address: "Sector 12, Block A, New Delhi - 110001",
      phone: "+91-11-2345-6789",
      timings: "24/7 Emergency, OPD: 9 AM - 5 PM",
      services: ["ANC Checkups", "Delivery", "Emergency Care", "Lab Services"],
      capacity: "50 beds",
      state: "Delhi",
      district: "New Delhi"
    },
    {
      name: "Community Health Centre - Rohini",
      type: "CHC",
      address: "Rohini Sector 3, New Delhi - 110085",
      phone: "+91-11-2876-5432",
      timings: "24/7 Services Available",
      services: ["Specialist Consultation", "High-Risk Pregnancy", "NICU", "Blood Bank"],
      capacity: "100 beds",
      state: "Delhi",
      district: "North West Delhi"
    },
    {
      name: "Sub Health Centre - Karol Bagh",
      type: "SHC",
      address: "Karol Bagh, Central Delhi - 110005",
      phone: "+91-11-2575-8901",
      timings: "9 AM - 5 PM (Mon-Sat)",
      services: ["Basic ANC", "Immunization", "Health Education", "Referral Services"],
      capacity: "10 beds",
      state: "Delhi",
      district: "Central Delhi"
    },
    {
      name: "District Hospital - Safdarjung",
      type: "DH",
      address: "Safdarjung, New Delhi - 110029",
      phone: "+91-11-2673-0000",
      timings: "24/7 All Services",
      services: ["Tertiary Care", "ICU", "Operation Theatre", "Blood Bank", "Ambulance"],
      capacity: "500 beds",
      state: "Delhi",
      district: "South Delhi"
    },
    {
      name: "Primary Health Centre - Gurgaon Rural",
      type: "PHC",
      address: "Village Wazirabad, Gurgaon - 122001",
      phone: "+91-124-234-5678",
      timings: "8 AM - 8 PM",
      services: ["ANC Checkups", "Normal Delivery", "Immunization", "Family Planning"],
      capacity: "30 beds",
      state: "Haryana",
      district: "Gurgaon"
    },
    {
      name: "Community Health Centre - Faridabad",
      type: "CHC",
      address: "Old Faridabad, Haryana - 121002",
      phone: "+91-129-234-5678",
      timings: "24/7 Emergency Services",
      services: ["Gynecology", "Pediatrics", "General Surgery", "Pathology"],
      capacity: "75 beds",
      state: "Haryana",
      district: "Faridabad"
    }
  ];

  const states = [...new Set(centers.map(center => center.state))];

  const filteredCenters = centers.filter(center => {
    const matchesSearch = center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         center.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         center.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = selectedState === '' || center.state === selectedState;
    return matchesSearch && matchesState;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'DH': return 'bg-blue-600';
      case 'CHC': return 'bg-orange-600';
      case 'PHC': return 'bg-blue-500';
      case 'SHC': return 'bg-orange-500';
      default: return 'bg-gray-600';
    }
  };

  const getTypeFullName = (type: string) => {
    switch (type) {
      case 'DH': return t('ancCenters.typeDH');
      case 'CHC': return t('ancCenters.typeCHC');
      case 'PHC': return t('ancCenters.typePHC');
      case 'SHC': return t('ancCenters.typeSHC');
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-2 py-2">
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('ancCenters.title')}</h1>
          <p className="text-lg text-gray-600">
            {t('ancCenters.subtitle')}
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white p-2 border border-gray-200 mb-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={t('ancCenters.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">{t('ancCenters.allStates')}</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Centers List */}
        <div className="space-y-2">
          {filteredCenters.map((center, index) => (
            <div key={index} className="bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-200">
              <div className="p-2">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className={`${getTypeColor(center.type)} text-white px-3 py-1 text-sm font-bold flex-shrink-0`}>
                      {center.type}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{center.name}</h3>
                      <p className="text-sm text-gray-500">{getTypeFullName(center.type)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">{center.state}</span>
                    <p className="text-sm font-medium text-gray-700">{center.district}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <MapPin className="text-gray-400 mt-1 flex-shrink-0" size={16} />
                      <p className="text-sm text-gray-600">{center.address}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="text-gray-400 flex-shrink-0" size={16} />
                      <p className="text-sm text-gray-600">{center.phone}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="text-gray-400 flex-shrink-0" size={16} />
                      <p className="text-sm text-gray-600">{center.timings}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="text-gray-400 flex-shrink-0" size={16} />
                      <p className="text-sm text-gray-600">{t('ancCenters.capacity')}: {center.capacity}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">{t('ancCenters.availableServices')}</h4>
                    <div className="flex flex-wrap gap-2">
                      {center.services.map((service, serviceIndex) => (
                        <span
                          key={serviceIndex}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium"
                        >
                          {t(`ancCenters.services.${service.replace(/\s+/g, '')}`, service)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex space-x-4">
                  <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
                    Get Directions
                  </button>
                  <button className="px-4 py-2 bg-orange-600 text-white text-sm font-medium hover:bg-orange-700 transition-colors">
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCenters.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t('ancCenters.noCentersFound')}</p>
          </div>
        )}

        {/* Emergency Information */}
        <div className="mt-12 bg-red-50 border border-red-200 p-6">
          <h2 className="text-xl font-semibold text-red-900 mb-4">{t('ancCenters.emergencyTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h3 className="font-medium text-red-800 mb-2">{t('ancCenters.emergencyHelpline')}</h3>
              <p className="text-red-700">{t('ancCenters.emergencyHelplineDesc')}</p>
            </div>
            <div>
              <h3 className="font-medium text-red-800 mb-2">{t('ancCenters.maternalHelpline')}</h3>
              <p className="text-red-700">{t('ancCenters.maternalHelplineDesc')}</p>
            </div>
            <div>
              <h3 className="font-medium text-red-800 mb-2">{t('ancCenters.ambulanceService')}</h3>
              <p className="text-red-700">{t('ancCenters.ambulanceServiceDesc')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}