import productsState from '../state/products';
import decreaseQuantity from './decrease-quantity';
import removeFromCart from './remove-from-cart';
import displayError from './display-error';

export default function addQuantityModification(newModification) {
  /*
	{
		id: `TESTA`,
		available: `5`,
	}
	*/
  if (!newModification) return {};
  const remove = [...productsState.state.products];
  if (typeof newModification === `string` && newModification === `all`) {
    remove.forEach(({ id, name }) => {
      removeFromCart(id);
      displayError(
        `"${name
          .replace(/&quot;/g, `"`)
          .replace(
            /&#039;/g,
            `'`
          )}" is no longer available for purchase and has been removed from your cart.`
      );
    });
    return { returnTo: `cart` };
  } else {
    remove.forEach(({ id, quantity, name }) => {
      const mod = search(id, newModification);
      if (mod) {
        if (mod.available == 0) {
          removeFromCart(id);
          displayError(
            `"${name
              .replace(/&quot;/g, `"`)
              .replace(
                /&#039;/g,
                `'`
              )}" is no longer available for purchase and has been removed from your cart.`
          );
        } else if (mod.available < quantity) {
          decreaseQuantity(id, quantity - mod.available, true);
        }
      }
    });
  }
  return {};
}

function search(key, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === key) {
      return arr[i];
    }
  }
  return false;
}
