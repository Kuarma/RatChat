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
  ws.on("message", (message) => onMessage(ws, message));
  
  //executeSQL(`UPDATE users SET active = 1 WHERE username = ${ws.username};`);
};

// if a connection is closed, the onClose function is called
const onClose = (ws) => {
  console.log(`A user disconnected`);
};

// If a new message is received, the onMessage function is called
const onMessage = async (ws, message) => {
  let MSG;
  console.log("_______________________________________________________");
  console.log("Message received: " + message);
  console.log("_______________________________________________________");

  message = JSON.parse(message);
  const checkUsername = await executeSQL(`SELECT * FROM users WHERE username = '${message.username}';`);
  if (checkUsername.length === 0) {
    return;
  }
  const savedMSG = await executeSQL(`INSERT INTO messages (user_name, message) VALUES ('${message.username}', '${message.message}');`);
  if (savedMSG.length == 0) {
    return;
  }
  try {
     MSG = await executeSQL(`SELECT * FROM messages WHERE user_name = '${message.username}' AND message = '${message.message}';`);
  }
  catch (error) {
    console.log(error)
    return;
  }

  ws.send(JSON.stringify(MSG));
};

module.exports = { initializeWebsocketServer };