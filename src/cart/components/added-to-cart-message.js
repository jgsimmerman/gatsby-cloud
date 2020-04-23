import React from 'react';

export default class AddedToCartMessage extends React.Component {
  render() {
    return (
      <div className="zygoteAddMsg">You've added a product to your cart!</div>
    );
  }
  static styles = () => ({
    '.zygoteAddMsg': {
      fontSize: `1.3em`,
      textAlign: `center`,
      fontStyle: `italic`,
    },
  });
}
