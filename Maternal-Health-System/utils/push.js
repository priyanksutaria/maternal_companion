import admin from "firebase-admin";
import path from "path";

// Make Firebase optional for development
let firebaseInitialized = false;

try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(
        path.resolve("config/fcmServiceAccount.json")
      )
    });
    firebaseInitialized = true;
  }
} catch (error) {
  console.log('Firebase initialization skipped for development');
}

export async function sendPush(fcmToken, title, body) {
  if (!firebaseInitialized) {
    console.log('Push notification skipped (Firebase not initialized):', { title, body });
    return;
  }
  const message = {
    notification: {
      title,
      body
    },
    token: fcmToken
  };
  try {
    const response = await admin.messaging().send(message);
    return response;
  } catch (err) {
    throw new Error("Push notification failed: " + err.message);
  }
}