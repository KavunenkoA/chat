const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });
const clients = new Set();

server.on('connection', (ws) => {
    clients.add(ws);

    ws.on('message', (data) => {
        const message = JSON.parse(data);
        console.log('Received:', message);

        // Відправляємо повідомлення всім підключеним клієнтам
        clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
    });

    ws.on('close', () => {
        clients.delete(ws);
    });
});

console.log('WebSocket server is running on ws://localhost:8080');