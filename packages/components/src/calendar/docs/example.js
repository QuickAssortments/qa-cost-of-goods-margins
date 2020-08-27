/**
 * Internal dependencies
 */
import { DateRange, DatePicker, H, Section } from '@woocommerce/components';

/**
 * External dependencies
 */
import moment from 'moment';
import { withState } from '@wordpress/compose';

const dateFormat = 'MM/DD/YYYY';

export default withState( {
	after: null,
	afterText: '',
	before: null,
	beforeText: '',
	afterError: null,
	beforeError: null,
	focusedInput: 'startDate',
} )(
	( {
		after,
		afterText,
		before,
		beforeText,
		afterError,
		focusedInput,
		setState,
	} ) => {
		function onRangeUpdate( update ) {
			setState( update );
		}

		function onDatePickerUpdate( { date, text, error } ) {
			setState( {
				after: date,
				afterText: text,
				afterError: error,
			} );
		}

		return (
			<div>
				<H>Date Range Picker</H>
				<Section component={ false }>
					<DateRange
						after={ after }
						afterText={ afterText }
						before={ before }
						beforeText={ beforeText }
						onUpdate={ onRangeUpdate }
						shortDateFormat={ dateFormat }
						focusedInput={ focusedInput }
						isInvalidDate={ ( date ) =>
							moment().isBefore( moment( date ), 'date' )
						}
					/>
				</Section>
				<H>Date Picker</H>
				<Section component={ false }>
					<DatePicker
						date={ after }
						text={ afterText }
						error={ afterError }
						onUpdate={ onDatePickerUpdate }
						dateFormat={ dateFormat }
						isInvalidDate={ ( date ) => moment( date ).day() === 1 }
					/>
				</Section>
			</div>
		);
	}
);
