const dbOpreation = require('../connection/sql.connection');

class sellerModal {

    sellerDbOpreation(query){
        return new Promise((resolve, reject) => {
            dbOpreation.query(query, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }
}

module.exports = new sellerModal();