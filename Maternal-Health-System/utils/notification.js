import { sendSMS } from "./sms.js";
import { sendPush } from "./push.js";

// Call this from controller
export async function sendAncReminder({
  contact,
  fcmToken,
  visitNumber,
  scheduledDate,
  language = "en",
  req,
}) {
  const dateStr = new Date(scheduledDate).toLocaleDateString(
    language === "mr" ? "mr-IN" : "en-IN"
  );
  const smsMsg = req.t("notifications.ancReminder", {
    visitNumber,
    scheduledDate: dateStr,
  });
  const pushTitle = req.t("notifications.visitReminder");
  const pushBody = req.t("notifications.ancReminder", {
    visitNumber,
    scheduledDate: dateStr,
  });

  let smsStatus = null;
  let pushStatus = null;
  let errors = [];

  // Try Push first, fallback to SMS if token not available or push fails
  if (fcmToken) {
    try {
      pushStatus = await sendPush(fcmToken, pushTitle, pushBody);
    } catch (err) {
      errors.push(err.message);
    }
  }
  if (contact) {
    try {
      smsStatus = await sendSMS(contact, smsMsg);
    } catch (err) {
      errors.push(err.message);
    }
  }

  if (!smsStatus && !pushStatus) {
    throw new Error("Failed to send both SMS and push: " + errors.join("; "));
  }

  return { smsStatus, pushStatus, errors };
}
