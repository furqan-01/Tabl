import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Cinzel"', '"Playfair Display"', 'serif'],
        heading: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        gold: {
          50: '#fdfbf7',
          100: '#fbf7ee',
          200: '#f5ebd3',
          300: '#eddaa8',
          400: '#e3c375',
          500: '#d4a945',
          600: '#b88931',
          700: '#946727',
          800: '#7a5225',
          900: '#674423',
        },
        obsidian: {
          800: '#171923',
          900: '#0f111a',
          950: '#08090e',
        },
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(0, 0, 0, 0.08), 0 0 1px 1px rgba(0, 0, 0, 0.04)',
        'luxury-hover': '0 30px 60px -12px rgba(0, 0, 0, 0.15), 0 0 1px 1px rgba(0, 0, 0, 0.06)',
        'glow-gold': '0 0 25px -5px rgba(212, 169, 69, 0.3)',
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.35)',
      },
    },
  },
  plugins: [],
};
export default config;
