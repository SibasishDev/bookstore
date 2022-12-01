const dbOpreation = require('../connection/sql.connection');

class customerModal {

   customerDbOpreation(query){
        return new Promise((resolve, reject) => {
            dbOpreation.query(query, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }
}

module.exports = new customerModal();