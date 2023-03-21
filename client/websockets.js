const Websocket = require('ws');

const server = new webSocket.Server({ port: 8080 });

const client = new set();

server.on('connection', (socket) => {
    clients.add(socket);


    socket.on('message', (message) => {
        for (const client of clients) {
            if (client !== socket && client.readyState === webSocket.OPEN) {
                client.send(message);
            }
        }
    });

    socket.on('close', () => {
        clients.delete(socket);
    });
});
