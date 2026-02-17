/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        void: '#050505',
        surface: '#0D0D0D',
        signal: '#F2F2F2',
        bounty: '#FFD700',
        system: '#00FF41',
        hazard: '#FF3131',
        neutral: '#404040',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        scroll: 'scroll 20s linear infinite',
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
