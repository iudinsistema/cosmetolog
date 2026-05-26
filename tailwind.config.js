/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./layouts/**/*.html', './content/**/*.{md,html}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: 'var(--brand-bg)',
          surface: 'var(--brand-surface)',
          elevated: 'var(--brand-elevated)',
          line: 'var(--brand-line)',
          text: 'var(--brand-text)',
          muted: 'var(--brand-muted)',
          black: '#000000',
        },
        accent: 'var(--accent)',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      borderRadius: { pill: '30px' },
      letterSpacing: { brand: '0.12em' },
    },
  },
  plugins: [],
};
