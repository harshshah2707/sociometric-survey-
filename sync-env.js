const fs = require('fs');
const path = require('path');

try {
    const jsonPath = 'C:/Users/HP/Downloads/useful-melody-445911-t8-0df3e3575437.json';
    const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    // We want literal \n in the .env file if the code uses .replace(/\\n/g, "\n")
    // If the JSON private_key has real newlines, we escape them to \n
    const escapedKey = json.private_key.replace(/\n/g, '\\n');

    const envPath = path.join(__dirname, '.env.local');
    const envContent = `# Google Sheets API Credentials
GOOGLE_CLIENT_EMAIL=${json.client_email}
GOOGLE_PRIVATE_KEY="${escapedKey}"
GOOGLE_SHEET_ID=16yoTayyRGpzIHqH7iezkQ456VKOg9VAlld0z9cOlcnk
`;

    fs.writeFileSync(envPath, envContent);
    console.log('SUCCESS: .env.local has been updated correctly from JSON source');
} catch (err) {
    console.error('ERROR: Failed to update .env.local');
    console.error(err);
    process.exit(1);
}
