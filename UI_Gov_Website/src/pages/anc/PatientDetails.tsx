import React, { useState, useEffect } from 'react';
import VisitReportForm from './VisitReportForm';
import ReportView from './ReportView';
import { getReportsByPregnancyId } from '../../api';

interface PatientDetailsProps {
  patient: any;
  visits: any;
  onBack: () => void;
}

export default function PatientDetails({ patient, visits, onBack }: PatientDetailsProps) {
  const [selectedVisit, setSelectedVisit] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any>(null);

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
    fetchReports();
  }, [patient?.pregnancyId]);

  if (selectedVisit) {
    // Pass the selected visit object to VisitReportForm
    return <VisitReportForm visit={selectedVisit} patient={patient} onBack={() => setSelectedVisit(null)} />;
  }

  if (selectedReport) {
    return <ReportView report={selectedReport} onBack={() => setSelectedReport(null)} />;
  }

  return (
    <div>
      <button onClick={onBack} className="mb-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">
        &larr; Back to Search
      </button>
      <div className="bg-white p-6 shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Patient Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><strong>Name:</strong> {patient.personal.name}</p>
          <p><strong>Age:</strong> {patient.personal.age}</p>
          <p><strong>Aadhaar:</strong> {patient.personal.aadhaarNumber}</p>
          <p><strong>Contact:</strong> {patient.personal.contact}</p>
          <p className="md:col-span-2"><strong>Address:</strong> {patient.personal.address}, {patient.personal.district}, {patient.personal.state} - {patient.personal.pin}</p>
        </div>
      </div>

      <div className="bg-white p-6 shadow-lg mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">ANC Visits</h3>
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

      <div className="bg-white p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Reports</h3>
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
    </div>
  );
}