const express = require('express');
const {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    loginCustomer,
    updateCustomer,
    deleteCustomer,
} = require('../Controller/CustomerController');

const router = express.Router();

router.post('/register', createCustomer);
router.get('/', getAllCustomers);
router.get('/:id', getCustomerById);
router.post('/login', loginCustomer);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

module.exports = router;
