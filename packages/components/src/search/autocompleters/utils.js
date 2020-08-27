/** @format */
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Parse a string suggestion, split apart by where the first matching query is.
 * Used to display matched partial in bold.
 *
 * @param {string} suggestion The item's label as returned from the API.
 * @param {string} query The search term to match in the string.
 * @return {object} A list in three parts: before, match, and after.
 */
export function computeSuggestionMatch( suggestion, query ) {
	if ( ! query ) {
		return null;
	}
	const indexOfMatch = suggestion.toLocaleLowerCase().indexOf( query.toLocaleLowerCase() );

	return {
		suggestionBeforeMatch: suggestion.substring( 0, indexOfMatch ),
		suggestionMatch: suggestion.substring( indexOfMatch, indexOfMatch + query.length ),
		suggestionAfterMatch: suggestion.substring( indexOfMatch + query.length ),
	};
}

export function getTaxCode( tax ) {
	return [ tax.country, tax.state, tax.name || __( 'TAX', 'qa-cost-of-goods-margins' ), tax.priority ]
		.filter( Boolean )
		.map( item =>
			item
				.toString()
				.toUpperCase()
				.trim()
		)
		.join( '-' );
}
