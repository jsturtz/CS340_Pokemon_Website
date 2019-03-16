var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_sturtzj',
  password        : 'JJemailJJ1226?',
  database        : 'cs340_sturtzj'
});

module.exports.pool = pool;
