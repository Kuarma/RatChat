const WebSocket = require("ws");
const { executeSQL } = require("./database");
const cookieParser = require("cookie-parser");

let users = new Map();

// Intiiate the websocket server
const initializeWebsocketServer = (server) => {
  const wss = new WebSocket.Server({ server });
  wss.on("connection", onConnection);
  wss.on("close", onClose);
  //wss.upgradeReq.headers.cookie

  //websocketServer.use(cookieParser());
};

// If a new connection is established, the onConnection function is called
const onConnection = async (ws, req) => {
  req.headers.cookie.split(";").forEach((cookie) => {
    const [key, value] = cookie.split("=");
    if (key === "username") {
      ws.username = value;
    }
  });
  
  console.log(`New user connected`);
  ws.on("message", (message) => onMessage(ws, message));

  
  //executeSQL(`UPDATE users SET active = 1 WHERE username = ${ws.username};`);
};

// if a connection is closed, the onClose function is called
const onClose = async (ws, req) => {
  req.headers.cookie.split(";").forEach((cookie) => {
    const [key, value] = cookie.split("=");
    if (key === "username") {
      ws.username = value;
    }
  });
  
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