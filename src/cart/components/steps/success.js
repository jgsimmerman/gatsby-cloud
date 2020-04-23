import React, { Fragment } from 'react';
import { Subscribe } from 'statable';

import { FaPrint } from 'react-icons/fa';
import ProductList from '../product-list';
import Totals from '../totals';
import successState from '../../state/success';
import settingsState from '../../state/settings';
import Button from '../button';
import closeCart from '../../utils/close-cart';

export default class SuccessStep extends React.Component {
  render() {
    return (
      <Subscribe to={[successState, settingsState]}>
        {({ products, totals, meta }, { successHeader, successFooter }) => (
          <Fragment>
            {!!successHeader && <div>{successHeader}</div>}
            {!successHeader && (
              <h1 className="zygoteSuccessHeader">Order Received!</h1>
            )}
            <h2 className="zygoteSectionHeader">Detailed Order Receipt</h2>
            <div className="zygoteSuccessMeta">
              {meta.orderNumber && <div>Order Number: {meta.orderNumber}</div>}
              {meta.orderDate && <div>Order Date: {meta.orderDate}</div>}
            </div>
            <ProductList products={products} editable={false} />
            <Totals totals={totals} />
            <div className="zygoteSuccessBtn">
              <Button secondary={true} onClick={() => window.print()}>
                Print Receipt&nbsp;&nbsp;&nbsp;
                <FaPrint />
              </Button>
              <Button onClick={closeCart}>Close Cart</Button>
            </div>
            {!!successFooter && <div>{successFooter}</div>}
          </Fragment>
        )}
      </Subscribe>
    );
  }
  static styles = () => ({
    '.zygoteSuccessHeader': {
      textAlign: `center`,
    },
    '.zygoteSuccessMeta': {
      marginBottom: 20,
      fontSize: `.9em`,
    },
    '.zygoteSuccessBtn': {
      marginTop: 30,
    },
  });
}
