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
           <span style="color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">MIS Ticketing System</span>
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

  const isResolved = Number(ticket.is_resolved) === 1;
  const resolutionText = isResolved ? "RESOLVED" : "FAILED / CLOSED";
  const resolutionColor = isResolved ? "#059669" : "#dc2626";
  const resolutionBg = isResolved ? "#f0fdf4" : "#fef2f2";

  return `
  <div style="background-color: #f8fafc; padding: 50px 20px; font-family: 'Inter', 'Segoe UI', Arial, sans-serif; color: #1e293b;">
    <div style="max-width: 600px; margin: 0 auto;">
      <div style="background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
        
        <div style="background-color: #0f172a; padding: 12px 30px;">
          <span style="color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
            MIS Ticketing System
          </span>
        </div>

        <div style="padding: 40px 30px;">
          <h1 style="margin: 0 0 10px 0; font-size: 22px; font-weight: 800; color: #0f172a;">
            Ticket Closed: ${ticket.subject}
          </h1>

          <p style="margin: 0; color: #64748b; font-size: 14px;">
            Reference ID: <span style="color: #3b82f6; font-weight: 600;">#${ticket.ticket_number}</span>
          </p>

          <p style="margin: 0; color: #64748b; font-size: 14px;">
            Description: <span style="color: #3b82f6; font-weight: 600;">#${ticket.description}</span>
          </p>

          <div style="margin: 25px 0; padding: 20px; background-color: ${resolutionBg}; border: 1px solid ${resolutionColor}20; border-radius: 12px;">
            <label style="display:block; font-size:10px; font-weight:800; color:${resolutionColor}; text-transform:uppercase; margin-bottom:8px; letter-spacing: 0.5px;">
              Closing Remarks
            </label>
            <div style="font-size: 15px; color: #1e293b; line-height: 1.6; font-weight: 500;">
              ${ticket.remarks || "No additional remarks provided."}
            </div>
          </div>

          <div style="margin: 20px 0; border-top: 1px solid #f1f5f9; padding-top: 20px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding-bottom: 20px; width: 50%;">
                  <label style="display:block; font-size:10px; font-weight:800; color:#94a3b8; text-transform:uppercase; margin-bottom:4px;">Resolution Status:</label>
                  <span style="font-size:14px; font-weight:800; color:${resolutionColor};">${resolutionText}</span>
                </td>
                <td style="padding-bottom: 20px; width: 50%;">
                  <label style="display:block; font-size:10px; font-weight:800; color:#94a3b8; text-transform:uppercase; margin-bottom:4px;">Closed On:</label>
                  <span style="font-size:14px; font-weight:500;">${closedDate}</span>
                </td>
              </tr>

              <tr>
                <td style="padding-bottom:20px;">
                  <label style="display:block; font-size:10px; font-weight:800; color:#94a3b8; text-transform:uppercase; margin-bottom:4px;">Reporter:</label>
                  <span style="font-size:14px; font-weight:500;">${ticket.created_by}</span>
                </td>
                <td style="padding-bottom:20px;">
                  <label style="display:block; font-size:10px; font-weight:800; color:#94a3b8; text-transform:uppercase; margin-bottom:4px;">Reporter:</label>
                  <span style="font-size:14px; font-weight:500;">${ticket.created_by}</span>
                </td>
              </tr>

              <tr>
                td style="padding-bottom:20px;">
                  <label style="display:block; font-size:10px; font-weight:800; color:#94a3b8; text-transform:uppercase; margin-bottom:4px;">Assigned to: </label>
                  <span style="font-size:14px; font-weight:500;">${ticket.assigned_to || "Not Assigned"}</span>
                </td>
                <td style="padding-bottom:20px;">
                  <label style="display:block; font-size:10px; font-weight:800; color:#94a3b8; text-transform:uppercase; margin-bottom:4px;">Reporter:</label>
                  <span style="font-size:14px; font-weight:500;">${ticket.created_by}</span>
                </td>

              </tr>
            </table>
          </div>

        </div>
      </div>
      <div style="text-align:center; margin-top:30px;">
        <p style="font-size:12px; color:#94a3b8; margin:0;">UBIX Helpdesk System • 2026</p>
      </div>
    </div>
  </div>
  `;
};
