module.exports = [
	require( '@wordpress/postcss-themes' )( {
		defaults: {
			primary: '#0085ba',
			secondary: '#11a0d2',
			toggle: '#11a0d2',
			button: '#0085ba',
			outlines: '#007cba',
		},
		themes: {
			'woocommerce-page': {
				primary: '#95588a',
				secondary: '#95588a',
				toggle: '#95588a',
				button: '#95588a',
				outlines: '#95588a',
			},
		},
	} ),
	require( 'autoprefixer' )( { grid: true } ),
	require( 'postcss-color-function' ),
];
