import settingsState from '../state/settings';
import capitalize from './capitalize';
import centsToDollars from './cents-to-dollars';
import productsState from '../state/products';
import totalsState from '../state/totals';
import metaState from '../state/meta';

export default function eventTrigger(type, data) {
  const capType = capitalize(type);
  settingsState.state[`on${capType}`](data);
  const { ga, dataLayer } = global;

  const { products } = productsState.state;
  const { total } = totalsState.state;
  const { meta } = metaState.state;

  /**
   * Google Analytics code snippet tracking
   */
  if (settingsState.state.googleAnalytics && ga) {
    try {
      ga(`send`, {
        hitType: `event`,
        eventCategory: `Zygote`,
        eventAction: type,
      });

      // Ecommerce plugin-specific event on successful order
      if (type === `order`) {
        // Use the Ecommerce GA plugin
        ga(`require`, `ecommerce`);

        // Add the overall order
        const transactionObj = {
          id: meta.orderId || `${Date.now()}`,
          revenue: centsToDollars(total),
          shipping: centsToDollars(getValue(`shipping`)),
          tax: centsToDollars(getValue(`tax`)),
        };
        ga(`ecommerce:addTransaction`, transactionObj);

        // Add the order's products
        products.forEach(prod => {
          // Formatted GA item data
          const gaItem = {
            id: transactionObj.id, // Links item to the transaction
            name: prod.name,
            sku: prod.id,
            price: centsToDollars(prod.price),
            quantity: prod.quantity,
          };
          ga(`ecommerce:addItem`, gaItem);
        });

        // Send the transaction + products
        ga(`ecommerce:send`);
        ga(`ecommerce:clear`);
      }
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Google Tag Manager Data Layer tracking
   */
  if (settingsState.state.googleTagManager && dataLayer) {
    if (type === `order`) {
      // Get rid of sensitive info (for regular GTM event later)
      delete data.billingCardCVC;
      delete data.billingCardExpiration;
      delete data.billingCardNumber;

      // Send special event formatted for Google Analytics Ecommerce plugin
      const ecommerceOrderEvent = {
        event: `zygoteOrderGA`,
        transactionId: meta.orderId || `${Date.now()}`,
        transactionTotal: centsToDollars(total),
        transactionTax: centsToDollars(getValue(`tax`)),
        transactionShipping: centsToDollars(getValue(`shipping`)),
        transactionProducts: products.map(prod => ({
          name: prod.name,
          sku: prod.id,
          price: centsToDollars(prod.price),
          quantity: prod.quantity,
        })),
      };
      dataLayer.push(ecommerceOrderEvent);
    }

    // Send the regular GTM event
    dataLayer.push({
      ...data,
      event: `zygote${capType}`,
    });
  }
}

function getValue(id) {
  const { modifications } = totalsState.state;
  for (let i = modifications.length; i--; ) {
    if (modifications[i].id === id) {
      return modifications[i].value;
    }
  }
  return 0;
}
