import React, { useState } from 'react';
import PatientSearch from './PatientSearch';
import PatientDetails from './PatientDetails';
import { getRegistration, getAncVisits } from '../../api';

export default function ANCDashboard() {
  const [pregnancyId, setPregnancyId] = useState<string | null>(null);
  const [patientData, setPatientData] = useState<any>(null);
  const [ancVisits, setAncVisits] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = async (id: string) => {
    setLoading(true);
    setError(null);
    setPatientData(null);
    setAncVisits(null);
    try {
      const [patient, visits] = await Promise.all([
        getRegistration(id),
        getAncVisits(id),
      ]);
      setPatientData(patient);
      setAncVisits(visits);
      console.log('Visits: ', visits);
      setPregnancyId(id);
    } catch (err) {
      setError('Failed to fetch patient data. Please check the Pregnancy ID.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPregnancyId(null);
    setPatientData(null);
    setAncVisits(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-800 text-white shadow-md">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold">ANC Dashboard</h1>
            <button 
              onClick={handleReset} 
              className="px-4 py-2 bg-white text-blue-800 rounded-md hover:bg-blue-100"
            >
              Logout
            </button>
          </div>
        </nav>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!pregnancyId ? (
          <PatientSearch onSearch={handleSearch} loading={loading} error={error} />
        ) : (
          <PatientDetails patient={patientData} visits={ancVisits} onBack={handleReset} />
        )}
      </main>
    </div>
  );
}