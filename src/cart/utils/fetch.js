import fetch from 'isomorphic-fetch';

import {
  metaState,
  shippingState,
  productsState,
  totalsState,
  stepState,
  settingsState,
  customerState,
} from '../state';
import * as cartState from '../state';
import displayError from './display-error';
import displayInfo from './display-info';
import addTotalModification from './add-total-modification';
import addQuantityModification from './quantity-modifications';
import setShipping from './set-shipping';
import triggerEvent from './trigger-event';

export default async function fetchWebhook(path, body) {
  // const cartState = Object.keys(state).reduce((acc, currentKey) => ({
  // 	...acc,
  // 	[currentKey]: state[currentKey].state ? { ...state[currentKey].state } : state[currentKey],
  // }), {})

  if (body.event) {
    triggerEvent(`${body.event}Attempt`, body);
  }
  let response, info, preFetchData;
  try {
    info = {
      ...body,
      products: productsState.state.products,
      selectedShippingMethod: shippingState.state.selected,
      totals: totalsState.state,
      meta: metaState.state.meta,
      subtotal: totalsState.state.subtotal,
      shippingMethods: shippingState.state.methods,
      customer: customerState.state.customer,
    };

    preFetchData = info;
    for (let i = 0; i < settingsState.state.plugins.length; i++) {
      preFetchData = await (body.event === `info` &&
      typeof settingsState.state.plugins[i].preInfo === `function`
        ? settingsState.state.plugins[i].preInfo({
            preFetchData,
            info,
            cartState,
          })
        : preFetchData);
      preFetchData = await (body.event === `order` &&
      typeof settingsState.state.plugins[i].preOrder === `function`
        ? settingsState.state.plugins[i].preOrder({
            preFetchData,
            info,
            cartState,
          })
        : preFetchData);
    }

    if (preFetchData.billingCardNumber) {
      preFetchData.billingCardNumber = preFetchData.billingCardNumber.replace(
        /\W+/g,
        ``
      );
    }

    const jsonBody = JSON.stringify(preFetchData);

    console.log(`Sending to API:`, jsonBody);
    if (path) {
      console.log(`Information sent to ${path}`);
      response = await fetch(path, {
        method: `post`,
        body: jsonBody,
      });
      response = await response.json();
    } else {
      console.warn(
        `No 'path' was provided for event '${body.event}'. Please fix this, unless the call is handled via a plugin.`
      );
      response = preFetchData;
    }

    for (let i = 0; i < settingsState.state.plugins.length; i++) {
      response = await (body.event == `info` &&
      typeof settingsState.state.plugins[i].coupons === `function`
        ? settingsState.state.plugins[i].coupons({
            response,
            info,
            preFetchData,
            cartState,
          })
        : response);
      response = await (body.event == `info` &&
      typeof settingsState.state.plugins[i].postInfo === `function`
        ? settingsState.state.plugins[i].postInfo({
            response,
            info,
            preFetchData,
            cartState,
          })
        : response);
      response = await (body.event == `order` &&
      typeof settingsState.state.plugins[i].postOrder === `function`
        ? settingsState.state.plugins[i].postOrder({
            response,
            info,
            preFetchData,
            cartState,
          })
        : response);
    }
    console.log(`Received from API:`, response);
  } catch (err) {
    console.error(err);
    triggerEvent(`error`, err);
    response = {};
  }
  try {
    if (body.event) {
      const eventData = {
        ...body,
        ...response,
      };
      if (response.success === true) {
        triggerEvent(`${body.event}`, eventData);
      } else {
        triggerEvent(`error`, eventData);
      }
    }

    const {
      meta,
      messages,
      shippingMethods,
      selectedShippingMethod = typeof shippingState.state.selected === `number`
        ? shippingState.state.selected
        : 0,
      step,
      modifications,
      quantityModifications,
    } = response;

    if (modifications) {
      addTotalModification(modifications);
    }
    if (quantityModifications) {
      response = {
        ...response,
        ...addQuantityModification(quantityModifications),
      };
    }
    if (typeof meta === `object`) {
      metaState.setState({ meta });
    }
    if (messages) {
      displayError(messages.error);
      displayInfo(messages.info);
    }
    if (shippingMethods) {
      shippingState.setState({
        methods: shippingMethods,
        selected: selectedShippingMethod,
      });
      if (
        typeof selectedShippingMethod == `object` &&
        Object.keys(selectedShippingMethod).length > 0
      ) {
        Object.keys(selectedShippingMethod).map(shipid =>
          setShipping(selectedShippingMethod[shipid], shipid)
        );
      } else {
        setShipping(selectedShippingMethod);
      }
    } else {
      for (let i = 0; i < settingsState.state.plugins.length; i++) {
        const ship = await (typeof settingsState.state.plugins[i]
          .getShippingMethods === `function`
          ? settingsState.state.plugins[i].getShippingMethods({
              response,
              info,
              preFetchData,
              cartState,
            })
          : {});
        if (ship && ship.methods && ship.methods.length) {
          shippingState.setState({
            methods: ship.methods,
            selected: ship.selected ? ship.selected : selectedShippingMethod,
          });
          if (ship.selected) {
            setShipping(ship.selected);
          }
        }
      }
    }
    if (step) {
      stepState.setState({ step });
    }
  } catch (err) {
    console.error(err);
  }

  return response;
}
