const { executeSQL } = require("./database");
const { jwt } = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

//function createJWT(email, password) {
//  const payload = { email, password };
//  const options = { expiresIn: "1h" };
//  return jwt.sign(payload, secret, options);
//}
//const authenticateJWT = (req, res, next) => {
//  const token = req.headers.token;
//  if (!token) {
//    return res.status(403).json({ message: "Token expired" });
//  }
//  try {
//    const data = jwt.verify(token, "");
//    req.email = data.email;
//    req.password = data.password;
//    return next();
//  } catch {
//    return res.sendStatus(403).json({ message: "Token expired" });
//  }
//};
const initializeAPI = (app) => {
  // default REST api endpoint
  app.post("/api/Login", async (req, res) => {
    let request = req.body;
//    try {
      const result = await executeSQL(`SELECT * FROM users WHERE email = '${request.email}' AND password = '${request.password}'`);
//      if (result.length !== 0) {
//        const token = createJWT(request.email, request.password);
//        res.cookie("token", token, { httpOnly: true })
//        .status(200)
//        .json({ message: "Login successful" });
//      } else {
//        res.status(401).json({ message: "Login failed" });
//      }
//    } catch (error) {
//      console.log(error)
      if (result.length !== 0) {
      res.status(200).json({ message: "login succesful" });
      } 
      else {
        res.status(401).json({ message: "Login failed" });
      }
    
  });

  app.post("/api/Registration", async (req, res) => {
    //Trun the JSON request body into a JS object
    let request = req.body;
    //check the request body for SQL injection
    if (request.email.includes("'") || request.password.includes("'") || request.username.includes("'")) {
      //fix the request body with a loop
      for (let key in request) {
        request[key] = request[key].replace(/'/g, "''");
      }
      return;
    }
    // check if request empty
    if (!request.email || !request.password || !request.username) {
      //response code 401 send json object
      res.status(401).json({ message: "Please fill out all fields" });
      return;
    }
    //check if email already exists
    try {
      const checkEmail = await executeSQL(`SELECT * FROM users WHERE email = '${request.email}'`);
      const checkUsername = await executeSQL(`SELECT * FROM users WHERE username = '${request.username}'`);

      if (checkEmail.length === 0 && checkUsername.length === 0) {
        await executeSQL(`INSERT INTO users (email, password, username) VALUES ('${request.email}', '${request.password}', '${request.username}')`);
        res.status(200).json({ message: "Registration successful" });
        //end the process
        return;
      }
      else if (checkEmail.length !== 0) {
        res.status(401).json({ message: "Email already exists" });
        return;
      }
      else if (checkUsername.length !== 0) {
        res.status(401).json({ message: "Username already exists" });
        return;
      }
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "An server error occured" });
    }
  });
};
module.exports = { initializeAPI };