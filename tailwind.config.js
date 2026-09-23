/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core background and surface colors from Drafted screenshot
        linen: {
          DEFAULT: '#FAF9F5', // Warm light cream background
          50: '#FFFFFF',
          100: '#FAF9F5',
          200: '#F5F2EA',
          300: '#EBE6DC',
          400: '#DFD8CC',
        },
        sand: {
          DEFAULT: '#EBE6DC', // Crisp subtle warm borders & surface
          50: '#FAF9F5',
          100: '#F5F2EA',
          200: '#EBE6DC',
          300: '#DFD8CC',
          400: '#CFC5B4',
          500: '#B8AB96',
        },
        ink: {
          DEFAULT: '#141414', // Jet black for headings & typography
          muted: '#666666',   // Clean secondary neutral text
          light: '#8C8C8C',
          border: '#E8E4DC',
        },
        // Action Dark (solid black buttons like '+ New Design' and 'Remix')
        dark: {
          DEFAULT: '#18181B',
          hover: '#27272A',
          subtle: '#2D2D30',
        },
        // Warm terracotta / burnt orange accent (avatar, active highlights)
        terracotta: {
          DEFAULT: '#E0582B',
          light: '#FAF3F0',
          dark: '#B83E16',
          50: '#FAF3F0',
          100: '#F6E4DE',
          200: '#EEBFB0',
          500: '#E0582B',
          600: '#C9481D',
          700: '#A73614',
        },
        // Backward-compatible sage palette mapped to warm architectural tones
        sage: {
          50: '#FAF9F5',
          100: '#F5F2EA',
          200: '#EBE6DC',
          300: '#DFD8CC',
          400: '#CFC5B4',
          500: '#18181B',
          600: '#27272A',
          700: '#141414',
          800: '#141414',
          900: '#000000',
        },
        primary: {
          50: '#FAF9F5',
          100: '#F5F2EA',
          200: '#EBE6DC',
          300: '#DFD8CC',
          400: '#E0582B',
          500: '#18181B',
          600: '#27272A',
          700: '#141414',
          800: '#141414',
          900: '#000000',
        },
        gold: {
          badge: '#C89B3C',
          bg: '#FAF5EA',
        }
      },
      fontFamily: {
        serif: ['"DM Serif Display"', '"Newsreader"', '"Playfair Display"', 'Georgia', 'serif'],
        display: ['"DM Serif Display"', '"Newsreader"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Inter', 'system-ui', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'elevated': '0 4px 20px -2px rgba(0, 0, 0, 0.06), 0 2px 6px -2px rgba(0, 0, 0, 0.03)',
        'card': '0 2px 12px 0 rgba(0, 0, 0, 0.05)',
        'glow': '0 0 20px rgba(224, 88, 43, 0.2)',
      },
    },
  },
  plugins: [],
}
