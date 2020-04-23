import { State } from 'statable';
import noop from '../utils/noop';

const settingsState = new State({
  shipping: true,
  tax: true,
  coupons: true,
  googleAnalytics: true,
  googleTagManager: true,
  stripeApiKey: ``,
  onOpen: noop,
  onClose: noop,
  onAddProduct: noop,
  onRemoveProduct: noop,
  onInfoAttempt: noop,
  onInfo: noop,
  onOrderAttempt: noop,
  onOrder: noop,
  onError: noop,
  orderSubmitError: `Sorry! One or more items in your cart may have gone out of stock. Please remove these products or try again later.`,
  infoSubmitError: `Please try again.`,
  splitName: false,
  testing: false,
  plugins: [],
  showStates: noop,
});

export default settingsState;
