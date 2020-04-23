import React from 'react';
import classNames from 'classnames';
import registerInput from '../../utils/register-input';
import unregisterInput from '../../utils/unregister-input';

export default class Select extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || ``,
      focus: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.validate = this.validate.bind(this);
  }
  handleChange(e) {
    if (this.props.handleChange) {
      this.props.handleChange(e);
    }
    this.setState({ value: e.target.value });
  }
  handleFocus() {
    this.setState({ focus: true });
  }
  validate() {
    this.setState({ focus: false });
    const { value } = this.select;

    // Required message
    if (this.props.required && !value) {
      return this.setState({ error: `This field is required` });
    }

    // Run validation functions
    const { validators } = this.props;
    if (validators) {
      for (let i = 0; i < validators.length; i++) {
        const error = validators[i](value);
        if (error) {
          return this.setState({ error });
        }
      }
    }

    this.setState({ error: false });
  }
  componentDidMount() {
    registerInput(this);
  }
  componentWillUnmount() {
    unregisterInput(this);
  }
  render() {
    const { value, focus, error } = this.state;
    const {
      label,
      type,
      autoComplete,
      children,
      inputRef,
      name,
      value: defaultValue,
    } = this.props;
    return (
      <label
        className={classNames(
          `zygoteSelectWrapper`,
          error && `zygoteSelectErr`,
          focus && `zygoteSelectFocus`
        )}
      >
        <span
          className={classNames(
            `zygoteSelectLabel`,
            (defaultValue || value || focus) && `zygoteSelectLabelMoved`
          )}
        >
          {label}
        </span>
        <select
          type={type || `text`}
          autoComplete={autoComplete}
          ref={el => {
            this.select = el;
            if (inputRef) inputRef(el);
          }}
          value={defaultValue || value}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.validate}
          className="zygoteSelect"
          name={name}
        >
          <option disabled value="" />
          {children}
        </select>
        {error && (
          <span className="zygoteSelectErrMsg" data-error>
            {error}
          </span>
        )}
      </label>
    );
  }
  static styles = ({ altBackgroundColor, altBorderColor }) => ({
    '.zygoteSelectWrapper': {
      position: `relative`,
      display: `block`,
      marginTop: 30,
      fontSize: `.9em`,
      background: altBackgroundColor,
      border: `1px solid ${altBorderColor}`,
      borderRadius: 4,
    },
    '.zygoteSelect': {
      background: `transparent`,
      height: 36,
      position: `relative`,
      zIndex: 2,
      display: `block`,
      width: `100%`,
      fontSize: `16px`,
      border: 0,
      outline: `none`,
    },
    '.zygoteSelectFocus': {
      border: `1px solid #666`,
    },
    '.zygoteSelectErr': {
      color: `#f00`,
      border: `1px solid #f00`,
    },
    '.zygoteSelectErrMsg': {
      position: `absolute`,
      display: `inline-block`,
      fontSize: `.75em`,
      right: 0,
      bottom: -18,
      ':before': {
        content: `''`,
        width: `100%`,
        position: `absolute`,
        height: `100%`,
        borderRadius: `10px`,
        animation: `zygote-pulse 1.3s`,
      },
    },
    '.zygoteSelectLabel': {
      position: `absolute`,
      top: -20,
      left: 0,
      fontSize: `.8em`,
      display: `block`,
      opacity: 0.75,
      transition: `transform .2s`,
      transform: `translate(7px, 32px)`,
      marginBottom: 5,
    },
    '.zygoteSelectLabelMoved': {
      transform: `translate(0px, 0px)`,
    },
  });
}
