import { css } from 'emotion';
import { default as cart } from '../components/cart';
import { default as addedToCartMsg } from '../components/added-to-cart-message';
import { default as button } from '../components/button';
import { default as errors } from '../components/errors';
import { default as header } from '../components/header';
import { default as info } from '../components/info';
import { default as loading } from '../components/loading-animation';
import { default as processing } from '../components/processing';
import { default as prodItem } from '../components/product-list-item';
import { default as prodList } from '../components/product-list';
import { default as shippingMethods } from '../components/shipping-methods';
import { default as shippingMethodsList } from '../components/shipping-methods/list';
import { default as smallButton } from '../components/small-button';
import { default as stepsHeader } from '../components/steps-header';
import { default as totals } from '../components/totals';
import { default as cardList } from '../components/card-list';
import { default as securityIcon } from '../components/card-list/security';
import { default as checkbox } from '../components/inputs/checkbox';
import { default as radio } from '../components/inputs/radio';
import { default as coupon } from '../components/inputs/coupon';
import { default as input } from '../components/inputs/input';
import { default as select } from '../components/inputs/select';
import { default as toggle } from '../components/inputs/toggle';
import { default as cardInput } from '../components/inputs/credit-card';
import { default as cartStep } from '../components/steps/cart';
import { default as infoStep } from '../components/steps/info';
import { default as shippingStep } from '../components/steps/shipping-methods';
import { default as paymentStep } from '../components/steps/payment';
import { default as successStep } from '../components/steps/success';
import { default as simpleSummary } from '../components/simple-summary';
import { default as stripe } from '../components/stripe';
import { default as stripeInput } from '../components/stripe/input';
import { default as stripePaymentRequest } from '../components/stripe/payment-request';
import { default as applePay } from '../components/apple-pay-button';
import printStyles from './print';

export default function styles(opts) {
  return css({
    ...addedToCartMsg.styles(opts),
    ...button.styles(opts),
    ...cart.styles(opts),
    ...errors.styles(opts),
    ...header.styles(opts),
    ...info.styles(opts),
    ...loading.styles(opts),
    ...processing.styles(opts),
    ...prodItem.styles(opts),
    ...prodList.styles(opts),
    ...shippingMethods.styles(opts),
    ...shippingMethodsList.styles(opts),
    ...smallButton.styles(opts),
    ...stepsHeader.styles(opts),
    ...totals.styles(opts),
    ...cardList.styles(opts),
    ...securityIcon.styles(opts),
    ...checkbox.styles(opts),
    ...radio.styles(opts),
    ...coupon.styles(opts),
    ...input.styles(opts),
    ...select.styles(opts),
    ...toggle.styles(opts),
    ...cartStep.styles(opts),
    ...infoStep.styles(opts),
    ...shippingStep.styles(opts),
    ...paymentStep.styles(opts),
    ...successStep.styles(opts),
    ...stripe.styles(opts),
    ...stripeInput.styles(opts),
    ...stripePaymentRequest.styles(opts),
    ...simpleSummary.styles(opts),
    ...applePay.styles(opts),
    ...cardInput.styles(opts),
    ...printStyles,
  });
}
