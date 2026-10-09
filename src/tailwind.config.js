/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      colors: {
        // Camadas de superfície (do fundo da página até elementos elevados)
        brand: {
          900: '#090D16', // fundo da aplicação
          800: '#0F1420', // cards, sidebar, modais
          700: '#151B2B', // hover / elementos elevados
          600: '#1E2638', // divisores fortes, avatares
        },
        // Acento único: usado só em ação primária e destaques essenciais
        accent: {
          DEFAULT: '#4F46E5',
          hover: '#4338CA',
          muted: '#818CF8', // links e ícones ativos sobre fundo escuro
        },
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(0, 0, 0, 0.35)',
        overlay: '0 16px 40px -12px rgba(0, 0, 0, 0.6)',
      },
    },
  },
  plugins: [],
}
