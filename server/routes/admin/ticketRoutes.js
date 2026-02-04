import express from "express";
import { getAllTickets, 
        changeTicketStatus, 
        createTicket, 
        getLatestTicketNumber,
        getSupportUsers,
        updateAssignment } from "../../controllers/admin/ticketController.js";

import { getTicketMessages,
         createMessage} from "../../controllers/admin/messageController.js";

const router = express.Router();

// order matters!
router.get("/latest-number", getLatestTicketNumber);
router.get("/", getAllTickets);
router.post("/", createTicket); // This handles POST http://localhost:3000/api/tickets
router.put("/status/:ticket_id", changeTicketStatus);
router.get("/support-users", getSupportUsers);
router.put("/assign/:ticket_id", updateAssignment);

// Ticket Messages
router.get("/:ticket_id/messages", getTicketMessages);
router.post("/messages", createMessage);
export default router;