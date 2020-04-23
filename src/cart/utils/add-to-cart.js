import productState from '../state/products';
import stepState from '../state/step';
import addedToCartState from '../state/products';
import openCart from './open-cart';
import calculateTotals from './calculate-totals';
import triggerEvent from './trigger-event';

export default function addToCart(newProduct) {
  let products = [...productState.state.products];
  if (!newProduct.quantity) {
    newProduct.quantity = 1;
  }
  let alreadyInCart = false;
  let shippable = products.length ? false : newProduct.shippable;
  for (let i = products.length; i--; ) {
    const product = products[i];
    if (product.id === newProduct.id) {
      alreadyInCart = true;
      if (products[i].quantity < newProduct.stock) {
        products[i] = {
          ...newProduct,
          quantity: products[i].quantity + newProduct.quantity,
        };
      }
    }
    shippable = shippable || product.shippable || newProduct.shippable;
  }
  if (!alreadyInCart) {
    products.push(newProduct);
  }
  if (!newProduct.noOpen) {
    openCart(true);
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
  addedToCartState.setState({ addedToCart: true });
  triggerEvent(`addProduct`, newProduct);
}
