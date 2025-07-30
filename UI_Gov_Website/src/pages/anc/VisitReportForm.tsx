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
  const [analyzeForm, setAnalyzeForm] = useState<any>({ symptoms: [], conditions: [] });
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
  
  // Loading states for the three sections
  const [analyzeLoading, setAnalyzeLoading] = useState(false);
  const [pregRiskLoading, setPregRiskLoading] = useState(false);
  const [fetalRiskLoading, setFetalRiskLoading] = useState(false);

  const visits = patient && patient.visits ? patient.visits : [];

  // Check if report already exists for this visit
  React.useEffect(() => {
    // Replace with your API call to fetch report for this visit
    async function fetchReport() {
      // Example: const existingReport = await getReportByVisitId(visit._id);
      // If you have a report, set it
      // setReport(existingReport);
    }
    fetchReport();
  }, [visit._id]);

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

    const handleAddSymptom = (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
    if (
      (e as React.KeyboardEvent).key === 'Enter' || (e as React.MouseEvent).type === 'click'
    ) {
      const value = symptomInput.trim();
      if (value && !analyzeForm.symptoms.includes(value)) {
        setAnalyzeForm((prev: any) => ({ ...prev, symptoms: [...(prev.symptoms || []), value] }));
        setSymptomInput('');
      }
    }
  };
  // Remove symptom
  const handleRemoveSymptom = (sym: string) => {
    setAnalyzeForm((prev: any) => ({ ...prev, symptoms: prev.symptoms.filter((s: string) => s !== sym) }));
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

  // Helper function to convert form data to numbers
  const convertFormDataToNumbers = (formData: any, fieldDefinitions: any[]) => {
    const convertedData: any = {};
    
    fieldDefinitions.forEach(field => {
      const value = formData[field.name];
      if (value !== undefined && value !== '') {
        if (field.type === 'number') {
          // Convert to number, handle both integers and floats
          const numValue = field.step ? parseFloat(value) : parseInt(value, 10);
          convertedData[field.name] = isNaN(numValue) ? 0 : numValue;
        } else {
          convertedData[field.name] = value;
        }
      } else {
        // Set default value of 0 for missing numeric fields
        if (field.type === 'number') {
          convertedData[field.name] = 0;
        }
      }
    });
    
    return convertedData;
  };

  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const handleAnalyze = async () => {
    setAnalyzeLoading(true);
    setAnalyzeError(null);
    try {
      const res = await analyzeReport({ data: analyzeForm });
      setAnalysis(res);
    } catch (error) {
      console.error('Analysis error:', error);
      setAnalyzeError('Failed to analyze data. Please try again.');
    } finally {
      setAnalyzeLoading(false);
    }
  };

  const handlePregRisk = async () => {
    setPregRiskLoading(true);
    try {
      // Convert string values to numbers
      const convertedData = convertFormDataToNumbers(pregForm, pregFields);
      console.log('Converted pregnancy data:', convertedData); // Debug log
      
      const res = await predictPregnancyRisk(convertedData);
      setPregRisk(res);
    } catch (error) {
      console.error('Pregnancy risk prediction error:', error);
      alert('Failed to predict pregnancy risk. Please check your input values.');
    } finally {
      setPregRiskLoading(false);
    }
  };

  const handleFetalRisk = async () => {
    setFetalRiskLoading(true);
    try {
      // Convert string values to numbers
      const convertedData = convertFormDataToNumbers(fetalForm, fetalFields);
      console.log('Converted fetal data:', convertedData); // Debug log
      
      const res = await predictFetalRisk(convertedData);
      setFetalRisk(res);
    } catch (error) {
      console.error('Fetal risk prediction error:', error);
      alert('Failed to predict fetal risk. Please check your input values.');
    } finally {
      setFetalRiskLoading(false);
    }
  };

  const handleSaveReport = async () => {
    setSaving(true);
    // Flatten all form fields and include all prediction objects
    console.log(pregRisk);
    const data = {
      analyzeForm,
      pregForm,
      fetalForm,
      analysis,
      pregRisk,
      fetalRisk,
      // Clinical Summary (Priority)
      clinical_summary: analysis?.llm_merged_summary || '',
      // Aggregated recommendations and data
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
      // Additional LLM responses for reference
      detailed_llm_response: analysis?.llm_response || '',
      // Clinical indicators
      clinical_indicators: {
        anemia: analysis?.anemia || false,
        gdm: analysis?.gdm || false,
        thyroid: analysis?.thyroid || false,
      },
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
          if (value && (!newForm.symptoms || !newForm.symptoms.includes(value))) {
            newForm.symptoms = [...(newForm.symptoms || []), value];
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
          if (sym && (!newForm.symptoms || !newForm.symptoms.includes(sym))) {
            newForm.symptoms = [...(newForm.symptoms || []), sym];
          }
        });
      }
      const colonMatch = line.match(/symptoms?:\s*([A-Za-z0-9 ,]+)/i);
      if (colonMatch) {
        const found = colonMatch[1].split(',').map(s => s.trim()).filter(Boolean);
        found.forEach(sym => {
          if (sym && (!newForm.symptoms || !newForm.symptoms.includes(sym))) {
            newForm.symptoms = [...(newForm.symptoms || []), sym];
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
              {/* symptoms Tag Input */}
              <div className="md:col-span-3 mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">symptoms</label>
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
                  {analyzeForm.symptoms?.map((sym: string) => (
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
            <button 
              onClick={handleAnalyze} 
              disabled={analyzeLoading}
              className={`px-4 py-2 text-white rounded flex items-center space-x-2 ${
                analyzeLoading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {analyzeLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <span>Analyze (Rules)</span>
              )}
            </button>
          )}
          {activeTab === 'preg' && (
            <button 
              onClick={handlePregRisk} 
              disabled={pregRiskLoading}
              className={`px-4 py-2 text-white rounded flex items-center space-x-2 ${
                pregRiskLoading 
                  ? 'bg-orange-400 cursor-not-allowed' 
                  : 'bg-orange-600 hover:bg-orange-700'
              }`}
            >
              {pregRiskLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Predicting Pregnancy Risk...</span>
                </>
              ) : (
                <span>Predict Pregnancy Risk</span>
              )}
            </button>
          )}
          {activeTab === 'fetal' && (
            <button 
              onClick={handleFetalRisk} 
              disabled={fetalRiskLoading}
              className={`px-4 py-2 text-white rounded flex items-center space-x-2 ${
                fetalRiskLoading 
                  ? 'bg-green-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {fetalRiskLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Predicting Fetal Risk...</span>
                </>
              ) : (
                <span>Predict Fetal Risk</span>
              )}
            </button>
          )}
        </div>
        {/* Results - Updated Layout with Clinical Summary Priority */}
        <div className="mt-6">
          {analyzeError && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-800 rounded">
              <strong>Error:</strong> {analyzeError}
            </div>
          )}
          
          {/* Analyze Loading State */}
          {analyzeLoading && (
            <div className="mb-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <div className="text-blue-800 font-semibold">Analyzing data and generating recommendations...</div>
              </div>
              <div className="mt-3 text-center text-blue-600 text-sm">Please wait while we process your information</div>
            </div>
          )}
          
          {analysis && (
            <>
              {/* Priority: Clinical Summary at the top */}
              {analysis.llm_merged_summary && (
                <div className="mb-6 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-l-4 border-indigo-500 rounded-lg">
                  <h3 className="text-xl font-bold text-indigo-900 mb-3 flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Clinical Summary & Recommendations
                  </h3>
                  <div className="text-gray-800 leading-relaxed whitespace-pre-line">
                    {analysis.llm_merged_summary}
                  </div>
                </div>
              )}
              {/* ...existing code for recommendations, alerts, dietary, indicators, llm_response... */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Supplement Recommendations */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold mb-3 text-blue-900 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.415-3.414l5-5A2 2 0 009 9.586V5L8 4z" />
                    </svg>
                    Supplement Recommendations
                  </h4>
                  <ul className="space-y-2">
                    {analysis.supplement_recommendations?.map((rec: string, idx: number) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start">
                        <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Alerts */}
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold mb-3 text-red-900 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    Clinical Alerts
                  </h4>
                  <ul className="space-y-2">
                    {analysis.alerts?.map((alert: string, idx: number) => (
                      <li key={idx} className="text-sm text-red-700 flex items-start">
                        <span className="inline-block w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {alert}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Dietary Recommendations */}
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold mb-3 text-green-900 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Dietary Recommendations
                  </h4>
                  <ul className="space-y-2">
                    {analysis.dietary_recommendations?.map((diet: string, idx: number) => (
                      <li key={idx} className="text-sm text-green-700 flex items-start">
                        <span className="inline-block w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {diet}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {/* Clinical Indicators */}
              {(analysis.anemia || analysis.gdm || analysis.thyroid) && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold mb-3 text-yellow-900 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Clinical Indicators Detected
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {analysis.anemia && (
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                        Anemia Detected
                      </span>
                    )}
                    {analysis.gdm && (
                      <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                        GDM Risk
                      </span>
                    )}
                    {analysis.thyroid && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                        Thyroid Issues
                      </span>
                    )}
                  </div>
                </div>
              )}
              {/* Detailed LLM Response (Collapsible) */}
              {analysis.llm_response && (
                <div className="mt-6">
                  <details className="bg-gray-50 border border-gray-200 rounded-lg">
                    <summary className="cursor-pointer p-4 font-semibold text-gray-700 hover:bg-gray-100 transition-colors">
                      View Detailed Clinical Analysis
                    </summary>
                    <div className="p-4 border-t border-gray-200">
                      <pre className="text-sm bg-white p-3 rounded border whitespace-pre-wrap text-gray-800">
                        {analysis.llm_response}
                      </pre>
                    </div>
                  </details>
                </div>
              )}
            </>
          )}
          
          {/* Pregnancy Risk Loading State */}
          {pregRiskLoading && (
            <div className="mt-6 p-6 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                <div className="text-orange-800 font-semibold">Analyzing pregnancy risk factors...</div>
              </div>
              <div className="mt-3 text-center text-orange-600 text-sm">Please wait while we predict pregnancy risk</div>
            </div>
          )}
          
          {/* Pregnancy Risk Results */}
          {pregRisk && !pregRiskLoading && (
            <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="font-semibold mb-3 text-orange-900 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Pregnancy Risk Prediction
              </h4>
              <pre className="text-sm bg-white p-3 rounded border whitespace-pre-wrap">{JSON.stringify(pregRisk, null, 2)}</pre>
            </div>
          )}
          
          {/* Fetal Risk Loading State */}
          {fetalRiskLoading && (
            <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <div className="text-green-800 font-semibold">Analyzing fetal health parameters...</div>
              </div>
              <div className="mt-3 text-center text-green-600 text-sm">Please wait while we predict fetal risk</div>
            </div>
          )}
          
          {/* Fetal Risk Results */}
          {fetalRisk && !fetalRiskLoading && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold mb-3 text-green-900 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Fetal Risk Prediction
              </h4>
              <pre className="text-sm bg-white p-3 rounded border whitespace-pre-wrap">{JSON.stringify(fetalRisk, null, 2)}</pre>
            </div>
          )}
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleSaveReport}
            className="w-full px-4 py-3 bg-gray-800 text-white font-semibold hover:bg-gray-900 transition-colors disabled:bg-gray-500 rounded-lg"
            disabled={saving || !analysis}
          >
            {saving ? 'Saving...' : 'Save Final Report'}
          </button>
        </div>
      </div>
    </div>
  );
}