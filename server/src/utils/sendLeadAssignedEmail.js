import transporter from "./mail.js";

export const sendLeadAssignedEmail = async (email, leadName, company) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "New Lead Assigned",
    html: `
      <h2>New Lead Assigned</h2>
      <p>Hello,</p>
      <p>A new lead has been assigned to you.</p>

      <ul>
        <li><strong>Name:</strong> ${leadName}</li>
        <li><strong>Company:</strong> ${company || "N/A"}</li>
      </ul>

      <p>Please log in to the CRM and follow up.</p>
    `,
  });
};