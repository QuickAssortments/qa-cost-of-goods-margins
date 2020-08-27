module.exports = {
	plugins: [
		require( '@wordpress/postcss-themes' )( {
			// @todo A default is required for now. Fix postcss-themes to allow no default
			defaults: {
				primary: '#0085ba',
				secondary: '#11a0d2',
				toggle: '#11a0d2',
				button: '#0085ba',
				outlines: '#007cba',
			},
			themes: {
				'quickassortments_page__qa_cog_retail_insights': {
					primary: '#7f54b3',
					secondary: '#c9356e',
					toggle: '#674399',
					button: '#F27AAA',
					outlines: '#c9356e',
				},
				'quickassortments_page__qa_cog_retail_insights_settings': {
					primary: '#7f54b3',
					secondary: '#c9356e',
					toggle: '#674399',
					button: '#F27AAA',
					outlines: '#c9356e',
				},
			},
		} ),
		require( 'autoprefixer' )( { grid: true } ),
		require( 'postcss-color-function' ),
	],
};
