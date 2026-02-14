/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./styles/**/*.css",
    ],
    theme: {
        extend: {
            fontFamily: {
                orbitron: ["Orbitron", "sans-serif"],
                rajdhani: ["Rajdhani", "sans-serif"],
            },
        },
    },
    plugins: [],
}