/** @type {import('tailwindcss').Config} */
export default {
 darkMode:'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
            animation: {
        aiThinking: 'aiThinking 1.5s steps(4, end) infinite',
      },
      keyframes: {
        aiThinking: {
          '0%': { width: '0', content: '"."' },
          '25%': { width: '0.5rem', content: '".."' },
          '50%': { width: '1rem', content: '"..."' },
          '75%': { width: '0', content: '""' },
          '100%': { width: '0', content: '"."' },
        }
      },
      colors:{
        primary:'#000000',
        background:'#FFFFFF',
        secondary:'#a0a0a7'
      },
      fontFamily: {
        'inter-tight': ['Inter Tight', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

