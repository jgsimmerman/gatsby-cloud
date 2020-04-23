import productState from '../state/products';
import calculateTotals from './calculate-totals';
import triggerEvent from './trigger-event';

// import Skus: example query found in: "../components/Products/Skus"

/*

				{skus.edges.map(({ node: sku }, id) => (
          maxQuantity = sku.inventory.quantity 
        ))}

*/

export default function increaseQuantity(id, quantity = 1) {
  let products = [...productState.state.products];
  let modifiedProduct;
  for (let i = products.length; i--; ) {
    const product = products[i];
    if (product.id === id) {
      modifiedProduct = product;
      product.quantity += quantity;
      if (typeof product.stock === `number`) {
        if (product.quantity > product.stock) {
          product.quantity = product.stock;
        }
      }
      break;
    }
  }
  productState.setState({ products });
  calculateTotals();
  if (modifiedProduct) {
    triggerEvent(`addProduct`, {
      ...modifiedProduct,
      quantity,
    });
  }
}
