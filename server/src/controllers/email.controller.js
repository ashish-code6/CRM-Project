import transporter from "../utils/mail.js";

export const sendTestEmail = async (req, res) => {
  try {
    const { to } = req.body;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: "CRM Test Email",
      html: `
        <h2>Welcome to CRM </h2>
        <p>This is a test email sent using Nodemailer.</p>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to send email",
    });
  }
};