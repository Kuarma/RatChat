const initializeAPI = (app) => {
  // default REST api endpoint
  app.get("/api/Login", (req, res) => {
      let { email, password} = req.body;

      if(executeSQL(`SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`)){
        //response code 200 send json object
        res.status(200).json({message: "Login successful"})
        }else{
        //response code 401 send json object
         res.status(401).json({message: "Login failed"});
        }});
  app.get("/api/Registration", (req, res) => {
    let { email, password, username} = req.body;


    //check if email already exists
    if(executeSQL(`SELECT * FROM users WHERE email = '${email}'`)){
      //response code 401 send json object
      res.status(401).json({message: "Email already exists"});
      return;
    }
    if(executeSQL(`INSERT INTO users (email, password, username) VALUES ('${email}', '${password}', '${username}')`)){
      //response code 200 send json object
      res.status(200).json({message: "Registration successful"})
    }
    else {
      //response code 401 send json object
       res.status(401).json({message: "Registration failed"});
    }});
};

module.exports = { initializeAPI };