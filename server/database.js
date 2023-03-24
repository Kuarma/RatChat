let pool = null;

const initializeMariaDB = async () => {
  const mariadb = require("mariadb");
  pool = mariadb.createPool({
    database: process.env.DB_NAME || "mychat",
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "supersecret123",
    connectionLimit: 5,
  });
};

const executeSQL = async (query) => {
  console.log(query);
  try {
    conn = await pool.getConnection();
    const res = await conn.query(query);
    conn.end();
    //log the result and make a new line
    console.log('---------------------------------------------');
    console.log(res);
    console.log('---------------------------------------------');
    return res;
  } catch (err) {
    conn.end();
    console.log(err)
  }
};

const initializeDBSchema = async () => {
  //delete the old talbes
  const deleteMessageTable = `DROP TABLE IF EXISTS messages;`;
  await executeSQL(deleteMessageTable);
  const deleteUserTable = `DROP TABLE IF EXISTS users;`;
  await executeSQL(deleteUserTable);
  //create new tables
  const userTableQuery = `CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (username)
  );`;
  await executeSQL(userTableQuery);
  const messageTableQuery = `CREATE TABLE IF NOT EXISTS messages (
    id INT NOT NULL AUTO_INCREMENT,
    user_name VARCHAR(255) NOT NULL,
    message VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_name) REFERENCES users(username)
  );`;
  await executeSQL(messageTableQuery);
};

module.exports = { executeSQL, initializeMariaDB, initializeDBSchema };