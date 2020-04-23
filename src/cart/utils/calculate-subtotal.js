import totalsState from '../state/totals';
import productsState from '../state/products';

export default function calculateSubtotal() {
  const { products } = productsState.state;
  let subtotal = 0;
  products.forEach(({ quantity, price }) => {
    subtotal += quantity * price;
  });
  totalsState.setState({ subtotal });
}
