/** @format */

/**
 * Internal dependencies
 */
import items from './items';
import options from './options';
import reportItems from './reports/items';
import reportStats from './reports/stats';
import user from './user';

function createWcApiSpec() {
	return {
		name: 'wcApi',
		mutations: {
			...items.mutations,
			...options.mutations,
			...user.mutations,
		},
		selectors: {
			...items.selectors,
			...options.selectors,
			...reportItems.selectors,
			...reportStats.selectors,
			...user.selectors,
		},
		operations: {
			read( resourceNames ) {
				if ( document.hidden ) {
					// Don't do any read updates while the tab isn't active.
					return [];
				}

				return [
					...items.operations.read( resourceNames ),
					...options.operations.read( resourceNames ),
					...reportItems.operations.read( resourceNames ),
					...reportStats.operations.read( resourceNames ),
					...user.operations.read( resourceNames ),
				];
			},
			update( resourceNames, data ) {
				return [
					...items.operations.update( resourceNames, data ),
					...options.operations.update( resourceNames, data ),
					...user.operations.update( resourceNames, data ),
				];
			},
			updateLocally( resourceNames, data ) {
				return [ ...items.operations.updateLocally( resourceNames, data ) ];
			},
		},
	};
}

export default createWcApiSpec();
