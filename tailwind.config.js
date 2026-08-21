/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        paper: '#F7F6F2',
        ink: '#14171C',
        // layer / accent colors — kept consistent across themes
        layer: {
          text: '#6B7280', // neutral gray
          chart: '#2563EB', // blue
          table: '#7C3AED', // plum
        },
        verified: '#16A34A', // green
        lowconf: '#D97706', // amber
      },
    },
  },
  plugins: [],
};
