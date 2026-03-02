export const EmailCreateTicket = (ticket) => {
  // Format the date for a cleaner look
  const dateCreated = new Date(ticket.created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `
  <div style="background-color: #f8fafc; padding: 50px 20px; font-family: 'Inter', 'Segoe UI', Helvetica, Arial, sans-serif; color: #1e293b;">
    <div style="max-width: 600px; margin: 0 auto;">

      <div style="background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
        
        <div style="background-color: #0f172a; padding: 12px 30px;">
           <span style="color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Internal Support Notification</span>
        </div>

        <div style="padding: 40px 30px;">
          <h1 style="margin: 0 0 10px 0; font-size: 22px; font-weight: 800; color: #0f172a; line-height: 1.3;">
            Ticket Subject: ${ticket.subject}
          </h1>
          <p style="margin: 0; color: #64748b; font-size: 14px;">Ticket ID: <span style="color: #3b82f6; font-weight: 600;">#${ticket.ticket_number}</span></p>

          <div style="margin-top: 12px; color: #475569; font-size: 13px; font-weight: 600; line-height: 1.5; white-space: pre-wrap;">
            Category: ${ticket.category || 'No description provided.'}
          </div>

          <div style="margin-top: 12px; color: #475569; font-size: 13px; font-weight: 600; line-height: 1.5; white-space: pre-wrap;">
            Description: ${ticket.description || 'No description provided.'}
          </div>

          <div style="margin: 30px 0; border-top: 1px solid #f1f5f9; padding-top: 30px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding-bottom: 20px; width: 50%;">
                  <label style="display: block; font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px;">Reporter</label>
                  <span style="font-size: 14px; font-weight: 500;">${ticket.created_by}</span>
                </td>
                <td style="padding-bottom: 20px; width: 50%;">
                  <label style="display: block; font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px;">Created On</label>
                  <span style="font-size: 14px; font-weight: 500;">${dateCreated}</span>
                </td>
              </tr>
              <tr>
                <td style="padding-bottom: 20px;">
                  <label style="display: block; font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px;">Department</label>
                  <span style="font-size: 14px; font-weight: 500;">${ticket.department}</span>
                </td>
                <td style="padding-bottom: 20px;">
                  <label style="display: block; font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px;">Branch</label>
                  <span style="font-size: 14px; font-weight: 500;">${ticket.branch}</span>
                </td>
              </tr>
            </table>
          </div>

          <div style="margin-top: 40px; text-align: center;">
            <a href="http://localhost:5173/admin/tickets" style="background-color: #2563eb; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">
              Review Ticket In Dashboard
            </a>
          </div>
        </div>
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <p style="font-size: 12px; color: #94a3b8; margin: 0;">
          UBIX Helpdesk System &bull; 2026 &bull; Automated Notification
        </p>
        <p style="font-size: 11px; color: #cbd5e1; margin-top: 5px;">
          This email was sent to notify you about a new ticket creation. Please do not reply.
        </p>
      </div>
    </div>
  </div>
  `;
};


export const EmailCloseTicket = (ticket) => {
  const closedDate = new Date(ticket.closed_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const resolutionText = Number(ticket.is_resolved) === 1 ? "RESOLVED" : "FAILED / CLOSED";
  const resolutionColor = Number(ticket.is_resolved) === 1 ? "#059669" : "#dc2626";

  return `
  <div style="background-color: #f8fafc; padding: 50px 20px; font-family: 'Inter', 'Segoe UI', Arial, sans-serif; color: #1e293b;">
    <div style="max-width: 600px; margin: 0 auto;">
      
     

      <div style="background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
        <div style="background-color: #0f172a; padding: 12px 30px;">
           <span style="color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Update: Ticket Closed</span>
        </div>

        <div style="padding: 40px 30px;">
          <h1 style="margin: 0 0 10px 0; font-size: 22px; font-weight: 800; color: #0f172a;">
            Ticket Closed: ${ticket.subject}
          </h1>
          <p style="margin: 0; color: #64748b; font-size: 14px;">Reference ID: <span style="color: #3b82f6; font-weight: 600;">#${ticket.ticket_number}</span></p>

          <div style="margin: 30px 0; border-top: 1px solid #f1f5f9; padding-top: 30px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding-bottom: 20px; width: 50%;">
                  <label style="display: block; font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px;">Resolution Status</label>
                  <span style="font-size: 14px; font-weight: 800; color: ${resolutionColor};">${resolutionText}</span>
                </td>
                <td style="padding-bottom: 20px; width: 50%;">
                  <label style="display: block; font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px;">Closed On</label>
                  <span style="font-size: 14px; font-weight: 500;">${closedDate}</span>
                </td>
              </tr>
            </table>
          </div>

          <p style="font-size: 14px; color: #475569; line-height: 1.6;">
            Hello ${ticket.created_by},<br><br>
            Your support ticket has been marked as <strong>Closed</strong>. If the issue persists or was not addressed to your satisfaction, please contact the IT department or visit the dashboard to reopen or create a new request.
          </p>

          <div style="margin-top: 40px; text-align: center;">
            <a href="http://localhost:5173/admin/tickets" style="background-color: #2563eb; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">
              View Ticket Details
            </a>
          </div>
        </div>
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <p style="font-size: 12px; color: #94a3b8; margin: 0;">
          UBIX Helpdesk System &bull; 2026
        </p>
      </div>
    </div>
  </div>
  `;
};