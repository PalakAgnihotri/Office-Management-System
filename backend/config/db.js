const mysql = require("mysql2");

const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "pass123",
  database: "office_management"
});

module.exports = connection.promise();
