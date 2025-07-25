import React, { useState } from 'react';
import { createReport, analyzeReport, predictPregnancyRisk, predictFetalRisk, markAncVisit } from '../../api';
import ReportView from './ReportView';
import { useNavigate } from 'react-router-dom';
import Tesseract from 'tesseract.js';

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
  { name: 'proteinuria', label: 'Proteinuria', type: 'text' }, // changed from number to text
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
  const [ocrFile, setOcrFile] = useState<File | null>(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState<string | null>(null);
  const [symptomInput, setSymptomInput] = useState('');
  const [conditionInput, setConditionInput] = useState('');

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

  // Add symptom
  const handleAddSymptom = (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
    if (
      (e as React.KeyboardEvent).key === 'Enter' || (e as React.MouseEvent).type === 'click'
    ) {
      const value = symptomInput.trim();
      if (value && !analyzeForm.sysmptoms.includes(value)) {
        setAnalyzeForm((prev: any) => ({ ...prev, sysmptoms: [...(prev.sysmptoms || []), value] }));
        setSymptomInput('');
      }
    }
  };
  // Remove symptom
  const handleRemoveSymptom = (sym: string) => {
    setAnalyzeForm((prev: any) => ({ ...prev, sysmptoms: prev.sysmptoms.filter((s: string) => s !== sym) }));
  };
  // Add condition
  const handleAddCondition = (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
    if (
      (e as React.KeyboardEvent).key === 'Enter' || (e as React.MouseEvent).type === 'click'
    ) {
      const value = conditionInput.trim();
      if (value && !analyzeForm.conditions.includes(value)) {
        setAnalyzeForm((prev: any) => ({ ...prev, conditions: [...(prev.conditions || []), value] }));
        setConditionInput('');
      }
    }
  };
  // Remove condition
  const handleRemoveCondition = (cond: string) => {
    setAnalyzeForm((prev: any) => ({ ...prev, conditions: prev.conditions.filter((c: string) => c !== cond) }));
  };

  // Sanitize analyzeForm before sending to backend
  const sanitizeAnalyzeForm = (form: any) => {
    const sanitized: any = {};
    for (const key in form) {
      if (Array.isArray(form[key])) {
        sanitized[key] = form[key];
      } else if (form[key] === '' || form[key] == null) {
        // skip
      } else if (key === 'proteinuria') {
        if (typeof form[key] === 'string') {
          const plusMatch = form[key].match(/^\s*([+]{1,3})\s*$/);
          if (plusMatch) {
            sanitized[key] = plusMatch[1].length;
          } else if (!isNaN(form[key])) {
            sanitized[key] = Number(form[key]);
          }
          // else skip if not a valid number or +++
        } else if (typeof form[key] === 'number') {
          sanitized[key] = form[key];
        }
        // else skip
      } else if (
        typeof form[key] === 'string' &&
        !isNaN(form[key]) &&
        form[key].trim() !== ''
      ) {
        sanitized[key] = Number(form[key]);
      } else {
        sanitized[key] = form[key];
      }
    }
    return sanitized;
  };

  // Prediction handlers
  const handleAnalyze = async () => {
    const sanitized = sanitizeAnalyzeForm(analyzeForm);
    console.log('Sending to backend:', sanitized); // <-- Add this line
    const res = await analyzeReport({ data: sanitized });
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

  // Helper: Map possible OCR field names to form field names (with regex for variants)
  const ocrFieldRegexMap: Array<{ regex: RegExp, field: string, valueType?: 'number' | 'string' | 'bool' }> = [
    { regex: /hemoglobin\s*\(1st.*?\)/i, field: 'hb_1st', valueType: 'number' },
    { regex: /hemoglobin\s*\(2nd.*?\)/i, field: 'hb_2nd', valueType: 'number' },
    { regex: /hemoglobin\s*\(3rd.*?\)/i, field: 'hb_3rd', valueType: 'number' },
    { regex: /hemoglobin(?!.*\(.*?\))/i, field: 'hb_1st', valueType: 'number' }, // fallback
    { regex: /serum ferritin/i, field: 'ferritin', valueType: 'number' },
    { regex: /transferrin saturation.*tsat/i, field: 'tsat', valueType: 'number' },
    { regex: /tsat/i, field: 'tsat', valueType: 'number' },
    { regex: /systolic bp/i, field: 'sbp', valueType: 'number' },
    { regex: /diastolic bp/i, field: 'dbp', valueType: 'number' },
    { regex: /proteinuria/i, field: 'proteinuria', valueType: 'string' },
    { regex: /ogtt.*fasting/i, field: 'ogtt_f', valueType: 'number' },
    { regex: /ogtt.*1 ?hour/i, field: 'ogtt_1h', valueType: 'number' },
    { regex: /ogtt.*2 ?hour/i, field: 'ogtt_2h', valueType: 'number' },
    { regex: /tsh.*1st.*trimester/i, field: 'tsh_1', valueType: 'number' },
    { regex: /tsh.*2nd.*trimester/i, field: 'tsh_2', valueType: 'number' },
    { regex: /tsh.*3rd.*trimester/i, field: 'tsh_3', valueType: 'number' },
    { regex: /free t4.*ft4/i, field: 'ft4', valueType: 'number' },
    { regex: /tpo antibodies/i, field: 'tpo_ab', valueType: 'bool' },
    { regex: /gestational age/i, field: 'gestational_age_weeks', valueType: 'number' },
    { regex: /bmi/i, field: 'bmi', valueType: 'number' },
    { regex: /pre-pregnancy weight/i, field: 'pre_pregnancy_weight', valueType: 'number' },
    { regex: /current weight/i, field: 'current_weight', valueType: 'number' },
    // Add more as needed
  ];

  // Helper: Extract value from a line (number, 'Positive', 'Negative', '+++', etc.)
  function extractOcrValue(line: string, valueType: 'number' | 'string' | 'bool' = 'number') {
    if (valueType === 'bool') {
      if (/positive/i.test(line)) return true;
      if (/negative/i.test(line)) return false;
      return undefined;
    }
    if (valueType === 'string') {
      // For proteinuria, extract +++ or similar
      const plusMatch = line.match(/([+]{1,3}|\(\d+\))/);
      if (plusMatch) return plusMatch[1];
      // fallback: return first word after colon
      const colonSplit = line.split(':');
      if (colonSplit.length > 1) return colonSplit[1].split(' ')[1] || colonSplit[1].trim();
      return undefined;
    }
    // Default: extract first number (int or float)
    const numMatch = line.match(/([-+]?[0-9]*\.?[0-9]+)/);
    if (numMatch) return numMatch[1];
    return undefined;
  }

  // Helper: Parse extracted text and map to analyzeForm fields
  function parseOcrTextToForm(text: string) {
    const newForm: any = { ...analyzeForm };
    const lines = text.split(/\n|\r/).map(l => l.trim()).filter(Boolean);
    let currentSection: 'symptoms' | 'conditions' | null = null;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Section headers
      if (/^reported symptoms/i.test(line)) {
        currentSection = 'symptoms';
        continue;
      }
      if (/^clinical impression/i.test(line)) {
        currentSection = 'conditions';
        continue;
      }
      // Bullet points under section
      if (currentSection && /^-\s+(.+)/.test(line)) {
        const value = line.replace(/^-\s+/, '').trim();
        if (currentSection === 'symptoms') {
          if (value && (!newForm.sysmptoms || !newForm.sysmptoms.includes(value))) {
            newForm.sysmptoms = [...(newForm.sysmptoms || []), value];
          }
        } else if (currentSection === 'conditions') {
          if (value && (!newForm.conditions || !newForm.conditions.includes(value))) {
            newForm.conditions = [...(newForm.conditions || []), value];
          }
        }
        continue;
      }
      // Reset section if a blank line or new unrelated section
      if (line === '' || /^[A-Za-z ]+:$/.test(line)) {
        currentSection = null;
      }
      // Field extraction as before
      for (const { regex, field, valueType } of ocrFieldRegexMap) {
        if (regex.test(line)) {
          const value = extractOcrValue(line, valueType);
          if (typeof value !== 'undefined') newForm[field] = value;
        }
      }
    }
    // Also support +, *, and colon-based symptoms/conditions as before
    lines.forEach(line => {
      const plusMatch = line.match(/\+\s*([A-Za-z0-9 ,]+)/);
      if (plusMatch) {
        const found = plusMatch[1].split(',').map(s => s.trim()).filter(Boolean);
        found.forEach(sym => {
          if (sym && (!newForm.sysmptoms || !newForm.sysmptoms.includes(sym))) {
            newForm.sysmptoms = [...(newForm.sysmptoms || []), sym];
          }
        });
      }
      const colonMatch = line.match(/symptoms?:\s*([A-Za-z0-9 ,]+)/i);
      if (colonMatch) {
        const found = colonMatch[1].split(',').map(s => s.trim()).filter(Boolean);
        found.forEach(sym => {
          if (sym && (!newForm.sysmptoms || !newForm.sysmptoms.includes(sym))) {
            newForm.sysmptoms = [...(newForm.sysmptoms || []), sym];
          }
        });
      }
    });
    lines.forEach(line => {
      const starMatch = line.match(/\*\s*([A-Za-z0-9 ,]+)/);
      if (starMatch) {
        const found = starMatch[1].split(',').map(c => c.trim()).filter(Boolean);
        found.forEach(cond => {
          if (cond && (!newForm.conditions || !newForm.conditions.includes(cond))) {
            newForm.conditions = [...(newForm.conditions || []), cond];
          }
        });
      }
      const colonMatch = line.match(/conditions?:\s*([A-Za-z0-9 ,]+)/i);
      if (colonMatch) {
        const found = colonMatch[1].split(',').map(c => c.trim()).filter(Boolean);
        found.forEach(cond => {
          if (cond && (!newForm.conditions || !newForm.conditions.includes(cond))) {
            newForm.conditions = [...(newForm.conditions || []), cond];
          }
        });
      }
    });
    return newForm;
  }

  // OCR handler
  const handleOcrFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOcrError(null);
    setOcrText(null);
    if (e.target.files && e.target.files[0]) {
      setOcrFile(e.target.files[0]);
    }
  };

  const handleOcrExtract = async () => {
    if (!ocrFile) return;
    setOcrLoading(true);
    setOcrError(null);
    setOcrText(null);
    try {
      const { data: { text } } = await Tesseract.recognize(ocrFile, 'eng');
      setOcrText(text);
      // Autofill form
      const newForm = parseOcrTextToForm(text);
      setAnalyzeForm(newForm);
    } catch (err) {
      setOcrError('Failed to extract text. Try a clearer image.');
    } finally {
      setOcrLoading(false);
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
          <>
            {/* OCR Upload Option */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Report for OCR (Image/PDF)</label>
              <input type="file" accept="image/*,.pdf" onChange={handleOcrFileChange} />
              <button
                type="button"
                className="ml-2 px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-400"
                onClick={handleOcrExtract}
                disabled={!ocrFile || ocrLoading}
              >
                {ocrLoading ? 'Extracting...' : 'Extract & Autofill'}
              </button>
              {ocrError && <div className="text-red-600 mt-1">{ocrError}</div>}
              {ocrText && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-blue-700">Show Extracted Text</summary>
                  <pre className="bg-gray-100 p-2 text-xs whitespace-pre-wrap">{ocrText}</pre>
                </details>
              )}
              <div className="my-4 text-center font-semibold text-gray-500">OR</div>
            </div>
            {/* Manual Form Entry */}
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
              {/* Symptoms Tag Input */}
              <div className="md:col-span-3 mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={symptomInput}
                    onChange={e => setSymptomInput(e.target.value)}
                    onKeyDown={handleAddSymptom}
                    placeholder="Type symptom and press Enter"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded"
                  />
                  <button
                    type="button"
                    className="px-3 py-2 bg-blue-500 text-white rounded"
                    onClick={handleAddSymptom}
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analyzeForm.sysmptoms?.map((sym: string) => (
                    <span key={sym} className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {sym}
                      <button
                        type="button"
                        className="ml-2 text-blue-700 hover:text-red-600 font-bold"
                        onClick={() => handleRemoveSymptom(sym)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              {/* Conditions Tag Input */}
              <div className="md:col-span-3 mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Conditions</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={conditionInput}
                    onChange={e => setConditionInput(e.target.value)}
                    onKeyDown={handleAddCondition}
                    placeholder="Type condition and press Enter"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded"
                  />
                  <button
                    type="button"
                    className="px-3 py-2 bg-blue-500 text-white rounded"
                    onClick={handleAddCondition}
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analyzeForm.conditions?.map((cond: string) => (
                    <span key={cond} className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {cond}
                      <button
                        type="button"
                        className="ml-2 text-blue-700 hover:text-red-600 font-bold"
                        onClick={() => handleRemoveCondition(cond)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </>
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