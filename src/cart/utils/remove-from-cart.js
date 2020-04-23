import productState from '../state/products';
import stepState from '../state/step';
import calculateTotals from './calculate-totals';
import triggerEvent from './trigger-event';
import changeStep from './change-step';

export default function removeFromCart(id) {
  let products = [...productState.state.products];
  let removedProduct;
  for (let i = products.length; i--; ) {
    if (products[i].id === id) {
      removedProduct = products.splice(i, 1);
      break;
    }
  }
  let shippable = false;
  for (let i = products.length; i--; ) {
    const product = products[i];
    shippable = shippable || product.shippable;
  }
  productState.setState({ products, shippable });
  if (!shippable) {
    stepState.setState({ skip: { ...stepState.state.skip, shipping: true } });
  } else {
    let skip = stepState.state.skip;
    delete skip[`shipping`];
    stepState.setState({ skip });
  }
  calculateTotals();
  if (removedProduct) {
    if (products.length == 0) {
      changeStep(`cart`);
    }
    triggerEvent(
      `removeProduct`,
      removedProduct.map(prod => prod.id)
    );
  }
}
