import nodemailer from "nodemailer";

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: EmailPayload) => {
  // Get email configuration from environment variables
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;
  const host = process.env.EMAIL_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.EMAIL_PORT || "587", 10);

  // Create a transporter
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for port 465, false for other ports
    auth: {
      user,
      pass,
    },
  });

  try {
    // Send the email
    const info = await transporter.sendMail({
      from: `"Photography MRA" <${user}>`,
      to,
      subject,
      html,
    });

    console.log(`Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

export const emailHtml = ({
  name,
  resetUrl,
}: {
  name?: string;
  resetUrl: string;
}) => {
  return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #eae2dd;
            margin: 0;
            padding: 0;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          .email-header {
            background-color: #ab6e70;
            padding: 30px 20px;
            text-align: center;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #ffffff;
            letter-spacing: 1px;
          }
          .email-content {
            padding: 30px 40px;
            background-color: #ffffff;
          }
          h1 {
            color: #ab6e70;
            font-size: 22px;
            margin-top: 0;
            margin-bottom: 20px;
          }
          .reset-button {
            display: inline-block;
            background-color: #ab6e70;
            color: #ffffff !important;
            text-decoration: none;
            padding: 12px 30px;
            border-radius: 4px;
            font-weight: bold;
            margin: 20px 0;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            transition: background-color 0.3s;
          }
          .reset-button:hover {
            background-color: #95595b;
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #666666;
            font-size: 12px;
            background-color: #eae2dd;
            border-top: 1px solid #e2d5ce;
          }
          .note {
            color: #777777;
            font-size: 14px;
            padding: 20px 0;
            border-top: 1px solid #eae2dd;
            margin-top: 20px;
          }
          .link-fallback {
            margin-top: 10px;
            font-size: 13px;
            color: #777777;
            word-break: break-all;
          }
          .highlight {
            color: #ab6e70;
            font-weight: 500;
          }
          .camera-icon {
            width: 48px;
            height: 48px;
            margin-bottom: 10px;
          }
          .hero-image {
            width: 100%;
            height: auto;
            object-fit: cover;
            margin-bottom: 20px;
            display: block;
          }
          .hour-highlight {
            color: #ab6e70;
            font-weight: 500;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <svg class="camera-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
              <circle cx="12" cy="13" r="3"/>
            </svg>
            <div class="logo">Photography MRA</div>
          </div>
          <img src="https://www.photographymra.com/images/meetmaria3.jpg" alt="Photography" class="hero-image">
          <div class="email-content">
            <h1>Reset Your Password</h1>
            <p>Hello <span class="highlight">${name || "there"}</span>,</p>
            <p>We received a request to reset your password for your Photography MRA account. Click the button below to set a new password:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="reset-button">Reset My Password</a>
            </div>
            
            <p class="link-fallback">
              If the button doesn't work, copy and paste this link into your browser:<br>
              ${resetUrl}
            </p>
            
            <div class="note">
              <p>This password reset link will expire in <span class="hour-highlight">1 hour</span> for security reasons.</p>
              <p>If you didn't request a password reset, you can safely ignore this email - your account is still secure.</p>
            </div>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Photography MRA. All rights reserved.</p>
            <p>Your professional photography management and resource platform</p>
          </div>
        </div>
      </body>
      </html>
        `;
};
