const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 3000 });

server.on('connection', (socket) => {
  console.log('Client connected');

  // Send a welcome message to the connected client
  socket.send('Welcome to the WebSocket server!');

  // Listen for messages from the client
  socket.on('message', (message) => {
    console.log(`Received message: ${message}`);

    // You can send a message back to the client or broadcast it to all connected clients
    socket.send(`You said: ${message}`);
  });

  // Listen for the socket to close
  socket.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is listening on port 3000');