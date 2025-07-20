import mongoose from "mongoose";

const AncVisitSchema = new mongoose.Schema({
  pregnancyId: {
    type: String,
    required: true,
    ref: "Registration",
    index: true, // For quick lookup
  },
  visitNumber: {
    type: String,
    required: true, // e.g., ANC1, ANC2, etc.
  },
  scheduledDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["scheduled", "completed", "missed"],
    default: "scheduled",
    required: true,
  },
  location: String, // Optional at scheduling
  anmId: String, // Optional at scheduling
  feedback: String,
  highRiskFlag: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const AncVisitModel = mongoose.model("AncVisit", AncVisitSchema);
export default AncVisitModel;
