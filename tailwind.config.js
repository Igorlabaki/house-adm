/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}","./src/**/*.{js,jsx,ts,tsx}", "./<custom directory>/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'gray-dark': '#1E1F22',
        'gray-reg': '#2B2D31',
        'gray-ligth': '#313338',
        'custom-gray': 'rgb(156 163 175)',
        'custom-white': 'rgb(250, 235, 215)',
      },
    },
  },
  plugins: [],
}

