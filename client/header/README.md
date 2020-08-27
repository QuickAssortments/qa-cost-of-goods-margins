Header
======

A basic component for the app header. The header outputs breadcrumbs via the `sections` prop (required) and access to the activity panel. It also sets the document title.

## How to use:

```jsx
import Header from 'header';

render: function() {
	return (
		<Header
			sections={ [
				[ '/analytics', __( 'Analytics', 'qa-cost-of-goods-margins' ) ],
				__( 'Report Title', 'qa-cost-of-goods-margins' ),
			] }
		/>
  	);
}
```

## Props

* `sections` (required): Used to generate breadcrumbs. Accepts a single items or an array of items. To make an item a link, wrap it in an array with a relative link (example: `[ '/analytics', __( 'Analytics', 'qa-cost-of-goods-margins' ) ]` ).
* `isEmbedded`: Boolean describing if the header is embedded on an existing wp-admin page. False if rendered as part of a full react page.

Activity Panel
==============

This component contains the Activity Panel. This is shown on every page and is rendered as part of the header.
