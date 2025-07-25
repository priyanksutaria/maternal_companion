import React, { useState, useEffect } from 'react';
import VisitReportForm from './VisitReportForm';
import ReportView from './ReportView';
import { getReportsByPregnancyId, getRegistration } from '../../api';

interface PatientDetailsProps {
  patient: any;
  visits: any;
  onBack: () => void;
}

export default function PatientDetails({ patient, visits, onBack }: PatientDetailsProps) {
  const [selectedVisit, setSelectedVisit] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'visits' | 'reports'>('overview');
  const [registration, setRegistration] = useState<any>(null);

  // If visits is an array, use it. If it's an object with a visits array, use visits.visits
  let allVisits: any[] = [];
  if (Array.isArray(visits)) {
    allVisits = visits;
  } else if (visits && Array.isArray(visits.visits)) {
    allVisits = visits.visits;
  }

  useEffect(() => {
    async function fetchReports() {
      if (patient?.pregnancyId) {
        try {
          const fetchedReports = await getReportsByPregnancyId(patient.pregnancyId);
          setReports(fetchedReports);
        } catch (err) {
          setReports([]);
        }
      }
    }
    async function fetchRegistration() {
      if (patient?.pregnancyId) {
        try {
          const reg = await getRegistration(patient.pregnancyId);
          setRegistration(reg);
        } catch (err) {
          setRegistration(null);
        }
      }
    }
    fetchReports();
    fetchRegistration();
  }, [patient?.pregnancyId]);

  if (selectedVisit) {
    // Pass the selected visit object to VisitReportForm
    return <VisitReportForm visit={selectedVisit} patient={patient} onBack={() => setSelectedVisit(null)} />;
  }

  if (selectedReport) {
    return <ReportView report={selectedReport} onBack={() => setSelectedReport(null)} />;
  }

  // Helper to render a section
  const renderSection = (title: string, obj: any) => (
    <div className="mb-6">
      <h4 className="text-lg font-semibold text-blue-700 mb-2">{title}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {obj && Object.entries(obj).map(([key, value]) => (
          <div key={key} className="text-gray-800">
            <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span> {value === null || value === undefined || value === '' ? 'N/A' : value.toString()}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <button onClick={onBack} className="mb-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">
        &larr; Back to Search
      </button>
      {/* Patient Details Card */}
      <div className="bg-white p-6 shadow-lg mb-8 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Patient Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><strong>Name:</strong> {registration?.personal?.name ?? patient?.personal?.name ?? 'N/A'}</p>
          <p><strong>Age:</strong> {registration?.personal?.age ?? patient?.personal?.age ?? 'N/A'}</p>
          <p><strong>Aadhaar:</strong> {registration?.personal?.aadhaarNumber ?? patient?.personal?.aadhaarNumber ?? 'N/A'}</p>
          <p><strong>Contact:</strong> {registration?.personal?.contact ?? patient?.personal?.contact ?? 'N/A'}</p>
          <p className="md:col-span-2"><strong>Address:</strong> {registration?.personal?.address ?? patient?.personal?.address ?? 'N/A'}</p>
        </div>
      </div>
      {/* Tabs */}
      <div className="mb-8">
        <div className="flex border-b mb-4">
          <button
            className={`px-4 py-2 font-semibold focus:outline-none border-b-2 transition-colors ${activeTab === 'overview' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-blue-700'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`ml-2 px-4 py-2 font-semibold focus:outline-none border-b-2 transition-colors ${activeTab === 'visits' ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-green-700'}`}
            onClick={() => setActiveTab('visits')}
          >
            ANC Visits
          </button>
          <button
            className={`ml-2 px-4 py-2 font-semibold focus:outline-none border-b-2 transition-colors ${activeTab === 'reports' ? 'border-yellow-500 text-yellow-700' : 'border-transparent text-gray-500 hover:text-yellow-700'}`}
            onClick={() => setActiveTab('reports')}
          >
            Reports
          </button>
        </div>
        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="bg-white p-6 shadow rounded-lg">
            <h3 className="text-lg font-bold mb-4">Registration Overview</h3>
            {registration ? (
              <>
                {renderSection('Personal Details', registration.personal)}
                {renderSection('Obstetric History', registration.obstetricHistory)}
                {renderSection('Menstrual History', registration.menstrualHistory)}
                {renderSection('Medical History', registration.medicalHistory)}
                {renderSection('Family History', registration.familyHistory)}
                {renderSection('Obstetric Risk Factors', registration.obstetricRiskFactors)}
                {renderSection('Immunization History', registration.immunizationHistory)}
                {renderSection('Diet and Nutrition', registration.dietAndNutrition)}
                {renderSection('Lifestyle', registration.lifestyle)}
                {renderSection('Environment', registration.environment)}
                {renderSection('Contraceptive History', registration.contraceptiveHistory)}
                {renderSection('Other', registration.other)}
                {renderSection('Registration Log', registration.registrationLog)}
              </>
            ) : (
              <div className="text-gray-500">Loading registration data...</div>
            )}
          </div>
        )}
        {activeTab === 'visits' && (
          <div className="bg-white p-6 shadow rounded-lg">
            <h3 className="text-lg font-bold mb-4">ANC Visits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {allVisits && allVisits.length > 0 ? (
                allVisits.map((visit: any) => (
                  <div
                    key={visit._id || visit.visitNumber}
                    className={`border p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${visit.status === 'completed' ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-white hover:border-blue-400'}`}
                    onClick={() => setSelectedVisit(visit)}
                  >
                    <h4 className="font-semibold text-gray-900 mb-2">Visit #{visit.visitNumber}</h4>
                    <p className="text-gray-600 text-sm">Scheduled: {new Date(visit.scheduledDate).toLocaleDateString()}</p>
                    <p className={`font-medium ${visit.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>{visit.status}</p>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 col-span-full">No ANC visits found for this patient.</div>
              )}
            </div>
          </div>
        )}
        {activeTab === 'reports' && (
          <div className="bg-white p-6 shadow rounded-lg">
            <h3 className="text-lg font-bold mb-4">Reports</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {reports && reports.length > 0 ? (
                reports.map((report: any) => (
                  <div
                    key={report._id}
                    className="border p-4 cursor-pointer transition-all duration-200 hover:shadow-md border-blue-300 bg-blue-50 hover:border-blue-500"
                    onClick={() => setSelectedReport(report)}
                  >
                    <h4 className="font-semibold text-gray-900 mb-2">Report</h4>
                    <p className="text-gray-600 text-sm">Created: {new Date(report.createdAt).toLocaleDateString()}</p>
                    <p className="text-gray-600 text-sm">Gestational Age: {report.data?.analyzeForm?.gestational_age_weeks || 'N/A'} weeks</p>
                    <p className="text-gray-600 text-sm">BMI: {report.data?.analyzeForm?.bmi || 'N/A'}</p>
                    <p className="text-gray-600 text-sm">Hemoglobin: {report.data?.analyzeForm?.hb_1st || 'N/A'} g/dl</p>
                    <p className="text-gray-600 text-sm">Pregnancy Risk: {(() => {
                      const risk = report.data?.pregRisk?.EnsemblePrediction;
                      if (risk === 0) return 'Low';
                      if (risk === 1) return 'Medium';
                      if (risk === 2) return 'High';
                      return 'N/A';
                    })()}</p>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 col-span-full">No reports found for this patient.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}