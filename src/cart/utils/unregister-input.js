import inputs from './inputs';

export default function unregisterInput(input) {
  delete inputs[input.props.name];
}
