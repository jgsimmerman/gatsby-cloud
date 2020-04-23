import shippingState, { findShippingMethod } from '../state/shipping';
import totalsState from '../state/totals';
import settingsState from '../state/settings';
import addTotalModification from './add-total-modification';
import * as cartState from '../state';

export default function setShipping(selected, setId) {
  const method = findShippingMethod(selected);
  if (!method) return;
  if (setId && typeof shippingState.state.selected === `object`) {
    const selectedSet = shippingState.state.selected;
    selectedSet[setId] = selected;
    shippingState.setState({ selected: selectedSet });
  } else {
    shippingState.setState({ selected });
  }
  totalsState.setState({ loading: true });
  addTotalModification({
    id:
      setId && typeof shippingState.state.selected === `object`
        ? `shipping-${setId}`
        : `shipping`,
    description: method.description,
    displayValue: method.displayValue,
    value: method.value,
  });

  const totalShippingCost = totalsState.state.modifications
    .filter(mod => mod.id.startsWith(`shipping`))
    .reduce((total, mod) =>
      total.value ? total.value + mod.value : total + mod.value
    );

  let discount = 0;
  totalsState.state.modifications
    .filter(mod => !mod.id.startsWith(`tax`) && !mod.id.startsWith(`shipping`))
    .forEach(mod => {
      discount += mod.value;
    });

  settingsState.state.plugins.forEach(plugin => {
    if (typeof plugin.calculateTax === `function` && settingsState.state.tax) {
      console.log(`Applying taxes to new shipping method`);
      plugin
        .calculateTax({
          shippingAddress: shippingState.state.address,
          subtotal: totalsState.state.subtotal,
          shipping: totalShippingCost.value
            ? totalShippingCost.value
            : totalShippingCost,
          discount,
          cartState,
        })
        .then(tax => {
          if (tax.id) addTotalModification(tax);
        })
        .catch(error =>
          console.log(`Error applying taxes to new shipping method`, error)
        );
    }
  });
  totalsState.setState({ loading: false });
}
