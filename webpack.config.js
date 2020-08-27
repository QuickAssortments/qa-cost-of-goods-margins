/** @format */
/**
 * External dependencies
 */
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const { get } = require( 'lodash' );
const path = require( 'path' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
const { DefinePlugin } = require( 'webpack' );
const WebpackRTLPlugin = require( 'webpack-rtl-plugin' );

/**
 * WordPress dependencies
 */
const CustomTemplatedPathPlugin = require( '@wordpress/custom-templated-path-webpack-plugin' );

const NODE_ENV = process.env.NODE_ENV || 'development';

// @todo Add a `beta` phase and build process so that we can separate final .org versions from beta GitHub versions.
let QA_COG_ADMIN_PHASE = process.env.QA_COG_ADMIN_PHASE || 'core';
if ( [ 'development', 'plugin', 'core' ].indexOf( QA_COG_ADMIN_PHASE ) === -1 ) {
	QA_COG_ADMIN_PHASE = 'core';
}
const QA_COG_ADMIN_CONFIG = require( path.join( __dirname, 'config', QA_COG_ADMIN_PHASE + '.json' ) );

const externals = {
	'@wordpress/api-fetch': { this: [ 'wp', 'apiFetch' ] },
	'@wordpress/blocks': { this: [ 'wp', 'blocks' ] },
	'@wordpress/data': { this: [ 'wp', 'data' ] },
	'@wordpress/editor': { this: [ 'wp', 'editor' ] },
	'@wordpress/element': { this: [ 'wp', 'element' ] },
	'@wordpress/hooks': { this: [ 'wp', 'hooks' ] },
	'@wordpress/url': { this: [ 'wp', 'url' ] },
	'@wordpress/html-entities': { this: [ 'wp', 'htmlEntities' ] },
	'@wordpress/i18n': { this: [ 'wp', 'i18n' ] },
	'@wordpress/keycodes': { this: [ 'wp', 'keycodes' ] },
	tinymce: 'tinymce',
	moment: 'moment',
	react: 'React',
	lodash: 'lodash',
	'react-dom': 'ReactDOM',
};

const QAAdminPackages = [
	'components',
	'csv-export',
	'currency',
	'date',
	'navigation',
	'number',
  'data',
];

const entryPoints = {};
QAAdminPackages.forEach( name => {
	externals[ `@woocommerce/${ name }` ] = {
		this: [ 'wc', name.replace( /-([a-z])/g, ( match, letter ) => letter.toUpperCase() ) ],
	};
	entryPoints[ name ] = `./packages/${ name }`;
} );

const webpackConfig = {
	mode: NODE_ENV,
	entry: {
		app: './client/index.js',
		embedded: './client/embedded.js',
		...entryPoints,
	},
	output: {
		filename: './assets/dist/[name]/index.js',
		path: __dirname,
		library: [ 'wc', '[modulename]' ],
		libraryTarget: 'this',
	},
	externals,
	module: {
		rules: [
			{
				parser: {
					amd: false,
				},
			},
			{
				test: /\.jsx?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.js?$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							[ '@babel/preset-env', { loose: true, modules: 'commonjs' } ],
						],
						plugins: [ 'transform-es2015-template-literals' ],
					},
				},
				include: new RegExp( '/node_modules\/(' +
					'|acorn-jsx' +
					'|d3-array' +
					'|debug' +
					'|newspack-components' +
					'|regexpu-core' +
					'|unicode-match-property-ecmascript' +
					'|unicode-match-property-value-ecmascript)/'
				),
			},
			{ test: /\.md$/, use: 'raw-loader' },
			{
				test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
				loader: 'url-loader',
			},
			{
				test: /\.s?css$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					{
						// postcss loader so we can use autoprefixer and theme Gutenberg components
						loader: 'postcss-loader',
						options: {
							config: {
								path: 'postcss.config.js',
							},
						},
					},
					  {
						    loader: 'sass-loader',
						    options: {
							      sassOptions: {
								        includePaths: [
									          'client/stylesheets/abstracts',
								        ],
							      },
							      prependData:
								        '@import "node_modules/@wordpress/base-styles/_colors.scss"; ' +
								        '@import "node_modules/@wordpress/base-styles/_variables.scss"; ' +
								        '@import "node_modules/@wordpress/base-styles/_mixins.scss"; ' +
								        '@import "node_modules/@wordpress/base-styles/_breakpoints.scss"; ' +
								        '@import "node_modules/@wordpress/base-styles/_animations.scss"; ' +
								        '@import "node_modules/@wordpress/base-styles/_z-index.scss"; ' +
								        '@import "_colors"; ' +
								        '@import "_variables"; ' +
								        '@import "_breakpoints"; ' +
								        '@import "_mixins"; ',
						    },
					  },
				],
			},
		],
	},
	resolve: {
		extensions: [ '.json', '.js', '.jsx' ],
		modules: [
			path.join( __dirname, 'client' ),
			path.join( __dirname, 'packages' ),
			'node_modules',
		],
		alias: {
			'gutenberg-components': path.resolve( __dirname, 'node_modules/@wordpress/components/src' ),
			'react-spring': 'react-spring/web.cjs',
		},
	},
	plugins: [
		// Inject the current feature flags.
		new DefinePlugin( {
			'window.wcAdminFeatures': { ...QA_COG_ADMIN_CONFIG.features },
		} ),
		new CustomTemplatedPathPlugin( {
			modulename( outputPath, data ) {
				const entryName = get( data, [ 'chunk', 'name' ] );
				if ( entryName ) {
					return entryName.replace( /-([a-z])/g, ( match, letter ) => letter.toUpperCase() );
				}
				return outputPath;
			},
		} ),
		new WebpackRTLPlugin( {
			filename: './assets/dist/[name]/style-rtl.css',
			minify: {
				safe: true,
			},
		} ),
		new MiniCssExtractPlugin( {
			filename: './assets/dist/[name]/style.css',
		} ),
		new CopyWebpackPlugin(
			QAAdminPackages.map( packageName => ( {
				from: `./packages/${ packageName }/build-style/*.css`,
				to: `./assets/dist/${ packageName }/`,
				flatten: true,
				transform: content => content,
			} ) )
		),
	],
};

if ( webpackConfig.mode !== 'production' ) {
	webpackConfig.devtool = process.env.SOURCEMAP || 'source-map';
}

module.exports = webpackConfig;
