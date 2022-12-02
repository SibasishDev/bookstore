'use strict;'
const router = require('express').Router();
const bookRouter = require('../router/book.router');
const sellerController = require('../controllers/seller.controller');
const customerController = require('../controllers/customer.controller');


// router for seller
router.post('/add/seller', sellerController.insertSeller);
router.post('/update/seller', sellerController.updateSeller);
router.get('/get/allseller', sellerController.getAllSeller);
router.get('/getseller', sellerController.getSeller);
router.delete('/delete/seller', sellerController.deleteSeller);


// router for customer
router.post('/add/customer', customerController.insertCustomer);
router.post('/update/customer', customerController.updateCustomer);
router.get('/get/allcustomer', customerController.getAllCustomer);
router.get('/getcustomer', customerController.getCustomer);
router.delete('/delete/customer', customerController.deleteCustomer);

router.use(bookRouter);


module.exports = router;
