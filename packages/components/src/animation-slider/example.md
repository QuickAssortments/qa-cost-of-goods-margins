```jsx
import { AnimationSlider } from '@woocommerce/components';

class MyAnimationSlider extends Component {
	constructor() {
		super();
		this.state = {
			pages: [ 44, 55, 66, 77, 88 ],
			page: 0,
			animate: null,
		};
		this.forward = this.forward.bind( this );
		this.back = this.forward.bind( this );
	}

	forward() {
		this.setState( state => ( {
			page: state.page + 1,
			animate: 'left',
		} ) );
	}

	back() {
		this.setState( state => ( {
			page: state.page - 1,
			animate: 'right',
		} ) );
	}

	render() {
		const { page, pages, animate } = this.state;
		const style = {
			margin: '16px 0',
			padding: '8px 16px',
			color: 'white',
			fontWeight: 'bold',
			backgroundColor: '#246EB9',
		};
		return (
			<div>
				<AnimationSlider animationKey={ page } animate={ animate }>
					{ status => (
						<div style={ style }>
							{ pages[ page ] }
						</div>
					) }
				</AnimationSlider>
				<button onClick={ this.back } disabled={ page === 0 }>
					Back
				</button>
				<button onClick={ this.forward } disabled={ page === pages.length + 1 }>
					Forward
				</button>
			</div>
		);
	}
}
```
