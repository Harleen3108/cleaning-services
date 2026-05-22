const fs = require('fs');
const path = require('path');

/**
 * Sends a transactional email using the Brevo (Sendinblue) API v3.
 * Falls back to logging if the BREVO_API_KEY is not defined.
 */
exports.sendBrevoEmail = async ({ toEmail, toName, subject, htmlContent }) => {
  const apiKey = process.env.BREVO_API_KEY || process.env.SENDINBLUE_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'notifications@cleannes.in';
  const senderName = process.env.BREVO_SENDER_NAME || 'Cleannes India';

  console.log(`[EMAIL DISPATCH] Preparing email to ${toEmail} (${subject})`);

  if (!apiKey) {
    console.warn('[EMAIL WARNING] BREVO_API_KEY is not set. Logging email content locally.');
    const logDir = path.join(__dirname, '../logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    const logFile = path.join(logDir, 'emails.log');
    const logEntry = `
========================================
TIMESTAMP: ${new Date().toISOString()}
TO: ${toName} <${toEmail}>
SUBJECT: ${subject}
BODY:
${htmlContent}
========================================
\n`;
    fs.appendFileSync(logFile, logEntry);
    return { success: true, loggedLocally: true };
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: toEmail, name: toName }],
        subject: subject,
        htmlContent: htmlContent
      })
    });

    const data = await response.json();
    if (response.ok) {
      console.log(`[EMAIL SUCCESS] Email sent to ${toEmail}. MessageID: ${data.messageId}`);
      return { success: true, messageId: data.messageId };
    } else {
      console.error('[EMAIL ERROR] Brevo API returned error:', data);
      return { success: false, error: data };
    }
  } catch (error) {
    console.error('[EMAIL ERROR] Exception sending email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Dispatches a simulated or link-based WhatsApp message.
 * Also logs to a local file for inspection.
 */
exports.sendWhatsAppMessage = async ({ toPhone, message }) => {
  // Format phone number (remove non-digits, ensure country code)
  let cleanPhone = toPhone.replace(/\D/g, '');
  if (cleanPhone.length === 10) {
    cleanPhone = '91' + cleanPhone; // Default to India country code
  }

  const encodedMessage = encodeURIComponent(message);
  const waLink = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`;

  console.log(`[WHATSAPP DISPATCH] Send message to +${cleanPhone}: "${message}"`);
  console.log(`[WHATSAPP LINK] Manual Trigger Link: ${waLink}`);

  // Write log entry for auditing
  const logDir = path.join(__dirname, '../logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  const logFile = path.join(logDir, 'whatsapp.log');
  const logEntry = `[${new Date().toISOString()}] TO: +${cleanPhone} | MSG: ${message} | LINK: ${waLink}\n`;
  fs.appendFileSync(logFile, logEntry);

  return { success: true, link: waLink };
};
