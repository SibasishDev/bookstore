'use strict;'
const createError = require('http-errors');
const sellerModal = require('../modal/seller.modal');

class sellerController {
  
    async insertSeller(req, res, next) {
        try {

            const { sName } = req.body;

            if (!sName) throw createError.BadRequest('Please enter seller name');

            const query = `INSERT INTO sellers (name) VALUES ('${sName}')`;

            let insertSeller = await sellerModal.sellerDbOpreation(query);

            if (!insertSeller) throw createError.BadRequest('something went wrong');

            return res.status(200).json({
                status: 200,
                message: "seller created successfully",
                sId : insertSeller.insertId
            });

        } catch (e) {
            next(e);
        }

    }

    async updateSeller(req, res, next) {
        try {

            const { sid, sName } = req.body;
            if (!sid || !sName) throw createError.BadRequest('seller id and seller name is required!');

            const query = `UPDATE sellers SET name = '${sName}' where id = ${sid}`;

            let updateSeller = await sellerModal.sellerDbOpreation(query);

            console.log(updateSeller.changedRows != 0);

            if (updateSeller.changedRows == 0) return res.status(400).json({
                status: 400,
                message: "something went wrong!",
            });

            return res.status(200).json({
                status: 200,
                message: "seller update successfully",
            });

        } catch (e) {
            next(e);
        }
    }

    async getAllSeller(req, res, next) {
        try {

            const query = `select * from sellers`;

            let sellerData = await sellerModal.sellerDbOpreation(query);

            if (!sellerData.length) throw createError.NotFound('no seller found in db');

            return res.status(200).json({
                code: 200,
                data: sellerData
            });

        } catch (e) {
            next(e);
        }
    }

    async getSeller(req, res, next) {
        try {
            const { sid } = req.body;

            if (!sid) throw createError.BadRequest('seller id required');

            const query = `select id,name from sellers where id = ${sid}`;

            let data = await sellerModal.sellerDbOpreation(query);

            if (!data.length) throw createError.NotFound('seller not found in db');

            return res.status(200).json({
                code: 200,
                data: data
            });

        } catch (e) {
            next(e);
        }
    }

    async deleteSeller(req, res, next) {
        try {

            const { sid } = req.body;

            if (!sid) throw createError.BadRequest('seller id required');

            let query1 = `select id from sellers where id = ${sid}`;

            let [isSellerExist] = await sellerModal.sellerDbOpreation(query1);

            if (!isSellerExist) throw createError.BadRequest('seller not found');

            let query2 = `DELETE from sellers where id = ${sid}`;

            let deleteSeller = await sellerModal.sellerDbOpreation(query2);

            return res.status(200).json({
                code: 200,
                message: "seller deleted successfully"
            });

        } catch (e) {
            next(e);
        }
    }

}

module.exports = new sellerController();