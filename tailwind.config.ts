import type {Config} from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    colors: {
      'gray-0': '#111111',
      'gray-1': '#202020',
      'gray-2': '#2a2a2a',
      'gray-3': '#353535',
      'gray-4': '#505050',
      'gray-5': '#5a5a5a',
      'gray-6': '#8d8d8d',
      'gray-7': '#b6b2b1',
      green: '#01da48',
      blue: '#09cae6',
      yellow: '#ffc907',
      red: '#fd1000',
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
