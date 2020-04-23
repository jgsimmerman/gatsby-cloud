import React from 'react';
import { Elements, StripeProvider } from 'react-stripe-elements';
import settingsState from '../../state/settings';
import StripeForm from './form';

export default class StripeWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = { stripe: null };
  }
  componentDidMount() {
    if (window.Stripe) {
      this.init();
    } else {
      const script = document.createElement(`script`);
      script.src = `https://js.stripe.com/v3/`;
      script.addEventListener(`load`, () => this.init());
      document.body.appendChild(script);
    }
  }
  init() {
    const stripe = window.Stripe(settingsState.state.stripeApiKey);
    this.setState({ stripe });
  }
  render() {
    return (
      <StripeProvider stripe={this.state.stripe}>
        <Elements>
          <div>
            <StripeForm stripe={this.state.stripe} />
          </div>
        </Elements>
      </StripeProvider>
    );
  }
  static styles = () => ({
    '.zygoteStripeInput': {
      borderRadius: 4,
      padding: 10,
    },
    '.zygoteStripeRow': {
      display: `flex`,
      '> div': {
        width: `50%`,
        padding: `0 10px`,
        ':first-of-type': {
          paddingLeft: 0,
        },
        ':last-of-type': {
          paddingRight: 0,
        },
      },
    },
  });
}
