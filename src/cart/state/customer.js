import { State } from 'statable';

const defaults = {
  customer: null,
};

const customerState = new State(
  { ...defaults },
  {
    reset() {
      this.setState({ ...defaults });
    },
  }
);

export default customerState;
