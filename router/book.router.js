'use strict;'
const router = require('express').Router();
const bookController = require('../controllers/book.controller');

router.post('/add/book', bookController.addBook);
router.post('/update/book', bookController.updateBook);
router.get('/allbook', bookController.getAllBook);
router.post('/customer/order', bookController.orderBook);
router.get('/customer/purchase', bookController.bookPurchaseByCustomer);
router.get('/seller/sold', bookController.bookSoldBySeller);
router.get('/view/soldbook', bookController.getSoldBook); 

module.exports = router;     