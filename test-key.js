const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Robust parsing logic copied from googleSheets.ts
function getParsedKey(rawKey) {
    if (!rawKey) return null;
    let privateKey = rawKey;
    // Handle literal newlines and escaped \n
    privateKey = privateKey.replace(/\\n/g, "\n");
    // Remove surrounding quotes if they were included by accident
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
        privateKey = privateKey.slice(1, -1);
    }
    // Ensure the BEGIN and END lines are correct
    if (!privateKey.includes("-----BEGIN PRIVATE KEY-----")) {
        privateKey = `-----BEGIN PRIVATE KEY-----\n${privateKey}`;
    }
    if (!privateKey.includes("-----END PRIVATE KEY-----")) {
        privateKey = `${privateKey}\n-----END PRIVATE KEY-----\n`;
    }
    return privateKey;
}

const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const privateKeyMatch = envContent.match(/GOOGLE_PRIVATE_KEY=(.*)/);

if (!privateKeyMatch) {
    console.error('Could not find GOOGLE_PRIVATE_KEY in .env.local');
    process.exit(1);
}

const rawKey = privateKeyMatch[1];
const privateKey = getParsedKey(rawKey);

console.log('Parsed Key Length:', privateKey.length);
console.log('Parsed Key Start:', JSON.stringify(privateKey.substring(0, 50)));

try {
    const sign = crypto.createSign('RSA-SHA256');
    sign.update('test');
    sign.sign(privateKey);
    console.log('SUCCESS: Key is valid and can sign data');
} catch (err) {
    console.error('FAILURE: Key validation failed!');
    console.error(err);
    process.exit(1);
}
