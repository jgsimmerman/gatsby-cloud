import React from 'react';
import classNames from 'classnames';

import Input from './input';

export default class Checkbox extends React.Component {
  render() {
    const {
      name,
      value,
      checked,
      onChange,
      label,
      autoComplete,
      step,
    } = this.props;
    return (
      <div
        className={classNames(
          `zygoteCheckbox`,
          checked && `zygoteCheckboxChecked`
        )}
      >
        <Input
          type="checkbox"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          label={label}
          autoComplete={autoComplete}
          step={step}
        />
        {checked && <div className="zygoteCheckboxIcon">✓</div>}
      </div>
    );
  }
  static styles = () => ({
    '.zygoteCheckbox': {
      width: 20,
      height: 20,
      border: `1px solid #666`,
      position: `relative`,
      display: `inline-block`,
      userSelect: `none`,
      input: {
        display: `none`,
      },
    },
    '.zygoteCheckboxChecked': {
      background: `#666`,
    },
    '.zygoteCheckboxIcon': {
      color: `#fff`,
      position: `absolute`,
      left: `50%`,
      top: `50%`,
      transform: `translate(-50%, -50%)`,
    },
  });
}
