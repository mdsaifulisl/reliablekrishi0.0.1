const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "krishi",
});

module.exports = pool.promise();

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "reliable_blog",
//   password: "Vla=Z%G(e4h9",
//   database: "reliable_blogs",
// });

// module.exports = pool.promise();