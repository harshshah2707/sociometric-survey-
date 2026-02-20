/**
 * GET /api/responses
 * Fetches all responses from Google Sheet for visualization.
 */
import { NextResponse } from "next/server";
import { readFromSheet } from "@/lib/googleSheets";

export async function GET() {
    try {
        const rows = await readFromSheet();
        return NextResponse.json({ success: true, data: rows }, { status: 200 });
    } catch (error: unknown) {
        console.error("Read error:", error);
        const message =
            error instanceof Error ? error.message : "Unknown error occurred";
        return NextResponse.json(
            { success: false, message, data: [] },
            { status: 500 }
        );
    }
}
