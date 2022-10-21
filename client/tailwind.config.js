/* eslint-disable */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
	theme: {
		screens: {
			xs: '500px',
			...defaultTheme.screens
		},
		extend: {
			colors: {
				primaryRed: '#C41D33',
				primaryRedHover: '#c41b20',
				primaryRedActive: '#991519',
				primaryRedActiveRoute: '#e14b50',
				primaryBrown: '#1e1415',
				footerButtonHover: '#241416'
			},
			borderWidth: {
				1: '1px'
			},
			width: {
				64: '16rem'
			}
		}
	},
	plugins: []
};
