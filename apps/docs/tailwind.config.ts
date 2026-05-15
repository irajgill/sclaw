import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ZeroForge — light + playful palette
        bg: '#fdfbff',
        surface: '#ffffff',
        'surface-2': '#f7f3ff',
        border: '#ece4ff',
        'border-2': '#dbcdff',
        muted: '#6b6390',
        text: '#221c3d',
        accent: '#8b5cf6',
        'accent-2': '#ec4899',
        'accent-3': '#ff8a3d',
        success: '#1fbf7a',
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: [
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
        ],
      },
    },
  },
  plugins: [],
};

export default config;
