import React, { useState } from 'react';
import { MapPin, Phone, Clock, Users, Search, Building2, Shield, Heart, Activity } from 'lucide-react';
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
      case 'DH': return 'bg-gradient-to-br from-yellow-600 to-yellow-700';
      case 'CHC': return 'bg-gradient-to-br from-green-600 to-green-700';
      case 'PHC': return 'bg-gradient-to-br from-yellow-500 to-yellow-600';
      case 'SHC': return 'bg-gradient-to-br from-green-500 to-green-600';
      default: return 'bg-gradient-to-br from-gray-600 to-gray-700';
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white/90 backdrop-blur-sm p-8 border border-yellow-200/50 rounded-2xl shadow-lg mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-gradient-to-br from-yellow-600 to-green-600 text-white p-4 rounded-2xl shadow-lg mr-6">
              <Building2 size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-yellow-600 to-green-600 bg-clip-text text-transparent">{t('ancCenters.title')}</h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                {t('ancCenters.subtitle')}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <Building2 size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{centers.length}</h3>
              <p className="text-gray-600 text-sm font-medium">Total Centers</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <Shield size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">24/7</h3>
              <p className="text-gray-600 text-sm font-medium">Emergency Care</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <Heart size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">100%</h3>
              <p className="text-gray-600 text-sm font-medium">Coverage</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-400 to-green-500 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <Activity size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">765</h3>
              <p className="text-gray-600 text-sm font-medium">Total Beds</p>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white/90 backdrop-blur-sm p-6 border border-yellow-200/50 rounded-2xl shadow-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={t('ancCenters.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
              />
            </div>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
            >
              <option value="">{t('ancCenters.allStates')}</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Centers List */}
        <div className="space-y-6">
          {filteredCenters.map((center, index) => (
            <div key={index} className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start space-x-6">
                    <div className={`${getTypeColor(center.type)} text-white px-4 py-2 text-sm font-bold rounded-xl shadow-lg flex-shrink-0`}>
                      {center.type}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{center.name}</h3>
                      <p className="text-lg text-gray-600">{getTypeFullName(center.type)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{center.state}</span>
                    <p className="text-sm font-semibold text-gray-700 mt-1">{center.district}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-3 rounded-xl shadow-lg flex-shrink-0">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                        <p className="text-gray-600">{center.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-3 rounded-xl shadow-lg flex-shrink-0">
                        <Phone size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Contact</h4>
                        <p className="text-gray-600">{center.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-white p-3 rounded-xl shadow-lg flex-shrink-0">
                        <Clock size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Timings</h4>
                        <p className="text-gray-600">{center.timings}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-br from-green-400 to-green-500 text-white p-3 rounded-xl shadow-lg flex-shrink-0">
                        <Users size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Capacity</h4>
                        <p className="text-gray-600">{center.capacity}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 text-lg flex items-center">
                      <Shield className="text-yellow-600 mr-2" size={20} />
                      {t('ancCenters.availableServices')}
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {center.services.map((service, serviceIndex) => (
                        <span
                          key={serviceIndex}
                          className="px-4 py-2 bg-gradient-to-r from-yellow-100 to-green-100 text-yellow-800 text-sm font-medium rounded-xl border border-yellow-200"
                        >
                          {t(`ancCenters.services.${service.replace(/\s+/g, '')}`, service)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200/50 flex space-x-4">
                  <button className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white text-sm font-semibold rounded-xl hover:from-yellow-700 hover:to-yellow-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                    Get Directions
                  </button>
                  <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCenters.length === 0 && (
          <div className="text-center py-12 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-lg">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-400" size={32} />
            </div>
            <p className="text-gray-500 text-lg font-medium">{t('ancCenters.noCentersFound')}</p>
          </div>
        )}

        {/* Emergency Information */}
        <div className="mt-12 bg-gradient-to-br from-yellow-50 to-green-100 border border-yellow-200 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center mb-6">
            <div className="bg-gradient-to-br from-yellow-500 to-green-600 text-white p-4 rounded-2xl shadow-lg mr-6">
              <Shield size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-green-900 mb-2">{t('ancCenters.emergencyTitle')}</h2>
              <p className="text-green-700 text-lg">Emergency services available 24/7 across all centers</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-yellow-200">
              <h3 className="font-semibold text-yellow-800 mb-3 text-lg flex items-center">
                <Phone className="text-yellow-600 mr-2" size={20} />
                {t('ancCenters.emergencyHelpline')}
              </h3>
              <p className="text-yellow-700">{t('ancCenters.emergencyHelplineDesc')}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-green-200">
              <h3 className="font-semibold text-green-800 mb-3 text-lg flex items-center">
                <Heart className="text-green-600 mr-2" size={20} />
                {t('ancCenters.maternalHelpline')}
              </h3>
              <p className="text-green-700">{t('ancCenters.maternalHelplineDesc')}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-yellow-200">
              <h3 className="font-semibold text-yellow-800 mb-3 text-lg flex items-center">
                <Activity className="text-yellow-600 mr-2" size={20} />
                {t('ancCenters.ambulanceService')}
              </h3>
              <p className="text-yellow-700">{t('ancCenters.ambulanceServiceDesc')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}