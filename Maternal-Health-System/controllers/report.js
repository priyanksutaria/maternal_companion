import RegistrationModel from "../models/registration.js";
import ReportModel from "../models/report.js";
import axios from "axios";

// Create report
export const createReport = async (req, res) => {
  try {
    const { pregnancyId, data } = req.body;
    if (!pregnancyId || !data) {
      return res
        .status(400)
        .json({ error: "pregnancyId and data are required" });
    }
    // 1. Save the report first
    const report = await ReportModel.create({ pregnancyId, ...data });
    await RegistrationModel.findOneAndUpdate(
      { pregnancyId },
      { $push: { reports: report._id } }
    );

    // 2. Call FastAPI for recommendations
    let recommendations = null;
    let fastApiError = null;
    let llm_merged_summary = '';
    try {
      const fastApiRes = await axios.post(
        "https://mrp999-mh-project.hf.space/analyze", // Change if FastAPI runs elsewhere
        { data }
      );
      recommendations = fastApiRes.data;
      llm_merged_summary = (recommendations && recommendations.llm_merged_summary) ? recommendations.llm_merged_summary : '';
      // Optionally, update the report with recommendations
      await ReportModel.findByIdAndUpdate(report._id, {
        recommendations: recommendations.supplement_recommendations,
        alerts: recommendations.alerts,
        dietary_recommendations: recommendations.dietary_recommendations,
        llm_merged_summary: llm_merged_summary,
      });
    } catch (err) {
      fastApiError = "Could not fetch recommendations from FastAPI.";
      llm_merged_summary = '';
    }

    // 3. Return the report and recommendations
    const finalReport = await ReportModel.findById(report._id);
    res.status(201).json({
      report: finalReport,
      recommendations,
      summary: llm_merged_summary,
      fastApiError,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all reports
const getReports = async (req, res) => {
  try {
    const reports = await ReportModel.find().sort({ createdAt: -1 });
    return res
      .status(201)
      .json({ message: "Reports successfully fetched", Reports: reports });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Get single report by ID
export const getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await ReportModel.findById(id);
    if (!report) return res.status(404).json({ error: "Report not found" });
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Call FastAPI for pregnancy risk prediction
export const predictPregnancyRisk = async (req, res) => {
  try {
    const response = await axios.post("https://mrp999-mh-project.hf.space/predict_preg", req.body);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to get pregnancy risk prediction", details: err.message });
  }
};

// Call FastAPI for fetal risk prediction
export const predictFetalRisk = async (req, res) => {
  try {
    const response = await axios.post("https://mrp999-mh-project.hf.space/predict_fetal", req.body);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to get fetal risk prediction", details: err.message });
  }
};

// Call FastAPI for rules-based recommendations
export const analyzeReport = async (req, res) => {
  try {
    console.log("Forwarding to FastAPI:", req.body);
    const response = await axios.post('https://mrp999-mh-project.hf.space/analyze', req.body);
    res.json(response.data);
    console.log("FastAPI Response:", response.data);
  } catch (error) {
    console.error("FastAPI Error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    res.status(error.response?.status || 500).json({
      error: 'FastAPI request failed',
      details: error.response?.data || error.message
    });
  }
};

export const getReportsByPregnancyId = async (req, res) => {
  try {
    const { pregnancyId } = req.params;
    const reports = await ReportModel.find({ pregnancyId }).sort({ createdAt: -1 });
    res.json({ reports });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { getReports };
