/** @format */
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component, Fragment } from '@wordpress/element';
import { compose } from '@wordpress/compose';
import PropTypes from 'prop-types';
import { SelectControl } from '@wordpress/components';
import { withDispatch } from '@wordpress/data';

/**
 * WooCommerce dependencies
 */
import { EllipsisMenu, MenuItem, MenuTitle, SectionHeader } from '@woocommerce/components';

/**
 * Internal dependencies
 */
import Leaderboard from 'analytics/components/leaderboard';
import withSelect from 'wc-api/with-select';
import { recordEvent } from 'lib/tracks';
import './style.scss';

class Leaderboards extends Component {
	  constructor( props ) {
		    super( ...arguments );

		    this.state = {
			      rowsPerTable: parseInt( props.userPrefLeaderboardRows ) || 5,
		    };
	  }

	  setRowsPerTable = rows => {
		    this.setState( { rowsPerTable: parseInt( rows ) } );
		    const userDataFields = { [ 'dashboard_leaderboard_rows' ]: parseInt( rows ) };
		    this.props.updateCurrentUserData( userDataFields );
	  };

	  renderMenu() {
		    const { rowsPerTable } = this.state;

		    return (
			      <EllipsisMenu
				      label={ __( 'Choose which leaderboards to display and other settings', 'qa-cost-of-goods-margins' ) }
				      renderContent={ ( { onToggle } ) => (
					        <Fragment>
						        <SelectControl
							        className="woocommerce-dashboard__dashboard-leaderboards__select"
							        label={ __( 'Rows Per Table', 'qa-cost-of-goods-margins' ) }
							        value={ rowsPerTable }
							        options={ Array.from( { length: 20 }, ( v, key ) => ( {
								          v: key + 1,
								          label: key + 1,
							        } ) ) }
							        onChange={ this.setRowsPerTable }
						        />
					        </Fragment>
				      ) }
			      />
		    );
	  }

	  renderLeaderboards() {
		    const { rowsPerTable } = this.state;
		    const { allLeaderboards, query } = this.props;

		    return allLeaderboards.map( leaderboard => {
			      return (
				        <Leaderboard
					        headers={ leaderboard.headers }
					        id={ leaderboard.id }
					        key={ leaderboard.id }
					        query={ query }
					        title={ leaderboard.label }
					        totalRows={ rowsPerTable }
				        />
			      );
		    } );
	  }

	  render() {
		    const { title } = this.props;

		    return (
			      <Fragment>
				      <div className="woocommerce-dashboard__dashboard-leaderboards">
					      <SectionHeader
						      title={ title || __( 'Leaderboards', 'qa-cost-of-goods-margins' ) }
						      menu={ this.renderMenu() }
					      />
					      <div className="woocommerce-dashboard__columns">{ this.renderLeaderboards() }</div>
				      </div>
			      </Fragment>
		    );
	  }
}

Leaderboards.propTypes = {
	  query: PropTypes.object.isRequired,
};

export default compose(
	  withSelect( select => {
		    const { getCurrentUserData, getItems, getItemsError, isGetItemsRequesting } = select( 'wc-api' );
		    const userData = getCurrentUserData();
		    const allLeaderboards = wcSettings.dataEndpoints.leaderboards;

		    return {
			      allLeaderboards,
			      getItems,
			      getItemsError,
			      isGetItemsRequesting,
			      // products_report_columns: userData.dashboard_leaderboard_rows,
		    };
	  } ),
	  withDispatch( dispatch => {
		    const { updateCurrentUserData } = dispatch( 'wc-api' );

		    return { updateCurrentUserData };
	  } )
)( Leaderboards );
