const mysql = require('mysql2');
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'book_store',
        connectionLimit: 10,
        waitForConnections: true,
        queueLimit: 0
    });
    pool.getConnection((err, connection) => {
        if (err)
            throw err;
        console.log('Database connected successfully');
        connection.release();
        return connection;
    });
module.exports = pool