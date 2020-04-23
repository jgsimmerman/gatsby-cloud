import openState from '../state/open';
import stepState from '../state/step';
import triggerEvent from './trigger-event';

export default function closeCart() {
  stepState.setState({ vals: {} });
  openState.setState({ open: false });
  document.body.classList.remove(`zygoteOpen`);
  triggerEvent(`close`);
}
