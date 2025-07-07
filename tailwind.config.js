/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}","./src/**/*.{js,jsx,ts,tsx}", "./<custom directory>/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'gray-dark': '#6366f1',
        'gray-reg': '#818cf8',
        'gray-ligth': '#c7d2fe',
        'custom-gray': '#f5f7ff',
        'custom-white': 'rgb(250, 235, 215)',
        eventhub: {
					primaryDark: '#4f46e5',
					primary: '#6366f1',
					secondary: '#818cf8',
					tertiary: '#c7d2fe',
					background: '#f5f7ff',
					text: '#111827'
				}
      },
    },
  },
  plugins: [],
}

