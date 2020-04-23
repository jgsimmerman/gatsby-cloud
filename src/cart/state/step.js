import { State } from 'statable';
import steps from '../utils/steps';

const stepState = new State({
  step: steps[0],
  processing: false,
  vals: {},
  skip: {},
});

export default stepState;
