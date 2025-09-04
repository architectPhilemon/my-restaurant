import axios from 'axios';

class MpesaService {
  constructor() {
    this.consumerKey = process.env.MPESA_CONSUMER_KEY;
    this.consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    this.shortcode = process.env.MPESA_SHORTCODE;
    this.passkey = process.env.MPESA_PASSKEY;
    this.callbackUrl = process.env.MPESA_CALLBACK_URL;
    this.baseUrl = 'https://sandbox.safaricom.co.ke'; // Change to production URL when ready
  }

  // Get M-Pesa access token
  async getAccessToken() {
    try {
      const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
      
      const response = await axios.get(
        `${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        }
      );

      return response.data.access_token;
    } catch (error) {
      console.error('Failed to get M-Pesa access token:', error.response?.data || error.message);
      throw new Error('Failed to get M-Pesa access token');
    }
  }

  // Format phone number for M-Pesa
  formatPhoneNumber(phoneNumber) {
    let formatted = phoneNumber.replace(/\+/g, '').replace(/\s/g, '');
    
    if (formatted.startsWith('0')) {
      formatted = '254' + formatted.substring(1);
    }
    if (!formatted.startsWith('254')) {
      formatted = '254' + formatted;
    }
    
    return formatted;
  }

  // Generate M-Pesa password
  generatePassword(timestamp) {
    return Buffer.from(`${this.shortcode}${this.passkey}${timestamp}`).toString('base64');
  }

  // Generate timestamp
  generateTimestamp() {
    return new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
  }

  // Initiate STK Push
  async initiateSTKPush(phoneNumber, amount, accountReference, transactionDesc) {
    try {
      const accessToken = await this.getAccessToken();
      const timestamp = this.generateTimestamp();
      const password = this.generatePassword(timestamp);
      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      const stkPushData = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(amount),
        PartyA: formattedPhone,
        PartyB: this.shortcode,
        PhoneNumber: formattedPhone,
        CallBackURL: this.callbackUrl,
        AccountReference: accountReference,
        TransactionDesc: transactionDesc
      };

      const response = await axios.post(
        `${this.baseUrl}/mpesa/stkpush/v1/processrequest`,
        stkPushData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('STK Push failed:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }

  // Query STK Push status
  async querySTKPushStatus(checkoutRequestId) {
    try {
      const accessToken = await this.getAccessToken();
      const timestamp = this.generateTimestamp();
      const password = this.generatePassword(timestamp);

      const queryData = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId
      };

      const response = await axios.post(
        `${this.baseUrl}/mpesa/stkpushquery/v1/query`,
        queryData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('STK Push query failed:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }

  // Validate M-Pesa callback
  validateCallback(callbackData) {
    try {
      const { Body } = callbackData;
      if (!Body || !Body.stkCallback) {
        return { valid: false, error: 'Invalid callback structure' };
      }

      const { stkCallback } = Body;
      const requiredFields = ['MerchantRequestID', 'CheckoutRequestID', 'ResultCode', 'ResultDesc'];
      
      for (const field of requiredFields) {
        if (!(field in stkCallback)) {
          return { valid: false, error: `Missing required field: ${field}` };
        }
      }

      return { valid: true, data: stkCallback };
    } catch (error) {
      return { valid: false, error: 'Callback validation failed' };
    }
  }

  // Extract transaction details from callback
  extractTransactionDetails(stkCallback) {
    const details = {
      merchantRequestId: stkCallback.MerchantRequestID,
      checkoutRequestId: stkCallback.CheckoutRequestID,
      resultCode: stkCallback.ResultCode,
      resultDesc: stkCallback.ResultDesc,
      mpesaReceiptNumber: null,
      transactionDate: null,
      amount: null,
      phoneNumber: null
    };

    if (stkCallback.CallbackMetadata && stkCallback.CallbackMetadata.Item) {
      const metadata = stkCallback.CallbackMetadata.Item;
      
      details.mpesaReceiptNumber = metadata.find(item => item.Name === 'MpesaReceiptNumber')?.Value;
      details.transactionDate = metadata.find(item => item.Name === 'TransactionDate')?.Value;
      details.amount = metadata.find(item => item.Name === 'Amount')?.Value;
      details.phoneNumber = metadata.find(item => item.Name === 'PhoneNumber')?.Value;
    }

    return details;
  }
}

export default new MpesaService();