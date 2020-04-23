import React from 'react';
import { Number } from 'react-credit-card-primitives';
import Card from 'creditcards/card';
import types from 'creditcards-types';
import Input from './input';
import AmericanExpress from '../card-list/american-express';
import Discover from '../card-list/discover';
import Mastercard from '../card-list/mastercard';
import Visa from '../card-list/visa';

const { isValid } = Card(types);
const cardImgs = {
  'American Express': <AmericanExpress />,
  Mastercard: <Mastercard />,
  Visa: <Visa />,
  Discover: <Discover />,
};

export default class CreditCard extends React.Component {
  static defaultProps = {
    autoComplete: `cc-number`,
    label: `Card Number`,
    required: true,
    name: `billingCardNumber`,
  };
  constructor(props) {
    super(props);
    this.state = {
      type: ``,
    };
  }
  validate(val) {
    val = val.replace(/\D/g, ``);
    if (!isValid(val)) {
      return `Please supply a valid credit card number`;
    }
  }
  render() {
    const { autoComplete, required, label, name, step } = this.props;
    return (
      <div className="zygoteCardInput">
        <Number
          onChange={({ type }) => this.setState({ type })}
          render={({ getInputProps }) => {
            const props = getInputProps();
            delete props.placeholder;
            return (
              <Input
                type="number"
                autoComplete={autoComplete}
                label={label}
                required={required}
                validators={[this.validate]}
                step={step}
                {...props}
                name={name}
              />
            );
          }}
        />
        <div className="zygoteCardInputType">{cardImgs[this.state.type]}</div>
      </div>
    );
  }
  static styles = () => ({
    '.zygoteCardInput': {
      position: `relative`,
    },
    '.zygoteCardInputType': {
      position: `absolute`,
      top: 3,
      right: 2,
      width: 49,
      height: 35,
    },
  });
}
