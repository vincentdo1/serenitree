import typographyPlugin from '@tailwindcss/typography'
import { type Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FBF8F1',
        forest: {
          50: '#f1f9f1',
          100: '#ddf0de',
          200: '#bce1bf',
          300: '#8fcd96',
          400: '#5bb069',
          500: '#379247',
          600: '#277537',
          700: '#215d2e',
          800: '#1d4a27',
          900: '#183d22',
        },
        bark: {
          50: '#faf6f2',
          100: '#f0e6dc',
          200: '#e0ccba',
          300: '#cba98c',
          400: '#b3855f',
          500: '#9c6a43',
          600: '#855636',
          700: '#6b4530',
          800: '#58392b',
          900: '#4a3026',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
        display: ['var(--font-display)', ...defaultTheme.fontFamily.serif],
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(24, 61, 34, 0.18)',
        glow: '0 0 60px -10px rgba(91, 176, 105, 0.45)',
      },
      keyframes: {
        sway: {
          '0%, 100%': { transform: 'rotate(-1.5deg)' },
          '50%': { transform: 'rotate(1.5deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'tree-in': {
          '0%': { opacity: '0', transform: 'scale(0.75) translateY(14px)' },
          '60%': { opacity: '1' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'tree-out': {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(1.06)' },
        },
      },
      animation: {
        sway: 'sway 6s ease-in-out infinite',
        float: 'float 5s ease-in-out infinite',
        'fade-up': 'fade-up 0.5s ease-out both',
        'scale-in': 'scale-in 0.3s ease-out both',
        'tree-in': 'tree-in 0.85s cubic-bezier(0.22, 1, 0.36, 1) both',
        'tree-out': 'tree-out 0.6s ease-out both',
      },
    },
  },
  plugins: [typographyPlugin],
} satisfies Config
