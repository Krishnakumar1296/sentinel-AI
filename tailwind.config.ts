/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      colors: {
        canvas: 'var(--canvas)',
        'canvas-soft': 'var(--canvas-soft)',
        zinc: {
          850: '#1f1f23',
          900: '#18181b',
          950: '#09090b',
        },
        cyber: {
          cyan: '#38bdf8',
          blue: '#3b82f6',
          purple: '#a855f7',
          violet: '#8b5cf6',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
          dark: '#000000',
          surface: '#09090b',
        },
        surface: {
          DEFAULT: 'var(--surface)',
          muted: 'var(--surface-muted)',
          soft: 'var(--surface-soft)',
        },
        line: {
          DEFAULT: 'var(--line)',
          soft: 'var(--line-soft)',
        },
        ink: {
          DEFAULT: 'var(--ink)',
          soft: 'var(--ink-soft)',
        },
        muted: {
          DEFAULT: 'var(--text-muted)',
          line: 'var(--text-faint)',
        },
        faint: 'var(--text-faint)',
        brand: {
          navy: 'rgb(var(--brand-navy) / <alpha-value>)',
          blue: 'rgb(var(--brand-blue) / <alpha-value>)',
          bg: 'var(--brand-bg)',
        },
        primary: {
          DEFAULT: 'rgb(var(--brand-navy) / <alpha-value>)',
          50: 'rgb(var(--primary-50) / <alpha-value>)',
          100: 'rgb(var(--primary-100) / <alpha-value>)',
          200: 'rgb(var(--primary-200) / <alpha-value>)',
          300: 'rgb(var(--primary-300) / <alpha-value>)',
          400: 'rgb(var(--primary-400) / <alpha-value>)',
          500: 'rgb(var(--primary-500) / <alpha-value>)',
          600: 'rgb(var(--primary-600) / <alpha-value>)',
          700: 'rgb(var(--primary-700) / <alpha-value>)',
          800: 'rgb(var(--primary-800) / <alpha-value>)',
          900: 'rgb(var(--primary-900) / <alpha-value>)',
        },
      },
      backgroundImage: {
        'corp-gradient': 'linear-gradient(135deg, rgb(var(--brand-navy)) 0%, rgb(var(--brand-blue)) 100%)',
        'cyber-gradient': 'linear-gradient(135deg, #00F0FF 0%, #8B5CF6 50%, #0EA5E9 100%)',
        'cyber-dark-gradient': 'linear-gradient(145deg, #0B1222 0%, #070B14 100%)',
      },
      boxShadow: {
        'card': '0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)',
        'card-md': '0 4px 16px rgba(16,24,40,0.06)',
        'card-lg': '0 8px 32px rgba(16,24,40,0.08)',
        'neon-cyan': '0 2px 10px rgba(14, 165, 233, 0.18), 0 1px 3px rgba(14, 165, 233, 0.1)',
        'neon-purple': '0 2px 10px rgba(99, 102, 241, 0.18), 0 1px 3px rgba(99, 102, 241, 0.1)',
        'neon-emerald': '0 2px 10px rgba(16, 185, 129, 0.18), 0 1px 3px rgba(16, 185, 129, 0.1)',
        '3d-float': '0 12px 28px -6px rgba(0, 0, 0, 0.35), 0 4px 12px rgba(0, 0, 0, 0.15)',
        'sidebar': '1px 0 0 var(--line)',
      },
      borderRadius: {
        'card': '16px',
        'btn': '10px',
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