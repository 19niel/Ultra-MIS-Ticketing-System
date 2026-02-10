import express from 'express';
import { getMyTickets } from '../../controllers/employee/empTicketController.js';

const router = express.Router();

router.get("/", getMyTickets);

export default router;