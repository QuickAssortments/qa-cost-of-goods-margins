/** @format */

/**
 * External dependencies
 */
import { event as d3Event } from 'd3-selection';
import { line as d3Line } from 'd3-shape';
import moment from 'moment';
import { first, get } from 'lodash';

/**
 * Internal dependencies
 */
import { smallBreak, wideBreak } from './breakpoints';

/**
 * Describes getDateSpaces
 * @param {array} data - The chart component's `data` prop.
 * @param {array} uniqueDates - from `getUniqueDates`
 * @param {array} visibleKeys - visible keys from the input data for the chart
 * @param {number} width - calculated width of the charting space
 * @param {function} xScale - from `getXLineScale`
 * @returns {array} that includes the date, start (x position) and width to mode the mouseover rectangles
 */
export const getDateSpaces = ( data, uniqueDates, visibleKeys, width, xScale ) => {
	const reversedKeys = visibleKeys.slice().reverse();

	return uniqueDates.map( ( d, i ) => {
		const datapoints = first( data.filter( item => item.date === d ) );
		const xNow = xScale( moment( d ).toDate() );
		const xPrev =
			i >= 1
				? xScale( moment( uniqueDates[ i - 1 ] ).toDate() )
				: xScale( moment( uniqueDates[ 0 ] ).toDate() );
		const xNext =
			i < uniqueDates.length - 1
				? xScale( moment( uniqueDates[ i + 1 ] ).toDate() )
				: xScale( moment( uniqueDates[ uniqueDates.length - 1 ] ).toDate() );
		let xWidth = i === 0 ? xNext - xNow : xNow - xPrev;
		const xStart = i === 0 ? 0 : xNow - xWidth / 2;
		xWidth = i === 0 || i === uniqueDates.length - 1 ? xWidth / 2 : xWidth;
		return {
			date: d,
			start: uniqueDates.length > 1 ? xStart : 0,
			width: uniqueDates.length > 1 ? xWidth : width,
			values: reversedKeys.map( ( { key } ) => {
				const datapoint = datapoints[ key ];
				if ( ! datapoint ) {
					return null;
				}
				return {
					key,
					value: datapoint.value,
					date: d,
				};
			} ).filter( Boolean ),
		};
	} );
};

/**
 * Describes getLine
 * @param {function} xScale - from `getXLineScale`.
 * @param {function} yScale - from `getYScale`.
 * @returns {function} the D3 line function for plotting all category values
 */
export const getLine = ( xScale, yScale ) =>
	d3Line()
		.x( d => xScale( moment( d.date ).toDate() ) )
		.y( d => yScale( d.value ) );

/**
 * Describes `getLineData`
 * @param {array} data - The chart component's `data` prop.
 * @param {array} orderedKeys - from `getOrderedKeys`.
 * @returns {array} an array objects with a category `key` and an array of `values` with `date` and `value` properties
 */
export const getLineData = ( data, orderedKeys ) =>
	orderedKeys.map( row => ( {
		key: row.key,
		focus: row.focus,
		visible: row.visible,
		label: row.label,
		values: data.map( d => ( {
			date: d.date,
			focus: row.focus,
			value: get( d, [ row.key, 'value' ], 0 ),
			visible: row.visible,
		} ) ),
	} ) );

export const drawLines = ( node, data, params, scales, formats, tooltip ) => {
	const height = scales.yScale.range()[ 0 ];
	const width = scales.xScale.range()[ 1 ];
	const line = getLine( scales.xScale, scales.yScale );
	const lineData = getLineData( data, params.visibleKeys );
	const series = node
		.append( 'g' )
		.attr( 'class', 'lines' )
		.selectAll( '.line-g' )
		.data( lineData.filter( d => d.visible ).reverse() )
		.enter()
		.append( 'g' )
		.attr( 'class', 'line-g' )
		.attr( 'role', 'region' )
		.attr( 'aria-label', d => d.label || d.key );
	const dateSpaces = getDateSpaces( data, params.uniqueDates, params.visibleKeys, width, scales.xScale );

	let lineStroke = width <= wideBreak || params.uniqueDates.length > 50 ? 2 : 3;
	lineStroke = width <= smallBreak ? 1.25 : lineStroke;
	const dotRadius = width <= wideBreak ? 4 : 6;

	params.uniqueDates.length > 1 &&
		series
			.append( 'path' )
			.attr( 'fill', 'none' )
			.attr( 'stroke-width', lineStroke )
			.attr( 'stroke-linejoin', 'round' )
			.attr( 'stroke-linecap', 'round' )
			.attr( 'stroke', d => params.getColor( d.key ) )
			.style( 'opacity', d => {
				const opacity = d.focus ? 1 : 0.1;
				return d.visible ? opacity : 0;
			} )
			.attr( 'd', d => line( d.values ) );

	const minDataPointSpacing = 36;

	width / params.uniqueDates.length > minDataPointSpacing &&
		series
			.selectAll( 'circle' )
			.data( ( d, i ) => d.values.map( row => ( { ...row, i, visible: d.visible, key: d.key } ) ) )
			.enter()
			.append( 'circle' )
			.attr( 'r', dotRadius )
			.attr( 'fill', d => params.getColor( d.key ) )
			.attr( 'stroke', '#fff' )
			.attr( 'stroke-width', lineStroke + 1 )
			.style( 'opacity', d => {
				const opacity = d.focus ? 1 : 0.1;
				return d.visible ? opacity : 0;
			} )
			.attr( 'cx', d => scales.xScale( moment( d.date ).toDate() ) )
			.attr( 'cy', d => scales.yScale( d.value ) )
			.attr( 'tabindex', '0' )
			.attr( 'aria-label', d => {
				const label = formats.screenReaderFormat( d.date instanceof Date ? d.date : moment( d.date ).toDate() );
				return `${ label } ${ tooltip.valueFormat( d.value ) }`;
			} )
			.on( 'focus', ( d, i, nodes ) => {
				tooltip.show( data.find( e => e.date === d.date ), nodes[ i ].parentNode, d3Event.target );
			} )
			.on( 'blur', () => tooltip.hide() );

	const focus = node
		.append( 'g' )
		.attr( 'class', 'focusspaces' )
		.selectAll( '.focus' )
		.data( dateSpaces )
		.enter()
		.append( 'g' )
		.attr( 'class', 'focus' );

	const focusGrid = focus
		.append( 'g' )
		.attr( 'class', 'focus-grid' )
		.attr( 'opacity', '0' );

	focusGrid
		.append( 'line' )
		.attr( 'x1', d => scales.xScale( moment( d.date ).toDate() ) )
		.attr( 'y1', 0 )
		.attr( 'x2', d => scales.xScale( moment( d.date ).toDate() ) )
		.attr( 'y2', height );

	focusGrid
		.selectAll( 'circle' )
		.data( d => d.values )
		.enter()
		.append( 'circle' )
		.attr( 'r', dotRadius + 2 )
		.attr( 'fill', d => params.getColor( d.key ) )
		.attr( 'stroke', '#fff' )
		.attr( 'stroke-width', lineStroke + 2 )
		.attr( 'cx', d => scales.xScale( moment( d.date ).toDate() ) )
		.attr( 'cy', d => scales.yScale( d.value ) );

	focus
		.append( 'rect' )
		.attr( 'class', 'focus-g' )
		.attr( 'x', d => d.start )
		.attr( 'y', 0 )
		.attr( 'width', d => d.width )
		.attr( 'height', height )
		.attr( 'opacity', 0 )
		.on( 'mouseover', ( d, i, nodes ) => {
			const isTooltipLeftAligned = ( i === 0 || i === dateSpaces.length - 1 ) && params.uniqueDates.length > 1;
			const elementWidthRatio = isTooltipLeftAligned ? 0 : 0.5;
			tooltip.show( data.find( e => e.date === d.date ), d3Event.target, nodes[ i ].parentNode, elementWidthRatio );
		} )
		.on( 'mouseout', () => tooltip.hide() );
};
