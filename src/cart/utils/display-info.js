import messagesState from '../state/status-messages';

export default function displayInfo(msg) {
  if (!msg) return;
  let info = [...messagesState.state.info];
  if (Array.isArray(msg)) {
    info.push(...msg);
  } else if (typeof msg === `string`) {
    info.push(msg);
  }
  messagesState.setState({ info });
}
