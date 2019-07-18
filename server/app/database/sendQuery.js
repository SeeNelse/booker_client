const dbData = require('../../config/config');
const mysql = require('mysql');
const pool  = mysql.createPool(dbData);

module.exports = function(query) {
  return new Promise((resolve, reject) => {
    pool.getConnection(function(err, connection) {
      if (err) throw err;
      connection.query(query, function (error, results, fields) {
        connection.release();
        if (error) throw error;
        resolve(results);
      });
    });
  });
}