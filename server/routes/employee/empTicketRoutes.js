import express from 'express';
import { getMyTickets, empcreateTicket } from '../../controllers/employee/empTicketController.js';

const router = express.Router();

router.get("/", getMyTickets);
router.post("/", empcreateTicket);

export default router;