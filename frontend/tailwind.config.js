/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx,css}'],
  darkMode: 'class',
  theme: {
    extend: {
      // your extensions, plugins etc
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    // other plugins or custom plugin functions
  ],
}
