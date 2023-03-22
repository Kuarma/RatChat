const { executeSQL } = require("./database");

const initializeAPI = (app) => {
  // default REST api endpoint
  app.post("/api/Login", (req, res) => {
    let request = req.body;

      if(executeSQL(`SELECT * FROM users WHERE email = '${request.email}' AND password = '${request.password}'`)){
        //response code 401 send json object
        res.status(401).json({message: "Login failed"});
        }else{
        //response code 200 send json object
        res.status(200).json({message: "Login successful"})
        }});


  app.post("/api/Registration", (req, res) => {

    //Trun the JSON request body into a JS object
    let request = req.body;

    //check the request body for SQL injection
    if(request.email.includes("'") || request.password.includes("'") || request.username.includes("'")){
      //fix the request body with a loop
      for(let key in request){
        request[key] = request[key].replace(/'/g, "''");
      }
      return;
    }

    // check if request empty
    if(!request.email || !request.password || !request.username){
      //response code 401 send json object
      res.status(401).json({message: "Please fill out all fields"});
      return;
    }

    //check if email already exists
    if(!executeSQL(`SELECT * FROM users WHERE email = '${request.email}'`)){
      //response code 401 send json object
      res.status(401).json({message: "There is already an account with this email"});
      return;
    }
    if(executeSQL(`INSERT INTO users (email, password, username) VALUES ('${request.email}', '${request.password}', '${request.username}')`)){
      //response code 200 send json object
      res.status(200).json({message: "Registration successful"})
      //end the process
      return;
    }
    else {
      //response code 401 send json object
       res.status(401).json({message: "Something went wrong while registering"});
        //end the process
        return;
    }});
};

module.exports = { initializeAPI };