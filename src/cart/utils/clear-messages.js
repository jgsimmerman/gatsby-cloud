import messagesState from '../state/status-messages';

export default function clearMessages() {
  messagesState.setState({
    errors: [],
    info: [],
  });
}
