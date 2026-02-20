"use client";

/**
 * NameInput — Autocomplete text input for selecting colleague names.
 * Shows predefined suggestions + allows manual typing.
 * Supports adding multiple names as tags (max limit configurable).
 */
import { useState, useRef, useEffect } from "react";
import { PREDEFINED_NAMES } from "@/types/survey";

interface NameInputProps {
    label: string;
    description?: string;
    value: string[];
    onChange: (names: string[]) => void;
    max?: number;
    currentUser?: string;
}

export default function NameInput({
    label,
    description,
    value,
    onChange,
    max = 5,
    currentUser,
}: NameInputProps) {
    const [inputValue, setInputValue] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [highlightIndex, setHighlightIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const filtered = PREDEFINED_NAMES.filter(
        (name) =>
            name.toLowerCase().includes(inputValue.toLowerCase()) &&
            !value.includes(name) &&
            name !== currentUser
    );

    // Close dropdown on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    function addName(name: string) {
        const trimmed = name.trim();
        if (!trimmed || value.includes(trimmed) || value.length >= max) return;
        onChange([...value, trimmed]);
        setInputValue("");
        setShowSuggestions(false);
        setHighlightIndex(-1);
        inputRef.current?.focus();
    }

    function removeName(name: string) {
        onChange(value.filter((n) => n !== name));
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter") {
            e.preventDefault();
            if (highlightIndex >= 0 && highlightIndex < filtered.length) {
                addName(filtered[highlightIndex]);
            } else if (inputValue.trim()) {
                addName(inputValue);
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightIndex((prev) => Math.min(prev + 1, filtered.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
            removeName(value[value.length - 1]);
        } else if (e.key === "Escape") {
            setShowSuggestions(false);
        }
    }

    return (
        <div ref={containerRef} className="mb-5">
            <label className="block text-sm font-medium text-academic-700 mb-1.5">
                {label}
                <span className="text-xs text-academic-400 ml-2">
                    (max {max})
                </span>
            </label>
            {description && (
                <p className="text-xs text-academic-400 mb-2">{description}</p>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-2">
                {value.map((name) => (
                    <span
                        key={name}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-academic-100 text-academic-700 rounded-full text-sm font-medium"
                    >
                        {name}
                        <button
                            type="button"
                            onClick={() => removeName(name)}
                            className="w-4 h-4 rounded-full bg-academic-300 text-white flex items-center justify-center text-xs hover:bg-red-400 transition-colors"
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>

            {/* Input + Dropdown */}
            {value.length < max && (
                <div className="relative">
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            setShowSuggestions(true);
                            setHighlightIndex(-1);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a name..."
                        className="w-full px-4 py-2.5 border border-parchment-400 rounded-lg bg-white text-sm text-academic-800 placeholder-academic-300"
                    />

                    {showSuggestions && filtered.length > 0 && (
                        <div className="absolute z-20 w-full mt-1 bg-white border border-parchment-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                            {filtered.map((name, idx) => (
                                <button
                                    key={name}
                                    type="button"
                                    onClick={() => addName(name)}
                                    className={`autocomplete-option w-full text-left px-4 py-2 text-sm text-academic-700 ${idx === highlightIndex ? "bg-academic-50 font-medium" : ""
                                        }`}
                                >
                                    {name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
