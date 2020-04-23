import React, { Fragment } from 'react';
import { Subscribe } from 'statable';

import stepState from '../../state/step';
import NameInput from '../inputs/name';
import EmailInput from '../inputs/email';
import PhoneInput from '../inputs/phone';
import AddressInput from '../inputs/address';
import Address2Input from '../inputs/address-2';
import CompanyName from '../inputs/company-name';
import City from '../inputs/city';
import State from '../inputs/state';
import Zip from '../inputs/zip';
import StepsHeader from '../steps-header';
import Header from '../header';
import Button from '../button';
import attemptSubmitInfo from '../../utils/attempt-submit-info';
import previousStep from '../../utils/previous-step';
import productsState from '../../state/products';
import settingsState from '../../state/settings';
import SimpleSummary from '../simple-summary';
import Coupon from '../inputs/coupon';

export default class InfoStep extends React.Component {
  render() {
    return (
      <Subscribe to={[stepState, settingsState]}>
        {(
          { step, vals },
          { infoHeader, infoFooter, splitName, coupons, testing, plugins }
        ) => (
          <Fragment>
            {(step === `info` || step === `shipping` || step === `payment`) && (
              <form data-form="info" onSubmit={attemptSubmitInfo}>
                {!!infoHeader && <div>{infoHeader}</div>}
                <StepsHeader step="info" />
                <SimpleSummary />
                <div className="zygoteInfoSection">
                  <Header>Let's get started</Header>
                  {splitName && (
                    <Fragment>
                      <NameInput
                        name="infoFirstName"
                        autoComplete="first name"
                        step="info"
                        label="First Name"
                        value={vals.infoFirstName ? vals.infoFirstName : ``}
                      />
                      <NameInput
                        name="infoLastName"
                        autoComplete="last name"
                        step="info"
                        label="Last Name"
                        value={vals.infoLastName ? vals.infoLastName : ``}
                      />
                    </Fragment>
                  )}
                  {!splitName && (
                    <NameInput
                      name="infoName"
                      autoComplete="shipping name"
                      step="info"
                      value={vals.infoName ? vals.infoName : ``}
                    />
                  )}
                  <EmailInput
                    name="infoEmail"
                    autoComplete="shipping email"
                    step="info"
                    value={vals.infoEmail ? vals.infoEmail : ``}
                  />

                  <PhoneInput
                    name="infoPhone"
                    autoComplete="shipping tel"
                    step="info"
                    value={vals.infoPhone ? vals.infoPhone : ``}
                    testing={testing}
                  />
                </div>
                {showShipping() && (
                  <div className="zygoteInfoSection">
                    <Header>Where should we deliver?</Header>
                    <AddressInput
                      name="shippingAddress1"
                      autoComplete="shipping address-line1"
                      step="info"
                      value={vals.shippingAddress1 ? vals.shippingAddress1 : ``}
                    />
                    <div className="zygoteInfoExtra">
                      <div>
                        <Address2Input
                          name="shippingAddress2"
                          autoComplete="shipping address-line2"
                          step="info"
                          value={
                            vals.shippingAddress2 ? vals.shippingAddress2 : ``
                          }
                        />
                      </div>
                      <div>
                        <CompanyName
                          name="shippingCompany"
                          autoComplete="shipping org"
                          step="info"
                          value={
                            vals.shippingCompany ? vals.shippingCompany : ``
                          }
                        />
                      </div>
                    </div>
                    <div className="zygoteInfoCityState">
                      <div>
                        <City
                          name="shippingCity"
                          autoComplete="shipping address-level2"
                          step="info"
                          value={vals.shippingCity ? vals.shippingCity : ``}
                        />
                      </div>
                      <div>
                        <State
                          name="shippingState"
                          autoComplete="shipping address-level1"
                          step="info"
                          showStates={settingsState.state.showStates}
                          value={vals.shippingState ? vals.shippingState : ``}
                        />
                      </div>
                    </div>
                    <Zip
                      name="shippingZip"
                      autoComplete="shipping postal-code"
                      step="info"
                      value={vals.shippingZip ? vals.shippingZip : ``}
                    />
                  </div>
                )}
                {coupons && (
                  <div className="zygoteInfoCoupon">
                    <Coupon />
                  </div>
                )}
                {plugins &&
                  plugins.map(({ Info }, key) => {
                    if (typeof Info === `function`) {
                      return <Info key={key} />;
                    }
                  })}
                <div className="zygoteInfoBtn">
                  <Button
                    type="submit"
                    /*onClick={}*/ dataTestid="info-next-step"
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
                {!!infoFooter && <div>{infoFooter}</div>}
              </form>
            )}
          </Fragment>
        )}
      </Subscribe>
    );
  }
  static styles = () => ({
    '.zygoteInfoSection': {
      marginTop: 40,
    },
    '.zygoteInfoExtra': {
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
    '.zygoteInfoCityState': {
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
    '.zygoteInfoCoupon': {
      margin: `15px 0`,
    },
    '.zygoteInfoBtn': {
      marginTop: 30,
    },
  });
}

function showShipping() {
  const { products } = productsState.state;
  for (let i = products.length; i--; ) {
    const product = products[i];
    if (!product.noShip) {
      return true;
    }
  }
  return false;
}
