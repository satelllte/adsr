import type {Config} from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    colors: {
      'brand-gray-1': '#202020',
      'brand-gray-2': '#2a2a2a',
      'brand-gray-3': '#353535',
      'brand-gray-4': '#505050',
      'brand-gray-5': '#5a5a5a',
      'brand-gray-6': '#8d8d8d',
      'brand-gray-7': '#b6b2b1',
      'brand-green': '#01da48',
      'brand-blue': '#09cae6',
      'brand-yellow': '#ffc907',
      'brand-red': '#fd1000',
    },
  },
  plugins: [
    plugin(({addUtilities}) => {
      addUtilities({
        '.webkit-tap-transparent': {
          '-webkit-tap-highlight-color': 'transparent',
        },
      });
    }),
  ],
} satisfies Config;
