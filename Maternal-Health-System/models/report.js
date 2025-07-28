import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  pregnancyId: {
    type: String,
    required: true,
    ref: "Registration",
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  recommendations: {
    type: [String], // Array of strings
    default: [],
  },
  alerts: {
    type: [String], // Array of strings
    default: [],
  },
  dietary_recommendations: {
    type: [String], // Array of strings
    default: [],
  },
  llm_merged_summary: {
    type: String,
    default: "",
  },
  createdAt: { type: Date, default: Date.now },
});

const ReportModel = mongoose.model("Report", reportSchema);
export default ReportModel;
