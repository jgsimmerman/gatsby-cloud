import React, { Fragment } from 'react';
import { Subscribe } from 'statable';

import shippingState from '../../state/shipping';
import LoadingAnimation from '../loading-animation';
import setShipping from '../../utils/set-shipping';
import ShippingMethodsList from './list';

export default class ShippingMethods extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    setShipping(e.target.value);
  }
  render() {
    return (
      <Subscribe to={shippingState}>
        {({ loading, selected, methods }) => (
          <Fragment>
            {loading && <LoadingAnimation />}
            {!loading && !!methods.length && (
              <div className="zygoteShipMethods">
                <h2 className="zygoteSectionHeader">Shipping Options</h2>
                {methods.length > 1 && methods[0].shippingMethods && (
                  <h3>{`This order will arrive in ${methods.length} separate shipments`}</h3>
                )}
                {methods[0].shippingMethods &&
                  methods.map(({ id, description, shippingMethods }) => (
                    <div key={`shippingMethodSet${id}`}>
                      {methods.length > 1 && methods[0].shippingMethods && (
                        <div className="zygoteShipMethodsSetDesc">
                          <span>Items from this order:</span> {description}
                        </div>
                      )}
                      <ShippingMethodsList
                        setId={id}
                        methods={shippingMethods}
                        selected={selected[id] ? selected[id] : selected}
                      />
                    </div>
                  ))}
                {!methods[0].shippingMethods && (
                  <ShippingMethodsList methods={methods} selected={selected} />
                )}
              </div>
            )}
          </Fragment>
        )}
      </Subscribe>
    );
  }
  static styles = () => ({
    '.zygoteShipMethods': {
      borderRight: 0,
      borderLeft: 0,
      h2: {
        marginTop: 0,
      },
    },
    '.zygoteShipMethodsSetDesc': {
      fontWeight: `bold`,
      margin: `30px 0 15px 0`,
      span: {
        fontWeight: `normal`,
      },
    },
  });
}
