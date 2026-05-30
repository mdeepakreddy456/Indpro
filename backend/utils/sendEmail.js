const nodemailer = require('nodemailer');
const { Resend } = require('resend');

const sendEmailOTP = async (email, otp) => {
  const brevoApiKey = process.env.BREVO_API_KEY;
  const resendApiKey = process.env.RESEND_API_KEY;
  const gmailUser = process.env.GMAIL_USER || 'deepakreddy1005@gmail.com';
  const gmailPass = process.env.GMAIL_PASS ? process.env.GMAIL_PASS.replace(/\s+/g, '') : null;

  // HTML template for the email
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b; background-color: #f8fafc; border-radius: 8px; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0;">
      <h2 style="color: #4f46e5; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top: 0;">Verify Your Account</h2>
      <p>Thank you for signing up for TaskManager. Please verify your account using the One-Time Password (OTP) below:</p>
      <div style="background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; padding: 20px; margin: 20px 0; text-align: center; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);">
        <span style="font-size: 36px; font-weight: 700; letter-spacing: 0.25em; color: #4f46e5; font-family: monospace;">${otp}</span>
      </div>
      <p style="font-size: 13px; color: #64748b;">This OTP code is valid for 10 minutes. If you did not initiate this request, you can safely ignore this email.</p>
      <div style="margin-top: 20px; padding-top: 10px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
        Sent automatically by TaskManager Server.
      </div>
    </div>
  `;

  // OPTION A: HTTP REST API via Brevo (Best for cloud hosts, sends to any recipient domain for free)
  if (brevoApiKey) {
    try {
      console.log(`[BREVO HTTP DELIVERY] Attempting to send OTP email to ${email} via Brevo API...`);
      
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': brevoApiKey,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: {
            name: 'TaskManager Support',
            email: gmailUser
          },
          to: [
            {
              email: email
            }
          ],
          subject: 'TaskManager Account Verification OTP',
          htmlContent: htmlContent
        })
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || JSON.stringify(responseData));
      }

      console.log(`Email successfully delivered to ${email} via Brevo API:`, responseData.messageId);
      return { success: true, service: 'brevo', messageId: responseData.messageId };
    } catch (error) {
      console.error(`Brevo REST API delivery failed: ${error.message}`);
      console.log(`[BREVO FALLBACK LOGGING] Code: ${otp}`);
      return { success: false, error: error.message };
    }
  }

  // OPTION B: HTTP-Based Email API (Resend) - Sends to onboarding/domain-specific recipients
  if (resendApiKey) {
    try {
      console.log(`[RESEND HTTP DELIVERY] Attempting to send OTP email to ${email} via Resend REST API...`);
      const resend = new Resend(resendApiKey);

      const response = await resend.emails.send({
        from: 'TaskManager <onboarding@resend.dev>',
        to: email,
        subject: 'TaskManager Account Verification OTP',
        html: htmlContent,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      console.log(`Email successfully delivered to ${email} via Resend:`, response.data.id);
      return { success: true, service: 'resend', id: response.data.id };
    } catch (error) {
      console.error(`Resend API delivery failed: ${error.message}`);
      console.log(`[RESEND FALLBACK LOGGING] Code: ${otp}`);
      return { success: false, error: error.message };
    }
  }

  // OPTION C: SMTP Nodemailer - Great for Local Development
  if (!gmailPass) {
    console.log('\n==================================================================');
    console.log(`[SIMULATED EMAIL DELIVERY]`);
    console.log(`To: ${email}`);
    console.log(`From: ${gmailUser}`);
    console.log(`Subject: Verify Your TaskManager Account`);
    console.log(`OTP Verification Code: ${otp}`);
    console.log(`\nTo send actual emails on Render to anyone, add BREVO_API_KEY to your environment variables.`);
    console.log('==================================================================\n');
    return { simulated: true, otp };
  }

  try {
    console.log(`[SMTP DELIVERY] Attempting to send OTP email to ${email} via Gmail SMTP...`);
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: gmailUser,
        pass: gmailPass
      },
      connectionTimeout: 10000,
      socketTimeout: 10000
    });

    const mailOptions = {
      from: `"TaskManager Support" <${gmailUser}>`,
      to: email,
      subject: 'TaskManager Account Verification OTP',
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`SMTP Email successfully sent to ${email}: ${info.messageId}`);
    return { success: true, service: 'smtp' };
  } catch (error) {
    console.error(`SMTP Email delivery failed: ${error.message}`);
    console.log(`[SMTP FALLBACK LOGGING] Code: ${otp}`);
    return { success: false, error: error.message };
  }
};

module.exports = sendEmailOTP;
