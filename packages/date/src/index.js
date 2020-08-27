/** @format */
/**
 * External dependencies
 */
import moment from 'moment';
import { find } from 'lodash';
import { __ } from '@wordpress/i18n';
import { parse } from 'qs';

export const isoDateFormat = 'YYYY-MM-DD';

/**
 * DateValue Object
 *
 * @typedef {Object} DateValue - Describes the date range supplied by the date picker.
 * @property {string} label - The translated value of the period.
 * @property {string} range - The human readable value of a date range.
 * @property {moment.Moment} after - Start of the date range.
 * @property {moment.Moment} before - End of the date range.
 */

/**
 * DateParams Object
 *
 * @typedef {Object} dateParams - date parameters derived from query parameters.
 * @property {string} period - period value, ie `last_week`
 * @property {string} compare - compare valuer, ie previous_year
 * @param {moment.Moment|null} after - If the period supplied is "custom", this is the after date
 * @param {moment.Moment|null} before - If the period supplied is "custom", this is the before date
 */

export const presetValues = [
	{ value: 'today', label: __( 'Today', 'qa-cost-of-goods-margins' ) },
	{ value: 'yesterday', label: __( 'Yesterday', 'qa-cost-of-goods-margins' ) },
	{ value: 'week', label: __( 'Week to Date', 'qa-cost-of-goods-margins' ) },
	{ value: 'last_week', label: __( 'Last Week', 'qa-cost-of-goods-margins' ) },
	{ value: 'month', label: __( 'Month to Date', 'qa-cost-of-goods-margins' ) },
	{ value: 'last_month', label: __( 'Last Month', 'qa-cost-of-goods-margins' ) },
	{ value: 'quarter', label: __( 'Quarter to Date', 'qa-cost-of-goods-margins' ) },
	{ value: 'last_quarter', label: __( 'Last Quarter', 'qa-cost-of-goods-margins' ) },
	{ value: 'year', label: __( 'Year to Date', 'qa-cost-of-goods-margins' ) },
	{ value: 'last_year', label: __( 'Last Year', 'qa-cost-of-goods-margins' ) },
	{ value: 'custom', label: __( 'Custom', 'qa-cost-of-goods-margins' ) },
];

export const periods = [
	{ value: 'previous_period', label: __( 'Previous Period', 'qa-cost-of-goods-margins' ) },
	{ value: 'previous_year', label: __( 'Previous Year', 'qa-cost-of-goods-margins' ) },
];

/**
 * Adds timestamp to a string date.
 *
 * @param {moment.Moment} date - Date as a moment object.
 * @param {string} timeOfDay - Either `start`, `now` or `end` of the day.
 * @return {string} - String date with timestamp attached.
 */
export const appendTimestamp = ( date, timeOfDay ) => {
	date = date.format( isoDateFormat );
	if ( timeOfDay === 'start' ) {
		return date + 'T00:00:00';
	}
	if ( timeOfDay === 'now' ) {
		// Set seconds to 00 to avoid consecutives calls happening before the previous
		// one finished.
		return date + 'T' + moment().format( 'HH:mm:00' );
	}
	if ( timeOfDay === 'end' ) {
		return date + 'T23:59:59';
	}
	throw new Error(
		'appendTimestamp requires second parameter to be either `start`, `now` or `end`'
	);
};

/**
 * Convert a string to Moment object
 *
 * @param {string} format - localized date string format
 * @param {string} str - date string
 * @return {Moment|null} - Moment object representing given string
 */
export function toMoment( format, str ) {
	if ( moment.isMoment( str ) ) {
		return str.isValid() ? str : null;
	}
	if ( 'string' === typeof str ) {
		const date = moment( str, [ isoDateFormat, format ], true );
		return date.isValid() ? date : null;
	}
	throw new Error( 'toMoment requires a string to be passed as an argument' );
}

/**
 * Given two dates, derive a string representation
 *
 * @param {Moment} after - start date
 * @param {Moment} before - end date
 * @return {string} - text value for the supplied date range
 */
export function getRangeLabel( after, before ) {
	const isSameYear = after.year() === before.year();
	const isSameMonth = isSameYear && after.month() === before.month();
	const isSameDay = isSameYear && isSameMonth && after.isSame( before, 'day' );
	const fullDateFormat = __( 'MMM D, YYYY', 'qa-cost-of-goods-margins' );
	const monthDayFormat = __( 'MMM D', 'qa-cost-of-goods-margins' );

	if ( isSameDay ) {
		return after.format( fullDateFormat );
	} else if ( isSameMonth ) {
		const afterDate = after.date();
		return after
			.format( fullDateFormat )
			.replace( afterDate, `${ afterDate } - ${ before.date() }` );
	} else if ( isSameYear ) {
		return `${ after.format( monthDayFormat ) } - ${ before.format( fullDateFormat ) }`;
	}
	return `${ after.format( fullDateFormat ) } - ${ before.format( fullDateFormat ) }`;
}

/**
 * Get a DateValue object for a period prior to the current period.
 *
 * @param {string} period - the chosen period
 * @param {string} compare - `previous_period` or `previous_year`
 * @return {DateValue} -  DateValue data about the selected period
 */
export function getLastPeriod( period, compare ) {
	const primaryStart = moment()
		.startOf( period )
		.subtract( 1, period );
	const primaryEnd = primaryStart.clone().endOf( period );
	let secondaryStart;
	let secondaryEnd;

	if ( 'previous_period' === compare ) {
		if ( 'year' === period ) {
			// Subtract two entire periods for years to take into account leap year
			secondaryStart = moment()
				.startOf( period )
				.subtract( 2, period );
			secondaryEnd = secondaryStart.clone().endOf( period );
		} else {
			// Otherwise, use days in primary period to figure out how far to go back
			const daysDiff = primaryEnd.diff( primaryStart, 'days' );
			secondaryEnd = primaryStart.clone().subtract( 1, 'days' );
			secondaryStart = secondaryEnd.clone().subtract( daysDiff, 'days' );
		}
	} else {
		secondaryStart =
			'week' === period
				? primaryStart
						.clone()
						.subtract( 1, 'years' )
						.week( primaryStart.week() )
						.startOf( 'week' )
				: primaryStart.clone().subtract( 1, 'years' );
		secondaryEnd = secondaryStart.clone().endOf( period );
	}
	return {
		primaryStart,
		primaryEnd,
		secondaryStart,
		secondaryEnd,
	};
}

/**
 * Get a DateValue object for a curent period. The period begins on the first day of the period,
 * and ends on the current day.
 *
 * @param {string} period - the chosen period
 * @param {string} compare - `previous_period` or `previous_year`
 * @return {DateValue} -  DateValue data about the selected period
 */
export function getCurrentPeriod( period, compare ) {
	const primaryStart = moment().startOf( period );
	const primaryEnd = moment();
	const daysSoFar = primaryEnd.diff( primaryStart, 'days' );
	let secondaryStart;
	let secondaryEnd;

	if ( 'previous_period' === compare ) {
		secondaryStart = primaryStart.clone().subtract( 1, period );
		secondaryEnd = primaryEnd.clone().subtract( 1, period );
	} else {
		secondaryStart =
			'week' === period
				? primaryStart
						.clone()
						.subtract( 1, 'years' )
						.week( primaryStart.week() )
						.startOf( 'week' )
				: primaryStart.clone().subtract( 1, 'years' );
		secondaryEnd = secondaryStart.clone().add( daysSoFar, 'days' );
	}
	return {
		primaryStart,
		primaryEnd,
		secondaryStart,
		secondaryEnd,
	};
}

/**
 * Get a DateValue object for a period described by a period, compare value, and start/end
 * dates, for custom dates.
 *
 * @param {string} period - the chosen period
 * @param {string} compare - `previous_period` or `previous_year`
 * @param {Moment} [after] - after date if custom period
 * @param {Moment} [before] - before date if custom period
 * @return {DateValue} - DateValue data about the selected period
 */
function getDateValue( period, compare, after, before ) {
	switch ( period ) {
		case 'today':
			return getCurrentPeriod( 'day', compare );
		case 'yesterday':
			return getLastPeriod( 'day', compare );
		case 'week':
			return getCurrentPeriod( 'week', compare );
		case 'last_week':
			return getLastPeriod( 'week', compare );
		case 'month':
			return getCurrentPeriod( 'month', compare );
		case 'last_month':
			return getLastPeriod( 'month', compare );
		case 'quarter':
			return getCurrentPeriod( 'quarter', compare );
		case 'last_quarter':
			return getLastPeriod( 'quarter', compare );
		case 'year':
			return getCurrentPeriod( 'year', compare );
		case 'last_year':
			return getLastPeriod( 'year', compare );
		case 'custom':
			const difference = before.diff( after, 'days' );
			if ( 'previous_period' === compare ) {
				const secondaryEnd = after.clone().subtract( 1, 'days' );
				const secondaryStart = secondaryEnd.clone().subtract( difference, 'days' );
				return {
					primaryStart: after,
					primaryEnd: before,
					secondaryStart,
					secondaryEnd,
				};
			}
			return {
				primaryStart: after,
				primaryEnd: before,
				secondaryStart: after.clone().subtract( 1, 'years' ),
				secondaryEnd: before.clone().subtract( 1, 'years' ),
			};
	}
}

/**
 * Add default date-related parameters to a query object
 *
 * @param {string} [period] - period value, ie `last_week`
 * @param {string} [compare] - compare value, ie `previous_year`
 * @param {string} [after] - date in iso date format, ie `2018-07-03`
 * @param {string} [before] - date in iso date format, ie `2018-07-03`
 * @return {DateParams} - date parameters derived from query parameters with added defaults
 */
export const getDateParamsFromQuery = ( { period, compare, after, before } ) => {
	if ( period && compare ) {
		return {
			period,
			compare,
			after: after ? moment( after ) : null,
			before: before ? moment( before ) : null,
		};
	}

	const defaultDateRange =
		wcSettings.wcAdminSettings.woocommerce_default_date_range ||
		'period=month&compare=previous_year';

	const queryDefaults = parse( defaultDateRange.replace( /&amp;/g, '&' ) );

	return {
		period: queryDefaults.period,
		compare: queryDefaults.compare,
		after: queryDefaults.after ? moment( queryDefaults.after ) : null,
		before: queryDefaults.before ? moment( queryDefaults.before ) : null,
	};
};

/**
 * Get Date Value Objects for a primary and secondary date range
 *
 * @param {Object} query - date parameters derived from query parameters
 * @property {string} [period] - period value, ie `last_week`
 * @property {string} [compare] - compare value, ie `previous_year`
 * @property {string} [after] - date in iso date format, ie `2018-07-03`
 * @property {string} [before] - date in iso date format, ie `2018-07-03`
 * @return {{primary: DateValue, secondary: DateValue}} - Primary and secondary DateValue objects
 */
export const getCurrentDates = query => {
	const { period, compare, after, before } = getDateParamsFromQuery( query );
	const { primaryStart, primaryEnd, secondaryStart, secondaryEnd } = getDateValue(
		period,
		compare,
		after,
		before
	);

	return {
		primary: {
			label: find( presetValues, item => item.value === period ).label,
			range: getRangeLabel( primaryStart, primaryEnd ),
			after: primaryStart,
			before: primaryEnd,
		},
		secondary: {
			label: find( periods, item => item.value === compare ).label,
			range: getRangeLabel( secondaryStart, secondaryEnd ),
			after: secondaryStart,
			before: secondaryEnd,
		},
	};
};

/**
 * Calculates the date difference between two dates. Used in calculating a matching date for previous period.
 *
 * @param {String} date - Date to compare
 * @param {String} date2 - Seconary date to compare
 * @return {Int}  - Difference in days.
 */
export const getDateDifferenceInDays = ( date, date2 ) => {
	const _date = moment( date );
	const _date2 = moment( date2 );
	return _date.diff( _date2, 'days' );
};

/**
 * Get the previous date for either the previous period of year.
 *
 * @param {String} date - Base date
 * @param {String|Moment.moment} date1 - primary start
 * @param {String|Moment.moment} date2 - secondary start
 * @param {String} compare - `previous_period`  or `previous_year`
 * @param {String} interval - interval
 * @return {Moment.moment}  - Calculated date
 */
export const getPreviousDate = ( date, date1, date2, compare, interval ) => {
	const dateMoment = moment( date );

	if ( 'previous_year' === compare ) {
		return dateMoment.clone().subtract( 1, 'years' );
	}

	const _date1 = moment( date1 );
	const _date2 = moment( date2 );
	const difference = _date1.diff( _date2, interval );

	return dateMoment.clone().subtract( difference, interval );
};

/**
 * Returns the allowed selectable intervals for a specific query.
 *
 * @param  {Object} query Current query
 * @return {Array} Array containing allowed intervals.
 */
export function getAllowedIntervalsForQuery( query ) {
	let allowed = [];
	if ( 'custom' === query.period ) {
		const { primary } = getCurrentDates( query );
		const differenceInDays = getDateDifferenceInDays( primary.before, primary.after );
		if ( differenceInDays >= 365 ) {
			allowed = [ 'day', 'week', 'month', 'quarter', 'year' ];
		} else if ( differenceInDays >= 90 ) {
			allowed = [ 'day', 'week', 'month', 'quarter' ];
		} else if ( differenceInDays >= 28 ) {
			allowed = [ 'day', 'week', 'month' ];
		} else if ( differenceInDays >= 7 ) {
			allowed = [ 'day', 'week' ];
		} else if ( differenceInDays > 1 && differenceInDays < 7 ) {
			allowed = [ 'day' ];
		} else {
			allowed = [ 'hour', 'day' ];
		}
	} else {
		switch ( query.period ) {
			case 'today':
			case 'yesterday':
				allowed = [ 'hour', 'day' ];
				break;
			case 'week':
			case 'last_week':
				allowed = [ 'day' ];
				break;
			case 'month':
			case 'last_month':
				allowed = [ 'day', 'week' ];
				break;
			case 'quarter':
			case 'last_quarter':
				allowed = [ 'day', 'week', 'month' ];
				break;
			case 'year':
			case 'last_year':
				allowed = [ 'day', 'week', 'month', 'quarter' ];
				break;
			default:
				allowed = [ 'day' ];
				break;
		}
	}
	return allowed;
}

/**
 * Returns the current interval to use.
 *
 * @param  {Object} query Current query
 * @return {String} Current interval.
 */
export function getIntervalForQuery( query ) {
	const allowed = getAllowedIntervalsForQuery( query );
	const defaultInterval = allowed[ 0 ];
	let current = query.interval || defaultInterval;
	if ( query.interval && ! allowed.includes( query.interval ) ) {
		current = defaultInterval;
	}

	return current;
}

/**
 * Returns the current chart type to use.
 *
 * @param  {Object} query Current query
 * @return {String} Current chart type.
 */
export function getChartTypeForQuery( { chartType } ) {
	if ( [ 'line', 'bar' ].includes( chartType ) ) {
		return chartType;
	}
	return 'line';
}

export const dayTicksThreshold = 63;
export const weekTicksThreshold = 9;
export const defaultTableDateFormat = 'm/d/Y';

/**
 * Returns date formats for the current interval.
 * See https://github.com/d3/d3-time-format for chart formats.
 *
 * @param  {String} interval Interval to get date formats for.
 * @param  {Int}    [ticks] Number of ticks the axis will have.
 * @return {String} Current interval.
 */
export function getDateFormatsForInterval( interval, ticks = 0 ) {
	let screenReaderFormat = '%B %-d, %Y';
	let tooltipLabelFormat = '%B %-d, %Y';
	let xFormat = '%Y-%m-%d';
	let x2Format = '%b %Y';
	let tableFormat = defaultTableDateFormat;

	switch ( interval ) {
		case 'hour':
			screenReaderFormat = '%_I%p %B %-d, %Y';
			tooltipLabelFormat = '%_I%p %b %-d, %Y';
			xFormat = '%_I%p';
			x2Format = '%b %-d, %Y';
			tableFormat = 'h A';
			break;
		case 'day':
			if ( ticks < dayTicksThreshold ) {
				xFormat = '%-d';
			} else {
				xFormat = '%b';
				x2Format = '%Y';
			}
			break;
		case 'week':
			if ( ticks < weekTicksThreshold ) {
				xFormat = '%-d';
				x2Format = '%b %Y';
			} else {
				xFormat = '%b';
				x2Format = '%Y';
			}
			screenReaderFormat = __( 'Week of %B %-d, %Y', 'qa-cost-of-goods-margins' );
			tooltipLabelFormat = __( 'Week of %B %-d, %Y', 'qa-cost-of-goods-margins' );
			break;
		case 'quarter':
		case 'month':
			screenReaderFormat = '%B %Y';
			tooltipLabelFormat = '%B %Y';
			xFormat = '%b';
			x2Format = '%Y';
			break;
		case 'year':
			screenReaderFormat = '%Y';
			tooltipLabelFormat = '%Y';
			xFormat = '%Y';
			break;
	}

	return {
		screenReaderFormat,
		tooltipLabelFormat,
		xFormat,
		x2Format,
		tableFormat,
	};
}

/**
 * Gutenberg's moment instance is loaded with i18n values, which are
 * PHP date formats, ie 'LLL: "F j, Y g:i a"'. Override those with translations
 * of moment style js formats.
 */
export function loadLocaleData() {
	const { userLocale, weekdaysShort } = wcSettings.l10n;
	// Don't update if the wp locale hasn't been set yet, like in unit tests, for instance.
	if ( 'en' !== moment.locale() ) {
		moment.updateLocale( userLocale, {
			longDateFormat: {
				L: __( 'MM/DD/YYYY', 'qa-cost-of-goods-margins' ),
				LL: __( 'MMMM D, YYYY', 'qa-cost-of-goods-margins' ),
				LLL: __( 'D MMMM YYYY LT', 'qa-cost-of-goods-margins' ),
				LLLL: __( 'dddd, D MMMM YYYY LT', 'qa-cost-of-goods-margins' ),
				LT: __( 'HH:mm', 'qa-cost-of-goods-margins' ),
			},
			weekdaysMin: weekdaysShort,
		} );
	}
}

loadLocaleData();

export const dateValidationMessages = {
	invalid: __( 'Invalid date', 'qa-cost-of-goods-margins' ),
	future: __( 'Select a date in the past', 'qa-cost-of-goods-margins' ),
	startAfterEnd: __( 'Start date must be before end date', 'qa-cost-of-goods-margins' ),
	endBeforeStart: __( 'Start date must be before end date', 'qa-cost-of-goods-margins' ),
};

/**
 * Validate text input supplied for a date range.
 *
 * @param {string} type - Designate begining or end of range, eg `before` or `after`.
 * @param {string} value - User input value
 * @param {Moment|null} [before] - If already designated, the before date parameter
 * @param {Moment|null} [after] - If already designated, the after date parameter
 * @param {string} format - The expected date format in a user's locale
 * @return {Object} validatedDate - validated date oject
 * @param {Moment|null} validatedDate.date - A resulting Moment date object or null, if invalid
 * @param {string} validatedDate.error - An optional error message if date is invalid
 */
export function validateDateInputForRange( type, value, before, after, format ) {
	const date = toMoment( format, value );
	if ( ! date ) {
		return {
			date: null,
			error: dateValidationMessages.invalid,
		};
	}
	if ( moment().isBefore( date, 'day' ) ) {
		return {
			date: null,
			error: dateValidationMessages.future,
		};
	}
	if ( 'after' === type && before && date.isAfter( before, 'day' ) ) {
		return {
			date: null,
			error: dateValidationMessages.startAfterEnd,
		};
	}
	if ( 'before' === type && after && date.isBefore( after, 'day' ) ) {
		return {
			date: null,
			error: dateValidationMessages.endBeforeStart,
		};
	}
	return { date };
}
