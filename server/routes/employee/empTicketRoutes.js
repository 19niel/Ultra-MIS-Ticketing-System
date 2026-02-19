import express from 'express';
import { getMyTickets, empcreateTicket, getEmployeeDashboardStats } from '../../controllers/employee/empTicketController.js';

const router = express.Router();

router.get("/", getMyTickets);
router.post("/", empcreateTicket);
router.get("/stats/:emp_id", getEmployeeDashboardStats);

export default router;