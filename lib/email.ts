import nodemailer from "nodemailer";
import { ApiUrl, defaultEmail } from "./utils";
import { Booking, Order } from "./generated/prisma";

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

// Get email configuration from environment variables
const user = process.env.EMAIL_USER || defaultEmail;
const pass = process.env.EMAIL_PASSWORD;
const host = process.env.EMAIL_HOST || "smtp.gmail.com";
const port = parseInt(process.env.EMAIL_PORT || "587", 10);

export const sendForgotEmail = async ({ to, subject, html }: EmailPayload) => {
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

export const forgotEmailHtml = ({
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
            padding: 35px 40px;
            background-color: #ffffff;
          }
          h1 {
            color: #ab6e70;
            font-size: 24px;
            margin-top: 0;
            margin-bottom: 25px;
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
            padding: 25px;
            color: #666666;
            font-size: 13px;
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
            margin-bottom: 12px;
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
          <img src="https://www.photographymra.com/images/landscape.jpg" alt="Photography" class="hero-image">
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

export const sendInquiryEmail = async ({ to, subject, html }: EmailPayload) => {
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
      bcc: user,
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

export const inquiryEmailHtml = (inquiry: Booking) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Photography Inquiry Confirmation</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.5;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #fff;
      border-radius: 8px;
      overflow: hidden; /* Add this to ensure content doesn't overflow rounded corners */
      border: 1px solid #e0e0e0; /* Adding a subtle border to ensure radius is visible */
    }
    .header {
      background-color: #ab6e70;
      color: white;
      padding: 15px;
      text-align: center;
    }
    .content {
      padding: 20px;
    }
    h1, h2, h3 {
      color: #ab6e70;
      margin-top: 0;
    }
    .info-section {
      background-color: #f9f5f2;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 15px;
    }
    .info-label {
      font-weight: 600;
      color: #555;
      display: inline-block;
      margin-right: 5px;
    }
    .note {
      border-left: 3px solid #ab6e70;
      padding: 10px 15px;
      background-color: #f9f5f2;
      margin-top: 15px;
    }
    .footer {
      background-color: #eae2dd;
      padding: 12px;
      text-align: center;
      font-size: 13px;
      color: #666;
    }
    .step {
      margin-bottom: 10px;
      padding-left: 20px;
      position: relative;
    }
    .step:before {
      content: '•';
      position: absolute;
      left: 0;
      color: #ab6e70;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f5f5f5">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table class="container" cellpadding="0" cellspacing="0" border="0" width="600" style="border-radius: 8px; overflow: hidden; background-color: #fff; max-width: 600px;">
          <tr>
            <td class="header" bgcolor="#ab6e70" style="padding: 15px; text-align: center;">
              <h2 style="color:#f5f5f5; margin:0">Photography MRA</h2>
            </td>
          </tr>
          
          <tr>
            <td class="content" style="padding: 20px;">
              <h1 style="color: #ab6e70; margin-top: 0;">Inquiry Confirmation</h1>
              <p>Hello <strong style="color:#ab6e70">${
                inquiry.name || "there"
              }</strong>,</p>
              <p>Thank you for reaching out to us! We've received your inquiry and are excited to discuss your photography needs.</p>
              
              <div class="info-section" style="background-color: #f9f5f2; padding: 15px; border-radius: 4px; margin-bottom: 15px;">
                <h3 style="color: #ab6e70; margin-top: 0;">Your Inquiry Details</h3>
                <p><span class="info-label" style="font-weight: 600; color: #555;">Name:</span> ${
                  inquiry.name || "Not provided"
                }</p>
                <p><span class="info-label" style="font-weight: 600; color: #555;">Email:</span> ${
                  inquiry.email || "Not provided"
                }</p>
                ${
                  inquiry.session_name
                    ? `<p><span class="info-label" style="font-weight: 600; color: #555;">Session Type:</span> <a href="${ApiUrl}/investment/${
                        inquiry.product_id || ""
                      }" style="color: #ab6e70; text-decoration: underline;">${
                        inquiry.session_name
                      }</a></p>`
                    : ""
                }
                ${
                  inquiry.date
                    ? `<p><span class="info-label" style="font-weight: 600; color: #555;">Preferred Date:</span> ${new Date(
                        inquiry.date
                      ).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}</p>`
                    : ""
                }
                ${
                  inquiry.time
                    ? `<p><span class="info-label" style="font-weight: 600; color: #555;">Preferred Time:</span> ${inquiry.time}</p>`
                    : ""
                }
                ${
                  inquiry.heard_from
                    ? `<p><span class="info-label" style="font-weight: 600; color: #555;">How You Found Us:</span> ${inquiry.heard_from}</p>`
                    : ""
                }
                ${
                  inquiry.message
                    ? `<p style="white-space: pre-wrap"><span class="info-label" style="font-weight: 600; color: #555;">Your Message:</span> ${inquiry.message}</p>`
                    : ""
                }
              </div>
              
              <h3 style="color: #ab6e70; margin-top: 0;">What Happens Next?</h3>
              <div class="step" style="margin-bottom: 10px; padding-left: 20px; position: relative;">
                <strong>Review (Complete)</strong>: We've received your inquiry
              </div>
              <div class="step" style="margin-bottom: 10px; padding-left: 20px; position: relative;">
                <strong>Response (Within 24-48 hours)</strong>: We'll reach out to discuss your photography needs
              </div>
              <div class="step" style="margin-bottom: 10px; padding-left: 20px; position: relative;">
                <strong>Planning</strong>: We'll work together to plan your perfect photography session
              </div>
              
              <div class="note" style="border-left: 3px solid #ab6e70; padding: 10px 15px; background-color: #f9f5f2; margin-top: 15px;">
                <p>A team member will contact you within 24-48 hours. If you have any immediate questions, please email us at <a href="mailto:m.rose.a.photography@gmail.com" style="color: #ab6e70;">m.rose.a.photography@gmail.com</a>.</p>
              </div>
            </td>
          </tr>
          
          <tr>
            <td class="footer" bgcolor="#eae2dd" style="padding: 12px; text-align: center; font-size: 13px; color: #666;">
              <p>&copy; ${new Date().getFullYear()} Photography MRA. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

export const sendOrderEmail = async ({ to, subject, html }: EmailPayload) => {
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
      bcc: user,
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

export const orderEmailHtml = (orderDetails: Order) => {
  // Format date for better readability
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: orderDetails.currency || "USD",
    }).format(amount / 100); // Assuming amount is in cents
  };

  return `
        <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Receipt</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.5;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: #fff;
            border-radius: 6px;
            overflow: hidden;
          }
          .header {
            background-color: #ab6e70;
            color: white;
            padding: 20px;
            text-align: center;
          }
          .content {
            padding: 25px;
          }
          h1, h2, h3 {
            color: #ab6e70;
            margin-top: 0;
          }
          .divider {
            border-top: 1px solid #eee;
            margin: 20px 0;
          }
          .badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
          }
          .badge-pending {
            background-color: #fff8e6;
            color: #b7791f;
          }
          .badge-completed {
            background-color: #e6f7ee;
            color: #2e856e;
          }
          .badge-cancelled {
            background-color: #fee2e2;
            color: #b91c1c;
          }
          .info-section {
            background-color: #f9f5f2;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 20px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          }
          .info-label {
            font-weight: 600;
            color: #555;
            margin-right: 10px;
          }
          .button {
            display: inline-block;
            padding: 8px 16px;
            background: #ab6e70;
            color: white !important;
            text-decoration: none;
            border-radius: 4px;
            font-weight: 500;
            margin-right: 10px;
            margin-top: 15px;
          }
          .button-secondary {
            background: #e6ded8;
            color: #ab6e70 !important;
          }
          .note {
            border-left: 3px solid #ab6e70;
            padding: 10px 15px;
            background-color: #f9f5f2;
            margin-top: 20px;
          }
          .footer {
            background-color: #eae2dd;
            padding: 15px;
            text-align: center;
            font-size: 13px;
            color: #666;
          }
          .total {
            font-size: 18px;
            font-weight: 600;
            color: #ab6e70;
            text-align: right;
            margin-top: 15px;
            border-top: 1px solid #eee;
            padding-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="color:#f5f5f5; margin:0">Photography MRA</h2>
          </div>
          
          <div class="content">
            <h1>Order Receipt</h1>
            <p>Hello <strong style="color:#ab6e70">${
              orderDetails.user_name || orderDetails.user_email.split("@")[0]
            }</strong>,</p>
            <p>Thank you for your order! Here's your receipt and booking details:</p>
            
            <div class="info-section">
              <h3>Order Information</h3>
              <div class="info-row">
                <span class="info-label">Order #:</span>
                <span>${orderDetails.id}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Date Issued:</span>
                <span>${formatDate(orderDetails.created_at)}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Order Status:</span>
                <span><span class="badge badge-${orderDetails.order_status.toLowerCase()}">${
    orderDetails.order_status
  }</span></span>
              </div>
              <div class="info-row">
                <span class="info-label">Payment Status:</span>
                <span><span class="badge badge-${
                  orderDetails.payment_status?.toLowerCase() || "pending"
                }">${orderDetails.payment_status || "Pending"}</span></span>
              </div>
            </div>
            
            <div class="info-section">
              <h3>Package Details</h3>
              <div class="info-row">
                <span class="info-label">Package:</span>
                <span>${orderDetails.product_title}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Price:</span>
                <span>${formatCurrency(orderDetails.paid_amount)}</span>
              </div>
              <div class="total">
                Total: ${formatCurrency(orderDetails.paid_amount)}
              </div>
            </div>
            
            <div class="info-section">
              <h3>Session Information</h3>
              <div class="info-row">
                <span class="info-label">Date:</span>
                <span>${formatDate(orderDetails.date)}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Time:</span>
                <span>${orderDetails.time}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Location:</span>
                <span>${orderDetails.address}</span>
              </div>
              ${
                orderDetails.note
                  ? `<div class="divider"></div>
                <div class="info-row">
                  <span class="info-label">Special Notes:</span>
                  <span>${orderDetails.note}</span>
                </div>`
                  : ""
              }
            </div>
            
            <div class="note">
              <p><strong>What's Next?</strong> Our team will contact you to confirm your session details. For questions or changes, email us at <a href="mailto:m.rose.a.photography@gmail.com" style="color: #ab6e70;">m.rose.a.photography@gmail.com</a>.</p>
            </div>
            
            <div style="margin-top: 20px; text-align: center;">
              <a href="${ApiUrl}/orders" class="button">View Order</a>
              <a href="${ApiUrl}/investment/${
    orderDetails.product_id
  }" class="button button-secondary">View Package</a>
            </div>
          </div>
          
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Photography MRA. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
  `;
};
