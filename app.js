"use strict;"
const express = require("express");

const app = express();

const createError = require('http-errors');

const morgan = require('morgan');


require('dotenv').config();

const PORT = process.env.PORT || 8080;

const router = require('./router/main.router');

const dbConnection = require('./connection/sql.connection');


app.use(express.json({
    limit: "50mb",
    type: 'application/json'
}));

app.use(express.urlencoded({
    extended: true,
    limit: "50mb"
}));

const server = app.listen(PORT, () => console.log(`Server listening on ${PORT}`));

/**
 * catch 404 and forward to error handler
 */

app.use('/api',router);

app.use((req, res, next) => {
    next(createError(404, "Not Found"));
});

/**
 * error handler
 */
app.use((err, req, res, next) => {
    console.log(err);
    return res.status(err.status || 500).json({
        error: {
            status: err.status || 500,
            message: !err.status || err.status === 500 ? "Internal server error" : err.message
        }
    });
});