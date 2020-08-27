/** @format */
/**
 * Internal dependencies
 */
import { Stepper } from '@woocommerce/components';

/**
 * External dependencies
 */
import { withState } from '@wordpress/compose';

export default withState( {
	currentStep: 'first',
	isComplete: false,
	isPending: false,
} )( ( { currentStep, isComplete, isPending, setState } ) => {
	const steps = [
		{
			key: 'first',
			label: 'First',
			description: 'Step item description',
			content: <div>First step content.</div>,
		},
		{
			key: 'second',
			label: 'Second',
			description: 'Step item description',
			content: <div>Second step content.</div>,
		},
		{
			label: 'Third',
			key: 'third',
			description: 'Step item description',
			content: <div>Third step content.</div>,
		},
		{
			label: 'Fourth',
			key: 'fourth',
			description: 'Step item description',
			content: <div>Fourth step content.</div>,
		},
	];

	const currentIndex = steps.findIndex( s => currentStep === s.key );

	if ( isComplete ) {
		steps.forEach( s => s.isComplete = true );
	}

	return (
	<div>
		{ isComplete ? (
			<button onClick={ () => setState( { currentStep: 'first', isComplete: false } ) } >
				Reset
			</button>
		) : (
			<div>
				<button
					onClick={ () => setState( { currentStep: steps[ currentIndex - 1 ].key } ) }
					disabled={ currentIndex < 1 }
				>
					Previous step
				</button>
				<button
					onClick={ () => setState( { currentStep: steps[ currentIndex + 1 ].key } ) }
					disabled={ currentIndex >= steps.length - 1 }
				>
					Next step
				</button>
				<button
					onClick={ () => setState( { isComplete: true } ) }
					disabled={ currentIndex !== steps.length - 1 }
				>
					Complete
				</button>
				<button
					onClick={ () => setState( { isPending: ! isPending } ) }
				>
					Toggle Spinner
				</button>
			</div>
		) }

		<Stepper
			steps={ steps }
			currentStep={ currentStep }
			isPending={ isPending }
		/>

		<br />

		<Stepper
			isPending={ isPending }
			isVertical={ true }
			steps={ steps }
			currentStep={ currentStep }
		/>
	</div>
	);
} );
