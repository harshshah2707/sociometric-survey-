/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                serif: ["Merriweather", "Georgia", "serif"],
                mono: ["JetBrains Mono", "monospace"],
            },
            colors: {
                parchment: {
                    50: "#fefdfb",
                    100: "#fdf9f0",
                    200: "#faf0dc",
                    300: "#f5e3c2",
                    400: "#efd4a4",
                    500: "#e6c285",
                },
                academic: {
                    50: "#f0f4f8",
                    100: "#d9e2ec",
                    200: "#bcccdc",
                    300: "#9fb3c8",
                    400: "#829ab1",
                    500: "#627d98",
                    600: "#486581",
                    700: "#334e68",
                    800: "#243b53",
                    900: "#102a43",
                },
                insight: {
                    blue: "#4a90d9",
                    green: "#27ae60",
                    purple: "#8e44ad",
                    red: "#c0392b",
                    orange: "#e67e22",
                    teal: "#16a085",
                },
            },
            animation: {
                "fade-in": "fadeIn 0.5s ease-out",
                "slide-up": "slideUp 0.4s ease-out",
                "pulse-soft": "pulseSoft 2s infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { opacity: "0", transform: "translateY(16px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                pulseSoft: {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0.7" },
                },
            },
        },
    },
    plugins: [],
};
