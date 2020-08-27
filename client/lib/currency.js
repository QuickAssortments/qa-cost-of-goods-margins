/** @format */
/**
 * External dependencies
 */
import { get, isNaN } from 'lodash';
import { sprintf } from '@wordpress/i18n';

/**
 * WooCommerce dependencies
 */
import { numberFormat } from '@woocommerce/number';

/**
 * Formats money with a given currency code. Uses site's currency settings for formatting.
 *
 * @param   {Number|String} number number to format
 * @param   {String}        currencySymbol currency code e.g. '$'
 * @returns {?String} A formatted string.
 */
export function formatCurrency( number ) {
	// default to wcSettings (and then to $) if currency symbol is not passed in
  const currencySymbol = get( wcSettings, [ 'currency', 'symbol' ], '$' );
	const precision = get( wcSettings, [ 'currency', 'precision' ], 2 );
	const formattedNumber = numberFormat( number, precision );
	const priceFormat = get( wcSettings, [ 'currency', 'price_format' ], '%1$s%2$s' );

	if ( '' === formattedNumber ) {
		return formattedNumber;
	}

	return sprintf( priceFormat, currencySymbol, formattedNumber );
}

/**
 * Get the rounded decimal value of a number at the precision used for the current currency.
 * This is a work-around for fraction-cents, meant to be used like `wc_format_decimal`
 *
 * @param {Number|String} number A floating point number (or integer), or string that converts to a number
 * @return {Number} The original number rounded to a decimal point
 */
export function getCurrencyFormatDecimal( number ) {
	const { precision = 2 } = wcSettings.currency;
	if ( 'number' !== typeof number ) {
		number = parseFloat( number );
	}
	if ( isNaN( number ) ) {
		return 0;
	}
	return Math.round( number * Math.pow( 10, precision ) ) / Math.pow( 10, precision );
}

/**
 * Get the string representation of a floating point number to the precision used by the current currency.
 * This is different from `formatCurrency` by not returning the currency symbol.
 *
 * @param  {Number|String} number A floating point number (or integer), or string that converts to a number
 * @return {String}               The original number rounded to a decimal point
 */
export function getCurrencyFormatString( number ) {
	const { precision = 2 } = wcSettings.currency;
	if ( 'number' !== typeof number ) {
		number = parseFloat( number );
	}
	if ( isNaN( number ) ) {
		return '';
	}
	return number.toFixed( precision );
}

export function renderCurrency( number, currencySymbol ) {
	if ( 'number' !== typeof number ) {
		number = parseFloat( number );
	}
	if ( number < 0 ) {
		return <span className="is-negative">{ formatCurrency( number, currencySymbol ) }</span>;
	}
	return formatCurrency( number, currencySymbol );
}
