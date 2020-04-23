import React from 'react';
import { Expiration } from 'react-credit-card-primitives';
import { isPast, year, month } from 'creditcards/expiration';
import Input from './input';

export default class CardExpiration extends React.Component {
  static defaultProps = {
    autoComplete: `cc-exp`,
    label: `Expiration`,
    required: true,
    name: `billingCardExpiration`,
  };
  constructor(props) {
    super(props);
    this.state = {
      type: ``,
    };
  }
  validate(val) {
    val = val.replace(/ /g, ``).split(`/`);
    const mo = month.parse(val[0]);
    const yr = year.parse(val[1]);
    if (
      yr > 99 ||
      !month.isValid(mo) ||
      !year.isValid(yr) ||
      isPast(mo, year.parse(yr, true))
    ) {
      return `Please supply a valid expiration date`;
    }
  }
  render() {
    const { autoComplete, required, label, name, step } = this.props;
    return (
      <div className="zygoteCardInput">
        <Expiration
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
