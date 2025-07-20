import {
  scheduleAncVisits,
  getAncVisits,
  markAncVisit,
  getAncAlerts,
  getAncVisitById,
  scheduleAdditionalAncVisit,
  remindAncVisit,
} from "../controllers/anc.js";
import express from "express";

const router = express.Router();

/**
 * @swagger
 * /anc/schedule/{pregnancyId}:
 *   post:
 *     summary: Schedule ANC visits for a pregnancy
 *     tags: [ANC]
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
 *         description: ANC visits scheduled
 *       400:
 *         description: Invalid input
 *
 * /anc/visit/{pregnancyId}:
 *   get:
 *     summary: Get ANC visits for a pregnancy
 *     tags: [ANC]
 *     parameters:
 *       - in: path
 *         name: pregnancyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of ANC visits
 *       404:
 *         description: Not found
 *
 * /anc/visit/{visitId}:
 *   get:
 *     summary: Get ANC visit by visit ID
 *     tags: [ANC]
 *     parameters:
 *       - in: path
 *         name: visitId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: ANC visit data
 *       404:
 *         description: Not found
 *   put:
 *     summary: Mark ANC visit as completed
 *     tags: [ANC]
 *     parameters:
 *       - in: path
 *         name: visitId
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
 *         description: ANC visit marked as completed
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Not found
 *
 * /anc/alerts:
 *   get:
 *     summary: Get ANC alerts
 *     tags: [ANC]
 *     responses:
 *       200:
 *         description: List of ANC alerts
 *
 * /anc/visit/{pregnancyId}/additional:
 *   post:
 *     summary: Schedule an additional ANC visit
 *     tags: [ANC]
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
 *         description: Additional ANC visit scheduled
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Not found
 */
router.post("/schedule/:pregnancyId", scheduleAncVisits);
router.get("/visit/:pregnancyId", getAncVisits);
router.put("/visit/:visitId", markAncVisit);
router.get("/alerts", getAncAlerts);
router.get("/visit/:visitId", getAncVisitById);
router.post("/visit/:pregnancyId/additional", scheduleAdditionalAncVisit);
router.post("/remind/:visitId", remindAncVisit);

export default router;
