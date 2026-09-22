/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Updated to user's #C08552 warm architectural terracotta / ochre
        sage: {
          50: '#FAF4EF',
          100: '#F5E9DF',
          200: '#EBD3BF',
          300: '#DFBA9D',
          400: '#CF9E75',
          500: '#C08552', // User Primary Color #C08552
          600: '#AC6E3D',
          700: '#8E552E',
          800: '#724426',
          900: '#4C2D1A',
          950: '#2A170B',
        },
        primary: {
          50: '#FAF4EF',
          100: '#F5E9DF',
          200: '#EBD3BF',
          300: '#DFBA9D',
          400: '#CF9E75',
          500: '#C08552',
          600: '#AC6E3D',
          700: '#8E552E',
          800: '#724426',
          900: '#4C2D1A',
        },
        linen: {
          DEFAULT: '#F7F2EB', // Warm background User Color
          50: '#FFFFFF',
          100: '#FAF7F3',
          200: '#F7F2EB',
          300: '#EFE6D9',
          400: '#E7D9C7',
        },
        sand: {
          DEFAULT: '#EAE2D6', // Sandstone Surface User Color
          50: '#FAF8F5',
          100: '#F5F0E9',
          200: '#EAE2D6',
          300: '#DCCEBC',
          400: '#CEBAA1',
          500: '#BF9E7E',
        },
        softgray: {
          DEFAULT: '#EEEEEE', // Soft Gray User Color
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
          400: '#BDBDBD',
        },
        ink: {
          DEFAULT: '#1E261F',
          muted: '#4A554D',
          light: '#768579',
          border: '#D8DFD5',
        },
        terracotta: {
          DEFAULT: '#C08552',
          light: '#FAF4EF',
          dark: '#8E552E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'Cambria', 'serif'],
        display: ['"Playfair Display"', 'Plus Jakarta Sans', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(30, 38, 31, 0.05), 0 1px 2px -1px rgba(30, 38, 31, 0.05)',
        'elevated': '0 4px 20px -2px rgba(30, 38, 31, 0.08), 0 2px 6px -2px rgba(30, 38, 31, 0.04)',
        'card': '0 2px 12px 0 rgba(192, 133, 82, 0.08)',
        'glow': '0 0 20px rgba(192, 133, 82, 0.25)',
      },
    },
  },
  plugins: [],
}
