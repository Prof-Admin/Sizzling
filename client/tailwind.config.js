/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8B1A1A',
          light: '#A52A2A',
          dark: '#6B1414',
          50: '#fdf2f2',
          100: '#fce8e8',
        },
        gold: {
          DEFAULT: '#C9A227',
          light: '#D4AF37',
          dark: '#A8851F',
          50: '#fdf8e7',
        },
        dark: {
          DEFAULT: '#1A1A1A',
          800: '#2A2A2A',
          700: '#3A3A3A',
          600: '#4A4A4A',
        },
        cream: '#F8F5F0',
        offwhite: '#F9F9F9',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, rgba(139,26,26,0.85) 0%, rgba(26,26,26,0.6) 100%)',
        'dark-gradient': 'linear-gradient(180deg, rgba(26,26,26,0) 0%, rgba(26,26,26,0.9) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      screens: {
        xs: '375px',
      },
    },
  },
  plugins: [],
};
