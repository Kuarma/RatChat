const WebSocket = require("ws");
const { executeSQL } = require("./database");
let users = {};

// Intiiate the websocket server
const initializeWebsocketServer = (server) => {
  const websocketServer = new WebSocket.Server({ server });
  websocketServer.on("connection", onConnection);
  websocketServer.on("close", onClose);
    
};

// If a new connection is established, the onConnection function is called
const onConnection = (ws) => {

  console.log(`New user connected`);
  ws.on("message", (message) => messageRouter(ws, message));
  
  //executeSQL(`UPDATE users SET active = 1 WHERE username = ${ws.username};`);
};

//If a message was recieved check what kind of message it is
const messageRouter = (ws, message) => {
  message = JSON.parse(message);
  if (message.hasOwnProperty("message")) {
    onMessage(ws, message);
  }
  if (message.hasOwnProperty("checkUsers")) {
    checkUsers(ws, message);
  }
  if (message.hasOwnProperty("username")) {
    setActiveUser(ws, message);
  }
} 
// if a user logs in the setActiveUser function is called
const setActiveUser = (ws, message) => {
  users.add(message.username);
}


// if a connection is closed, the onClose function is called
const onClose = (ws) => {
  console.log(`A user disconnected`);
};

// If a new message is received, the onMessage function is called
const onMessage = (ws, message) => {
  console.log("Message received: " + message);
  message = JSON.parse(message);
  executeSQL(`INSERT INTO messages (user_id, message) VALUES (${message.user_id}, ${message.msg});`);
  //Send message and id to all users
  //ws.send(JSON.stringify({ user_id: ws.user_id, message: message }));
  ws.send(message);
};

module.exports = { initializeWebsocketServer };