import axios from 'axios';

class BankService {
  constructor() {
    this.baseUrl = 'https://sandbox.safaricom.co.ke'; // Change for production
  }

  // Account balance inquiry
  async checkAccountBalance() {
    try {
      // This would typically require additional M-Pesa API setup
      // For now, return a mock response
      return {
        success: true,
        balance: 50000, // Mock balance
        currency: 'KES'
      };
    } catch (error) {
      console.error('Balance inquiry failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Bank transfer (B2C - Business to Customer)
  async initiateB2CTransfer(phoneNumber, amount, remarks = 'Payment') {
    try {
      // This would require B2C API setup with M-Pesa
      // For now, return a mock response
      console.log(`Mock B2C Transfer: ${amount} KES to ${phoneNumber}`);
      
      return {
        success: true,
        transactionId: `B2C${Date.now()}`,
        message: 'Transfer initiated successfully'
      };
    } catch (error) {
      console.error('B2C transfer failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Refund processing
  async processRefund(originalTransactionId, amount, phoneNumber, reason = 'Order cancellation') {
    try {
      // In a real implementation, this would use M-Pesa reversal API
      console.log(`Processing refund: ${amount} KES to ${phoneNumber} for transaction ${originalTransactionId}`);
      
      const refundResult = await this.initiateB2CTransfer(phoneNumber, amount, `Refund: ${reason}`);
      
      return {
        success: refundResult.success,
        refundTransactionId: refundResult.transactionId,
        message: refundResult.success ? 'Refund processed successfully' : 'Refund failed'
      };
    } catch (error) {
      console.error('Refund processing failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Transaction status inquiry
  async queryTransactionStatus(transactionId) {
    try {
      // Mock transaction status check
      return {
        success: true,
        status: 'completed',
        transactionId,
        amount: 1000,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Transaction status query failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Validate bank account (for future bank transfer features)
  async validateBankAccount(accountNumber, bankCode) {
    try {
      // Mock bank account validation
      return {
        success: true,
        accountName: 'John Doe',
        accountNumber,
        bankName: 'Sample Bank',
        valid: true
      };
    } catch (error) {
      console.error('Bank account validation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate payment reference
  generatePaymentReference(prefix = 'PAY') {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  }

  // Format currency
  formatCurrency(amount, currency = 'KES') {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  }

  // Calculate transaction fees
  calculateTransactionFee(amount) {
    // M-Pesa transaction fees (simplified)
    if (amount <= 100) return 0;
    if (amount <= 500) return 5;
    if (amount <= 1000) return 10;
    if (amount <= 1500) return 15;
    if (amount <= 2500) return 20;
    if (amount <= 3500) return 25;
    if (amount <= 5000) return 30;
    if (amount <= 7500) return 35;
    if (amount <= 10000) return 40;
    if (amount <= 15000) return 45;
    if (amount <= 20000) return 50;
    if (amount <= 35000) return 55;
    if (amount <= 50000) return 60;
    return 65; // For amounts above 50,000
  }
}

export default new BankService();