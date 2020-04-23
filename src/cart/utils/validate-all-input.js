import inputs from './inputs';

export default function validateAllInputs(step) {
  let firstFocus = true;
  for (let i in inputs) {
    if (step && inputs[i].props.step !== step) {
      continue;
    }
    if (inputs[i].validate) {
      // console.log(inputs[i])
      if (!inputs[i].validate(firstFocus) && inputs[i].input && firstFocus) {
        document.querySelector(`[name="${inputs[i].input.name}"]`).focus();
        firstFocus = false;
      }
    }
  }
}
