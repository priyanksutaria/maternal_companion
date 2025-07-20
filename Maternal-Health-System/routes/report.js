import express from "express";
import { createReport, getReportById, getReports, getReportsByPregnancyId, predictPregnancyRisk, predictFetalRisk, analyzeReport } from "../controllers/report.js";
const router = express.Router();

/**
 * @swagger
 * /report/createReport:
 *   post:
 *     summary: Create a new report for a pregnancy
 *     tags: [Report]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pregnancyId:
 *                 type: string
 *               data:
 *                 type: object
 *     responses:
 *       201:
 *         description: Report created successfully
 *       400:
 *         description: Invalid input
 *
 * /report/reports:
 *   get:
 *     summary: Get all reports
 *     tags: [Report]
 *     responses:
 *       200:
 *         description: List of all reports
 *
 * /report/{id}:
 *   get:
 *     summary: Get a report by its ID
 *     tags: [Report]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report data
 *       404:
 *         description: Report not found
 *
 * /report/predict_preg:
 *   post:
 *     summary: Predict pregnancy risk using ML models (calls FastAPI)
 *     tags: [Report]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               age:
 *                 type: number
 *               systolic:
 *                 type: number
 *               diastolic:
 *                 type: number
 *               bs:
 *                 type: number
 *               bmi:
 *                 type: number
 *               heart_rate:
 *                 type: number
 *               body_temp:
 *                 type: number
 *               previous_complications:
 *                 type: number
 *     responses:
 *       200:
 *         description: ML pregnancy risk prediction
 *       500:
 *         description: Prediction error
 *
 * /report/predict_fetal:
 *   post:
 *     summary: Predict fetal risk using ML models (calls FastAPI)
 *     tags: [Report]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               baseline_value:
 *                 type: number
 *               accelerations:
 *                 type: number
 *               fetal_movement:
 *                 type: number
 *               uterine_contractions:
 *                 type: number
 *               light_decelerations:
 *                 type: number
 *               severe_decelerations:
 *                 type: number
 *               prolongued_decelerations:
 *                 type: number
 *               abnormal_short_term_variability:
 *                 type: number
 *               mean_value_of_short_term_variability:
 *                 type: number
 *               percentage_of_time_with_abnormal_long_term_variability:
 *                 type: number
 *               mean_value_of_long_term_variability:
 *                 type: number
 *               histogram_width:
 *                 type: number
 *               histogram_min:
 *                 type: number
 *               histogram_max:
 *                 type: number
 *               histogram_number_of_peaks:
 *                 type: number
 *               histogram_number_of_zeroes:
 *                 type: number
 *               histogram_mode:
 *                 type: number
 *               histogram_mean:
 *                 type: number
 *               histogram_median:
 *                 type: number
 *               histogram_variance:
 *                 type: number
 *               histogram_tendency:
 *                 type: number
 *     responses:
 *       200:
 *         description: ML fetal risk prediction
 *       500:
 *         description: Prediction error
 *
 * /report/analyze:
 *   post:
 *     summary: Analyze report and get rules-based recommendations (calls FastAPI)
 *     tags: [Report]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 description: Patient report data (fields as required by FastAPI)
 *     responses:
 *       200:
 *         description: Rules-based recommendations
 *       500:
 *         description: Analysis error
 */
/**
 * @swagger
 * /report/byPregnancy/{pregnancyId}:
 *   get:
 *     summary: Get all reports for a given pregnancyId
 *     tags: [Report]
 *     parameters:
 *       - in: path
 *         name: pregnancyId
 *         required: true
 *         schema:
 *           type: string
 *         description: Pregnancy ID
 *     responses:
 *       200:
 *         description: List of reports for the pregnancy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reports:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Report'
 *       404:
 *         description: No reports found for this pregnancyId
 */
router.post("/createReport", createReport);
router.get("/reports", getReports);
router.get("/byPregnancy/:pregnancyId", getReportsByPregnancyId);
router.get("/:id", getReportById);
router.post("/predict_preg", predictPregnancyRisk);
router.post("/predict_fetal", predictFetalRisk);
router.post("/analyze", analyzeReport);

export default router;
