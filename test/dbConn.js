const mysql = require("mysql");
const conn = mysql.createConnection({
    host : "coredot-test-db.c0og555lagsl.ap-northeast-2.rds.amazonaws.com",
    port : "3306",
    user : "admin",
    password : "coredot1206!!",
    database : "mysql"
});

conn.connect();

conn.query('SELECT * from user', (error, rows, fields) => {
  if (error) throw error;
  console.log('User info is: ', rows);
});

conn.end();

