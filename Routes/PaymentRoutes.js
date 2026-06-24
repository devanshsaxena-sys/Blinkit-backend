const express = require('express');
const {
    createPayment,
    getAllPayments,
    getPaymentById,
    updatePayment,
    deletePayment,
    createRazorpayOrder,
    verifyPayment,
} = require('../Controller/PaymentController');

const router = express.Router();

router.post('/razorpay-order', createRazorpayOrder);
router.post('/verify', verifyPayment);
router.post('/', createPayment);
router.get('/', getAllPayments);
router.get('/:id', getPaymentById);
router.put('/:id', updatePayment);
router.delete('/:id', deletePayment);

module.exports = router;
