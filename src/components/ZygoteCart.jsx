import React from 'react';

import { graphql, Link } from 'gatsby';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { Layout, Container, Content } from 'layouts';
//import { TagsBlock, Header, SEO, SecondNav, Zygote } from 'components';
import Helmet from 'react-helmet';
import BuyButton from './BuyButton';
import Img from 'gatsby-image';
import { Grid, GridItem } from 'styled-grid-component';

import { Cart, getShippingMethods, preInfo, Shipping} from 'cart';


const ZygoteCart = props => {

  //const { subtotal } = props.Totals.totalsState.state

  // const tenPercent = ({
	// 	id: `10OFF`,
	// 	description: `10% off discount`,
	// 	displayValue: `-10%`,
	// 	value: () => {
	// 		return totalsState.State.subtotal * -.1
	// 	}
  // })
  
  
   
  return(
    
    <Cart
     //stripeApiKey="pk_live_nMctV4G1movcajzQsjXet2Zs000zybvAUV"
     stripeApiKey="pk_test_Vc8z3p2pdxHFQgxhbbhIXtyv00GnPddsjV"

     // stripeApiKey={process.env.STRIPE_API_PUBLIC}

      infoWebhook='/.netlify/functions/info-stripe'
      orderWebhook='/.netlify/functions/order-stripe'
      shippingWebhook='/.netlify/functions/shipping-stripe'

      // infoWebhook='https://97bc9b72.ngrok.io/.netlify/functions/info-stripe'
      // orderWebhook='https://97bc9b72.ngrok.io/.netlify/functions/order-stripe'
      // shippingWebhook='https://97bc9b72.ngrok.io/.netlify/functions/shipping-stripe'

      // infoWebhook={process.env.INFO_WEBHOOK}
      // orderWebhook={process.env.ORDER_WEBHOOK}
      // shippingWebhook={process.env.SHIPPING_WEBHOOK}

      plugins={[ 
        // getShippingMethods, 
        // preInfo, 
        // Shipping
      ]}

      cartHeader={<div>Sweet Leaf</div>}

      // auth0ClientID='2VYDe7FojdVooeMFbcWsf9rXEI0F8clm'
      // auth0Logout='https://localhost:8000/'
      // //auth0Logout='https://sweetleaf-gc.netlify.app/'
      // auth0Domain='dev-cbk6z20i.auth0.com'
      // auth0Theme={{
      //   primaryColor: '#00cfff',
      // }}
      
      // auth0Options={{
      //   avatar: null,
      //   rememberLastLogin: false,
      //   hashCleanup: true,
        
      //   auth: {
      //     // Solution from this link: https://github.com/auth0/lock/issues/1294
      //      responseType: 'token',
      //      redirect: true,
      //      redirectUrl: 'https://localhost:8000/'
      //     //redirectUrl: 'https://sweetleaf-gc.netlify.app/'
      //   },
      // }}
      

      // totalModifications={[
      //   // {
      //   //   id: `shipping`,
      //   //   description: `Shipping`,
      //   //   value: 0,
      //   //   displayValue: `Free`,
      //   // },
      //   // {
      //   //   id: `tax`,
      //   //   description: `Tax`,
      //   //   value: 0,
      //   //   displayValue: `Calculated at checkout`,
      //   // },
      //   // {
      //   //   id: `sale-1`,
      //   //   description: `Super Sale!`,
      //   //   value: -2000,
      //   // },
      // ]}
     
    />
    
  );
};

export default ZygoteCart;