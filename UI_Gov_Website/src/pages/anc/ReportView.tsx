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

const AlertCard = ({ alerts }: { alerts: string[] }) => (
  <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
    <div className="flex">
      <div className="flex-shrink-0">
        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="ml-3">
        <h4 className="text-sm font-semibold text-red-800">Critical Alerts</h4>
        <ul className="mt-2 text-sm text-red-700 space-y-1">
          {alerts.map((alert, idx) => (
            <li key={idx} className="flex items-start">
              <span className="mr-2">•</span>
              {alert}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const RecommendationCard = ({ recommendations, title, bgColor, borderColor, textColor, icon }: {
  recommendations: string[],
  title: string,
  bgColor: string,
  borderColor: string,
  textColor: string,
  icon: React.ReactNode
}) => (
  <div className={`${bgColor} border-l-4 ${borderColor} p-4 rounded-lg`}>
    <div className="flex">
      <div className="flex-shrink-0">
        {icon}
      </div>
      <div className="ml-3">
        <h4 className={`text-sm font-semibold ${textColor}`}>{title}</h4>
        <ul className={`mt-2 text-sm ${textColor} space-y-1`}>
          {recommendations.map((rec, idx) => (
            <li key={idx} className="flex items-start">
              <span className="mr-2">•</span>
              {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const RiskSummaryCard = ({ title, riskClass, probabilities, type }: {
  title: string,
  riskClass: number | undefined,
  probabilities: any,
  type: 'pregnancy' | 'fetal'
}) => {
  let riskLevel, riskColor, bgGradient;
  
  if (type === 'pregnancy') {
    switch(riskClass) {
      case 0:
        riskLevel = "Low Risk";
        riskColor = "text-green-700";
        bgGradient = "bg-gradient-to-r from-green-100 to-green-50";
        break;
      case 1:
        riskLevel = "Medium Risk";
        riskColor = "text-yellow-700";
        bgGradient = "bg-gradient-to-r from-yellow-100 to-yellow-50";
        break;
      case 2:
        riskLevel = "High Risk";
        riskColor = "text-red-700";
        bgGradient = "bg-gradient-to-r from-red-100 to-red-50";
        break;
      default:
        riskLevel = "Unknown";
        riskColor = "text-gray-700";
        bgGradient = "bg-gradient-to-r from-gray-100 to-gray-50";
    }
  } else {
    switch(riskClass) {
      case 0:
        riskLevel = "Normal";
        riskColor = "text-green-700";
        bgGradient = "bg-gradient-to-r from-green-100 to-green-50";
        break;
      case 1:
        riskLevel = "Suspect";
        riskColor = "text-yellow-700";
        bgGradient = "bg-gradient-to-r from-yellow-100 to-yellow-50";
        break;
      case 2:
        riskLevel = "Pathological";
        riskColor = "text-red-700";
        bgGradient = "bg-gradient-to-r from-red-100 to-red-50";
        break;
      default:
        riskLevel = "Unknown";
        riskColor = "text-gray-700";
        bgGradient = "bg-gradient-to-r from-gray-100 to-gray-50";
    }
  }

  return (
    <div className={`p-4 rounded-lg border-2 border-opacity-50 ${bgGradient}`}>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-gray-800 mb-1">{title}</h4>
          <p className={`text-lg font-bold ${riskColor}`}>
            {riskClass !== undefined ? `${riskLevel}` : 'N/A'}
          </p>
          <p className={`text-sm ${riskColor} opacity-75`}>
            {riskClass !== undefined ? `Class ${riskClass}` : 'Unknown'}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${riskColor} ${bgGradient.replace('100', '200').replace('50', '100')}`}>
          {riskClass !== undefined ? riskClass : '?'}
        </div>
      </div>
    </div>
  );
};

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

            {/* Risk Assessment Summary */}
            <Section title="Risk Assessment Summary">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RiskSummaryCard
                  title="Pregnancy Risk"
                  riskClass={data.pregRisk?.EnsemblePrediction}
                  probabilities={data.pregRisk?.Probabilities}
                  type="pregnancy"
                />
                <RiskSummaryCard
                  title="Fetal Risk"
                  riskClass={data.fetalRisk?.EnsemblePrediction}
                  probabilities={data.fetalRisk?.Probabilities}
                  type="fetal"
                />
              </div>
            </Section>

            {/* Alerts Section in Summary */}
            {data.alerts && data.alerts.length > 0 && (
              <Section title="Critical Alerts">
                <AlertCard alerts={data.alerts} />
              </Section>
            )}

            {/* Clinical Recommendations in Summary */}
            {data.recommendations && data.recommendations.length > 0 && (
              <Section title="Clinical Recommendations">
                <RecommendationCard
                  recommendations={data.recommendations}
                  title="Supplement & Treatment Recommendations"
                  bgColor="bg-blue-50"
                  borderColor="border-blue-400"
                  textColor="text-blue-800"
                  icon={
                    <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  }
                />
              </Section>
            )}

            {/* Dietary Recommendations in Summary */}
            {data.dietary_recommendations && data.dietary_recommendations.length > 0 && (
              <Section title="Dietary Recommendations">
                <RecommendationCard
                  recommendations={data.dietary_recommendations}
                  title="Nutritional Guidelines"
                  bgColor="bg-green-50"
                  borderColor="border-green-400"
                  textColor="text-green-800"
                  icon={
                    <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  }
                />
              </Section>
            )}
            
            {data.llm_merged_summary && (
              <Section title="Clinical Summary">
                <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
                  <div className="whitespace-pre-line text-blue-900 leading-relaxed">
                    {data.llm_merged_summary}
                  </div>
                </div>
              </Section>
            )}
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
          <div className="space-y-6">
            {/* Alerts Section */}
            {data.alerts && data.alerts.length > 0 && (
              <Section title="Critical Alerts">
                <AlertCard alerts={data.alerts} />
              </Section>
            )}

            {/* Clinical Recommendations */}
            {data.recommendations && data.recommendations.length > 0 && (
              <Section title="Clinical Recommendations">
                <RecommendationCard
                  recommendations={data.recommendations}
                  title="Supplement & Treatment Recommendations"
                  bgColor="bg-blue-50"
                  borderColor="border-blue-400"
                  textColor="text-blue-800"
                  icon={
                    <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  }
                />
              </Section>
            )}

            {/* Dietary Recommendations */}
            {data.dietary_recommendations && data.dietary_recommendations.length > 0 && (
              <Section title="Dietary Recommendations">
                <RecommendationCard
                  recommendations={data.dietary_recommendations}
                  title="Nutritional Guidelines"
                  bgColor="bg-green-50"
                  borderColor="border-green-400"
                  textColor="text-green-800"
                  icon={
                    <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  }
                />
              </Section>
            )}

            {/* Pregnancy Risk Prediction */}
            <Section title="Pregnancy Risk Assessment">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                <h4 className="font-semibold mb-4 text-purple-800 text-lg">AI-Based Risk Classification</h4>
                {(() => {
                  const riskClass = data.pregRisk?.EnsemblePrediction;
                  let riskLevel, riskColor, riskInfo, bgGradient;
                  
                  switch(riskClass) {
                    case 0:
                      riskLevel = "Low Risk";
                      riskColor = "text-green-700";
                      bgGradient = "bg-gradient-to-r from-green-100 to-green-50";
                      riskInfo = "This indicates a low-risk pregnancy with minimal complications expected. Continue with routine antenatal care and follow standard monitoring protocols.";
                      break;
                    case 1:
                      riskLevel = "Medium Risk";
                      riskColor = "text-yellow-700";
                      bgGradient = "bg-gradient-to-r from-yellow-100 to-yellow-50";
                      riskInfo = "This indicates moderate risk factors are present. Enhanced monitoring may be required with more frequent check-ups and additional screening tests.";
                      break;
                    case 2:
                      riskLevel = "High Risk";
                      riskColor = "text-red-700";
                      bgGradient = "bg-gradient-to-r from-red-100 to-red-50";
                      riskInfo = "This indicates a high-risk pregnancy requiring immediate attention and specialized care. Consider referral to a specialist and implement intensive monitoring protocols.";
                      break;
                    default:
                      riskLevel = "Unknown";
                      riskColor = "text-gray-700";
                      bgGradient = "bg-gradient-to-r from-gray-100 to-gray-50";
                      riskInfo = "Risk classification unavailable.";
                  }
                  
                  return (
                    <div>
                      <div className={`p-4 rounded-lg border-2 border-opacity-50 mb-4 ${bgGradient}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`text-lg font-bold ${riskColor}`}>
                              Risk Level: {riskClass !== undefined ? `${riskLevel}` : 'N/A'}
                            </p>
                            <p className={`text-sm ${riskColor} opacity-75`}>
                              Classification: {riskClass !== undefined ? `Class ${riskClass}` : 'Unknown'}
                            </p>
                          </div>
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${riskColor} ${bgGradient.replace('from-', 'from-').replace('to-', 'to-').replace('100', '200').replace('50', '100')}`}>
                            {riskClass !== undefined ? riskClass : '?'}
                          </div>
                        </div>
                        <p className={`mt-3 text-sm ${riskColor} leading-relaxed`}>{riskInfo}</p>
                      </div>
                    </div>
                  );
                })()}
                
                {data.pregRisk?.Probabilities && (
                  <div className="mt-4">
                    <h5 className="font-medium mb-3 text-purple-800">Risk Probabilities:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="bg-gradient-to-br from-green-100 to-green-50 p-3 rounded-lg border border-green-200">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-700">
                            {(data.pregRisk.Probabilities.Class_0 * 100).toFixed(1)}%
                          </div>
                          <div className="text-sm text-green-600 font-medium">Low Risk</div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 p-3 rounded-lg border border-yellow-200">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-700">
                            {(data.pregRisk.Probabilities.Class_1 * 100).toFixed(1)}%
                          </div>
                          <div className="text-sm text-yellow-600 font-medium">Medium Risk</div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-red-100 to-red-50 p-3 rounded-lg border border-red-200">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-700">
                            {(data.pregRisk.Probabilities.Class_2 * 100).toFixed(1)}%
                          </div>
                          <div className="text-sm text-red-600 font-medium">High Risk</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Section>

            {/* Fetal Risk Prediction */}
            <Section title="Fetal Risk Assessment">
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg border border-indigo-200">
                <h4 className="font-semibold mb-4 text-indigo-800 text-lg">Fetal Heart Rate Analysis</h4>
                {(() => {
                  const riskClass = data.fetalRisk?.EnsemblePrediction;
                  let riskLevel, riskColor, riskInfo, bgGradient;
                  
                  switch(riskClass) {
                    case 0:
                      riskLevel = "Normal";
                      riskColor = "text-green-700";
                      bgGradient = "bg-gradient-to-r from-green-100 to-green-50";
                      riskInfo = "Fetal heart rate patterns are normal. Continue with routine monitoring and standard care protocols.";
                      break;
                    case 1:
                      riskLevel = "Suspect";
                      riskColor = "text-yellow-700";
                      bgGradient = "bg-gradient-to-r from-yellow-100 to-yellow-50";
                      riskInfo = "Some concerning fetal heart rate patterns detected. Increased monitoring is recommended with closer observation and possible additional tests.";
                      break;
                    case 2:
                      riskLevel = "Pathological";
                      riskColor = "text-red-700";
                      bgGradient = "bg-gradient-to-r from-red-100 to-red-50";
                      riskInfo = "Abnormal fetal heart rate patterns indicating potential fetal distress. Immediate medical evaluation and intervention may be required.";
                      break;
                    default:
                      riskLevel = "Unknown";
                      riskColor = "text-gray-700";
                      bgGradient = "bg-gradient-to-r from-gray-100 to-gray-50";
                      riskInfo = "Fetal risk classification unavailable.";
                  }
                  
                  return (
                    <div>
                      <div className={`p-4 rounded-lg border-2 border-opacity-50 mb-4 ${bgGradient}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`text-lg font-bold ${riskColor}`}>
                              Status: {riskClass !== undefined ? `${riskLevel}` : 'N/A'}
                            </p>
                            <p className={`text-sm ${riskColor} opacity-75`}>
                              Classification: {riskClass !== undefined ? `Class ${riskClass}` : 'Unknown'}
                            </p>
                          </div>
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${riskColor} ${bgGradient.replace('from-', 'from-').replace('to-', 'to-').replace('100', '200').replace('50', '100')}`}>
                            {riskClass !== undefined ? riskClass : '?'}
                          </div>
                        </div>
                        <p className={`mt-3 text-sm ${riskColor} leading-relaxed`}>{riskInfo}</p>
                      </div>
                    </div>
                  );
                })()}
                
                {data.fetalRisk?.Probabilities && (
                  <div className="mt-4">
                    <h5 className="font-medium mb-3 text-indigo-800">Classification Probabilities:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="bg-gradient-to-br from-green-100 to-green-50 p-3 rounded-lg border border-green-200">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-700">
                            {(data.fetalRisk.Probabilities.Class_0 * 100).toFixed(1)}%
                          </div>
                          <div className="text-sm text-green-600 font-medium">Normal</div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 p-3 rounded-lg border border-yellow-200">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-700">
                            {(data.fetalRisk.Probabilities.Class_1 * 100).toFixed(1)}%
                          </div>
                          <div className="text-sm text-yellow-600 font-medium">Suspect</div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-red-100 to-red-50 p-3 rounded-lg border border-red-200">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-700">
                            {(data.fetalRisk.Probabilities.Class_2 * 100).toFixed(1)}%
                          </div>
                          <div className="text-sm text-red-600 font-medium">Pathological</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Section>

            {/* Rules-based Analysis */}
            {data.analysis && (
              <Section title="Clinical Analysis">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold mb-2 text-gray-800">Additional Clinical Indicators</h4>
                  <KeyValueGrid data={data.analysis} />
                </div>
              </Section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}