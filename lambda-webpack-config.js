var webpack = require('webpack')

module.exports = {
	plugins: [new webpack.DefinePlugin({ 'global.GENTLY': false })],
	module: {
		rules: [
			{
				type: `javascript/auto`,
				test: /\.mjs$/,
				use: [],
			},
		],
	},
}
