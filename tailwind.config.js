/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Design system — dark mode primario
        surface: {
          DEFAULT: '#0f1117',
          1: '#161b27',
          2: '#1c2333',
          3: '#232b3e',
          4: '#2a3349',
        },
        brand: {
          DEFAULT: '#3b82f6',
          dim: '#1d4ed8',
          glow: '#60a5fa',
        },
        accent: {
          green:  '#10b981',
          amber:  '#f59e0b',
          red:    '#ef4444',
          purple: '#8b5cf6',
        },
        ink: {
          DEFAULT: '#e2e8f0',
          muted:   '#94a3b8',
          faint:   '#475569',
        },
        line: {
          DEFAULT: '#1e2a3a',
          strong:  '#2d3f56',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'glow-blue':  '0 0 20px rgba(59,130,246,0.15)',
        'glow-green': '0 0 20px rgba(16,185,129,0.15)',
        'card':       '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.6)',
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease-out',
        'slide-up':   'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' },               to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
