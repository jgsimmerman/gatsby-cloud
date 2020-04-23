import React, { Fragment } from 'react';
import Input from './input';
import Toggle from './toggle';

export default class Address2Input extends React.Component {
  static defaultProps = {
    toggleText: `Apt/Suite #`,
    label: `Apt/Suite #`,
    autoComplete: `address-line2`,
    required: false,
    name: `addressLine2`,
  };
  constructor(props) {
    super(props);
    this.state = { open: false };
    this.open = this.open.bind(this);
  }
  open() {
    this.setState({ open: true });
    setTimeout(() => {
      this.input.focus();
    }, 1);
  }
  render() {
    const { open } = this.state;
    const {
      toggleText,
      label,
      autoComplete,
      required,
      name,
      step,
      value,
    } = this.props;
    return (
      <Fragment>
        <div style={{ display: open ? `none` : `block` }}>
          <Toggle onClick={this.open}>{toggleText}</Toggle>
        </div>
        <div style={{ display: open ? `block` : `none` }}>
          <Input
            inputRef={el => (this.input = el)}
            label={label}
            autoComplete={autoComplete}
            required={required}
            name={name}
            step={step}
            value={value}
          />
        </div>
      </Fragment>
    );
  }
}
