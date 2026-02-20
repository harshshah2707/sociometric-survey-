/**
 * Google Sheets API integration
 * Handles authentication and data append operations
 */
import { google } from "googleapis";

/** Get authenticated Google Sheets client */
function getGoogleSheetsClient() {
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const sheetId = process.env.GOOGLE_SHEET_ID;

    if (privateKey) {
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
    }

    if (!clientEmail || !privateKey || !sheetId) {
        throw new Error(
            "Missing Google Sheets credentials. Set GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, and GOOGLE_SHEET_ID."
        );
    }

    const auth = new google.auth.JWT(clientEmail, undefined, privateKey, [
        "https://www.googleapis.com/auth/spreadsheets",
    ]);

    const sheets = google.sheets({ version: "v4", auth });
    return { sheets, sheetId };
}

/** Append a row of values to the Google Sheet */
export async function appendToSheet(values: string[][]) {
    const { sheets, sheetId } = getGoogleSheetsClient();

    await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: "Sheet1!A1",
        valueInputOption: "USER_ENTERED",
        requestBody: { values },
    });
}

/** Read all rows from the Google Sheet */
export async function readFromSheet(): Promise<string[][]> {
    const { sheets, sheetId } = getGoogleSheetsClient();

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: "Sheet1!A1:ZZ",
    });

    return (response.data.values as string[][]) || [];
}
