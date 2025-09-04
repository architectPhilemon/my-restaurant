import nodemailer from 'nodemailer';
import twilio from 'twilio';
import AfricasTalking from 'africastalking';

// Initialize services
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const africasTalking = AfricasTalking({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME
});

// Email transporter setup
const emailTransporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});

class NotificationService {
  // Send SMS via Africa's Talking
  async sendSMS(phoneNumber, message) {
    try {
      // Format phone number for Africa's Talking
      let formattedPhone = phoneNumber.replace(/\+/g, '');
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '254' + formattedPhone.substring(1);
      }
      if (!formattedPhone.startsWith('254')) {
        formattedPhone = '254' + formattedPhone;
      }

      const sms = africasTalking.SMS;
      const result = await sms.send({
        to: `+${formattedPhone}`,
        message,
        from: process.env.AT_SHORTCODE
      });

      console.log('SMS sent successfully:', result);
      return { success: true, result };
    } catch (error) {
      console.error('SMS sending failed:', error);
      
      // Fallback to Twilio if Africa's Talking fails
      try {
        const result = await twilioClient.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phoneNumber
        });
        
        console.log('SMS sent via Twilio fallback:', result.sid);
        return { success: true, result, provider: 'twilio' };
      } catch (twilioError) {
        console.error('Twilio SMS fallback failed:', twilioError);
        return { success: false, error: twilioError.message };
      }
    }
  }

  // Send Email
  async sendEmail(to, subject, html, text = null) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM_ADDRESS,
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, '') // Strip HTML for text version
      };

      const result = await emailTransporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Order notifications
  async notifyOrderCreated(order, user) {
    const message = `Hi ${user.name}, your order #${order._id.toString().slice(-6)} has been placed successfully. Total: KES ${order.totalAmount}. We'll notify you when it's ready!`;
    
    await this.sendSMS(user.phone, message);
    
    const emailHtml = `
      <h2>Order Confirmation</h2>
      <p>Hi ${user.name},</p>
      <p>Your order has been placed successfully!</p>
      <h3>Order Details:</h3>
      <ul>
        ${order.items.map(item => `<li>${item.quantity}x ${item.name} - KES ${item.price * item.quantity}</li>`).join('')}
      </ul>
      <p><strong>Total: KES ${order.totalAmount}</strong></p>
      <p>We'll notify you when your order is ready for pickup/delivery.</p>
      <p>Thank you for choosing our restaurant!</p>
    `;
    
    await this.sendEmail(user.email, 'Order Confirmation', emailHtml);
  }

  async notifyOrderStatusUpdate(order, user, newStatus) {
    const statusMessages = {
      confirmed: 'Your order has been confirmed and is being prepared.',
      preparing: 'Your order is now being prepared by our kitchen.',
      ready: 'Your order is ready for pickup/delivery!',
      delivered: 'Your order has been delivered. Enjoy your meal!',
      cancelled: 'Your order has been cancelled.'
    };

    const message = `Hi ${user.name}, ${statusMessages[newStatus]} Order #${order._id.toString().slice(-6)}`;
    await this.sendSMS(user.phone, message);
  }

  // Payment notifications
  async notifyPaymentSuccess(order, user, transactionId) {
    const message = `Payment confirmed! KES ${order.totalAmount} received for order #${order._id.toString().slice(-6)}. Transaction ID: ${transactionId}`;
    await this.sendSMS(user.phone, message);
    
    const emailHtml = `
      <h2>Payment Confirmation</h2>
      <p>Hi ${user.name},</p>
      <p>Your payment has been successfully processed!</p>
      <p><strong>Amount:</strong> KES ${order.totalAmount}</p>
      <p><strong>Transaction ID:</strong> ${transactionId}</p>
      <p><strong>Order ID:</strong> #${order._id.toString().slice(-6)}</p>
      <p>Your order is now confirmed and will be prepared shortly.</p>
    `;
    
    await this.sendEmail(user.email, 'Payment Confirmation', emailHtml);
  }

  async notifyPaymentFailed(order, user, reason) {
    const message = `Payment failed for order #${order._id.toString().slice(-6)}. Reason: ${reason}. Please try again.`;
    await this.sendSMS(user.phone, message);
  }

  // Reservation notifications
  async notifyReservationCreated(reservation, user) {
    const message = `Reservation confirmed for ${reservation.partySize} people on ${reservation.date.toDateString()} at ${reservation.time}. Reservation ID: #${reservation._id.toString().slice(-6)}`;
    await this.sendSMS(user.phone, message);
    
    const emailHtml = `
      <h2>Reservation Confirmation</h2>
      <p>Hi ${reservation.customerName},</p>
      <p>Your reservation has been confirmed!</p>
      <h3>Reservation Details:</h3>
      <ul>
        <li><strong>Date:</strong> ${reservation.date.toDateString()}</li>
        <li><strong>Time:</strong> ${reservation.time}</li>
        <li><strong>Party Size:</strong> ${reservation.partySize} people</li>
        <li><strong>Reservation ID:</strong> #${reservation._id.toString().slice(-6)}</li>
      </ul>
      ${reservation.specialRequests ? `<p><strong>Special Requests:</strong> ${reservation.specialRequests}</p>` : ''}
      <p>We look forward to serving you!</p>
    `;
    
    await this.sendEmail(reservation.customerEmail, 'Reservation Confirmation', emailHtml);
  }

  async notifyReservationStatusUpdate(reservation, newStatus) {
    const statusMessages = {
      confirmed: 'Your reservation has been confirmed.',
      cancelled: 'Your reservation has been cancelled.',
      completed: 'Thank you for dining with us!',
      'no-show': 'We noticed you missed your reservation. Please contact us to reschedule.'
    };

    const message = `${statusMessages[newStatus]} Reservation #${reservation._id.toString().slice(-6)} for ${reservation.date.toDateString()} at ${reservation.time}`;
    await this.sendSMS(reservation.customerPhone, message);
  }

  // Loyalty points notifications
  async notifyLoyaltyPointsEarned(user, pointsEarned, orderId) {
    const message = `You earned ${pointsEarned} loyalty points from order #${orderId.toString().slice(-6)}! Total points: ${user.loyaltyPoints}`;
    await this.sendSMS(user.phone, message);
  }

  async notifyLoyaltyPointsRedeemed(user, pointsRedeemed, discountAmount) {
    const message = `You redeemed ${pointsRedeemed} loyalty points for KES ${discountAmount} discount! Remaining points: ${user.loyaltyPoints}`;
    await this.sendSMS(user.phone, message);
  }

  // Admin notifications
  async notifyAdminNewOrder(order, user) {
    const adminUsers = await User.find({ role: 'admin', isActive: true });
    
    for (const admin of adminUsers) {
      const message = `New order received! Order #${order._id.toString().slice(-6)} from ${user.name} - KES ${order.totalAmount}`;
      await this.sendSMS(admin.phone, message);
    }
  }

  async notifyAdminNewReservation(reservation) {
    const adminUsers = await User.find({ role: 'admin', isActive: true });
    
    for (const admin of adminUsers) {
      const message = `New reservation: ${reservation.customerName} for ${reservation.partySize} people on ${reservation.date.toDateString()} at ${reservation.time}`;
      await this.sendSMS(admin.phone, message);
    }
  }
}

export default new NotificationService();
