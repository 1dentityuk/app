const autoprefixer = require('autoprefixer');
const postcssCustomMedia = require('postcss-custom-media');
const postcssGlobalData = require('@csstools/postcss-global-data');

module.exports = {
	plugins: [
		autoprefixer(),
		postcssGlobalData({
			files: ['src/theme/breakpoints.css']
		}),
		postcssCustomMedia()
	]
};
