'use strict;'
const createError = require('http-errors');
const customerModal = require('../modal/customer.modal');

class customerController {
    /**
   * insertseller - 
   * @param {*} res 
   * @param {*} next 
   * @returns 
   * @author Sibasish Das
   */

    async insertCustomer(req, res, next) {
        try {

            const { cName } = req.body;

            if (!cName) throw createError.BadRequest('customer name requried');

            const query = `INSERT INTO customers (name) VALUES ('${cName}')`;

            let insertCustomer = await customerModal.customerDbOpreation(query);

            if (!insertCustomer) throw createError.BadRequest('something went wrong');

            return res.status(200).json({
                status: 200,
                message: "customer created successfully",
            });

        } catch (e) {
            next(e);
        }

    }

    async updateCustomer(req, res, next) {
        try {

            const { cid, cName } = req.body;
            if (!cid || !cName) throw createError.BadRequest('seller id and seller name is required!');

            const query = `UPDATE customers SET name = '${cName}' where id = ${cid}`;

            let updateCustomer = await customerModal.customerDbOpreation(query);

            if (updateCustomer.changedRows == 0) return res.status(400).json({
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

    async getAllCustomer(req, res, next) {
        try {

            const query = `select * from customers`;

            let customerData = await customerModal.customerDbOpreation(query);

            if (!customerData.length) throw createError.NotFound('no customers found in db');

            return res.status(200).json({
                code: 200,
                data: customerData
            });

        } catch (e) {
            next(e);
        }
    }

    async getCustomer(req,res,next){
        try{
            const {cid} = req.body;

            if(!cid) throw createError.BadRequest('customer id required');

            const query = `select id,name from customers where id = ${cid}`;

            let [data] = await customerModal.customerDbOpreation(query);

            if (!data) throw createError.NotFound('customer not found in db');

            return res.status(200).json({
                code: 200,
                data: data
            });

        }catch(e){
            next(e);
        }
    }

    async deleteCustomer(req, res, next) {
        try {

            const { cid } = req.body;

            if (!cid) throw createError.BadRequest('customer id required');

            let query1 = `select id from customers where id = ${cid}`;

            let isCustomerExist = await customerModal.customerDbOpreation(query1);

            if (!isCustomerExist.length) throw createError.BadRequest('customer not found');

            let query2 = `DELETE from customers where id = ${cid}`;

            let deleteCustomer = await customerModal.customerDbOpreation(query2);


            if (deleteCustomer.affectedRows == 1) return res.status(200).json({
                code: 200,
                message: "customer deleted successfully"
            });

            throw createError.BadRequest("Something went wrong.");

        } catch (e) {
            next(e);
        }
    }

}

module.exports = new customerController();