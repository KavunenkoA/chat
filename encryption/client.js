const WebSocket = require('ws');
const { encrypt, decrypt } = require('./encryption'); // Імпорт шифрування
const yargs = require('yargs');

// Парсинг аргументів командного рядка
const argv = yargs
    .option('name', {
        alias: 'n',
        describe: 'Ваше ім\'я',
        type: 'string',
        demandOption: true
    })
    .option('sessionId', {
        alias: 's',
        describe: 'ID сесії',
        type: 'string',
        demandOption: true
    })
    .option('key', {
        alias: 'k',
        describe: 'Ключ шифрування',
        type: 'string',
        demandOption: true
    })
    .help()
    .argv;

const ws = new WebSocket('ws://localhost:8080'); // Адреса сервера

const encryptionKey = argv.key.padEnd(32, '0').slice(0, 32); // Приведення ключа до 256 біт

// Підключення до сервера
ws.on('open', () => {
    console.log(`Connected to the server as ${argv.name}`);
    ws.send(JSON.stringify({
        type: 'connect',
        name: argv.name,
        sessionId: argv.sessionId,
    }));
});

// Обробка вхідних повідомлень
ws.on('message', (data) => {
    const message = JSON.parse(data);
    if (message.type === 'message') {
        const decryptedContent = decrypt(message.content, encryptionKey);
        console.log(`[${message.sender}]: ${decryptedContent}`);
    }
});

// Надсилання повідомлень
process.stdin.on('data', (input) => {
    const content = input.toString().trim();
    const encryptedContent = encrypt(content, encryptionKey);
    ws.send(JSON.stringify({
        type: 'message',
        content: encryptedContent,
    }));
});
