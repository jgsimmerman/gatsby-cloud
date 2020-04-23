import { State } from 'statable';

const defaults = {
  subtotal: 0,
  modifications: [],
  total: 0,
  loading: false,
};

const totalsState = new State(
  { ...defaults },
  {
    reset() {
      this.setState({ ...defaults });
    },
  }
);

export default totalsState;
