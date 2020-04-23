import React from 'react';
import { ThreeBounce } from 'better-react-spinkit';
//import { primaryColor } from '../styles/settings'

export default class LoadingAnimation extends React.Component {
  static defaultProps = {
    size: 10,
  };
  render() {
    return (
      <div className="zygoteLoading">
        <ThreeBounce size={this.props.size} />
      </div>
    );
  }
  static styles = ({ primaryColor }) => ({
    '.zygoteLoading': {
      textAlign: `center`,
      div: {
        backgroundColor: `${primaryColor} !important`,
      },
    },
  });
}
