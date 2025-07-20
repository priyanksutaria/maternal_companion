import React, { useState } from 'react';
import { createReport, analyzeReport, predictPregnancyRisk, predictFetalRisk, markAncVisit } from '../../api';
import ReportView from './ReportView';
import { useNavigate } from 'react-router-dom';

interface VisitReportFormProps {
  visit: any;
  patient: any;
  onBack: () => void;
}

const analyzeFields = [
  { name: 'hb_1st', label: 'Hemoglobin 1st (g/dl)', type: 'number', step: '0.1' },
  { name: 'hb_2nd', label: 'Hemoglobin 2nd (g/dl)', type: 'number', step: '0.1' },
  { name: 'hb_3rd', label: 'Hemoglobin 3rd (g/dl)', type: 'number', step: '0.1' },
  { name: 'ferritin', label: 'Ferritin', type: 'number' },
  { name: 'tsat', label: 'TSAT', type: 'number' },
  { name: 'sbp', label: 'Systolic BP', type: 'number' },
  { name: 'dbp', label: 'Diastolic BP', type: 'number' },
  { name: 'proteinuria', label: 'Proteinuria', type: 'number' },
  { name: 'ogtt_f', label: 'OGTT Fasting', type: 'number' },
  { name: 'ogtt_1h', label: 'OGTT 1h', type: 'number' },
  { name: 'ogtt_2h', label: 'OGTT 2h', type: 'number' },
  { name: 'tsh_1', label: 'TSH 1', type: 'number', step: '0.1' },
  { name: 'tsh_2', label: 'TSH 2', type: 'number', step: '0.1' },
  { name: 'tsh_3', label: 'TSH 3', type: 'number', step: '0.1' },
  { name: 'ft4', label: 'FT4', type: 'number', step: '0.1' },
  { name: 'tpo_ab', label: 'TPO Antibody', type: 'checkbox' },
  { name: 'gestational_age_weeks', label: 'Gestational Age (weeks)', type: 'number' },
  { name: 'bmi', label: 'BMI', type: 'number', step: '0.1' },
  { name: 'pre_pregnancy_weight', label: 'Pre-pregnancy Weight', type: 'number' },
  { name: 'current_weight', label: 'Current Weight', type: 'number' },
];
const analyzeSymptoms = [
  'swelling',
  'blurred vision',
  'shortness of breath',
  'severe headaches',
];
const analyzeConditions = [
  'gestational hypertension',
  'severe anemia',
  'hypothyroidism',
  'gestational diabetes',
];

const pregFields = [
  { name: 'age', label: 'Age', type: 'number' },
  { name: 'systolic', label: 'Systolic BP', type: 'number' },
  { name: 'diastolic', label: 'Diastolic BP', type: 'number' },
  { name: 'bs', label: 'Blood Sugar', type: 'number' },
  { name: 'bmi', label: 'BMI', type: 'number', step: '0.1' },
  { name: 'heart_rate', label: 'Heart Rate', type: 'number' },
  { name: 'body_temp', label: 'Body Temp', type: 'number', step: '0.1' },
  { name: 'previous_complications', label: 'Previous Complications', type: 'number' },
];

const fetalFields = [
  { name: 'baseline_value', label: 'Baseline Value', type: 'number' },
  { name: 'accelerations', label: 'Accelerations', type: 'number' },
  { name: 'fetal_movement', label: 'Fetal Movement', type: 'number' },
  { name: 'uterine_contractions', label: 'Uterine Contractions', type: 'number' },
  { name: 'light_decelerations', label: 'Light Decelerations', type: 'number' },
  { name: 'severe_decelerations', label: 'Severe Decelerations', type: 'number' },
  { name: 'prolongued_decelerations', label: 'Prolongued Decelerations', type: 'number' },
  { name: 'abnormal_short_term_variability', label: 'Abnormal Short Term Variability', type: 'number' },
  { name: 'mean_value_of_short_term_variability', label: 'Mean Value of Short Term Variability', type: 'number', step: '0.1' },
  { name: 'percentage_of_time_with_abnormal_long_term_variability', label: 'Percentage of Time with Abnormal Long Term Variability', type: 'number' },
  { name: 'mean_value_of_long_term_variability', label: 'Mean Value of Long Term Variability', type: 'number' },
  { name: 'histogram_width', label: 'Histogram Width', type: 'number' },
  { name: 'histogram_min', label: 'Histogram Min', type: 'number' },
  { name: 'histogram_max', label: 'Histogram Max', type: 'number' },
  { name: 'histogram_number_of_peaks', label: 'Histogram Number of Peaks', type: 'number' },
  { name: 'histogram_number_of_zeroes', label: 'Histogram Number of Zeroes', type: 'number' },
  { name: 'histogram_mode', label: 'Histogram Mode', type: 'number' },
  { name: 'histogram_mean', label: 'Histogram Mean', type: 'number' },
  { name: 'histogram_median', label: 'Histogram Median', type: 'number' },
  { name: 'histogram_variance', label: 'Histogram Variance', type: 'number' },
  { name: 'histogram_tendency', label: 'Histogram Tendency', type: 'number' },
];

export default function VisitReportForm({ visit, patient, onBack }: VisitReportFormProps) {
  // Use three separate form states
  const [analyzeForm, setAnalyzeForm] = useState<any>({ sysmptoms: [], conditions: [] });
  const [pregForm, setPregForm] = useState<any>({});
  const [fetalForm, setFetalForm] = useState<any>({});
  const [analysis, setAnalysis] = useState<any>(null);
  const [pregRisk, setPregRisk] = useState<any>(null);
  const [fetalRisk, setFetalRisk] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'analyze' | 'preg' | 'fetal'>('analyze');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  const visits = patient && patient.visits ? patient.visits : [];

  // Check if report already exists for this visit
  React.useEffect(() => {
    async function fetchReport() {
      // Example: const existingReport = await getReportByVisitId(visit._id);
      // If you have a report, set it
      // setReport(existingReport);
    }
    fetchReport();
  }, [visit._id]);

  // Input handler for all forms
  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, type, value } = e.target;
    if (activeTab === 'analyze') {
      if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
        setAnalyzeForm((prev: any) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
      } else {
        setAnalyzeForm((prev: any) => ({ ...prev, [name]: value }));
      }
    } else if (activeTab === 'preg') {
      setPregForm((prev: any) => ({ ...prev, [name]: value }));
    } else if (activeTab === 'fetal') {
      setFetalForm((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  // Multi-select handler for analyze tab
  const handleMultiSelect = (name: string, value: string) => {
    if (activeTab === 'analyze') {
      setAnalyzeForm((prev: any) => {
        const arr = prev[name] || [];
        if (arr.includes(value)) {
          return { ...prev, [name]: arr.filter((v: string) => v !== value) };
        } else {
          return { ...prev, [name]: [...arr, value] };
        }
      });
    }
  };

  // Prediction handlers
  const handleAnalyze = async () => {
    const res = await analyzeReport({ data: analyzeForm });
    setAnalysis(res);
  };

  const handlePregRisk = async () => {
    const res = await predictPregnancyRisk(pregForm);
    setPregRisk(res);
  };

  const handleFetalRisk = async () => {
    const res = await predictFetalRisk(fetalForm);
    setFetalRisk(res);
  };

  // Save report with all forms and results
  const handleSaveReport = async () => {
    setSaving(true);
    console.log(pregRisk);
    const data = {
      analyzeForm,
      pregForm,
      fetalForm,
      analysis,
      pregRisk,
      fetalRisk,
      recommendations: [
        ...(analysis?.supplement_recommendations || []),
        ...(pregRisk?.supplement_recommendations || []),
        ...(fetalRisk?.supplement_recommendations || [])
      ],
      alerts: [
        ...(analysis?.alerts || []),
        ...(pregRisk?.alerts || []),
        ...(fetalRisk?.alerts || [])
      ],
      dietary_recommendations: [
        ...(analysis?.dietary_recommendations || []),
        ...(pregRisk?.dietary_recommendations || []),
        ...(fetalRisk?.dietary_recommendations || [])
      ],
      patientDetails: patient,
      visitDetails: visit,
    };
    const reportData = {
      pregnancyId: patient.pregnancyId,
      data
    };
    console.log('Saving report:', reportData); // Debug
    try {
      const savedReport = await createReport(patient.pregnancyId, reportData);
      setSaving(false);
      setDownloadUrl(`/api/reports/download/${savedReport._id}`);
      setReport(savedReport);
    } catch (err) {
      setSaving(false);
      alert('Failed to save report. Please try again.');
    }
  };

  if (report) {
    const handleMarkCompleted = async () => {
      try {
        await markAncVisit(visit._id, { status: 'completed' });
        alert('ANC visit marked as completed!');
        navigate('/anc');
        window.location.reload(); // Force refresh to reload dashboard data
      } catch (err) {
        alert('Failed to mark ANC visit as completed.');
      }
    };
    return (
      <div>
        <ReportView report={report} onBack={() => setReport(null)} />
        <div className="mt-4 flex items-center space-x-4">
          {downloadUrl && (
            <a
              href={downloadUrl}
              className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
              download
            >
              Download Report
            </a>
          )}
          <button
            onClick={handleMarkCompleted}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Mark ANC Visit as Completed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button onClick={onBack} className="mb-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">
        &larr; Back to Patient Details
      </button>
      {/* ANC Visits List */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-blue-800 mb-2">All ANC Visits</h3>
        {Array.isArray(visits) && visits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {visits.map((v: any) => (
              <div key={v._id} className="p-3 bg-blue-50 border border-blue-200 rounded shadow">
                <div className="font-semibold text-blue-900">{v.visitNumber}</div>
                <div className="text-sm text-gray-700">Date: {new Date(v.scheduledDate).toLocaleDateString()}</div>
                <div className="text-xs text-gray-600">Status: {v.status}</div>
                {v.highRiskFlag && <div className="text-xs text-red-600 font-bold">High Risk</div>}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500">No ANC visits scheduled.</div>
        )}
      </div>
      <div className="bg-white p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">ANC Visit Report - Visit #{visit.visitNumber}</h2>
        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-semibold focus:outline-none border-b-2 transition-colors ${activeTab === 'analyze' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-blue-700'}`}
            onClick={() => setActiveTab('analyze')}
          >
            Analyze (Rules)
          </button>
          <button
            className={`ml-2 px-4 py-2 font-semibold focus:outline-none border-b-2 transition-colors ${activeTab === 'preg' ? 'border-orange-500 text-orange-700' : 'border-transparent text-gray-500 hover:text-orange-700'}`}
            onClick={() => setActiveTab('preg')}
          >
            Predict Pregnancy Risk
          </button>
          <button
            className={`ml-2 px-4 py-2 font-semibold focus:outline-none border-b-2 transition-colors ${activeTab === 'fetal' ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-green-700'}`}
            onClick={() => setActiveTab('fetal')}
          >
            Predict Fetal Risk
          </button>
        </div>
        {/* Tab Content */}
        {activeTab === 'analyze' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {analyzeFields.map(field => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                {field.type === 'checkbox' ? (
                  <input
                    name={field.name}
                    type="checkbox"
                    checked={!!analyzeForm[field.name]}
                    onChange={handleInput}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                ) : (
                  <input
                    name={field.name}
                    type={field.type}
                    step={field.step}
                    value={analyzeForm[field.name] || ''}
                    onChange={handleInput}
                    className="w-full px-3 py-2 border border-gray-300"
                  />
                )}
              </div>
            ))}
            {/* Symptoms Multi-select */}
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms</label>
              <div className="flex flex-wrap gap-2">
                {analyzeSymptoms.map(sym => (
                  <label key={sym} className={`px-3 py-1 rounded-full border cursor-pointer ${analyzeForm.sysmptoms?.includes(sym) ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-700 border-gray-300'}`}>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={analyzeForm.sysmptoms?.includes(sym)}
                      onChange={() => handleMultiSelect('sysmptoms', sym)}
                    />
                    {sym}
                  </label>
                ))}
              </div>
            </div>
            {/* Conditions Multi-select */}
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Conditions</label>
              <div className="flex flex-wrap gap-2">
                {analyzeConditions.map(cond => (
                  <label key={cond} className={`px-3 py-1 rounded-full border cursor-pointer ${analyzeForm.conditions?.includes(cond) ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-700 border-gray-300'}`}>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={analyzeForm.conditions?.includes(cond)}
                      onChange={() => handleMultiSelect('conditions', cond)}
                    />
                    {cond}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'preg' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {pregFields.map(field => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                <input
                  name={field.name}
                  type={field.type}
                  step={field.step}
                  value={pregForm[field.name] || ''}
                  onChange={handleInput}
                  className="w-full px-3 py-2 border border-gray-300"
                />
              </div>
            ))}
          </div>
        )}
        {activeTab === 'fetal' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {fetalFields.map(field => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                <input
                  name={field.name}
                  type={field.type}
                  step={field.step}
                  value={fetalForm[field.name] || ''}
                  onChange={handleInput}
                  className="w-full px-3 py-2 border border-gray-300"
                />
              </div>
            ))}
          </div>
        )}
        {/* Action Buttons for Each Tab */}
        <div className="flex space-x-4 mt-2 mb-6">
          {activeTab === 'analyze' && (
            <button onClick={handleAnalyze} className="px-4 py-2 bg-blue-600 text-white rounded">Analyze (Rules)</button>
          )}
          {activeTab === 'preg' && (
            <button onClick={handlePregRisk} className="px-4 py-2 bg-orange-600 text-white rounded">Predict Pregnancy Risk</button>
          )}
          {activeTab === 'fetal' && (
            <button onClick={handleFetalRisk} className="px-4 py-2 bg-green-600 text-white rounded">Predict Fetal Risk</button>
          )}
        </div>
        {/* Results */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {analysis && (
            <div className="p-4 bg-blue-50 border border-blue-200">
              <h4 className="font-semibold mb-2">Recommendations</h4>
              <ul className="list-disc ml-6">
                {analysis.supplement_recommendations?.map((rec: string, idx: number) => <li key={idx}>{rec}</li>)}
              </ul>
              <h4 className="font-semibold mt-4 mb-2">Alerts</h4>
              <ul className="list-disc ml-6 text-red-600">
                {analysis.alerts?.map((alert: string, idx: number) => <li key={idx}>{alert}</li>)}
              </ul>
              <h4 className="font-semibold mt-4 mb-2">Dietary Recommendations</h4>
              <ul className="list-disc ml-6">
                {analysis.dietary_recommendations?.map((diet: string, idx: number) => <li key={idx}>{diet}</li>)}
              </ul>
            </div>
          )}
          {pregRisk && (
            <div className="p-4 bg-orange-50 border border-orange-200">
              <h4 className="font-semibold mb-2">Pregnancy Risk Prediction</h4>
              <pre className="text-sm bg-gray-100 p-2 whitespace-pre-wrap">{JSON.stringify(pregRisk, null, 2)}</pre>
            </div>
          )}
          {fetalRisk && (
            <div className="p-4 bg-green-50 border border-green-200">
              <h4 className="font-semibold mb-2">Fetal Risk Prediction</h4>
              <pre className="text-sm bg-gray-100 p-2 whitespace-pre-wrap">{JSON.stringify(fetalRisk, null, 2)}</pre>
            </div>
          )}
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleSaveReport}
            className="w-full px-4 py-3 bg-gray-800 text-white font-semibold hover:bg-gray-900 transition-colors disabled:bg-gray-500"
            disabled={saving || !analysis}
          >
            {saving ? 'Saving...' : 'Save Final Report'}
          </button>
        </div>
      </div>
    </div>
  );
}