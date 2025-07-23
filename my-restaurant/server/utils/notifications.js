// backend/utils/notifications.js
const nodemailer = require('nodemailer');
const AfricasTalking = require('africastalking');
const dotenv = require('dotenv');

dotenv.config();

// --- Africa's Talking SMS Setup ---
const africastalking = AfricasTalking({
    apiKey: process.env.AT_API_KEY,
    username: process.env.AT_USERNAME
});
const sms = africastalking.SMS;

// --- Nodemailer Email Setup ---
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE, // e.g., 'Gmail', 'Outlook365', 'SendGrid'
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Function to send SMS
const sendSMS = async (to, message) => {
    try {
        const options = {
            to: to, // Can be a comma-separated list or an array of numbers
            message: message,
            // from: 'YOUR_SENDER_ID' // Optional: If you have a registered sender ID
        };
        const response = await sms.send(options);
        console.log('SMS sent successfully:', response);
        return true;
    } catch (error) {
        console.error('Error sending SMS:', error.message);
        return false;
    }
};

// Function to send Email
const sendEmail = async (to, subject, htmlContent) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            html: htmlContent
        };
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to:', to);
        return true;
    } catch (error) {
        console.error('Error sending email to', to, ':', error.message);
        return false;
    }
};

module.exports = {
    sendSMS,
    sendEmail
};
