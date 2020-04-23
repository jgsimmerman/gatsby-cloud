import React from 'react';
import classNames from 'classnames';

export default class Radio extends React.Component {
  render() {
    const { name, value, checked, onChange } = this.props;
    return (
      <div
        className={classNames(`zygoteRadio`, checked && `zygoteRadioChecked`)}
      >
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
        />
        {checked && <div className="zygoteRadioIcon">✓</div>}
      </div>
    );
  }
  static styles = () => ({
    '.zygoteRadio': {
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
    '.zygoteRadioChecked': {
      background: `#666`,
    },
    '.zygoteRadioIcon': {
      color: `#fff`,
      position: `absolute`,
      left: `50%`,
      top: `50%`,
      transform: `translate(-50%, -50%)`,
    },
  });
}
