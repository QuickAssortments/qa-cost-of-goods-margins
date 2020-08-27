```jsx
import { TextControlWithAffixes } from '@woocommerce/components';

const MyTextControlWithAffixes = withState( {
	first: '',
	second: '',
	third: '',
	fourth: '',
	fifth: '',
} )( ( { first, second, third, fourth, fifth, setState } ) => (
	<div>
		<TextControlWithAffixes
			label="Text field without affixes"
			value={ first }
			placeholder="Placeholder"
			onChange={ value => setState( { first: value } ) }
		/>
		<TextControlWithAffixes
			prefix="$"
			label="Text field with a prefix"
			value={ second }
			onChange={ value => setState( { second: value } ) }
		/>
		<TextControlWithAffixes
			prefix="Prefix"
			suffix="Suffix"
			label="Text field with both affixes"
			value={ third }
			onChange={ value => setState( { third: value } ) }
		/>
		<TextControlWithAffixes
			suffix="%"
			label="Text field with a suffix"
			value={ fourth }
			onChange={ value => setState( { fourth: value } ) }
		/>
		<TextControlWithAffixes
			prefix="$"
			label="Text field with prefix and help text"
			value={ fifth }
			onChange={ value => setState( { fifth: value } ) }
			help="This is some help text."
		/>
	</div>
) );
```
