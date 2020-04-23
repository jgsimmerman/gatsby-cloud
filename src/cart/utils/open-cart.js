import openState from '../state/open';
import stepState from '../state/step';
import settingsState from '../state/settings';
import addedToCartState from '../state/added-to-cart';
import clearMessages from './clear-messages';
import triggerEvent from './trigger-event';
import addTotalModification from './add-total-modification';
import calculateTotals from './calculate-totals';

export default function openCart(product) {
  if (openState.state.open) return;

  const { totalModifications } = settingsState.state;
  if (totalModifications) {
    addTotalModification(totalModifications);
  }
  calculateTotals();

  clearMessages();
  if (!openState.state.init) {
    openState.setState({ init: true });
    setTimeout(() => openState.setState({ open: true }), 1);
  } else {
    openState.setState({ open: true });
  }
  stepState.setState({ step: `cart` });
  if (product === true) {
    addedToCartState.setState({ addedToCart: true });
  } else {
    addedToCartState.setState({ addedToCart: false });
  }
  document.body.classList.add(`zygoteOpen`);
  triggerEvent(`open`);
}
