import React from 'react';
import isEmail from 'is-email';
import Input from './input';

export default class EmailInput extends React.Component {
  static defaultProps = {
    label: `Email`,
    required: true,
    autoComplete: `email`,
    name: `email`,
  };
  validate(val) {
    if (!isEmail(val)) {
      return `Please supply a valid email address`;
    }
  }
  render() {
    const { label, required, autoComplete, name, step, value } = this.props;
    return (
      <Input
        type="email"
        autoComplete={autoComplete}
        label={label}
        required={required}
        validators={[this.validate]}
        name={name}
        step={step}
        value={value}
      />
    );
  }
}
