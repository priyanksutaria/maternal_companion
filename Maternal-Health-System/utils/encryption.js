import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const ALGORITHM = "aes-256-cbc";
let SECRET_KEY = process.env.ENCRYPTION_SECRET;

// Ensure 32 characters for AES-256
if (!SECRET_KEY || SECRET_KEY.length < 32) {
  throw new Error("ENCRYPTION_SECRET must be 32 characters");
} else if (SECRET_KEY.length > 32) {
  SECRET_KEY = SECRET_KEY.slice(0, 32);
}

const IV_LENGTH = 16;

export function encryptSensitive(text) {
  if (!text) return "";
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(SECRET_KEY, "utf8"),
    iv
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

export function decryptSensitive(text) {
  if (!text) return "";
  const [ivHex, encrypted] = text.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(SECRET_KEY, "utf8"),
    iv
  );
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
