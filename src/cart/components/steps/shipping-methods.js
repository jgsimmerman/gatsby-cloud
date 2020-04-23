import React, { Fragment } from 'react';
import { Subscribe } from 'statable';

import {
  stepState,
  shippingState,
  settingsState,
  statusMessagesState,
} from '../../state';
import StepsHeader from '../steps-header';
import Button from '../button';
import ProductList from '../product-list';
import Totals from '../totals';
import ShippingMethods from '../shipping-methods';
import nextStep from '../../utils/next-step';
import previousStep from '../../utils/previous-step';
import Shipping from '../../plugins/Shipping';

export default class ShippingStep extends React.Component {
  render() {
    return (
      <Subscribe
        to={[stepState, shippingState, settingsState, statusMessagesState]}
      >
        {(
          { step },
          { loading },
          { paymentHeader, paymentFooter, plugins },
          { errors }
        ) => (
          <Fragment>
            {(step === `info` || step === `shipping` || step === `payment`) && (
              <form data-form="shipping">
                {!!paymentHeader && <div>{paymentHeader}</div>}
                <StepsHeader step="shipping" />
                <div className="zygoteShippingSection">
                  <ShippingMethods />
                </div>
                <div className="zygoteShippingSection">
                  <h2 className="zygoteSectionHeader">Order Summary</h2>
                  <ProductList editable={false} />
                  <Totals />
                </div>
                {plugins &&
                  plugins.map(({ Shipping }, key) => {
                    if (typeof Shipping === `function`) {
                      return <Shipping key={key} />;
                    }
                    <Shipping />;
                  })}
                <div className="zygoteShippingBtn">
                  <Button
                    onClick={
                      (errors && errors.length) || loading ? null : nextStep
                    }
                    disabled={
                      (errors && errors.length) || loading ? true : false
                    }
                  >
                    Next Step
                  </Button>
                </div>
                <div className="zygoteInfoLink">
                  <Button
                    className="zygoteBtn"
                    secondary={true}
                    onClick={previousStep}
                  >
                    Previous Step
                  </Button>
                </div>
                {!!paymentFooter && <div>{paymentFooter}</div>}
              </form>
            )}
          </Fragment>
        )}
      </Subscribe>
    );
  }
  static styles = () => ({
    '.zygoteShippingSection': {
      marginTop: 40,
    },
    '.zygoteShippingBtn': {
      marginTop: 30,
    },
  });
}
