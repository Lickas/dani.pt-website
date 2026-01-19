/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                archivo: ['Archivo', 'sans-serif'],
                inter: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
                primary: {
                    DEFAULT: '#E60000',
                    hover: '#CC0000',
                    foreground: '#FFFFFF',
                },
                background: {
                    DEFAULT: '#FFFFFF',
                    subtle: '#F4F4F4',
                    dark: '#1A1A1A',
                },
                text: {
                    primary: '#1A1A1A',
                    secondary: '#666666',
                    muted: '#999999',
                },
                border: '#E5E5E5',
                'border-strong': '#1A1A1A',
            },
            borderRadius: {
                sm: '2px',
                DEFAULT: '2px',
                md: '4px',
                lg: '4px',
            },
            spacing: {
                '18': '4.5rem',
                '22': '5.5rem',
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
                'fade-in': 'fadeIn 0.3s ease-out forwards',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
