const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc'; // Симетричний алгоритм
const IV_LENGTH = 16; // Довжина ініціалізаційного вектора

// Функція для шифрування
function encrypt(text, key) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(key, 'utf-8'), iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf-8'), cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// Функція для розшифрування
function decrypt(encryptedText, key) {
    const parts = encryptedText.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = Buffer.from(parts[1], 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(key, 'utf-8'), iv);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString('utf-8');
}

module.exports = { encrypt, decrypt };
