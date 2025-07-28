import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Registration APIs
export const registerPregnancy = async (data) => {
  const res = await axios.post(`${API_BASE_URL}/registration/register`, data);
  return res.data;
};

export const syncRegistrations = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await axios.post(`${API_BASE_URL}/registration/sync`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const getRegistration = async (pregnancyId) => {
  const res = await axios.get(`${API_BASE_URL}/registration/${pregnancyId}`);
  return res.data;
};

export const updateRegistration = async (pregnancyId, data) => {
  const res = await axios.put(`${API_BASE_URL}/registration/${pregnancyId}`, data);
  return res.data;
};

export const updateFcmToken = async (pregnancyId, fcmToken) => {
  const res = await axios.put(`${API_BASE_URL}/registration/${pregnancyId}/fcmtoken`, { fcmToken });
  return res.data;
};

// ANC APIs
export const scheduleAncVisits = async (pregnancyId, data) => {
  const res = await axios.post(`${API_BASE_URL}/anc/schedule/${pregnancyId}`, data);
  return res.data;
};

export const getAncVisits = async (pregnancyId) => {
  const res = await axios.get(`${API_BASE_URL}/anc/visit/${pregnancyId}`);
  return res.data;
};

export const getAncVisitById = async (visitId) => {
  const res = await axios.get(`${API_BASE_URL}/anc/visit/${visitId}`);
  return res.data;
};

export const markAncVisit = async (visitId, data) => {
  const res = await axios.put(`${API_BASE_URL}/anc/visit/${visitId}`, data);
  return res.data;
};

export const getAncAlerts = async () => {
  const res = await axios.get(`${API_BASE_URL}/anc/alerts`);
  return res.data;
};

export const scheduleAdditionalAncVisit = async (pregnancyId, data) => {
  const res = await axios.post(`${API_BASE_URL}/anc/visit/${pregnancyId}/additional`, data);
  return res.data;
};

// Report APIs
export const createReport = async (pregnancyId: string, data: any) => {
  const res = await axios.post(`${API_BASE_URL}/report/createReport`, {
    pregnancyId,
    data
  });
  return res.data;
};

export const getAllReports = async () => {
  const res = await axios.get(`${API_BASE_URL}/report/reports`);
  return res.data;
};

export const getReportById = async (id: string) => {
  const res = await axios.get(`${API_BASE_URL}/report/${id}`);
  return res.data;
};

export const predictPregnancyRisk = async (data: any) => {
  const res = await axios.post(`${API_BASE_URL}/report/predict_preg`, data);
  return res.data;
};

export const predictFetalRisk = async (data: any) => {
  const res = await axios.post(`${API_BASE_URL}/report/predict_fetal`, data);
  return res.data;
};

export const analyzeReport = async (payload: { data: any }) => {
  const response = await axios.post(`${API_BASE_URL}/report/analyze`, payload, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

export const getReportsByPregnancyId = async (pregnancyId: string) => {
  const res = await axios.get(`${API_BASE_URL}/report/byPregnancy/${pregnancyId}`);
  return res.data.reports;
}; 