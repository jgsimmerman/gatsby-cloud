import React from 'react';
import { CardExpiryElement } from 'react-stripe-elements';
import Input from './input';

export default class StripeExpiration extends React.Component {
  static defaultProps = {
    name: `expiration`,
  };
  render() {
    return (
      <Input label="Expiration" name={this.props.name}>
        {({ handleChange, handleFocus, handleBlur }) => (
          <CardExpiryElement
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
