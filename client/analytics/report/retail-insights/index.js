/** @format */
/**
 * External dependencies
 */
import { Component, Fragment } from '@wordpress/element';
import PropTypes from 'prop-types';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { advancedFilters, charts, filters } from './config';
import getSelectedChart from 'lib/get-selected-chart';
import ReportChart from 'analytics/components/report-chart';
import ReportSummary from 'analytics/components/report-summary';
import ReportFilters from 'analytics/components/report-filters';
import Leaderboards from 'analytics/report/leaderboards';

export default class RetailInsights extends Component {
	getChartMeta() {
		const { query } = this.props;
		const isCompareView =
			'compare-categories' === query.filter &&
			query.categories &&
			query.categories.split( ',' ).length > 1;
		const isSingleCategoryView = 'single_category' === query.filter && !! query.categories;

		const mode = isCompareView || isSingleCategoryView ? 'item-comparison' : 'time-comparison';
		const itemsLabel = isSingleCategoryView
			? __( '%d products', 'qa-cost-of-goods-margins' )
			: __( '%d categories', 'qa-cost-of-goods-margins' );

		return {
			isSingleCategoryView,
			itemsLabel,
			mode,
		};
	}

	render() {
		const { isRequesting, query, path } = this.props;
		const { mode, itemsLabel, isSingleCategoryView } = this.getChartMeta();

		const chartQuery = {
			...query,
		};

		if ( 'item-comparison' === mode ) {
			chartQuery.segmentby = isSingleCategoryView ? 'product' : 'category';
		}

		return (
			<Fragment>
				<ReportFilters
					query={ query }
					path={ path }
					filters={ filters }
					advancedFilters={ advancedFilters }
					report="categories"
				/>
				<ReportSummary
					charts={ charts }
					endpoint="products"
					isRequesting={ isRequesting }
					limitProperties={ isSingleCategoryView ? [ 'products', 'categories' ] : [ 'categories' ] }
					query={ chartQuery }
					selectedChart={ getSelectedChart( query.chart, charts ) }
					filters={ filters }
					advancedFilters={ advancedFilters }
					report="categories"
				/>
				<ReportChart
					filters={ filters }
					advancedFilters={ advancedFilters }
					mode={ mode }
					endpoint="products"
					limitProperties={ isSingleCategoryView ? [ 'products', 'categories' ] : [ 'categories' ] }
					path={ path }
					query={ chartQuery }
					isRequesting={ isRequesting }
					itemsLabel={ itemsLabel }
					selectedChart={ getSelectedChart( query.chart, charts ) }
				/>
				<Leaderboards query={ query } hiddenBlocks={ [] } />

			</Fragment>
		);
	}
}

RetailInsights.propTypes = {
	query: PropTypes.object.isRequired,
	path: PropTypes.string.isRequired,
};
