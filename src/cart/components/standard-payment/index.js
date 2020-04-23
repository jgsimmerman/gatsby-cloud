import React, { Fragment } from 'react';

import NameInput from '../inputs/name';
import CreditCard from '../inputs/credit-card';
import Expiration from '../inputs/expiration';
import Cvc from '../inputs/cvc';

export default class Payment extends React.Component {
  render() {
    return (
      <Fragment>
        <Fragment>
          <NameInput
            name="billingFirstName"
            autoComplete="first name"
            step="billing"
            label="First Name"
          />
          <NameInput
            name="billingLastName"
            autoComplete="last name"
            step="billing"
            label="Last Name"
          />
        </Fragment>
        <CreditCard step="billing" />
        <div className="zygotePaymentExpCVC">
          <div>
            <Expiration step="billing" />
          </div>
          <div>
            <Cvc step="billing" />
          </div>
        </div>
      </Fragment>
    );
  }
}
