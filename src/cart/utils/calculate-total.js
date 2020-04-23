import totalsState from '../state/totals';

export default function calculateTotal() {
  const { subtotal, modifications } = totalsState.state;
  let total = subtotal;
  for (let i = modifications.length; i--; ) {
    total += modifications[i].value || 0;
  }
  totalsState.setState({ total });
}
