import { State } from 'statable';

const defaults = {
  totals: {},
  products: [],
  meta: {},
};

const successState = new State(
  { ...defaults },
  {
    reset() {
      this.setState({ ...defaults });
    },
  }
);

export default successState;
