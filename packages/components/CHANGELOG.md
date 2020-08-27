# 4.0.0
- Added a new `<ScrollTo />` component.
- Changed the `<List />` `description` prop to `content` and allowed content nodes to be passed in addition to strings.

# 3.2.0
- AdvancedFilters component: fire `onAdvancedFilterAction` for match changes.
- TableCard component: add `onSearch` and `onSort` function props.
- Add new component `<List />` for displaying interactive list items.
- Fix z-index issue in `<Chart />` empty message.
- Added a new `<SimpleSelectControl />` component.
- Added a new `<WebPreview />` component.
- SearchListItem component: fix long count values being cut-off in IE11.
- Add `disabled` prop to CompareButton, Search, and TableCard components.
- Table component: add empty table display.

# 3.1.0
- Added support for a `countLabel` prop on `SearchListItem` to allow custom counts.

# 3.0.0
- <DateInput> and <DatePicker> got a `disabled` prop.
- TableCard component: new `onPageChange` prop.
- TableCard now has a `defaultOrder` parameter to specify default sort column sort order.
- Pagination no longer considers `0` a valid input and triggers `onPageChange` on the input blur event.
- Tweaks to SummaryListPlaceholder height in order to better match SummaryNumber.
- EllipsisMenu component (breaking change): Remove `children` prop in favor of a render prop `renderContent` so that function arguments `isOpen`, `onToggle`, and `onClose` can be passed down.
- Chart has a new prop named `yBelow1Format` which overrides the `yFormat` for values between -1 and 1 (not included).
- Add a `totals` prop to Chart component that allows overwriting the total values shown in the legend.
- Add new component `<Stepper />` for showing a list of steps and progress.
- Add new `<Spinner />` component.
- Card component: updated default Muriel design.
- Card component: new `description` prop.
- Card component: new `isInactive` prop.
- DateRangeFilterPicker (breaking change): Introduced `onRangeSelect` prop and remove `path` prop better control.
- Update license to GPL-3.0-or-later.

# 2.0.0
- Chart legend component now uses withInstanceId HOC so the ids used in several HTML elements are unique.
- Chart component now accepts data with negative values.
- Chart component: new prop `filterParam` used to detect selected items in the current query. If there are, they will be displayed in the chart even if their values are 0.
- Expand search results and allow searching when input is refocused in autocompleter.
- Animation Slider: Remove `focusOnChange` in favor of `onExited` so consumers can pass a function to be executed after a transition has finished.
- SearchListControl: Add `onSearch` callback prop to let the parent component know about search changes.
- Calendar: Expose `isInvalidDate` prop to `DatePicker` to indicated invalid days that are not selectable.
- Calendar: Expose `isInvalidDate` prop to `DateRange` and remove the `invalidDays` prop.
- Bump dependency versions.

# 1.6.0
- Chart component: new props `emptyMessage` and `baseValue`. When an empty message is provided, it will be displayed on top of the chart if there are no values different than `baseValue`.
- Chart component: remove d3-array dependency.
- Chart component: fix display when there is no data.
- Chart component: change chart type query parameter to `chartType`.
- Chart component: add `screenReaderFormat` prop that will be used to format dates for screen reader labels.
- Bug fix for `<StockReportTable />` returning N/A instead of zero.
- Add new component: SearchListControl for displaying and filtering a selectable list of items.

# 1.5.0
- Improves display of charts where all values are 0.
- Fix X-axis labels in hourly bar charts.
- New `<Search>` prop named `showClearButton`, that will display a 'Clear' button when the search box contains one or more tags.
- Number of selectable chart elements is now limited to 5.
- Color scale logic for charts with lots of items has been fixed.
- Update `@woocommerce/navigation` to v2.0.0
- Bug fix for `<StockReportTable />` returning N/A instead of zero.
- In `<Search>` use backspace key to remove tags from the search box.

# 1.4.2
- Add emoji-flags dependency

# 1.4.1
- Chart component: format numbers and prices using store currency settings.
- Make `href`/linking optional in SummaryNumber.
- Fix SummaryNumber example code.

# 1.4.0
- Add download log ip address autocompleter to search component
- Add order number autocompleter to search component
- Add order number, username, and IP address filters to the downloads report.
- Added `interactive` prop for `d3chart/legend` to signal if legend items are clickable or not.
- Fix for undefined ref in `d3chart/legend`.
- Added three news props to `<Chart>`:
  - `interactiveLegend`: whether legend items are clickable or not. Defaults to true.
  - `legendPosition`: can be `top`, `side` or `bottom`. If not specified, it's calculated based on `mode` and viewport width.
  - `showHeaderControls`: whether the header controls must be visible. Defaults to true.
- `getColor()` method in chart utils now requires `keys` and `colorScheme` to be passed as separate params.
- Fix to avoid duplicated Y-axis ticks when the Y max value was 0.
- Remove decimals from Y-axis when displaying currencies.
- Fix date formatting on charts in Safari.

# 1.3.0

- Update `<Table />` to use header keys to denote which columns are shown
- Add `onColumnsChange` property to `<Table />` which is called when columns are shown/hidden
- Add country autocompleter to search component
- Add customer email autocompleter to search component
- Add customer username autocompleter to search component
- Adding new `<Chart />` component.
- Added new `showDatePicker` prop to `<Filters />` component which allows to use the filters component without the date picker.
- Added new taxes and customers autocompleters, and added support for using them within `<Filters />`.
- Bug fix for `<SummaryNumber />` returning N/A instead of zero.
- Bug fix for screen reader label IDs in `<Table />` header.
- Added new component `<TextControlWithAffixes />`.

# 1.2.0

- Update `Search` to exclude already-selected items
- Fix incorrectly loaded `proptype-validator`
- Update focus style on `SummaryNumber`
- Remove prefixes from order statuses

# 1.1.0

- Add `interpolate-components` as an explicit dependency, fixes issue with
- Update `<Popover />` usage to match core component updates
- Chart component: Add `chartMode` prop to control display mode
- Add Taxes autocompleter to Search
- Improve test coverage with new tests
