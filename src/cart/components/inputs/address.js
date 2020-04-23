import React from 'react';
import Input from './input';

export default class NameInput extends React.Component {
  static defaultProps = {
    label: `Address`,
    autoComplete: `address-line1`,
    required: true,
    name: `addressLine1`,
  };
  render() {
    const { label, autoComplete, required, name, step, value } = this.props;
    return (
      <Input
        label={label}
        autoComplete={autoComplete}
        required={required}
        name={name}
        step={step}
        value={value}
      />
    );
  }
}
