"use client";

/**
 * Section 8 — Comments
 */
import type { Comments } from "@/types/survey";

interface Section8Props {
    data: Comments;
    onChange: (data: Comments) => void;
}

export default function Section8({ data, onChange }: Section8Props) {
    return (
        <div className="section-enter space-y-4">
            <p className="text-sm text-academic-500 mb-4">
                Please share any additional thoughts, observations, or context about
                your workplace relationships and interactions.
            </p>

            <div>
                <label className="block text-sm font-medium text-academic-700 mb-2">
                    Additional Comments
                </label>
                <textarea
                    value={data.additionalComments}
                    onChange={(e) =>
                        onChange({ additionalComments: e.target.value })
                    }
                    placeholder="Share any observations about workplace dynamics, team cohesion, communication barriers, or other relevant information..."
                    rows={8}
                    className="w-full px-4 py-3 border border-parchment-400 rounded-lg bg-white text-sm resize-y min-h-[160px]"
                />
            </div>

            <div className="bg-insight-green/10 border border-insight-green/20 rounded-lg p-4 mt-4">
                <p className="text-sm text-academic-600">
                    <strong>Thank you!</strong> After clicking &ldquo;Submit Survey&rdquo; on this page,
                    your response will be recorded. All data is treated confidentially
                    and used solely for organizational research.
                </p>
            </div>
        </div>
    );
}
