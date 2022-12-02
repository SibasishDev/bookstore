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
                bookId: insertBook.insertId
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

            const query = `SELECT 
            b.id, b.bookName,b.price,d.discount,d.type, 
            case 
                WHEN d.type = 'percentage' 
                THEN round(b.price * (100 - d.discount)/100)
                WHEN d.type = 'amount'
                THEN round(b.price - d.discount) 
            END  as discount_price
        from books b inner join discount d on b.id = d.bId;`;

            let bookData = await bookModal.bookDbOpreation(query);

            if (!bookData.length) throw createError.NotFound('no book found in db');

            // discountPrice,discounttype,discountvalue


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

            console.log(insertOrder);

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

            if (!purchaseBookData.length) throw createError.NotFound('no data found');

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

            const query = `SELECT s.id as sid,b.id as bid,s.name AS seller_name,b.bookName AS book_name
                           FROM sellers s INNER JOIN books b ON s.id = b.sid`;

            let sellerData = await bookModal.bookDbOpreation(query);

            if (!sellerData.length) throw createError.NotFound('no data found');

            return res.status(200).json({
                code: 200,
                data: sellerData
            })

        } catch (e) {
            next(e);
        }
    }

    async getSoldBook(req, res, next) {
        try {

            const query = `SELECT o.bid, b.bookName FROM orders o INNER JOIN books b ON o.bid = b.id group BY b.id`;

            let bookData = await bookModal.bookDbOpreation(query);

            if (!bookData.length) throw createError.NotFound('no data found');

            return res.status(200).json({
                code: 200,
                data: bookData
            })

        } catch (e) {
            next(e);
        }
    }

    async deleteBook(req, res, next) {
        try {

            const { bid } = req.body;

            if (!bid) throw createError.BadRequest('book id required');

            let query1 = `SELECT id from books where id = ${bid}`;

            let [isBookExist] = await bookModal.bookDbOpreation(query1);

            if (!isBookExist) throw createError.NotFound('book id not exist');

            let query2 = `DELETE from books where id = ${bid}`;

            let deleteBook = await bookModal.bookDbOpreation(query2);

            return res.status(200).json({
                code: 200,
                message: "Book deleted successfully"
            })


        } catch (e) {
            next(e);
        }
    }

    async filterData(req, res, next) {
        try {

            const { word } = req.body;
            if (!word) throw createError.BadRequest('search keyword requird');

            const query = `SELECT * from books where bookName LIKE  '%${word}%' OR authorName LIKE '%${word}%'`;
            
            let filterData = await bookModal.bookDbOpreation(query);

            if (!filterData.length) throw createError.NotFound('no data found');

            return res.status(200).json({
                code: 200,
                data: filterData
            })


        } catch (e) {
            console.log(e.message);
            next(e);
        }
    }


}

module.exports = new bookController();
