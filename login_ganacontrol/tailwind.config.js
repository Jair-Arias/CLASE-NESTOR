/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'ganadero': {
          'verde': '#166534',
          'verde-claro': '#22c55e',
          'verde-oscuro': '#14532d',
          'marron': '#78350f',
          'beige': '#fef3c7',
          'gris': '#374151',
          'gris-oscuro': '#1f2937'
        }
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'login-bg': "url('/src/assets/fondo-login.jpg')",
        'register-bg': "url('/src/assets/fondo-register.jpg')",
        'dashboard-bg': "linear-gradient(135deg, #14532d 0%, #1f2937 100%)"
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}