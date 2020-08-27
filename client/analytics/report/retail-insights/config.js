/** @format */
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import { getCategoryLabels } from 'lib/async-requests';

const CATEGORY_REPORT_CHARTS_FILTER = 'qa_cog_ri_category_report_charts';
const CATEGORY_REPORT_FILTERS_FILTER = 'qa_cog_ri_category_report_filters';
const CATEGORY_REPORT_ADVANCED_FILTERS_FILTER =
	'qa_cog_ri_category_report_advanced_filters';

export const charts = applyFilters( CATEGORY_REPORT_CHARTS_FILTER, [
	{
		key: 'gross_revenue',
		label: __( 'Gross Revenue', 'qa-cost-of-goods-margins' ),
		order: 'desc',
		orderby: 'gross_revenue',
		type: 'currency',
	},
	{
		key: 'net_revenue',
		label: __( 'Net Revenue', 'qa-cost-of-goods-margins' ),
		order: 'desc',
		orderby: 'net_revenue',
		type: 'currency',
	},
	{
		key: 'net_profit',
		label: __( 'Net Profit', 'qa-cost-of-goods-margins' ),
		order: 'desc',
		orderby: 'net_profit',
		type: 'currency',
	},
] );

export const filters = applyFilters( CATEGORY_REPORT_FILTERS_FILTER, [
	{
		label: __( 'Show', 'qa-cost-of-goods-margins' ),
		staticParams: [],
		param: 'filter',
		showFilters: () => true,
		filters: [
			{ label: __( 'All Categories', 'qa-cost-of-goods-margins' ), value: 'all' },
			{
				label: __( 'Single Category', 'qa-cost-of-goods-margins' ),
				value: 'select_category',
				chartMode: 'item-comparison',
				subFilters: [
					{
						component: 'Search',
						value: 'single_category',
						chartMode: 'item-comparison',
						path: [ 'select_category' ],
						settings: {
							type: 'categories',
							param: 'categories',
							getLabels: getCategoryLabels,
							labels: {
								placeholder: __( 'Type to search for a category', 'qa-cost-of-goods-margins' ),
								button: __( 'Single Category', 'qa-cost-of-goods-margins' ),
							},
						},
					},
				],
			},
			{
				label: __( 'Comparison', 'qa-cost-of-goods-margins' ),
				value: 'compare-categories',
				chartMode: 'item-comparison',
				settings: {
					type: 'categories',
					param: 'categories',
					getLabels: getCategoryLabels,
					labels: {
						helpText: __( 'Check at least two categories below to compare', 'qa-cost-of-goods-margins' ),
						placeholder: __( 'Search for categories to compare', 'qa-cost-of-goods-margins' ),
						title: __( 'Compare Categories', 'qa-cost-of-goods-margins' ),
						update: __( 'Compare', 'qa-cost-of-goods-margins' ),
					},
				},
			},
		],
	},
] );

export const advancedFilters = applyFilters( CATEGORY_REPORT_ADVANCED_FILTERS_FILTER, {} );
