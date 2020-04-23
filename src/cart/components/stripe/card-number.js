import React from 'react';
import { CardNumberElement } from 'react-stripe-elements';
import Input from './input';

export default class StripeCardNumber extends React.Component {
  static defaultProps = {
    name: `cardNumber`,
  };
  render() {
    return (
      <Input label="Card Number" name={this.props.name}>
        {({ handleChange, handleFocus, handleBlur }) => (
          <CardNumberElement
            placeholder=""
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            classes={{ base: `zygoteStripeInput` }}
          />
        )}
      </Input>
    );
  }
}
