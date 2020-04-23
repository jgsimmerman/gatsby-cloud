import React from 'react';
import totalsState from '../../state/totals';
import productsState from '../../state/products';
import submitOrder from '../../utils/submit-order';
import ApplePay from '../apple-pay-button';
import Button from '../button';

export default class PaymentRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canMakePayment: false,
    };
    this.updateTotal = this.updateTotal.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
  }
  update() {
    const { stripe } = this.props;
    if (!stripe) return;
    if (!this.state.paymentRequest) {
      this.updateTotal();
    }
    const paymentRequest = stripe.paymentRequest({
      country: `US`,
      currency: `usd`,
      requestShipping: false,
      displayItems: this.createDisplayItems(),
      total: {
        label: `Total`,
        amount: totalsState.state.total,
      },
    });
    this.setState({ paymentRequest });

    paymentRequest.on(`token`, ({ complete, token }) => {
      submitOrder({ type: `stripe`, token });
      complete(`success`);
    });

    paymentRequest.canMakePayment().then(result => {
      this.setState({ canMakePayment: !!result });
    });
  }
  updateTotal() {
    if (!this.state.paymentRequest) return;
    this.state.paymentRequest.update({
      currency: `usd`,
      displayItems: this.createDisplayItems(),
      total: {
        label: `Total`,
        amount: totalsState.state.total,
      },
    });
  }
  createDisplayItems() {
    const displayItems = [];
    productsState.state.products.forEach(({ name, quantity, price }) => {
      displayItems.push({
        label: `${name.replace(/&quot;/g, `"`).replace(/&#039;/g, `'`)}${
          quantity > 1 ? ` (x${quantity})` : ``
        }`,
        amount: price * quantity,
      });
    });
    totalsState.state.modifications.forEach(({ description, value }) => {
      // console.log(description, value)
      if (typeof value === `number`) {
        displayItems.push({
          label: description,
          amount: value,
        });
      }
    });
    return displayItems;
  }
  clickHandler() {
    const { paymentRequest } = this.state;
    if (paymentRequest) {
      paymentRequest.show();
    }
  }
  componentDidUpdate() {
    const { stripe } = this.props;
    if (!stripe || this.state.stripe) return;
    this.setState({ stripe });
    this.update();
  }
  componentDidMount() {
    this.update();
    totalsState.subscribe(this.updateTotal);
  }
  componentWillUnmount() {
    totalsState.unsubscribe(this.updateTotal);
  }
  render() {
    const { canMakePayment } = this.state;
    const { applePay } = canMakePayment;
    return canMakePayment ? (
      <div className="zygotePaymentRequest">
        {applePay && <ApplePay onClick={this.clickHandler} />}
        {!applePay && <Button onClick={this.clickHandler}>Pay Now</Button>}
        <div className="zygotePaymentRequestDivider">
          Or enter card your information
        </div>
      </div>
    ) : null;
  }
  static styles = () => ({
    '.zygotePaymentRequest': {
      marginTop: 10,
    },
    '.zygotePaymentRequestDivider': {
      marginTop: 30,
      textAlign: `center`,
    },
  });
}
