var mysql = require('mysql');

var con = mysql.createConnection({
  host     : 'remotemysql.com',
  user     : 'GCWBkOzvMb',
  password : 'GDF5AXH7oQ',
  database : 'GCWBkOzvMb',
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});