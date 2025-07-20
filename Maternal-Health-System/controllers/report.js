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
    try {
      const fastApiRes = await axios.post(
        "http://localhost:8000/analyze", // Change if FastAPI runs elsewhere
        { data }
      );
      recommendations = fastApiRes.data;
      // Optionally, update the report with recommendations
      await ReportModel.findByIdAndUpdate(report._id, {
        recommendations: recommendations.supplement_recommendations,
        alerts: recommendations.alerts,
        dietary_recommendations: recommendations.dietary_recommendations,
        anemia: recommendations.anemia,
        gdm: recommendations.gdm,
        thyroid: recommendations.thyroid,
      });
    } catch (err) {
      fastApiError = "Could not fetch recommendations from FastAPI.";
    }

    // 3. Return the report and recommendations
    const finalReport = await ReportModel.findById(report._id);
    res.status(201).json({
      report: finalReport,
      recommendations,
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
    const response = await axios.post("http://localhost:8000/predict_preg", req.body);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to get pregnancy risk prediction", details: err.message });
  }
};

// Call FastAPI for fetal risk prediction
export const predictFetalRisk = async (req, res) => {
  try {
    const response = await axios.post("http://localhost:8000/predict_fetal", req.body);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to get fetal risk prediction", details: err.message });
  }
};

// Call FastAPI for rules-based recommendations
export const analyzeReport = async (req, res) => {
  try {
    const response = await axios.post("http://localhost:8000/analyze", req.body);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to get analysis from FastAPI", details: err.message });
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
