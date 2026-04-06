import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary:  '#030A05',
          card:     '#060F08',
          elevated: '#091409',
          green:    '#003D1F',
          'deep-green': '#002B16',
        },
        brand: {
          primary: '#005B2F',
          accent:  '#00A652',
          dark:    '#003D1F',
        },
        border: {
          DEFAULT: 'rgba(0,91,47,0.25)',
          hover:   'rgba(0,166,82,0.4)',
          subtle:  'rgba(255,255,255,0.06)',
        },
        text: {
          primary: '#FFFFFF',
          muted:   'rgba(255,255,255,0.5)',
          subtle:  'rgba(255,255,255,0.25)',
          accent:  '#00A652',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0',
        none: '0',
        sm: '0',
        md: '0',
        lg: '0',
        xl: '0',
        '2xl': '0',
        full: '9999px',
      },
    },
  },
}

export default config
