import stepState from '../state/step';

export default function resetStep() {
  stepState.setState({
    step: `cart`,
  });
}
