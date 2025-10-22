/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode:'class',
  theme: {
    extend: {
      backgroundImage: {
        'charlie-brown': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='12' viewBox='0 0 20 12'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='charlie-brown' fill='%2397939d' fill-opacity='0.07'%3E%3Cpath d='M9.8 12L0 2.2V.8l10 10 10-10v1.4L10.2 12h-.4zm-4 0L0 6.2V4.8L7.2 12H5.8zm8.4 0L20 6.2V4.8L12.8 12h1.4zM9.8 0l.2.2.2-.2h-.4zm-4 0L10 4.2 14.2 0h-1.4L10 2.8 7.2 0H5.8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
      },
      backgroundColor: {
        lightWhite: '#f7f8fa',
        lightDark: '#1c1f2f',

        macLight: '#f6f7f8',     // fondo principal claro
        macLightOne: '#e3e4e2',     // fondo principal claro
        macPanel: '#ffffff',     // tarjetas o celdas
        macBorder: '#e0e0e0',    // bordes suaves
        macHover: '#f0f1f3',     // hover sutil
      },
      colors: {
        salmon: '#e56952',

        macText: '#2c2c2c',      // texto principal
        macMuted: '#777777',     // texto secundario
        profitGreen: '#2ecc71',  // ganancia
        lossRed: '#e74c3c',      // pérdida
        accentBlue: '#007aff',   // acento azul tipo macOS
      },
      textColor: {
        white: '#e0e0e0',
        black: '#121212',

        macText: '#717072',
        macMuted: '#777777',

        macPanel: '#ffffff',     // tarjetas o celdas
        macBorder: '#e0e0e0',    // bordes suaves
        macHover: '#f0f1f3',     // hover sutil
 
        profitGreen: '#2ecc71',
        lossRed: '#e74c3c',
      },
      fontFamily: {
        heading: 'Times New Roman',
        sans: [ 'SF Pro Display', 'Helvetica Neue', 'Arial', 'sans-serif' ],
        arial: 'Arial',
      },
      fontSize: {
        heading: [
          '2.5rem', {
            lineHeight: '1rem ',
          } 
        ]
      },
      boxShadow: {
        macSoft: '0 4px 12px rgba(0,0,0,0.05)', // sombra difusa tipo macOS
      },
      borderRadius: {
        mac: '16px', // esquinas redondeadas suaves
      },
    },
  },
  plugins: [],
}

