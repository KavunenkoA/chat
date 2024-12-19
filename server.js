const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Вказуємо директорію, в якій знаходяться статичні файли
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`Сервер запущено на http://localhost:${PORT}`);
});
