const mysql     = require('mysql');
let   connection;
const config = require('../db/config/config_detail')
connection = mysql.createPool({
	connectionLimit : 150,
	host            : config.db_host,
	user            : config.db_user_name,
	password        : config.db_password,
	database        : config.db_name,
	charset         : "utf8mb4",
});


connection.getConnection((err, connection) => {
    if(err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log("mysql connected!");
});

let dbHandler = {

    executeQuery : function (queryObj) {
        return new Promise((resolve, reject) => {
            const start = new Date();
            queryObj.query = queryObj.query.replace(/\s+/g, " ");
            let finalQuery = connection.query(queryObj.query, queryObj.args, (err, result) => {
                queryObj.sql = finalQuery.sql;
                queryObj.sql = queryObj.sql.replace(/[\n\t]/g, '');
                if(err && (err.code === 'ER_LOCK_DEADLOCK' || err.code === 'ER_QUERY_INTERRUPTED' || err.code === 'ER_LOCK_WAIT_TIMEOUT')) {
                    setTimeout(() => {
                        module.exports.dbHandler.executeQuery(queryObj)
                            .then(result => resolve(result), (error, result) => reject(error, result));
                    }, 50);
                } else if(err) {
                    return reject(err, result);
                } else {
                    return resolve(result);
                }
            });
        });
    }

};

module.exports.connection  =  connection;
module.exports.dbHandler   =  dbHandler;

