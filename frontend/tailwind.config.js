/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class', // modo oscuro por clase en <html>
  theme: {
    extend: {
      colors: {
        // Paleta MORADA de marca (alineada al índigo oscuro del logo en 900/950).
        // Se mantiene la clave `rio` para no romper clases ya usadas.
        rio: {
          50: '#f6f4fe',
          100: '#ede9fd',
          200: '#dcd5fb',
          300: '#c3b5f7',
          400: '#a488f0',
          500: '#8a5fe6',
          600: '#7841d4',
          700: '#6730b4',
          800: '#542a92',
          900: '#2c1e4f', // morado oscuro (fondo dark)
          950: '#1a1230', // casi el fondo del logo
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
