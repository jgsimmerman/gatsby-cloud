import messagesState from '../state/status-messages';

export default function displayError(msg) {
  if (!msg) return;
  let errors = [...messagesState.state.errors];
  if (Array.isArray(msg)) {
    errors.push(...msg);
  } else if (typeof msg === `string`) {
    errors.push(msg);
  }
  messagesState.setState({ errors });
}
