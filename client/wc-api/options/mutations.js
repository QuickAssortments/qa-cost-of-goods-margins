/** @format */

/**
 * Internal dependencies
 */
import { getResourceName } from '../utils';

const updateOptions = operations => options => {
	const resourceName = getResourceName( 'options', Object.keys( options ) );
	operations.update( [ resourceName ], { [ resourceName ]: options } );
};

export default {
	updateOptions,
};
