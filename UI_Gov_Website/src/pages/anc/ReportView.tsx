import React, { useState } from 'react';

interface ReportViewProps {
  report: any;
  onBack: () => void;
}

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold text-gray-700 border-b-2 border-blue-200 pb-2 mb-3">{title}</h3>
    {children}
  </div>
);

const TabButton = ({ active, onClick, children }: { active: boolean, onClick: () => void, children: React.ReactNode }) => (
  <button
    className={`px-4 py-2 font-semibold border-b-2 transition-colors focus:outline-none ${active ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-transparent text-gray-500 hover:text-blue-700'}`}
    onClick={onClick}
  >
    {children}
  </button>
);

const KeyValueGrid = ({ data }: { data: any }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
    {Object.entries(data || {}).map(([key, value]) => (
      <div key={key} className="flex">
        <span className="font-semibold mr-2 capitalize">{key.replace(/_/g, ' ')}:</span>
        <span>{typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value || 'N/A')}</span>
      </div>
    ))}
  </div>
);

export default function ReportView({ report, onBack }: ReportViewProps) {
  const [activeTab, setActiveTab] = useState('summary');
  
  // Handle nested report structure - check if report.report exists (your data structure)
  const actualReport = report.report || report;
  const data = actualReport.data || {};
  const patient = data.patientDetails || {};
  const visit = data.visitDetails || {};

  // Helper to safely render arrays or single string/null
  const renderList = (data: any, emptyMsg: string) => {
    if (Array.isArray(data)) {
      if (data.length === 0) return <li>{emptyMsg}</li>;
      return data.map((item: string, idx: number) => <li key={idx}>{item}</li>);
    }
    if (typeof data === 'string' && data) return <li>{data}</li>;
    return <li>{emptyMsg}</li>;
  };

  return (
    <div>
      <button onClick={onBack} className="mb-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">
        &larr; Back to Reports
      </button>
      <div className="bg-white p-8 shadow-2xl rounded-lg">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">ANC Visit Report</h2>
        {/* Tabs */}
        <div className="flex border-b mb-8 overflow-x-auto">
          <TabButton active={activeTab === 'summary'} onClick={() => setActiveTab('summary')}>Summary</TabButton>
          <TabButton active={activeTab === 'patient'} onClick={() => setActiveTab('patient')}>Patient Details</TabButton>
          <TabButton active={activeTab === 'visit'} onClick={() => setActiveTab('visit')}>Visit Details</TabButton>
          <TabButton active={activeTab === 'analyze'} onClick={() => setActiveTab('analyze')}>Analyze Form</TabButton>
          <TabButton active={activeTab === 'preg'} onClick={() => setActiveTab('preg')}>Pregnancy Risk Form</TabButton>
          <TabButton active={activeTab === 'fetal'} onClick={() => setActiveTab('fetal')}>Fetal Risk Form</TabButton>
          <TabButton active={activeTab === 'predictions'} onClick={() => setActiveTab('predictions')}>Predictions & Recommendations</TabButton>
          <TabButton active={activeTab === 'raw'} onClick={() => setActiveTab('raw')}>Raw Data</TabButton>
        </div>
        {/* Tab Content */}
        {activeTab === 'summary' && (
          <div>
            <Section title="Key Summary">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p><strong>Patient Name:</strong> {patient.personal?.name || 'N/A'}</p>
                  <p><strong>Pregnancy ID:</strong> {actualReport.pregnancyId || 'N/A'}</p>
                  <p><strong>Visit Number:</strong> {visit.visitNumber || 'N/A'}</p>
                  <p><strong>Date:</strong> {visit.scheduledDate ? new Date(visit.scheduledDate).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <p><strong>Gestational Age:</strong> {data.analyzeForm?.gestational_age_weeks || 'N/A'} weeks</p>
                  <p><strong>BMI:</strong> {data.analyzeForm?.bmi || 'N/A'}</p>
                  <p><strong>Hemoglobin (1st):</strong> {data.analyzeForm?.hb_1st || 'N/A'} g/dl</p>
                  <p><strong>Blood Pressure:</strong> {data.analyzeForm?.sbp || 'N/A'}/{data.analyzeForm?.dbp || 'N/A'} mmHg</p>
                </div>
              </div>
            </Section>
            <Section title="Alerts & Recommendations">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-red-600 mb-2">Alerts</h4>
                  <ul className="list-disc ml-5 space-y-1 text-red-700">
                    {renderList(data.alerts, 'No alerts.')}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-600 mb-2">Supplement Recommendations</h4>
                  <ul className="list-disc ml-5 space-y-1 text-gray-700">
                    {renderList(data.recommendations, 'No specific supplement recommendations.')}
                  </ul>
                </div>
                <div className="md:col-span-2">
                  <h4 className="font-semibold text-green-600 mb-2">Dietary Recommendations</h4>
                  <ul className="list-disc ml-5 space-y-1 text-gray-700">
                    {renderList(data.dietary_recommendations, 'Follow a standard balanced diet.')}
                  </ul>
                </div>
              </div>
            </Section>
          </div>
        )}
        {activeTab === 'patient' && (
          <Section title="Patient Details">
            <div className="space-y-6">
              <Section title="Personal Information">
                <KeyValueGrid data={patient.personal} />
              </Section>
              <Section title="Obstetric History">
                <KeyValueGrid data={patient.obstetricHistory} />
              </Section>
              <Section title="Menstrual History">
                <KeyValueGrid data={patient.menstrualHistory} />
              </Section>
              <Section title="Medical History">
                <KeyValueGrid data={patient.medicalHistory} />
              </Section>
              <Section title="Family History">
                <KeyValueGrid data={patient.familyHistory} />
              </Section>
              <Section title="Obstetric Risk Factors">
                <KeyValueGrid data={patient.obstetricRiskFactors} />
              </Section>
              <Section title="Immunization History">
                <KeyValueGrid data={patient.immunizationHistory} />
              </Section>
              <Section title="Diet & Nutrition">
                <KeyValueGrid data={patient.dietAndNutrition} />
              </Section>
              <Section title="Lifestyle">
                <KeyValueGrid data={patient.lifestyle} />
              </Section>
              <Section title="Environment">
                <KeyValueGrid data={patient.environment} />
              </Section>
              <Section title="Contraceptive History">
                <KeyValueGrid data={patient.contraceptiveHistory} />
              </Section>
              <Section title="Other Information">
                <KeyValueGrid data={patient.other} />
              </Section>
            </div>
          </Section>
        )}
        {activeTab === 'visit' && (
          <Section title="Visit Details">
            <KeyValueGrid data={visit} />
          </Section>
        )}
        {activeTab === 'analyze' && (
          <Section title="Analyze Form Data">
            <KeyValueGrid data={data.analyzeForm} />
          </Section>
        )}
        {activeTab === 'preg' && (
          <Section title="Pregnancy Risk Form Data">
            <KeyValueGrid data={data.pregForm} />
          </Section>
        )}
        {activeTab === 'fetal' && (
          <Section title="Fetal Risk Form Data">
            <KeyValueGrid data={data.fetalForm} />
          </Section>
        )}
        {activeTab === 'predictions' && (
          <div>
            <Section title="Rules-based Analysis">
              <KeyValueGrid data={data.analysis} />
            </Section>
            <Section title="Pregnancy Risk Prediction">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Risk Classification</h4>
                {(() => {
                  const riskClass = data.pregRisk?.EnsemblePrediction;
                  let riskLevel, riskColor, riskInfo;
                  
                  switch(riskClass) {
                    case 0:
                      riskLevel = "Low Risk";
                      riskColor = "text-green-600 bg-green-50 border-green-200";
                      riskInfo = "This indicates a low-risk pregnancy with minimal complications expected. Continue with routine antenatal care and follow standard monitoring protocols.";
                      break;
                    case 1:
                      riskLevel = "Medium Risk";
                      riskColor = "text-yellow-600 bg-yellow-50 border-yellow-200";
                      riskInfo = "This indicates moderate risk factors are present. Enhanced monitoring may be required with more frequent check-ups and additional screening tests.";
                      break;
                    case 2:
                      riskLevel = "High Risk";
                      riskColor = "text-red-600 bg-red-50 border-red-200";
                      riskInfo = "This indicates a high-risk pregnancy requiring immediate attention and specialized care. Consider referral to a specialist and implement intensive monitoring protocols.";
                      break;
                    default:
                      riskLevel = "Unknown";
                      riskColor = "text-gray-600 bg-gray-50 border-gray-200";
                      riskInfo = "Risk classification unavailable.";
                  }
                  
                  return (
                    <div>
                      <div className={`p-3 rounded-lg border mb-3 ${riskColor}`}>
                        <p><strong>Predicted Class:</strong> {riskClass !== undefined ? `${riskLevel} (${riskClass})` : 'N/A'}</p>
                        <p className="mt-2 text-sm">{riskInfo}</p>
                      </div>
                    </div>
                  );
                })()}
                <div className="mt-3">
                  <h5 className="font-medium mb-1">Probabilities:</h5>
                  {data.pregRisk?.Probabilities && (
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="p-2 bg-green-100 rounded">Low Risk (0): {(data.pregRisk.Probabilities.Class_0 * 100).toFixed(1)}%</div>
                      <div className="p-2 bg-yellow-100 rounded">Medium Risk (1): {(data.pregRisk.Probabilities.Class_1 * 100).toFixed(1)}%</div>
                      <div className="p-2 bg-red-100 rounded">High Risk (2): {(data.pregRisk.Probabilities.Class_2 * 100).toFixed(1)}%</div>
                    </div>
                  )}
                </div>
              </div>
            </Section>
            <Section title="Fetal Risk Prediction">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Risk Classification</h4>
                {(() => {
                  const riskClass = data.fetalRisk?.EnsemblePrediction;
                  let riskLevel, riskColor, riskInfo;
                  
                  switch(riskClass) {
                    case 0:
                      riskLevel = "Normal";
                      riskColor = "text-green-600 bg-green-50 border-green-200";
                      riskInfo = "Fetal heart rate patterns are normal. Continue with routine monitoring and standard care protocols.";
                      break;
                    case 1:
                      riskLevel = "Suspect";
                      riskColor = "text-yellow-600 bg-yellow-50 border-yellow-200";
                      riskInfo = "Some concerning fetal heart rate patterns detected. Increased monitoring is recommended with closer observation and possible additional tests.";
                      break;
                    case 2:
                      riskLevel = "Pathological";
                      riskColor = "text-red-600 bg-red-50 border-red-200";
                      riskInfo = "Abnormal fetal heart rate patterns indicating potential fetal distress. Immediate medical evaluation and intervention may be required.";
                      break;
                    default:
                      riskLevel = "Unknown";
                      riskColor = "text-gray-600 bg-gray-50 border-gray-200";
                      riskInfo = "Fetal risk classification unavailable.";
                  }
                  
                  return (
                    <div>
                      <div className={`p-3 rounded-lg border mb-3 ${riskColor}`}>
                        <p><strong>Predicted Class:</strong> {riskClass !== undefined ? `${riskLevel} (${riskClass})` : 'N/A'}</p>
                        <p className="mt-2 text-sm">{riskInfo}</p>
                      </div>
                    </div>
                  );
                })()}
                <div className="mt-3">
                  <h5 className="font-medium mb-1">Probabilities:</h5>
                  {data.fetalRisk?.Probabilities && (
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="p-2 bg-green-100 rounded">Normal (0): {(data.fetalRisk.Probabilities.Class_0 * 100).toFixed(1)}%</div>
                      <div className="p-2 bg-yellow-100 rounded">Suspect (1): {(data.fetalRisk.Probabilities.Class_1 * 100).toFixed(1)}%</div>
                      <div className="p-2 bg-red-100 rounded">Pathological (2): {(data.fetalRisk.Probabilities.Class_2 * 100).toFixed(1)}%</div>
                    </div>
                  )}
                </div>
              </div>
            </Section>
          </div>
        )}
        {activeTab === 'raw' && (
          <Section title="Raw Report Data (Debug)">
            <pre className="bg-gray-100 p-4 text-xs overflow-x-auto whitespace-pre-wrap">{JSON.stringify(report, null, 2)}</pre>
          </Section>
        )}
      </div>
    </div>
  );
}