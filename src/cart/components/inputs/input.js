import React from 'react';
import classNames from 'classnames';
import InputMask from './input-mask';

import registerInput from '../../utils/register-input';
import unregisterInput from '../../utils/unregister-input';

export default class Input extends React.Component {
  static defaultProps = {
    inputRef: () => {},
  };
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || ``,
      focus: false,
      userEditing: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.validate = this.validate.bind(this);
  }
  handleChange(e) {
    let userEditing = true;
    if (this.props.onChange) {
      this.props.onChange(e);
      userEditing = false; // The provided field edited the value so the rules are different
    }
    if (this.input.type === `checkbox`) {
      if (this.input.checked) {
        this.setState({ value: this.input.value, userEditing });
      } else {
        this.setState({ value: ``, userEditing });
      }
    } else {
      this.setState({ value: this.input.value, userEditing });
    }
  }
  handleFocus(e) {
    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
    this.setState({ focus: true });
  }
  handleBlur(e) {
    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
    this.validate();
  }
  validate(focus = false) {
    const { value } = this.input;

    // Required message
    if (this.props.required && !value) {
      this.setState({ error: `This field is required`, focus });
      return false;
    }

    // Run validation functions
    const { validators } = this.props;
    if (validators) {
      for (let i = 0; i < validators.length; i++) {
        const error = validators[i](value);
        if (error) {
          this.setState({ error, focus });
          return false;
        }
      }
    }

    this.setState({ error: false, focus: false });
    return true;
  }
  componentDidMount() {
    registerInput(this);
  }
  componentWillUnmount() {
    unregisterInput(this);
  }
  render() {
    const { value, focus, error, userEditing } = this.state;
    const {
      label,
      mask,
      unmask,
      type,
      autoComplete,
      name,
      inputRef,
      checked,
      value: defaultVal,
    } = this.props;

    return (
      <label
        className={classNames(
          `zygoteInputWrapper`,
          focus && `zygoteInputFocus`,
          error && `zygoteInputErr`
        )}
        ref={el => (this.wrapper = el)}
      >
        <span
          className={classNames(
            `zygoteInputLabel`,
            (defaultVal || value || focus) && `zygoteInputLabelMoved`
          )}
        >
          {label}
        </span>
        {mask && (
          <InputMask
            mask={mask}
            unmask={unmask || true}
            onAccept={value => {
              let userEditing = true;
              this.setState({ value: value, userEditing });
            }}
            onFocus={this.handleFocus}
            onBlur={this.validate}
            value={userEditing ? value : defaultVal || value}
            type={type || `text`}
            autoComplete={autoComplete}
            inputRef={el => {
              this.input = el;
            }}
            className="zygoteInput"
            name={name}
          />
        )}
        {!mask && (
          <input
            type={type || `text`}
            autoComplete={autoComplete}
            ref={input => {
              this.input = input;
              inputRef(input);
            }}
            value={userEditing ? value : defaultVal || value}
            name={name}
            className="zygoteInput"
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.validate}
            checked={checked}
          />
        )}
        {error && (
          <span className="zygoteInputErrMsg" data-error>
            {error}
          </span>
        )}
      </label>
    );
  }
  static styles = ({ altBackgroundColor, altBorderColor }) => ({
    '.zygoteInputWrapper': {
      position: `relative`,
      display: `block`,
      marginTop: 30,
      fontSize: `.9em`,
      background: altBackgroundColor,
      border: `1px solid ${altBorderColor}`,
      borderRadius: 4,
    },
    '.zygoteInputFocus': {
      border: `1px solid #666`,
    },
    '.zygoteInputErr': {
      color: `#f00`,
      border: `1px solid #f00`,
    },
    '.zygoteInputLabel': {
      position: `absolute`,
      top: -18,
      left: 0,
      fontSize: `.85em`,
      display: `block`,
      opacity: 0.75,
      transition: `transform .2s`,
      transform: `translate(7px, 30px)`,
    },
    '.zygoteInputLabelMoved': {
      transform: `translate(0px, 0px)`,
    },
    '.zygoteInput': {
      width: `100%`,
      display: `block`,
      background: `transparent`,
      border: 0,
      borderRadius: 4,
      fontSize: `16px`,
      padding: `0 10px`,
      height: 36,
      outline: `none`,
    },
    '.zygoteInputErrMsg': {
      position: `absolute`,
      display: `inline-block`,
      fontSize: `.75em`,
      right: 0,
      top: 42,
      ':before': {
        content: `''`,
        width: `100%`,
        position: `absolute`,
        height: `100%`,
        borderRadius: `10px`,
        animation: `zygote-pulse 1.3s`,
        backgroundColor: `rgba(204, 44, 44, 0)`,
      },
    },
    '@keyframes zygote-pulse': {
      '0%': {
        boxShadow: `0 0 0 0 rgba(255, 4, 0, 0.4)`,
        backgroundColor: `rgba(255, 4, 0, 0.4)`,
      },
      '70%': {
        boxShadow: `0 0 0 10px rgba(204, 44, 44, 0)`,
        backgroundColor: `rgba(204, 44, 44, 0)`,
      },
      '100%': {
        boxShadow: `0 0 0 0 rgba(204, 44, 44, 0)`,
        backgroundColor: `rgba(204, 44, 44, 0)`,
      },
    },
  });
}
