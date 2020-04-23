import React from 'react';
import { Cvc } from 'react-credit-card-primitives';
import cvc from 'creditcards/cvc';
import types from 'creditcards-types';
import Input from './input';

const { isValid } = cvc(types);

export default class CardCVC extends React.Component {
  static defaultProps = {
    autoComplete: `cc-csc`,
    label: `CVC`,
    required: true,
    name: `billingCardCVC`,
  };
  constructor(props) {
    super(props);
    this.state = {
      type: ``,
    };
  }
  validate(val) {
    if (!isValid(val)) {
      return `Please supply a valid security code`;
    }
  }
  render() {
    const { autoComplete, required, label, name, step } = this.props;
    return (
      <div className="zygoteCardInput">
        <Cvc
          onChange={({ type }) => this.setState({ type })}
          render={({ getInputProps }) => {
            const props = getInputProps();
            delete props.placeholder;
            return (
              <Input
                type="text"
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
      </div>
    );
  }
}
