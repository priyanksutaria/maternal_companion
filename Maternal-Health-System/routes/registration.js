import {
  registerPregnancy,
  syncRegistrations,
  getRegistration,
  updateRegistration,
  updateFCMToken,
} from "../controllers/registration.js";
import express from "express";
import upload from "../utils/multer.js"; // Import multer for file uploads
import authenticate from "../middleware/auth.js"; // Import authentication middleware

const router = express.Router();

/**
 * @swagger
 * /registration/register:
 *   post:
 *     summary: Register a new pregnancy
 *     tags: [Registration]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Registration successful
 *       400:
 *         description: Invalid input
 *
 * /registration/sync:
 *   post:
 *     summary: Sync registrations via file upload
 *     tags: [Registration]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Sync successful
 *       400:
 *         description: Invalid input
 *
 * /registration/{pregnancyId}:
 *   get:
 *     summary: Get registration by pregnancy ID
 *     tags: [Registration]
 *     parameters:
 *       - in: path
 *         name: pregnancyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Registration data
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update registration by pregnancy ID
 *     tags: [Registration]
 *     parameters:
 *       - in: path
 *         name: pregnancyId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Update successful
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Not found
 *
 * /registration/{pregnancyId}/fcmtoken:
 *   put:
 *     summary: Update FCM token for push notifications
 *     tags: [Registration]
 *     parameters:
 *       - in: path
 *         name: pregnancyId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fcmToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: FCM token updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Not found
 */
router.post("/register", registerPregnancy); // Register pregnancy with auth
router.post("/sync", upload.single("file"), syncRegistrations); // Sync registrations with auth and file upload
router.get("/:pregnancyId", getRegistration); // Get registration by pregnancyId with auth
router.put("/:pregnancyId", updateRegistration); // Update registration with auth
router.put("/:pregnancyId/fcmtoken", updateFCMToken); // Update FCM token for push notifications

export default router;
