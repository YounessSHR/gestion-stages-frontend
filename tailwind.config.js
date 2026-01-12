/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        linkedin: {
          primary: '#0A66C2',
          primaryHover: '#004182',
          secondary: '#057642',
          dark: '#000000E6',
          gray: {
            50: '#F3F2EF',
            100: '#EBEBEB',
            200: '#E9E9E9',
            300: '#CFCFCF',
            400: '#A8A8A8',
            500: '#666666',
            600: '#5E5E5E',
            700: '#3D3D3D',
          },
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
      },
    },
  },
  plugins: [],
}