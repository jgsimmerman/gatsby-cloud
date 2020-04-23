import { State } from 'statable';

const defaults = {
  products: [],
  shippable: true,
};

const productsState = new State(
  { ...defaults },
  {
    reset() {
      this.setState({ ...defaults });
    },
  },
  {
    localStorage: `zygoteCart`,
  }
);

export default productsState;
