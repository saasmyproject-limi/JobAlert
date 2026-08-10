/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vert-profond': '#173D2E',
        'vert-moyen': '#1F5C43',
        'or-ambre': '#E8A33D',
        'or-clair': '#F4CB86',
        'creme': '#FBF6EC',
        'encre': '#17201C',
        'sauge': '#BFD3C4',
        'whatsapp': '#25D366',
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'phone': '0 25px 50px -12px rgba(23, 61, 46, 0.25), 0 0 0 12px #17201C',
        'subtle': '0 4px 20px -2px rgba(23, 32, 28, 0.06)',
        'gold': '0 10px 30px -5px rgba(232, 163, 61, 0.3)',
      }
    },
  },
  plugins: [],
}
