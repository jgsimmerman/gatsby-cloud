import { State } from 'statable';

const defaults = {
  meta: {},
};

const openState = new State(
  { ...defaults },
  {
    reset() {
      this.setState({ ...defaults });
    },
  }
);

export default openState;
