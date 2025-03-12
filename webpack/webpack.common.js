const path = require('node:path')
const CopyPlugin = require('copy-webpack-plugin')

const srcDir = path.join(__dirname, '..', 'src')

module.exports = {
	entry: {
		dynamic: path.join(srcDir, 'dynamic/index.ts'),
		core: path.join(srcDir, 'dynamic/core.ts'),
		popup: path.join(srcDir, 'popup.tsx'),
	},
	output: {
		path: path.join(__dirname, '../dist/js'),
		filename: '[name].js',
	},
	optimization: {
		splitChunks: {
			name: 'vendor',
			chunks(chunk) {
				return chunk.name !== 'background'
			},
		},
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
	},
	plugins: [
		new CopyPlugin({
			patterns: [{ from: '.', to: '../', context: 'public' }],
			options: {},
		}),
	],
}
