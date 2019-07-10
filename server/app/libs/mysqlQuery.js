const dbData = require('../../config/config');
const mysql = require('mysql');

module.exports = function (queryString, queryArg) {
  let mysqlServer = mysql.createConnection(dbData);
  if (!queryArg) {
    queryArg = '';
  }
  return new Promise((resolve, reject) => {
    mysqlServer.query(queryString + queryArg, (err, results) => {
      if(err) {
        console.log("Query failed", err);
        mysqlServer.end(function(err){
          console.log("Error", err);
        });
      } else {
        mysqlServer.end(function(err) {
          if(err) {
            console.log("Warning: disconnection failed", err);
          } else {
            resolve(results);
          }
        });
      }
    });
  });
  
}