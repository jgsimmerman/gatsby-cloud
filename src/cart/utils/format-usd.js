export default function formatUSD(n) {
  if (typeof n !== `number`) {
    n = 0;
  }
  n = n / 100;
  n = n.toLocaleString(`en-US`, { style: `currency`, currency: `USD` });
  return n;
}
