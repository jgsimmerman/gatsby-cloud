import inputs from './inputs';

export default function getFormValues() {
  let obj = {};
  for (let i in inputs) {
    const input = inputs[i];
    if (!input.props.name) {
      continue;
    }
    obj[input.props.name] = input.state.value;
  }
  return obj;
}
