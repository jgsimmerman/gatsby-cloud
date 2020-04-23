import React, { Fragment } from 'react';
import { Subscribe } from 'statable';
import productsState from '../state/products';
import Item from './product-list-item';

class ProductsUl extends React.Component {
  render() {
    const { products, editable } = this.props;
    return (
      <Fragment>
        {!!products.length && (
          <ul className="zygoteProdList">
            {products.map((product, key) => (
              <Item editable={editable} key={`cartProd${key}`} {...product} />
            ))}
          </ul>
        )}
      </Fragment>
    );
  }
}

export default class ProductList extends React.Component {
  render() {
    const { products, editable } = this.props;
    return (
      <Fragment>
        {products && <ProductsUl products={products} editable={editable} />}
        {!products && (
          <Subscribe to={productsState}>
            {({ products }) => (
              <ProductsUl products={products} editable={editable} />
            )}
          </Subscribe>
        )}
      </Fragment>
    );
  }
  static styles = ({ borderColor }) => ({
    '.zygoteProdList': {
      listStyleType: `none`,
      margin: 0,
      padding: 0,
      paddingTop: 20,
      borderTop: `1px solid ${borderColor}`,
      '> li': {
        margin: `10px 0`,
        ':first-of-type': {
          marginTop: 0,
        },
        ':last-of-type': {
          marginBottom: 0,
        },
      },
      ':after': {
        content: `""`,
        display: `block`,
        clear: `both`,
      },
    },
  });
}
