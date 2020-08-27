/** @format */
/**
 * External dependencies
 */
import { Component } from '@wordpress/element';
import PropTypes from 'prop-types';
import { BaseControl } from '@wordpress/components';
import { withInstanceId } from '@wordpress/compose';

/**
 * This component is essentially a wrapper (really a reimplementation) around the
 * TextControl component that adds support for affixes, i.e. the ability to display
 * a fixed part either at the beginning or at the end of the text input.
 */
class TextControlWithAffixes extends Component {
	render() {
		const {
			label,
			value,
			help,
			className,
			instanceId,
			onChange,
			prefix,
			suffix,
			type,
			...props
		} = this.props;

		const id = `inspector-text-control-with-affixes-${ instanceId }`;
		const onChangeValue = ( event ) => onChange( event.target.value );
		const describedby = [];
		if ( help ) {
			describedby.push( `${ id }__help` );
		}
		if ( prefix ) {
			describedby.push( `${ id }__prefix` );
		}
		if ( suffix ) {
			describedby.push( `${ id }__suffix` );
		}

		return (
			<BaseControl label={ label } id={ id } help={ help } className={ className }>
				<div className="text-control-with-affixes">
					{ prefix && (
						<span
							id={ `${ id }__prefix` }
							className="text-control-with-affixes__prefix"
						>
							{ prefix }
						</span>
					) }

					<input
						className="components-text-control__input"
						type={ type }
						id={ id }
						value={ value }
						onChange={ onChangeValue }
						aria-describedby={ describedby.join( ' ' ) }
						{ ...props }
					/>

					{ suffix && (
						<span
							id={ `${ id }__suffix` }
							className="text-control-with-affixes__suffix"
						>
							{ suffix }
						</span>
					) }
				</div>
			</BaseControl>
		);
	}
}

TextControlWithAffixes.defaultProps = {
	type: 'text',
};

TextControlWithAffixes.propTypes = {
	/**
	 * If this property is added, a label will be generated using label property as the content.
	 */
	label: PropTypes.string,
	/**
	 * If this property is added, a help text will be generated using help property as the content.
	 */
	help: PropTypes.string,
	/**
	 * Type of the input element to render. Defaults to "text".
	 */
	type: PropTypes.string,
	/**
	 * The current value of the input.
	 */
	value: PropTypes.string.isRequired,
	/**
	 * The class that will be added with "components-base-control" to the classes of the wrapper div.
	 * If no className is passed only components-base-control is used.
	 */
	className: PropTypes.string,
	/**
	 * A function that receives the value of the input.
	 */
	onChange: PropTypes.func.isRequired,
	/**
	 * Markup to be inserted at the beginning of the input.
	 */
	prefix: PropTypes.node,
	/**
	 * Markup to be appended at the end of the input.
	 */
	suffix: PropTypes.node,
};

export default withInstanceId( TextControlWithAffixes );
