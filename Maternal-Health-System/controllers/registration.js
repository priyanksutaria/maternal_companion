import RegistrationModel from "../models/registration.js";
import crypto from "crypto";
import { encryptSensitive, decryptSensitive } from "../utils/encryption.js"; // Custom utility for encryption/decryption
import { validateRegistrationInput } from "../validators/registrationValidator.js"; // Custom Joi/Yup validator
import qrcode from "qrcode";

import { scheduleAncVisitsInternal } from "./anc.js";

// Generate unique Pregnancy ID (timestamp + PHC code + hash)
export function generatePregnancyId(data) {
  // Compose demographic hash string (excluding direct Aadhaar usage for privacy)
  const demographicString = [
    data.personal?.name?.trim().toLowerCase() || "",
    data.personal?.age || "",
    data.personal?.husbandName?.trim().toLowerCase() || "",
    data.personal?.address?.trim().toLowerCase() || "",
  ].join("|");

  // Compose the input string for hashing
  const str = [
    new Date().toISOString(), // ISO UTC timestamp
    process.env.PHC_CODE || "PHC_UNKNOWN", // PHC code
    demographicString,
  ].join("|");

  // SHA-256 hash for unique, secure ID
  return crypto.createHash("sha256").update(str).digest("hex");
}

export const registerPregnancy = async (req, res) => {
  try {
    const registrations = Array.isArray(req.body) ? req.body : [req.body];
    const results = [];

    for (const regData of registrations) {
      const { error } = validateRegistrationInput(regData);
      if (error) {
        results.push({ error: error.details[0].message, input: regData });
        continue;
      }

      if (regData.personal?.aadhaarNumber)
        regData.personal.aadhaarNumber = encryptSensitive(
          regData.personal.aadhaarNumber
        );
      if (regData.personal?.bankAccount)
        regData.personal.bankAccount = encryptSensitive(
          regData.personal.bankAccount
        );

      const pregnancyId = generatePregnancyId(regData);
      regData.pregnancyId = pregnancyId;
      regData.qrCode = await qrcode.toDataURL(pregnancyId);
      regData.registrationLog = {
        timestamp: new Date(),
        enteredBy: req.user?.username || "unknown",
        gps: regData.registrationLog?.gps || null,
      };
      regData.syncStatus = req.body.syncStatus || "synced";

      // 1. Save registration first
      const saved = await RegistrationModel.create(regData);

      // 2. Then schedule ANC visits
      await scheduleAncVisitsInternal(pregnancyId);

      results.push({
        pregnancyId: saved.pregnancyId,
        qrCode: saved.qrCode,
        registrationLog: saved.registrationLog,
        abhaStatus: saved.abhaId ? "Linked" : "Not Linked",
        jsyEligibility: saved.jsyEligibility?.eligible
          ? "Eligible"
          : "Not Eligible",
      });
    }
    res.status(201).json(Array.isArray(req.body) ? results : results[0]);
  } catch (err) {
    console.error("Error in registerPregnancy:", err);
    res.status(500).json({ error: "Server error during registration." });
  }
};

// Controller: Auto-sync (for offline data uploads)
export const syncRegistrations = async (req, res) => {
  try {
    const records = Array.isArray(req.body) ? req.body : [req.body];
    const results = [];

    for (const record of records) {
      // Find by pregnancyId and update syncStatus to 'synced'
      const updated = await RegistrationModel.findOneAndUpdate(
        { pregnancyId: record.pregnancyId },
        { syncStatus: "synced" },
        { new: true }
      );
      results.push(
        updated
          ? { pregnancyId: updated.pregnancyId, syncStatus: "synced" }
          : { pregnancyId: record.pregnancyId, error: "Not found" }
      );
    }
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Server error during sync." });
  }
};

// Controller: Get Registration by pregnancyId (decrypts sensitive fields)
export const getRegistration = async (req, res) => {
  try {
    const { pregnancyId } = req.params;
    const record = await RegistrationModel.findOne({ pregnancyId });
    if (!record) return res.status(404).json({ error: "Not found" });
    // Decrypt sensitive fields
    if (record.personal?.aadhaarNumber)
      record.personal.aadhaarNumber = decryptSensitive(
        record.personal.aadhaarNumber
      );
    if (record.personal?.bankAccount)
      record.personal.bankAccount = decryptSensitive(
        record.personal.bankAccount
      );
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: "Error fetching registration record." });
  }
};

// Controller: Update Registration (with audit log)

export const updateRegistration = async (req, res) => {
  try {
    const { pregnancyId } = req.params;

    // Fetch old registration to compare LMP/EDD
    const oldRecord = await RegistrationModel.findOne({ pregnancyId });
    if (!oldRecord) return res.status(404).json({ error: "Not found" });
    const oldEdd = oldRecord.menstrualHistory?.edd;
    const oldLmp = oldRecord.menstrualHistory?.lmp;

    const { error } = validateRegistrationInput(req.body, true);
    if (error) return res.status(400).json({ error: error.details[0].message });

    if (req.body.personal?.aadhaarNumber)
      req.body.personal.aadhaarNumber = encryptSensitive(
        req.body.personal.aadhaarNumber
      );
    if (req.body.personal?.bankAccount)
      req.body.personal.bankAccount = encryptSensitive(
        req.body.personal.bankAccount
      );

    const updated = await RegistrationModel.findOneAndUpdate(
      { pregnancyId },
      { ...req.body, "registrationLog.timestamp": new Date() },
      { new: true }
    );

    // Compare and reschedule if LMP/EDD changed
    const newEdd = req.body.menstrualHistory?.edd;
    const newLmp = req.body.menstrualHistory?.lmp;
    if ((newEdd && newEdd !== oldEdd) || (newLmp && newLmp !== oldLmp)) {
      await scheduleAncVisitsInternal(pregnancyId);
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Error updating registration." });
  }
};

export const updateFCMToken = async (req, res) => {
  try {
    const { pregnancyId } = req.params;
    const { fcmToken } = req.body;
    if (!fcmToken) return res.status(400).json({ error: "FCM token required" });
    const updated = await RegistrationModel.findOneAndUpdate(
      { pregnancyId },
      { "personal.fcmToken": fcmToken },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Not found" });
    return res.status(200).json({ message: "FCM token updated" });
  } catch (err) {
    console.error("Error updating FCM token:", err);
    return res.status(500).json({ error: "Server error updating FCM token" });
  }
};
