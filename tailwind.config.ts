import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: 'var(--font-press-start-2p), sans-serif',
        body: 'var(--font-vt323), monospace',
        mono: 'var(--font-vt323), monospace',
      },
      colors: {
        retro: {
          cream: '#F5E6D3',
          beige: '#E8D9C3',
          'red-shop': '#D97B68',
          'red-highlight': '#E85D54',
          'mint-green': '#A8D77B',
          'forest-green': '#6B8E23',
          'dark-brown': '#5C4033',
          'light-brown': '#8B7355',
          'soft-yellow': '#F4E4C1',
          'sky-blue': '#C8E6F5',
        },
      },
    },
  },
  plugins: [],
};

export default config;
