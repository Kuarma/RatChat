let pool = null;
// connect to the database
const initializeMariaDB = async () => {
  const mariadb = require("mariadb");
  const config = {
    database: process.env.DB_NAME || "ratchat",
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "mychat",
    password: process.env.DB_PASSWORD || "supersecret123",
    connectionLimit: 5,
    connectTimeout: 30000, // Increase the connection timeout to 30 seconds
  };
  console.log('MariaDB pool configuration:', config);
  pool = mariadb.createPool(config);
};

async function executeSQL(query) {
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(query);
    console.log(res);

  } catch (err) {
    throw err;
  } finally {
    if (conn) return conn.end();
  }
}


//const executeSQL = async (query) => {
//  let 
//  try {
//    conn = await pool.getConnection();
//    const res = await conn.query(query);
//    return res;
//  } catch (err) {
//    console.log(err)
//  } finally {
//    if (conn) return conn.end();
//  }
//};

const initializeDBSchema = async () => {
  const userTableQuery = `CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT,
    active BOOLEAN NOT NULL DEFAULT 0,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
  );`;
  
  await executeSQL(userTableQuery);
  const messageTableQuery = `CREATE TABLE IF NOT EXISTS messages (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    message VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );`;
  await executeSQL(messageTableQuery);
};

module.exports = { executeSQL, initializeMariaDB, initializeDBSchema };
