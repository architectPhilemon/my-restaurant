// backend/utils/mpesa.js
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE;
const MPESA_PASSKEY = process.env.MPESA_PASSKEY;
const MPESA_CALLBACK_URL = process.env.MPESA_CALLBACK_URL;

// Generate M-Pesa Access Token
const getAccessToken = async () => {
    try {
        const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
        const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
            headers: {
                'Authorization': `Basic ${auth}`
            }
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting M-Pesa access token:', error.response ? error.response.data : error.message);
        throw new Error('Failed to get M-Pesa access token.');
    }
};

// Initiate STK Push
const initiateSTKPush = async (phoneNumber, amount, orderId) => {
    try {
        const accessToken = await getAccessToken();
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3); // YYYYMMDDHHmmss
        const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64');

        const response = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
            BusinessShortCode: MPESA_SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline', // Or 'CustomerBuyGoodsOnline'
            Amount: amount,
            PartyA: phoneNumber, // Customer's phone number
            PartyB: MPESA_SHORTCODE,
            PhoneNumber: phoneNumber,
            CallBackURL: MPESA_CALLBACK_URL,
            AccountReference: `Order ${orderId}`, // Unique identifier for the transaction
            TransactionDesc: `Payment for Order ${orderId}`
        }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data; // Contains MerchantRequestID, CheckoutRequestID
    } catch (error) {
        console.error('Error initiating STK Push:', error.response ? error.response.data : error.message);
        throw new Error(error.response?.data?.CustomerMessage || 'Failed to initiate M-Pesa STK Push.');
    }
};

module.exports = {
    initiateSTKPush
};
