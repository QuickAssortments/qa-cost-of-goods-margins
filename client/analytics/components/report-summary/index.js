/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component } from '@wordpress/element';
import { compose } from '@wordpress/compose';
import PropTypes from 'prop-types';

/**
 * WooCommerce dependencies
 */
import { getDateParamsFromQuery } from 'lib/date';
import { getNewPath } from '@woocommerce/navigation';
import {
	SummaryList,
	SummaryListPlaceholder,
	SummaryNumber,
} from '@woocommerce/components';
import { calculateDelta, formatValue } from '@woocommerce/number';

/**
 * Internal dependencies
 */
import { getSummaryNumbers } from 'wc-api/reports/utils';
import ReportError from 'analytics/components/report-error';
import withSelect from 'wc-api/with-select';
import { recordEvent } from 'lib/tracks';
import { formatCurrency } from 'lib/currency';
/**
 * Component to render summary numbers in reports.
 */
export class ReportSummary extends Component {
	getValues( key, type ) {
		const { emptySearchResults, summaryData } = this.props;
		const { totals } = summaryData;
		const primaryValue = emptySearchResults ? 0 : totals.primary[ key ];
		const secondaryValue = emptySearchResults ? 0 : totals.secondary[ key ];

		return {
			delta: calculateDelta( primaryValue, secondaryValue ),
			prevValue: formatCurrency( secondaryValue ),
			value: formatCurrency( primaryValue ),
		};
	}

	render() {
		const {
			charts,
			isRequesting,
			query,
			selectedChart,
			summaryData,
			endpoint,
			report,
			defaultDateRange,
		} = this.props;
		const { isError, isRequesting: isSummaryDataRequesting } = summaryData;

		if ( isError ) {
			return <ReportError isError />;
		}

		if ( isRequesting || isSummaryDataRequesting ) {
			return <SummaryListPlaceholder numberOfItems={ charts.length } />;
		}

		const { compare } = getDateParamsFromQuery( query, defaultDateRange );

		const renderSummaryNumbers = ( { onToggle } ) =>
			charts.map( ( chart ) => {
				const { key, order, orderby, label, type } = chart;
				const newPath = { chart: key };
				if ( orderby ) {
					newPath.orderby = orderby;
				}
				if ( order ) {
					newPath.order = order;
				}
				const href = getNewPath( newPath );
				const isSelected = selectedChart.key === key;
				const { delta, prevValue, value } = this.getValues( key, type );

				return (
					<SummaryNumber
						key={ key }
						delta={ delta }
						href={ href }
						label={ label }
						prevLabel={
							compare === 'previous_period'
								? __( 'Previous Period:', 'woocommerce-admin' )
								: __( 'Previous Year:', 'woocommerce-admin' )
						}
						prevValue={ prevValue }
						selected={ isSelected }
						value={ value }
						onLinkClickCallback={ () => {
							// Wider than a certain breakpoint, there is no dropdown so avoid calling onToggle.
							if ( onToggle ) {
								onToggle();
							}
							recordEvent( 'analytics_chart_tab_click', {
								report: report || endpoint,
								key,
							} );
						} }
					/>
				);
			} );

		return <SummaryList>{ renderSummaryNumbers }</SummaryList>;
	}
}

ReportSummary.propTypes = {
	/**
	 * Properties of all the charts available for that report.
	 */
	charts: PropTypes.array.isRequired,
	/**
	 * The endpoint to use in API calls to populate the Summary Numbers.
	 * For example, if `taxes` is provided, data will be fetched from the report
	 * `taxes` endpoint (ie: `/wc-analytics/reports/taxes/stats`). If the provided endpoint
	 * doesn't exist, an error will be shown to the user with `ReportError`.
	 */
	endpoint: PropTypes.string.isRequired,
	/**
	 * Allows specifying properties different from the `endpoint` that will be used
	 * to limit the items when there is an active search.
	 */
	limitProperties: PropTypes.array,
	/**
	 * The query string represented in object form.
	 */
	query: PropTypes.object.isRequired,
	/**
	 * Whether there is an API call running.
	 */
	isRequesting: PropTypes.bool,
	/**
	 * Properties of the selected chart.
	 */
	selectedChart: PropTypes.shape( {
		/**
		 * Key of the selected chart.
		 */
		key: PropTypes.string.isRequired,
		/**
		 * Chart label.
		 */
		label: PropTypes.string.isRequired,
		/**
		 * Order query argument.
		 */
		order: PropTypes.oneOf( [ 'asc', 'desc' ] ),
		/**
		 * Order by query argument.
		 */
		orderby: PropTypes.string,
		/**
		 * Number type for formatting.
		 */
		type: PropTypes.oneOf( [ 'average', 'number', 'currency' ] ).isRequired,
	} ).isRequired,
	/**
	 * Data to display in the SummaryNumbers.
	 */
	summaryData: PropTypes.object,
	/**
	 * Report name, if different than the endpoint.
	 */
	report: PropTypes.string,
};

ReportSummary.defaultProps = {
	summaryData: {
		totals: {
			primary: {},
			secondary: {},
		},
		isError: false,
		isRequesting: false,
	},
};

export default compose(
	withSelect( ( select, props ) => {
		const {
			charts,
			endpoint,
			isRequesting,
			limitProperties,
			query,
			filters,
			advancedFilters,
		} = props;
		const limitBy = limitProperties || [ endpoint ];

		if ( isRequesting ) {
			return {};
		}

		const hasLimitByParam = limitBy.some(
			( item ) => query[ item ] && query[ item ].length
		);

		if ( query.search && ! hasLimitByParam ) {
			return {
				emptySearchResults: true,
			};
		}

		const fields = charts && charts.map( chart => chart.key );

		const { woocommerce_default_date_range: defaultDateRange } = 'period=month&amp;compare=previous_year';

		const summaryData = getSummaryNumbers( {
			endpoint,
			query,
			select,
			limitBy,
			filters,
			advancedFilters,
			defaultDateRange,
			fields,
		} );

		return {
			summaryData,
			defaultDateRange,
		};
	} )
)( ReportSummary );
