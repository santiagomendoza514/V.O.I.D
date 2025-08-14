import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: { // Añadir esta sección
        sans: ['var(--font-inter)'],
        custom: ['var(--font-void-custom)'], // Nuestra nueva familia de fuentes
      },
      animation: { // Añadir esta sección para la marquesina
        marquee: 'marquee 20s linear infinite',
      },
      keyframes: { // Añadir esta sección para la marquesina
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [],
}
export default config