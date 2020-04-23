import React, { Fragment } from 'react';
import { Subscribe } from 'statable';
import classNames from 'classnames';

import openState from '../state/open';
import closeCart from '../utils/close-cart';
import stepState from '../state/step';
import settingsState from '../state/settings';
import CartStep from './steps/cart';
import InfoStep from './steps/info';
import ShippingMethodsStep from './steps/shipping-methods';
import PaymentStep from './steps/payment';
import SuccessStep from './steps/success';
import Processing from './processing';
import Errors from './errors';
import Info from './info';
import capitalize from '../utils/capitalize';
import Login from './auth0';

export default class Cart extends React.Component {
  render() {
    return (
      <Subscribe to={[openState, stepState, settingsState]}>
        {(
          { open, init },
          { step, processing, skip },
          { header, shipping, footer }
        ) => (
          <Fragment>
            {init && (
              <div
                data-testid="cart"
                className={classNames(
                  `zygote`,
                  `zygoteOn${
                    processing ? `Processing` : `${capitalize(step)}Step`
                  }`,
                  open && `zygoteOpen`
                )}
              >
                <div className="zygoteBg" onClick={closeCart} />
                <div id="zygoteCartLoginPanel" />
                <div id="zygoteCart" className="zygoteCart">
                  <Login />
                  <button
                    role="button"
                    className="zygoteCloseButton"
                    onClick={closeCart}
                    ref={el => (this.closeBtn = el)}
                    onMouseUp={() => this.closeBtn.blur()}
                    data-testid="zygoteCloseButton"
                  >
                    ×
                  </button>

                  {header && <div className="zygoteHeader">{header}</div>}

                  <Errors />
                  <Info />

                  <div className="zygoteStep zygoteCartStep">
                    <CartStep />
                  </div>
                  <div
                    className="zygoteStep zygoteInfoStep"
                    data-testid="info-step"
                  >
                    <InfoStep />
                  </div>
                  {!skip.shipping && shipping && (
                    <div
                      className="zygoteStep zygoteShippingStep"
                      data-testid="shipping-step"
                    >
                      <ShippingMethodsStep />
                    </div>
                  )}
                  <div
                    className="zygoteStep zygotePaymentStep"
                    data-testid="payment-step"
                  >
                    <PaymentStep />
                  </div>
                  <div
                    className="zygoteStep zygoteSuccessStep"
                    data-testid="success-step"
                  >
                    <SuccessStep />
                  </div>
                  {!!processing && <Processing>{processing}</Processing>}
                  {footer && <div className="zygoteFooter">{footer}</div>}
                </div>
              </div>
            )}
          </Fragment>
        )}
      </Subscribe>
    );
  }
  static styles = ({
    fontColor,
    fontFamily,
    overlayColor,
    backgroundColor,
  }) => ({
    '[role="button"]': {
      cursor: `pointer`,
      userSelect: `none`,
    },
    '&, *, *:before, *:after': {
      boxSizing: `border-box`,
    },
    '.zygote': {
      color: fontColor,
      fontFamily,
      textRendering: `optimizeLegibility`,
      '-webkit-font-smoothing': `antialiased`,
      fontSize: 16,
    },
    '.zygoteBg': {
      position: `fixed`,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      background: overlayColor,
      visibility: `hidden`,
      opacity: 0,
      transition: `opacity .3s, visibility .3s`,
    },
    '.zygoteCart': {
      position: `fixed`,
      top: 0,
      bottom: 0,
      right: 0,
      width: 500,
      overflowY: `auto`,
      maxWidth: `100%`,
      backgroundColor,
      transform: `translateX(110%)`,
      transition: `transform .3s`,
      boxShadow: `-3px 0 4px rgba(0, 0, 0, 0.2)`,
      padding: 20,
      paddingTop: 30,
      zIndex: 2,
    },
    '.zygoteCloseButton': {
      background: `transparent`,
      border: 0,
      outline: `none`,
      position: `absolute`,
      top: 25,
      right: 25,
      fontSize: `3em`,
      lineHeight: `0`,
      cursor: `pointer`,
      height: `30px`,
      margin: 0,
      padding: 0,
      fontWeight: 200,
      ':hover, :focus': {
        opacity: 0.6,
      },
    },
    '.zygoteHeader': {
      textAlign: `center`,
      marginBottom: 20,
      '.logo': {
        maxWidth: `150px`,
        margin: `0 30px`,
      },
    },
    '.zygoteStep': {
      display: `none`,
    },
    '.zygoteOnCartStep': {
      '.zygoteCartStep': {
        display: `block`,
      },
    },
    '.zygoteOnInfoStep': {
      '.zygoteInfoStep': {
        display: `block`,
      },
    },
    '.zygoteOnShippingStep': {
      '.zygoteShippingStep': {
        display: `block`,
      },
    },
    '.zygoteOnPaymentStep': {
      '.zygotePaymentStep': {
        display: `block`,
      },
    },
    '.zygoteOnSuccessStep': {
      '.zygoteSuccessStep': {
        display: `block`,
      },
    },
    '.zygoteOpen': {
      '.zygoteBg': {
        visibility: `visible`,
        opacity: 1,
      },
      '.zygoteCart': {
        transform: `translateX(0%)`,
      },
    },
  });
}
