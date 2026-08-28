/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#123B5D',
          50: '#EBF4FB',
          100: '#CCDFF0',
          200: '#99BFE2',
          300: '#669FD3',
          400: '#337FC4',
          500: '#2563EB',
          600: '#1D4ED8',
          700: '#1E3A5F',
          800: '#123B5D',
          900: '#0A2540',
        },
        brand: {
          navy: '#123B5D',
          blue: '#2563EB',
          bg: '#F7F9FC',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F7F9FC',
          tertiary: '#F1F5F9',
        },
      },
      backgroundImage: {
        'corp-gradient': 'linear-gradient(135deg, #123B5D 0%, #1D4ED8 100%)',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-md': '0 4px 16px rgba(0,0,0,0.08)',
        'card-lg': '0 8px 32px rgba(0,0,0,0.10)',
        'sidebar': '1px 0 0 #E2E8F0',
      },
      borderRadius: {
        'card': '14px',
        'btn': '8px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'typing': 'typing 1.5s steps(40) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
