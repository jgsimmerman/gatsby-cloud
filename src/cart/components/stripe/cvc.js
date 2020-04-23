import React from 'react';
import { CardCVCElement } from 'react-stripe-elements';
import Input from './input';

export default class StripeCVC extends React.Component {
  static defaultProps = {
    name: `cvc`,
  };
  render() {
    return (
      <Input label="CVC" name={this.props.name}>
        {({ handleChange, handleFocus, handleBlur }) => (
          <CardCVCElement
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
