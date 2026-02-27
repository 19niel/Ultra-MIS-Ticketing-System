
export const EmailCreateTicket = (ticket) => {
  return `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2 style="color:#2c3e50;">New Ticket Created</h2>
    
    <p><strong>Ticket Number:</strong> ${ticket.ticket_number}</p>
    <p><strong>Subject:</strong> ${ticket.subject}</p>
    <p><strong>Description:</strong> ${ticket.description}</p>
    <p><strong>Created By:</strong> ${ticket.created_by}</p>
    <p><strong>Department:</strong> ${ticket.department}</p>
    <p><strong>Priority:</strong> ${ticket.priority}</p>
    <p><strong>Status:</strong> ${ticket.status}</p>
    <p><strong>Branch:</strong> ${ticket.branch}</p>

    <hr />

    <p style="font-size: 14px; color: gray;">
      UBIX Helpdesk System<br/>
      This is an automated email notification.
    </p>
  </div>
  `;
};
