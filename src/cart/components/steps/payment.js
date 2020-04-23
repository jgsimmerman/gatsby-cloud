import React, { Fragment } from 'react';
import { Subscribe } from 'statable';

import {
  stepState,
  shippingState,
  settingsState,
  statusMessagesState,
} from '../../state';
import StepsHeader from '../steps-header';
import Header from '../header';
import CardList from '../card-list';
import StripePayment from '../stripe';
import Button from '../button';
import submitOrder from '../../utils/submit-order';
import ProductList from '../product-list';
import Totals from '../totals';
import Checkbox from '../inputs/checkbox';
import inputs from '../../utils/inputs';
import AddressInput from '../inputs/address';
import Address2Input from '../inputs/address-2';
import CompanyName from '../inputs/company-name';
import City from '../inputs/city';
import State from '../inputs/state';
import Zip from '../inputs/zip';
// import Paypal from '../paypal'
import previousStep from '../../utils/previous-step';
import StandardPayment from '../standard-payment';
export default class PaymentStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = { sameBilling: true };
    this.toggleBilling = this.toggleBilling.bind(this);
  }
  toggleBilling() {
    this.setState({ sameBilling: !this.state.sameBilling });
  }
  render() {
    let altPayment = false;
    return (
      <Subscribe
        to={[stepState, shippingState, settingsState, statusMessagesState]}
      >
        {(
          { step },
          { loading },
          {
            paymentHeader,
            paymentFooter,
            stripeApiKey,
            plugins,
            // paypalAppId,
          },
          { errors }
        ) => (
          <Fragment>
            {(step === `info` || step === `shipping` || step === `payment`) && (
              <form data-form="payment">
                {!!paymentHeader && <div>{paymentHeader}</div>}
                <StepsHeader step="payment" />
                <div className="zygotePaymentSection">
                  <div className="zygotePaymentHeader">
                    <div>
                      <Header>Payment</Header>
                    </div>
                    <div>
                      <CardList />
                    </div>
                  </div>

                  {/* {!!paypalAppId && (
										<Paypal id={paypalAppId} />
									)} */}

                  {/* {plugins && plugins.map(({ ExternalPayment }, key) => {
										if (typeof ExternalPayment === `function`) {
											return <ExternalPayment key={key} />
										}
									})}

									{plugins && plugins.map(({ Payment }, key) => {
										if (typeof Payment === `function`) {
											altPayment = true
											return <Payment key={key} />
										}
									})}

									{(plugins.findIndex(plugin => plugin.hasOwnProperty(`Payment`)) === -1 || !plugins)
											&& <StandardPayment />} */}

                  {!altPayment && !!stripeApiKey && <StripePayment />}

                  <label className="zygotePaymentSame">
                    <Checkbox
                      name="sameBilling"
                      checked={this.state.sameBilling}
                      onChange={this.toggleBilling}
                      value={true}
                    />
                    <div>Same Billing and Shipping Address</div>
                  </label>

                  {this.state.sameBilling && (
                    <div className="zygotePaymentAddress">
                      <div>{value(`infoName`)}</div>
                      <div>{value(`shippingAddress1`)}</div>
                      <div>{value(`shippingAddress2`)}</div>
                      <div>
                        {value(`shippingCity`)}, {value(`shippingState`)}{' '}
                        {value(`shippingZip`)}
                      </div>
                    </div>
                  )}
                  {!this.state.sameBilling && (
                    <div className="zygotePaymentSection">
                      <Header>What is your billing address?</Header>
                      <AddressInput
                        name="billingAddress1"
                        autoComplete="billing address-line1"
                      />
                      <div className="zygotePaymentExtra">
                        <div>
                          <Address2Input
                            name="billingAddress2"
                            autoComplete="billing address-line2"
                          />
                        </div>
                        <div>
                          <CompanyName
                            name="billingCompany"
                            autoComplete="billing org"
                          />
                        </div>
                      </div>
                      <div className="zygotePaymentCityState">
                        <div>
                          <City
                            name="billingCity"
                            autoComplete="billing address-level2"
                          />
                        </div>
                        <div>
                          <State
                            name="billingState"
                            autoComplete="billing address-level1"
                          />
                        </div>
                      </div>
                      <Zip
                        name="billingZip"
                        autoComplete="billing postal-code"
                      />
                    </div>
                  )}
                </div>
                <div className="zygotePaymentSection">
                  <h2 className="zygoteSectionHeader">Final Order Summary</h2>
                  <ProductList editable={false} />
                  <Totals />
                </div>
                <div className="zygotePaymentBtn">
                  <Button
                    onClick={() => {
                      console.log(`ZYGOTE PAYMENT STEP CLICKED`);
                      if ((errors && errors.length) || loading) {
                        return;
                      }
                      submitOrder();
                    }}
                    disabled={
                      (errors && errors.length) || loading ? true : false
                    }
                    dataTestid="submit-order-button"
                  >
                    Place Order
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
    '.zygotePaymentAddress': {
      fontWeight: `bold`,
      marginTop: 10,
      marginLeft: 30,
    },
    '.zygotePaymentSection': {
      marginTop: 40,
    },
    '.zygotePaymentHeader': {
      '@media(min-width: 500px)': {
        display: `flex`,
        '> div': {
          ':first-of-type': {
            width: `40%`,
          },
          ':last-of-type': {
            width: `60%`,
            textAlign: `right`,
            marginTop: 5,
          },
        },
      },
    },
    '.zygotePaymentSame': {
      cursor: `pointer`,
      display: `flex`,
      marginTop: 30,
      userSelect: `none`,
      '> *': {
        ':first-of-type': {
          marginRight: 10,
        },
      },
    },
    '.zygotePaymentExtra': {
      '@media(min-width: 450px)': {
        display: `flex`,
        '> div': {
          width: `50%`,
          padding: `0 10px`,
          ':first-of-type': {
            paddingLeft: 0,
          },
          ':last-of-type': {
            paddingRight: 0,
          },
        },
      },
    },
    '.zygotePaymentCityState': {
      '@media(min-width: 450px)': {
        display: `flex`,
        '> div': {
          padding: `0 10px`,
          ':first-of-type': {
            width: `60%`,
            paddingLeft: 0,
          },
          ':last-of-type': {
            width: `40%`,
            paddingRight: 0,
          },
        },
      },
    },
    '.zygotePaymentExpCVC': {
      '@media(min-width: 450px)': {
        display: `flex`,
        '> div': {
          padding: `0 10px`,
          width: `50%`,
          ':first-of-type': {
            paddingLeft: 0,
          },
          ':last-of-type': {
            paddingRight: 0,
          },
        },
      },
    },
    '.zygotePaymentBtn': {
      marginTop: 30,
    },
  });
}

function value(name) {
  if (inputs[name] && inputs[name].state && inputs[name].state.value) {
    return inputs[name].state.value;
  }
}
