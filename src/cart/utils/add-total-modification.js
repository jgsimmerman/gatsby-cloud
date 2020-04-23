import totalsState from '../state/totals';
import calculateTotal from './calculate-total';

export default function addModification(newModification) {
  /*
	{
		id: `10OFF`,
		description: `10% off discount`,
		displayValue: `-10%`,
		value: () => {
			return totalsState.state.subtotal * -.1
		}
	}
	*/
  console.log(`Adding modification`, newModification);
  if (!newModification) return;
  if (Array.isArray(newModification)) {
    totalsState.setState({
      modifications: newModification,
    });
  } else {
    const modifications = [...totalsState.state.modifications];
    // See if already exists
    let modificationExists = false;
    if (newModification.id) {
      for (let i = modifications.length; i--; ) {
        let mod = modifications[i];
        if (mod.id && newModification.id === mod.id) {
          modificationExists = true;
          modifications[i] = newModification;
        }
      }
    }
    // Add new modification
    if (!modificationExists) {
      modifications.push(newModification);
    }
    totalsState.setState({ modifications });
  }
  calculateTotal();
}
