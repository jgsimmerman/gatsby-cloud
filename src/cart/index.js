export { default as Cart } from './components';
export { default as CartQuantity } from './components/cart-quantity';
export { default as openCart } from './utils/open-cart';
export { default as closeCart } from './utils/close-cart';
export { default as toggleCart } from './utils/toggle-cart';
export { default as addToCart } from './utils/add-to-cart';
export { default as removeFromCart } from './utils/remove-from-cart';
export { default as getShippingMethods } from './plugins/getShippingMethods';
export { default as preInfo } from './plugins/preInfo';
export { default as Shipping } from './plugins/Shipping';

export {
  addedToCartState,
  customerState,
  metaState,
  openState,
  productsState,
  settingsState,
  shippingState,
  statusMessagesState,
  stepState,
  successState,
  totalsState,
  findShippingMethod,
} from './state';
// export * from './state'
