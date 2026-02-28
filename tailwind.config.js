/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        violet: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
      },
      animation: {
        'blob-slow':   'blob 12s ease-in-out infinite',
        'blob-med':    'blob 9s  ease-in-out infinite 2s',
        'blob-fast':   'blob 7s  ease-in-out infinite 4s',
        'spin-slow':   'spin 1.4s linear infinite',
      },
      keyframes: {
        blob: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%':      { transform: 'translate(40px, -30px) scale(1.08)' },
          '66%':      { transform: 'translate(-20px, 20px) scale(0.94)' },
        },
      },
    },
  },
  plugins: [],
}
