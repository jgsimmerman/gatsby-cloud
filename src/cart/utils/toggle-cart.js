import openState from '../state/open';
import openCart from './open-cart';
import closeCart from './close-cart';

export default function toggleCart() {
  if (openState.state.open) {
    return closeCart();
  }
  openCart();
}
