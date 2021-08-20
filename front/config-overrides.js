const { addBabelPlugin, override, fixBabelImports } = require('customize-cra')

module.exports = override(
	addBabelPlugin([
		'babel-plugin-root-import',
		{
			rootPathSuffix: 'src',
		},
	]),
	fixBabelImports('antd', {
		libraryDirectory: 'es',
		style: 'css',
	})
)
