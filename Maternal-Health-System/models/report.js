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
  createdAt: { type: Date, default: Date.now },
});

const ReportModel = mongoose.model("Report", reportSchema);
export default ReportModel;
