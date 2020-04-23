import inputs from './inputs';

export default function registerInput(input) {
  inputs[input.props.name] = input;
}
