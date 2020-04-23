import React from 'react';
import Input from './input';

export default class CityInput extends React.Component {
  static defaultProps = {
    label: `City`,
    autoComplete: `address-level2`,
    required: true,
    name: `city`,
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
