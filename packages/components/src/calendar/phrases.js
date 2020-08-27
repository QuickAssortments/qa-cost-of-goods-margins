/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

export default {
	calendarLabel: __( 'Calendar', 'qa-cost-of-goods-margins' ),
	closeDatePicker: __( 'Close', 'qa-cost-of-goods-margins' ),
	focusStartDate: __(
		'Interact with the calendar and select start and end dates.',
		'qa-cost-of-goods-margins'
	),
	clearDate: __( 'Clear Date', 'qa-cost-of-goods-margins' ),
	clearDates: __( 'Clear Dates', 'qa-cost-of-goods-margins' ),
	jumpToPrevMonth: __(
		'Move backward to switch to the previous month.',
		'qa-cost-of-goods-margins'
	),
	jumpToNextMonth: __(
		'Move forward to switch to the next month.',
		'qa-cost-of-goods-margins'
	),
	enterKey: __( 'Enter key', 'qa-cost-of-goods-margins' ),
	leftArrowRightArrow: __( 'Right and left arrow keys', 'qa-cost-of-goods-margins' ),
	upArrowDownArrow: __( 'up and down arrow keys', 'qa-cost-of-goods-margins' ),
	pageUpPageDown: __( 'page up and page down keys', 'qa-cost-of-goods-margins' ),
	homeEnd: __( 'Home and end keys', 'qa-cost-of-goods-margins' ),
	escape: __( 'Escape key', 'qa-cost-of-goods-margins' ),
	questionMark: __( 'Question mark', 'qa-cost-of-goods-margins' ),
	selectFocusedDate: __( 'Select the date in focus.', 'qa-cost-of-goods-margins' ),
	moveFocusByOneDay: __(
		'Move backward (left) and forward (right) by one day.',
		'qa-cost-of-goods-margins'
	),
	moveFocusByOneWeek: __(
		'Move backward (up) and forward (down) by one week.',
		'qa-cost-of-goods-margins'
	),
	moveFocusByOneMonth: __( 'Switch months.', 'qa-cost-of-goods-margins' ),
	moveFocustoStartAndEndOfWeek: __(
		'Go to the first or last day of a week.',
		'qa-cost-of-goods-margins'
	),
	returnFocusToInput: __(
		'Return to the date input field.',
		'qa-cost-of-goods-margins'
	),
	keyboardNavigationInstructions: __(
		'Press the down arrow key to interact with the calendar and select a date.',
		'qa-cost-of-goods-margins'
	),
	chooseAvailableStartDate: ( { date } ) =>
		sprintf(
			__( 'Select %s as a start date.', 'qa-cost-of-goods-margins' ),
			date
		),
	chooseAvailableEndDate: ( { date } ) =>
		sprintf( __( 'Select %s as an end date.', 'qa-cost-of-goods-margins' ), date ),
	chooseAvailableDate: ( { date } ) => date,
	dateIsUnavailable: ( { date } ) =>
		sprintf( __( '%s is not selectable.', 'qa-cost-of-goods-margins' ), date ),
	dateIsSelected: ( { date } ) =>
		sprintf( __( 'Selected. %s', 'qa-cost-of-goods-margins' ), date ),
};
