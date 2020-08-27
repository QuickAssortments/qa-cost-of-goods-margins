/** @format */
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';
import { Component } from '@wordpress/element';
import { compose } from '@wordpress/compose';
import PropTypes from 'prop-types';
import { find } from 'lodash';

/**
 * WooCommerce dependencies
 */
import { useFilters } from '@woocommerce/components';
import { getQuery, getSearchWords } from '@woocommerce/navigation';

/**
 * Internal dependencies
 */
import './style.scss';
import RetailInsights from './retail-insights';
import ReportError from 'analytics/components/report-error';
import { searchItemsByString } from 'wc-api/items/utils';
import withSelect from 'wc-api/with-select';

export const REPORTS_FILTER = 'qa_cog_ri_reports_list';

export const getReports = () => {
	  const reports = [
		    {
			      report: 'categories',
			      title: __( 'Categories', 'qa-cost-of-goods-margins' ),
			      component: RetailInsights,
		    }
	  ].filter( Boolean );

	  return applyFilters( REPORTS_FILTER, reports );
};

class Report extends Component {
	  constructor() {
		    super( ...arguments );

		    this.state = {
			      hasError: false,
		    };
	  }

	  componentDidCatch( error ) {
		    this.setState( {
			      hasError: true,
		    } );
		    /* eslint-disable no-console */
		    console.warn( error );
		    /* eslint-enable no-console */
	  }

	  render() {
		    if ( this.state.hasError ) {
			      return null;
		    }

		    const { params, isError } = this.props;

		    if ( isError ) {
			      return <ReportError isError />;
		    }

		    return <RetailInsights { ...this.props } />;
	  }
}

Report.propTypes = {
	  params: PropTypes.object.isRequired,
};

export default compose(
	  useFilters( REPORTS_FILTER ),
	  withSelect( ( select, props ) => {
		    const query = getQuery();
		    const { search } = query;

		    if ( ! search ) {
			      return {};
		    }

		    const { report } = props.params;
		    const searchWords = getSearchWords( query );
		    // Single Category view in Categories Report uses the products endpoint, so search must also.
		    const mappedReport = 'categories' === report && 'single_category' === query.filter ? 'products' : report;
		    const itemsResult = searchItemsByString( select, mappedReport, searchWords );
		    const { isError, isRequesting, items } = itemsResult;
		    const ids = Object.keys( items );
		    if ( ! ids.length ) {
			      return {
				        isError,
				        isRequesting,
			      };
		    }

		    return {
			      isError,
			      isRequesting,
			      query: {
				        ...props.query,
				        [ mappedReport ]: ids.join( ',' ),
			      },
		    };
	  } )
)( Report );
