import React from 'react';
import classNames from 'classnames';
import Visa from '../card-list/visa';
import Mastercard from '../card-list/mastercard';
import AmericanExpress from '../card-list/american-express';
import Discover from '../card-list/discover';
import registerInput from '../../utils/register-input';
import unregisterInput from '../../utils/unregister-input';

export default class StripeInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focus: false,
      value: false,
    };
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.validate = this.validate.bind(this);
  }
  handleFocus() {
    this.setState({ focus: true });
  }
  handleBlur() {
    this.setState({ focus: false });
  }
  handleError(msg) {
    this.setState({ error: msg });
  }
  handleChange(e) {
    this.setState({
      value: !e.empty,
      error: e.error && e.error.message ? e.error.message : false,
      brand: e.brand,
    });
  }
  validate() {
    const { value, error } = this.state;
    if (!value) {
      this.setState({
        error: `This field is required`,
      });
      return false;
    }
    if (!error) return false;
    return true;
  }
  componentDidMount() {
    registerInput(this);
  }
  componentWillUnmount() {
    unregisterInput(this);
  }
  render() {
    const { focus, error, value, brand } = this.state;
    const { label } = this.props;
    return (
      <label
        className={classNames(
          `zygoteStripeInputWrapper`,
          focus && `zygoteStripeFocus`,
          error && `zygoteStripeErr`
        )}
      >
        <span
          className={`zygoteStripeLabel${
            value || focus ? ` zygoteStripeMoved` : ``
          }`}
        >
          {label}
        </span>
        <span className="zygoteStripeSpan">
          {this.props.children({
            handleFocus: this.handleFocus,
            handleBlur: this.handleBlur,
            handleError: this.handleError,
            handleChange: this.handleChange,
          })}
        </span>
        {!!brand && (
          <div className="zygoteStripeCard">
            {brand === `visa` && <Visa />}
            {brand === `mastercard` && <Mastercard />}
            {brand === `amex` && <AmericanExpress />}
            {brand === `discover` && <Discover />}
          </div>
        )}
        {error && (
          <span className="zygoteStripeErrMsg" data-error>
            {error}
          </span>
        )}
      </label>
    );
  }
  static styles = ({ altBackgroundColor, altBorderColor }) => ({
    '.zygoteStripeInputWrapper': {
      position: `relative`,
      display: `block`,
      marginTop: 30,
      fontSize: `.9em`,
      background: altBackgroundColor,
      border: `1px solid ${altBorderColor}`,
      borderRadius: 4,
    },
    '.zygoteStripeCard': {
      position: `absolute`,
      width: 35,
      right: 7,
      top: 7,
    },
    '.zygoteStripeSpan': {
      display: `block`,
    },
    '.zygoteStripeErr': {
      color: `#f00`,
      border: `1px solid #f00`,
    },
    '.zygoteStripeFocus': {
      border: `1px solid #666`,
    },
    '.zygoteStripeErrMsg': {
      position: `absolute`,
      display: `inline-block`,
      fontSize: `.75em`,
      right: 0,
      top: 42,
    },
    '.zygoteStripeLabel': {
      position: `absolute`,
      top: -18,
      left: 0,
      fontSize: `.85em`,
      display: `block`,
      opacity: 0.75,
      transition: `transform .2s`,
      transform: `translate(7px, 30px)`,
    },
    '.zygoteStripeMoved': {
      transform: `translate(0px, 0px)`,
    },
  });
}
