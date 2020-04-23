import React from 'react';
import LoadingAnimiation from './loading-animation';

export default class Processing extends React.Component {
  render() {
    return (
      <div className="zygoteProcessing">
        <div>
          <LoadingAnimiation size={22} />
        </div>
        {this.props.message || (
          <div>
            Processing your order.
            <br />
            Please do not close this page.
          </div>
        )}
      </div>
    );
  }
  static styles = () => ({
    '.zygoteProcessing': {
      textAlign: `center`,
      '> div:first-of-type': {
        margin: `100px auto 30px auto`,
      },
    },
  });
}
