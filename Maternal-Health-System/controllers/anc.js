import RegistrationModel from "../models/registration.js";
import AncVisitModel from "../models/anc.js";
import dayjs from "dayjs";
import { sendAncReminder } from "../utils/notification.js";

async function _generateAncVisitsForPregnancy(pregnancyId) {
  const reg = await RegistrationModel.findOne({ pregnancyId });
  if (!reg) throw new Error("Registration not found");

  let lmp = reg.menstrualHistory?.lmp;
  let edd = reg.menstrualHistory?.edd;
  if (!lmp && !edd) throw new Error("LMP or EDD required");

  const baseLmp = lmp ? dayjs(lmp) : dayjs(edd).subtract(280, "day");

  const visits = [
    { visitNumber: "ANC1", week: 8 },
    { visitNumber: "ANC2", week: 20 },
    { visitNumber: "ANC3", week: 30 },
    { visitNumber: "ANC4", week: 36 },
  ];

  await AncVisitModel.deleteMany({ pregnancyId });

  const visitDocs = visits.map((v) => ({
    pregnancyId,
    visitNumber: v.visitNumber,
    scheduledDate: baseLmp.add(v.week, "week").toDate(),
    status: "scheduled",
    highRiskFlag: false,
  }));

  await AncVisitModel.insertMany(visitDocs);
  return visitDocs;
}

export const scheduleAncVisits = async (req, res) => {
  const { pregnancyId } = req.params;
  try {
    const visits = await _generateAncVisitsForPregnancy(pregnancyId);
    return res.status(201).json({ message: "ANC Visits scheduled", visits });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

export async function scheduleAncVisitsInternal(pregnancyId) {
  return await _generateAncVisitsForPregnancy(pregnancyId);
}

export const getAncVisits = async (req, res) => {
  const { pregnancyId } = req.params;
  try {
    const visits = await AncVisitModel.find({ pregnancyId }).sort({
      scheduledDate: 1,
    });
    // Fetch registration info for woman's name and other details
    const registration = await RegistrationModel.findOne({ pregnancyId });
    let womanInfo = null;
    if (registration) {
      womanInfo = {
        name: registration.personal?.name || "",
        age: registration.personal?.age || null,
        husbandName: registration.personal?.husbandName || "",
        address: registration.personal?.address || "",
        contact: registration.personal?.contact || "",
        abhaNumber: registration.personal?.abhaNumber || "",
      };
    }
    return res.status(200).json({ woman: womanInfo, visits });
  } catch (err) {
    return res.status(500).json({ error: "Error fetching ANC visits." });
  }
};

export const markAncVisit = async (req, res) => {
  const { visitId } = req.params;
  const { status, feedback, location, anmId, highRiskFlag } = req.body;

  // Only allow valid status values
  const allowedStatus = ["scheduled", "completed", "missed"];
  if (status && !allowedStatus.includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  try {
    const update = {
      ...(status && { status }),
      ...(feedback && { feedback }),
      ...(location && { location }),
      ...(anmId && { anmId }),
      ...(typeof highRiskFlag === "boolean" && { highRiskFlag }),
      updatedAt: new Date(),
    };

    const visit = await AncVisitModel.findByIdAndUpdate(visitId, update, {
      new: true,
    });
    if (!visit) return res.status(404).json({ error: "Visit not found" });

    return res.status(200).json({ message: "ANC visit updated", visit });
  } catch (err) {
    return res.status(500).json({ error: "Error updating ANC visit" });
  }
};

export const getAncAlerts = async (req, res) => {
  try {
    const now = dayjs();
    const nextWeek = now.add(7, "day").toDate();

    // Missed visits
    const missed = await AncVisitModel.find({ status: "missed" });

    // Upcoming scheduled visits in next 7 days
    const upcoming = await AncVisitModel.find({
      status: "scheduled",
      scheduledDate: { $gte: now.toDate(), $lte: nextWeek },
    });

    // Escalations (high risk)
    const escalations = await AncVisitModel.find({ highRiskFlag: true });

    return res.status(200).json({
      missed,
      upcoming,
      escalations,
    });
  } catch (err) {
    return res.status(500).json({ error: "Error fetching ANC alerts." });
  }
};

export const getAncVisitById = async (req, res) => {
  const { visitId } = req.params;
  try {
    const visit = await AncVisitModel.findById(visitId);
    if (!visit) {
      return res.status(404).json({ error: "ANC visit not found" });
    }
    // Optionally, fetch registration info for context
    const registration = await RegistrationModel.findOne({
      pregnancyId: visit.pregnancyId,
    });
    let womanInfo = null;
    if (registration) {
      womanInfo = {
        name: registration.personal?.name || "",
        age: registration.personal?.age || null,
        husbandName: registration.personal?.husbandName || "",
        address: registration.personal?.address || "",
        contact: registration.personal?.contact || "",
        abhaNumber: registration.personal?.abhaNumber || "",
      };
    }
    return res.status(200).json({
      visit,
      woman: womanInfo,
      audit: {
        createdAt: visit.createdAt,
        updatedAt: visit.updatedAt,
        anmId: visit.anmId || null,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: "Error fetching ANC visit details." });
  }
};

export const remindAncVisit = async (req, res) => {
  const { visitId } = req.params;
  try {
    const visit = await AncVisitModel.findById(visitId);
    if (!visit) {
      return res.status(404).json({ error: "ANC visit not found" });
    }
    // Fetch woman's contact info and (optionally) fcmToken
    const registration = await RegistrationModel.findOne({
      pregnancyId: visit.pregnancyId,
    });
    if (!registration || !registration.personal?.contact) {
      return res.status(404).json({ error: "Woman's contact not found" });
    }
    const fcmToken = registration.personal?.fcmToken;

    // Send notification (push and/or SMS)
    const notifyResult = await sendAncReminder({
      contact: registration.personal.contact,
      fcmToken,
      visitNumber: visit.visitNumber,
      scheduledDate: visit.scheduledDate,
      req, 
    });

    return res.status(200).json({
      message: "Reminder triggered",
      result: notifyResult,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Error triggering reminder.", details: err.message });
  }
};

export const scheduleAdditionalAncVisit = async (req, res) => {
  const { pregnancyId } = req.params;
  const { scheduledDate, reason, anmId, location, highRiskFlag } = req.body;

  if (!scheduledDate || !reason) {
    return res
      .status(400)
      .json({ error: "scheduledDate and reason are required" });
  }

  try {
    let isHighRisk = !!highRiskFlag;
    if (highRiskFlag) {
      const registration = await RegistrationModel.findOne({ pregnancyId });
      if (
        !registration ||
        !registration.obstetricRiskFactors ||
        Object.values(registration.obstetricRiskFactors).every(
          (v) => v === false || v === "" || v === null
        )
      ) {
        return res.status(400).json({
          error:
            "High-risk flag is set but no high-risk factors found in registration.",
        });
      }
      isHighRisk = true;
    }
    const lastVisit = await AncVisitModel.find({ pregnancyId })
      .sort({ visitNumber: -1 })
      .limit(1);
    let nextVisitNumber = "ANC-Extra";
    if (lastVisit.length > 0 && /^ANC\d+$/.test(lastVisit[0].visitNumber)) {
      const lastNum = parseInt(lastVisit[0].visitNumber.replace("ANC", ""), 10);
      nextVisitNumber = `ANC${lastNum + 1}`;
    }

    const newVisit = new AncVisitModel({
      pregnancyId,
      visitNumber: nextVisitNumber,
      scheduledDate,
      status: "scheduled",
      location,
      anmId,
      feedback: reason,
      highRiskFlag: isHighRisk,
    });

    await newVisit.save();
    return res
      .status(201)
      .json({ message: "Additional ANC visit scheduled", visit: newVisit });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Error scheduling additional ANC visit" });
  }
};
