const crypto = require('crypto');
const Razorpay = require('razorpay');
const Payment = require('../Models/PaymentModel');
const Order = require('../Models/OrderModel');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createRazorpayOrder = async (req, res) => {
    try {
        console.log("REQ BODY:", req.body);

        const { amount, currency = 'INR', receipt } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                message: 'Amount valid honi chahiye',
                receivedAmount: amount
            });
        }

        const options = {
            amount: Math.round(amount * 100),
            currency,
            receipt: receipt || `order_rcptid_${Date.now()}`,
        };

        console.log("RAZORPAY OPTIONS:", options);

        const order = await razorpay.orders.create(options);

        console.log("ORDER CREATED:", order);

        res.status(201).json(order);
    } catch (error) {
        console.error("RAZORPAY ERROR:", error);

        res.status(500).json({
            message: 'Razorpay order create nahi hua',
            error: error.message,
            details: error
        });
    }
};
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: 'Payment verification data missing' });
        }

        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({ message: 'Signature mismatch' });
        }

        const payment = await Payment.create({
            amount: amount || 0,
            paymentMethod: 'razorpay',
            paymentStatus: 'success',
            transactionId: razorpay_payment_id,
        });

        res.status(200).json({ message: 'Payment verified', payment });
    } catch (error) {
        res.status(500).json({ message: 'Payment verification failed', error: error.message });
    }
};

const createPayment = async (req, res) => {
    try {
        const payment = await Payment.create(req.body);
        const paymentWithOrder = await Payment.findByPk(payment.id, { include: Order });
        res.status(201).json(paymentWithOrder);
    } catch (error) {
        res.status(500).json({ message: 'Payment create nahi hua', error: error.message });
    }
};

const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.findAll({ include: Order });
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Payments fetch nahi hue', error: error.message });
    }
};

const getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findByPk(req.params.id, { include: Order });

        if (!payment) {
            return res.status(404).json({ message: 'Payment nahi mila' });
        }

        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Payment fetch nahi hua', error: error.message });
    }
};

const updatePayment = async (req, res) => {
    try {
        const payment = await Payment.findByPk(req.params.id);

        if (!payment) {
            return res.status(404).json({ message: 'Payment nahi mila' });
        }

        await payment.update(req.body);
        const updatedPayment = await Payment.findByPk(payment.id, { include: Order });
        res.status(200).json(updatedPayment);
    } catch (error) {
        res.status(500).json({ message: 'Payment update nahi hua', error: error.message });
    }
};

const deletePayment = async (req, res) => {
    try {
        const payment = await Payment.findByPk(req.params.id);

        if (!payment) {
            return res.status(404).json({ message: 'Payment nahi mila' });
        }

        await payment.destroy();
        res.status(200).json({ message: 'Payment delete ho gaya' });
    } catch (error) {
        res.status(500).json({ message: 'Payment delete nahi hua', error: error.message });
    }
};

module.exports = {
    createRazorpayOrder,
    verifyPayment,
    createPayment,
    getAllPayments,
    getPaymentById,
    updatePayment,
    deletePayment,
};