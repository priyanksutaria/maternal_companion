import axios from "axios";

export async function sendSMS(mobile, message) {
  // Replace with your actual MSG91 credentials and sender ID
  const authKey = process.env.MSG91_AUTH_KEY;
  const senderId = process.env.MSG91_SENDER_ID || "HOSPIT";
  const route = "4"; // Transactional

  const url = "https://api.msg91.com/api/v2/sendsms";
  try {
    const response = await axios.post(
      url,
      {
        sender: senderId,
        route,
        country: "91",
        sms: [
          {
            message,
            to: [mobile]
          }
        ]
      },
      {
        headers: {
          authkey: authKey,
          "Content-Type": "application/json"
        }
      }
    );
    return response.data;
  } catch (err) {
    throw new Error("SMS sending failed: " + err.message);
  }
}