import React from 'react';
import { Subscribe } from 'statable';
import productsState from '../state/products';

export default class CartQuantity extends React.Component {
  render() {
    return (
      <Subscribe to={productsState}>
        {({ products }) =>
          this.props.children(
            products.reduce((total, { quantity }) => total + quantity, 0)
          )
        }
      </Subscribe>
    );
  }
}
