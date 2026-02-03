import express from "express";
import { getAllTickets, changeTicketStatus } from "../../controllers/admin/ticketController.js";

const router = express.Router();

router.get("/", getAllTickets);
router.put("/status/:ticket_id", changeTicketStatus);

export default router;