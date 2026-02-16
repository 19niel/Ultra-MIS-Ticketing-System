import express from "express";
import { 
    getAllTickets, 
    changeTicketStatus,
    updatePriority, 
    createTicket, 
    getLatestTicketNumber,
    getSupportUsers,
    updateAssignment,
    getDashboardStats 
} from "../../controllers/admin/ticketController.js";

import { 
    getTicketMessages,
    createMessage 
} from "../../controllers/admin/messageController.js";

const router = express.Router();

// Order matters! 
router.get("/latest-number", getLatestTicketNumber);

// 2. Add the summary route here
router.get("/stats/summary", getDashboardStats); 

router.get("/", getAllTickets);
router.post("/", createTicket); 
router.put("/status/:ticket_id", changeTicketStatus);
router.put("/priority/:ticket_id", updatePriority);
router.get("/support-users", getSupportUsers);
router.put("/assign/:ticket_id", updateAssignment);

// Ticket Messages
router.get("/:ticket_id/messages", getTicketMessages);
router.post("/messages", createMessage);

export default router;