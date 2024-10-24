const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid'); // Пакет uuid для унікальних ID
const wss = new WebSocket.Server({ port: 8080 });

class Client {
    constructor(id, name, ws) {
        this.id = id;
        this.name = name;
        this.ws = ws;
    }
}

let clients = [];

wss.on('connection', (ws) => {
    // Створюємо новий клієнт з унікальним ID
    const clientId = uuidv4();
    const client = new Client(clientId, 'Анонім', ws);
    clients.push(client);

    ws.on('message', (data) => {
        const message = JSON.parse(data);

        if (message.type === 'setName') {
            client.name = message.name;
        } else if (message.type === 'chat') {
            const broadcastMessage = JSON.stringify({
                clientId: client.id,
                name: client.name,
                message: message.text
            });

            // Відправляємо повідомлення всім клієнтам
            clients.forEach((c) => {
                c.ws.send(broadcastMessage);
            });
        }
    });

    ws.on('close', () => {
        // Видаляємо клієнта зі списку при відключенні
        clients = clients.filter(c => c.id !== clientId);
    });
});

console.log('WebSocket сервер працює на порті 8080');
