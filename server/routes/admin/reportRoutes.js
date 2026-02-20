import express from "express";
import { getTicketReports } from "../../controllers/admin/reportsController.js";

const router = express.Router();

// GET /api/reports
router.get("/", getTicketReports);

export default router;