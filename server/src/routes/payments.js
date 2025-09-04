import express from 'express';
import Order from '../models/Order.js';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import mpesaService from '../utils/mpesa.js';
import notificationService from '../services/notificationService.js';

const router = express.Router();

// Initiate M-Pesa payment
router.post('/mpesa', authenticateToken, async (req, res) => {
  try {
    const { orderId, phoneNumber, amount } = req.body;
    const userId = req.user._id;

    // Validate order
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ error: 'Order already paid' });
    }

    // Validate amount matches order total
    if (Math.abs(amount - order.totalAmount) > 1) {
      return res.status(400).json({ error: 'Payment amount does not match order total' });
    }

    // Initiate STK Push
    const accountReference = order._id.toString();
    const transactionDesc = `Payment for order ${accountReference.slice(-6)}`;
    
    const stkResult = await mpesaService.initiateSTKPush(
      phoneNumber,
      amount,
      accountReference,
      transactionDesc
    );

    if (!stkResult.success) {
      return res.status(400).json({ error: 'Failed to initiate payment', details: stkResult.error });
    }

    // Store transaction details
    const transaction = new Transaction({
      order: order._id,
      user: userId,
      amount,
      phoneNumber: mpesaService.formatPhoneNumber(phoneNumber),
      checkoutRequestId: stkResult.data.CheckoutRequestID,
      merchantRequestId: stkResult.data.MerchantRequestID,
      status: 'pending'
    });

    await transaction.save();

    res.json({
      message: 'Payment initiated successfully',
      checkoutRequestId: stkResult.data.CheckoutRequestID,
      merchantRequestId: stkResult.data.MerchantRequestID
    });
  } catch (error) {
    console.error('M-Pesa payment error:', error);
    res.status(500).json({ error: 'Failed to initiate payment' });
  }
});

// M-Pesa callback
router.post('/mpesa-callback', async (req, res) => {
  try {
    console.log('M-Pesa Callback received:', JSON.stringify(req.body, null, 2));

    const validation = mpesaService.validateCallback(req.body);
    if (!validation.valid) {
      console.error('Invalid callback:', validation.error);
      return res.status(400).json({ error: validation.error });
    }

    const stkCallback = validation.data;
    const transactionDetails = mpesaService.extractTransactionDetails(stkCallback);

    // Find transaction
    const transaction = await Transaction.findOne({ 
      checkoutRequestId: stkCallback.CheckoutRequestID 
    }).populate('order user');

    if (!transaction) {
      console.log('Transaction not found for CheckoutRequestID:', stkCallback.CheckoutRequestID);
      return res.status(200).json({ message: 'OK' });
    }

    // Update transaction
    transaction.status = transactionDetails.resultCode === 0 ? 'completed' : 'failed';
    transaction.resultCode = transactionDetails.resultCode;
    transaction.resultDesc = transactionDetails.resultDesc;
    
    if (transactionDetails.resultCode === 0) {
      transaction.mpesaReceiptNumber = transactionDetails.mpesaReceiptNumber;
      transaction.transactionDate = transactionDetails.transactionDate;
    }

    await transaction.save();

    // Update order
    const order = transaction.order;
    if (transactionDetails.resultCode === 0) {
      // Payment successful
      order.paymentStatus = 'paid';
      order.status = 'confirmed';
      order.mpesaTransactionId = transactionDetails.mpesaReceiptNumber;
      
      // Award loyalty points
      const user = await User.findById(order.user);
      if (user) {
        user.loyaltyPoints += order.loyaltyPointsEarned;
        await user.save();
        
        // Send success notifications
        await notificationService.notifyPaymentSuccess(order, user, transactionDetails.mpesaReceiptNumber);
        await notificationService.notifyLoyaltyPointsEarned(user, order.loyaltyPointsEarned, order._id);
      }
    } else {
      // Payment failed
      order.paymentStatus = 'failed';
      
      const user = await User.findById(order.user);
      if (user) {
        await notificationService.notifyPaymentFailed(order, user, transactionDetails.resultDesc);
      }
    }

    await order.save();
    res.status(200).json({ message: 'OK' });
  } catch (error) {
    console.error('Callback processing error:', error);
    res.status(500).json({ error: 'Callback processing failed' });
  }
});

// Query payment status
router.get('/status/:checkoutRequestId', authenticateToken, async (req, res) => {
  try {
    const { checkoutRequestId } = req.params;
    
    const transaction = await Transaction.findOne({ checkoutRequestId })
      .populate('order', 'status paymentStatus totalAmount');

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Also query M-Pesa for latest status
    const mpesaStatus = await mpesaService.querySTKPushStatus(checkoutRequestId);

    res.json({
      transaction: {
        status: transaction.status,
        resultCode: transaction.resultCode,
        resultDesc: transaction.resultDesc,
        mpesaReceiptNumber: transaction.mpesaReceiptNumber
      },
      order: transaction.order,
      mpesaQuery: mpesaStatus
    });
  } catch (error) {
    console.error('Payment status query error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;