'use strict;'
const createError = require('http-errors');
const bookModal = require('../modal/book.modal');

class bookController {

    async addBook(req, res, next) {
        try {

            const { sellerId, bookName } = req.body;

            if (!sellerId || !bookName) throw createError.BadRequest('sellerId and bookName required');

            const query = `INSERT INTO books (bookName,sid) VALUES ('${bookName}',${sellerId})`;

            let insertBook = await bookModal.bookDbOpreation(query);

            if (!insertBook) throw createError.BadRequest("Something went wrong.");

            res.status(200).json({
                status: 200,
                message: "book insert succeefully",
            });


        } catch (e) {
            next(e);
        }
    }

    async updateBook(req, res, next) {
        try {

            const { bookId, bookName } = req.body;

            if (!bookId || !bookName) throw createError.BadRequest('bookId and bookName required');

            const query = `UPDATE books SET bookName = '${bookName}' where id = ${bookId}`;

            let updateBook = await bookModal.bookDbOpreation(query);

            if (updateBook.changedRows == 0) return res.status(400).json({
                status: 400,
                message: "something went wrong!",
            });

            return res.status(200).json({
                status: 200,
                message: "book update successfully",
            });


        } catch (e) {
            next(e);
        }
    }

    async getAllBook(req, res, next) {
        try {

            const query = `select id,bookName from books`;

            let bookData = await bookModal.bookDbOpreation(query);

            if (!bookData) throw createError.NotFound('no book found in db');

            return res.status(200).json({
                code: 200,
                data: bookData

            });

        } catch (e) {
            next(e);
        }
    }

    async orderBook(req, res, next) {
        try {

            const { customerId, bookId } = req.body;

            if (!customerId || !bookId) throw createError.BadRequest('customerId and bookId requried');

            const query = `INSERT INTO orders (cid,bid) VALUES (${customerId}, ${bookId})`;

            let insertOrder = await bookModal.bookDbOpreation(query);

            if (!insertOrder) throw createError.BadRequest("Something went wrong.");

            return res.status(200).json({
                code: 200,
                message: 'book purchase successfully'
            })

        } catch (e) {
            next(e);
        }
    }

    async bookPurchaseByCustomer(req, res, next) {
        try {

            const query = `SELECT o.bid,o.cid,b.bookName AS book_name,c.name AS cust_name 
                           FROM orders o INNER JOIN books b ON o.bid = b.id INNER JOIN 
                           customers c ON c.id = o.cid `;

            let purchaseBookData = await bookModal.bookDbOpreation(query);

            return res.status(200).json({
                code: 200,
                data: purchaseBookData
            })

        } catch (e) {
            next(e);
        }
    }

    async bookSoldBySeller(req, res, next) {
        try {

            const query = `SELECT s.id,b.id,s.name AS seller_name,b.bookName AS book_name
                           FROM sellers s INNER JOIN books b ON s.id = b.sid`;

            let sellerData = await bookModal.bookDbOpreation(query);

            return res.status(200).json({
                code: 200,
                data: sellerData
            })

        } catch (e) {
            next(e);
        }
    }

    async getSoldBook(req,res,next){
        try{

            const query = `SELECT o.bid, b.bookName FROM orders o INNER JOIN books b ON o.bid = b.id group BY b.id`;

            let bookData = await bookModal.bookDbOpreation(query);

            return res.status(200).json({
                code: 200,
                data: bookData
            })

        }catch(e){
            next(e);
        }
    }
}

module.exports = new bookController();
