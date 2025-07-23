// backend/services/notificationService.js
// This service handles sending SMS and Email notifications.
// In a real application, you would integrate with third-party APIs here (e.g., Twilio, SendGrid).

const axios = require('axios'); // Still useful if you use a real SMS API
const dotenv = require('dotenv');
const nodemailer = require('nodemailer'); // Import Nodemailer

dotenv.config(); // Load environment variables

// --- SMS Service Configuration (Conceptual/Placeholder) ---
// Keep this as is if you're not setting up a real SMS API yet.
const sendSms = async (to, message) => {
    console.log(`[SMS Service] Attempting to send SMS to ${to}: "${message}"`);
    try {
        // Placeholder for actual SMS API call
        // Example with Africa's Talking (if you install and configure it):
        // const AfricasTalking = require('africastalking')({
        //     apiKey: process.env.AT_API_KEY,
        //     username: process.env.AT_USERNAME
        // });
        // const sms = AfricasTalking.SMS;
        // await sms.send({
        //     to: to,
        //     message: message,
        //     from: process.env.AT_SHORTCODE // Or your sender ID
        // });

        console.log('[SMS Service] SMS sent successfully (simulated).');
        return { success: true, message: 'SMS sent (simulated)' };
    } catch (error) {
        console.error('[SMS Service] Error sending SMS:', error.message);
        return { success: false, message: 'Failed to send SMS (simulated)' };
    }
};

// --- Email Service Configuration (Nodemailer) ---
// Create a Nodemailer transporter using your SMTP details from .env
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true', // Use 'true' for port 465 (SSL), 'false' for 587 (STARTTLS)
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async (to, subject, htmlContent) => {
    console.log(`[Email Service] Attempting to send email to ${to} with subject: "${subject}"`);
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM_ADDRESS, // Sender address (e.g., "My Restaurant" <noreply@example.com>)
            to: to, // List of receivers
            subject: subject, // Subject line
            html: htmlContent, // HTML body
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('[Email Service] Email sent successfully:', info.messageId);
        return { success: true, message: 'Email sent' };
    } catch (error) {
        console.error('[Email Service] Error sending email:', error.message);
        // Log more details for debugging
        if (error.response) {
            console.error('Email service error response:', error.response);
        }
        return { success: false, message: 'Failed to send email' };
    }
};

module.exports = {
    sendSms,
    sendEmail
};
