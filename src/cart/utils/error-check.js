import stepState from '../state/step';

export default function errorCheck() {
  const cart = document.querySelector(`.zygoteCart`);
  if (!cart) return true;
  const forms = cart.querySelectorAll(
    `[data-form="info"], [data-form="payment"]`
  );
  for (let i = 0; i < forms.length; i++) {
    if (forms[i].querySelector(`[data-error]`)) {
      stepState.setState({ step: forms[i].getAttribute(`data-form`) });
      return true;
    }
  }
  return false;
}
