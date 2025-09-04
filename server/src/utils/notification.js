// Notification utility functions
export const formatPhoneNumber = (phoneNumber) => {
  let formatted = phoneNumber.replace(/\+/g, '').replace(/\s/g, '').replace(/-/g, '');
  
  if (formatted.startsWith('0')) {
    formatted = '254' + formatted.substring(1);
  }
  if (!formatted.startsWith('254')) {
    formatted = '254' + formatted;
  }
  
  return formatted;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phoneNumber) => {
  const formatted = formatPhoneNumber(phoneNumber);
  const phoneRegex = /^254[0-9]{9}$/;
  return phoneRegex.test(formatted);
};

export const generateNotificationId = () => {
  return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const createEmailTemplate = (title, content, actionUrl = null, actionText = null) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e9ecef; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6c757d; }
        .button { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
        .highlight { background: #fff3cd; padding: 10px; border-radius: 4px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>My Restaurant</h1>
      </div>
      <div class="content">
        <h2>${title}</h2>
        ${content}
        ${actionUrl && actionText ? `<a href="${actionUrl}" class="button">${actionText}</a>` : ''}
      </div>
      <div class="footer">
        <p>Thank you for choosing My Restaurant!</p>
        <p>If you have any questions, please contact us at support@myrestaurant.com</p>
      </div>
    </body>
    </html>
  `;
};

export const createSMSTemplate = (type, data) => {
  const templates = {
    orderConfirmation: `Hi ${data.customerName}, your order #${data.orderId} has been placed. Total: KES ${data.amount}. We'll notify you when ready!`,
    orderReady: `Hi ${data.customerName}, your order #${data.orderId} is ready for pickup/delivery!`,
    paymentConfirmation: `Payment of KES ${data.amount} confirmed for order #${data.orderId}. Transaction ID: ${data.transactionId}`,
    reservationConfirmation: `Reservation confirmed for ${data.partySize} people on ${data.date} at ${data.time}. ID: #${data.reservationId}`,
    loyaltyPoints: `You earned ${data.points} loyalty points! Total: ${data.totalPoints} points.`,
    adminAlert: `New ${data.type}: ${data.details}`
  };

  return templates[type] || `Notification: ${JSON.stringify(data)}`;
};

export const logNotification = (type, recipient, message, status) => {
  console.log(`[${new Date().toISOString()}] ${type.toUpperCase()} to ${recipient}: ${message} - ${status}`);
};

// Rate limiting for notifications
const notificationLimits = new Map();

export const checkRateLimit = (recipient, type, maxPerHour = 10) => {
  const key = `${recipient}_${type}`;
  const now = Date.now();
  const hourAgo = now - (60 * 60 * 1000);

  if (!notificationLimits.has(key)) {
    notificationLimits.set(key, []);
  }

  const timestamps = notificationLimits.get(key).filter(timestamp => timestamp > hourAgo);
  
  if (timestamps.length >= maxPerHour) {
    return false; // Rate limit exceeded
  }

  timestamps.push(now);
  notificationLimits.set(key, timestamps);
  return true; // Within rate limit
};

// Clean up old rate limit data (call periodically)
export const cleanupRateLimits = () => {
  const hourAgo = Date.now() - (60 * 60 * 1000);
  
  for (const [key, timestamps] of notificationLimits.entries()) {
    const validTimestamps = timestamps.filter(timestamp => timestamp > hourAgo);
    if (validTimestamps.length === 0) {
      notificationLimits.delete(key);
    } else {
      notificationLimits.set(key, validTimestamps);
    }
  }
};