```jsx
import { Search } from '@woocommerce/components';

const MySearch = withState( {
	selected: [],
	inlineSelected: [],
} )( ( { selected, inlineSelected, setState } ) => (
	<div>
		<H>Tags Below Input</H>
		<Section component={ false }>
			<Search
				type="products"
				placeholder="Search for a product"
				selected={ selected }
				onChange={ items => setState( { selected: items } ) }
			/>
		</Section>
		<H>Tags Inline with Input</H>
		<Section component={ false }>
			<Search
				type="products"
				placeholder="Search for a product"
				selected={ inlineSelected }
				onChange={ items => setState( { inlineSelected: items } ) }
				inlineTags
			/>
		</Section>
	</div>
) );
```
