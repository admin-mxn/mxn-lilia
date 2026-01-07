import colors from 'tailwindcss/colors'

module.exports = {
  content: [
    "./node_modules/flowbite/**/*.js",
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './layouts/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    darkMode: 'class',
    purge: ['./src/**/*.tsx', './src/**/*.jsx', './src/**/*.js', './src/**/*.ts'],
    typography: (theme) => ({}),
    extend: {
      colors: {
        secondary: {
          DEFAULT: colors.neutral[200],
          dark: colors.neutral[800],
          hover: colors.neutral[300],
          border: colors.neutral[400],
          text: colors.neutral[500],
          ["dark-hover"]: colors.neutral[900],
        },
        'mxn-green': '#00A99D',
        'mxn-blue': '#00A99D',
        'mxn-yellow': '#FFC107',
        'mxn-red': '#FF5252',
        'mxn-dark': '#1A1A1A',
        'mxn-light': '#F2F2F2',
        'mxn-gray': '#E0E0E0',
        'mxn-gray-dark': '#4F4F4F',
        'mxn-gray-light': '#BDBDBD',
        'mxn-gray-lighter': '#E0E0E0',
        'mxn-gray-lightest': '#F2F2F2',
        'mxn-gray-darkest': '#333333',
        'mxn-gray-darker': '#4F4F4F',
        'smoke-darkest': 'rgba(0, 0, 0, 0.9)',
        'smoke-darker': 'rgba(0, 0, 0, 0.75)',
        'smoke-dark': 'rgba(0, 0, 0, 0.6)',
        'smoke': 'rgba(0, 0, 0, 0.5)',
        'smoke-light': 'rgba(0, 0, 0, 0.4)',
        'smoke-lighter': 'rgba(0, 0, 0, 0.25)',
        'smoke-lightest': 'rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        'hero1': "url('/l1.webp')",
        'vert1': "url('https://mxn-public-assets.s3.us-east-2.amazonaws.com/yucatan1.webp')"
      }
    },
    fontFamily: {

      'staatliches': [
        'Staatliches',
      ],

      'sans': [
        '"Open Sans Variable"', 'Verdana', 'Arial', 'Helvetica', 'sans-serif'
      ]
    }
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')({ strategy: 'class' }),
    require('flowbite/plugin')
  ],

};
