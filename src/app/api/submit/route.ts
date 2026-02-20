/**
 * POST /api/submit
 * Receives survey JSON, flattens it, appends to Google Sheet.
 */
import { NextRequest, NextResponse } from "next/server";
import { appendToSheet, readFromSheet } from "@/lib/googleSheets";
import { flattenSurveyData } from "@/lib/flattenSurvey";
import type { SurveyData } from "@/types/survey";

export async function POST(request: NextRequest) {
    try {
        const body: SurveyData = await request.json();

        // Add submission timestamp
        body.submittedAt = new Date().toISOString();

        // Flatten nested data into header + value arrays
        const { headers, values } = flattenSurveyData(body);

        // Check if sheet already has headers; if not, write them first
        let existingRows: string[][] = [];
        try {
            existingRows = await readFromSheet();
        } catch {
            // Sheet may be empty, that's fine
        }

        const rowsToAppend: string[][] = [];

        // If no existing data, write headers first
        if (existingRows.length === 0) {
            rowsToAppend.push(headers);
        }

        rowsToAppend.push(values);
        await appendToSheet(rowsToAppend);

        return NextResponse.json(
            { success: true, message: "Survey submitted successfully." },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error("Submit error:", error);
        const message =
            error instanceof Error ? error.message : "Unknown error occurred";
        return NextResponse.json(
            { success: false, message },
            { status: 500 }
        );
    }
}
