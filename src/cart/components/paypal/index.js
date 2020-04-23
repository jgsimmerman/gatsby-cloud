import React from 'react';
import PaypalExpressBtn from './button';
import { Subscribe } from 'statable';
import settingsState from '../../state/settings';
import productsState from '../../state/products';
import totalsState from '../../state/totals';
import submitOrder from '../../utils/submit-order';
import centsToDollars from '../../utils/cents-to-dollars';

export default class Paypal extends React.Component {
  render() {
    return (
      <Subscribe to={[settingsState, totalsState, productsState]}>
        {(
          { paypalAppId, paypalEnv = `production` },
          { total, modifications },
          { products }
        ) => {
          const transaction = {
            amount: {
              total: centsToDollars(total),
              currency: `USD`,
              details: {
                subtotal: 0,
              },
            },
            item_list: {
              items: [],
            },
          };
          products.forEach(({ name, id, price, quantity, description }) => {
            const dollars = centsToDollars(price);
            transaction.item_list.items.push({
              sku: id,
              name,
              price: dollars,
              currency: `USD`,
              quantity,
              description,
            });
            transaction.amount.details.subtotal += price;
          });
          modifications.forEach(({ id, value, description }) => {
            if (id === `tax` || id === `shipping`) {
              transaction.amount.details[id] = centsToDollars(value);
            } else {
              const price = centsToDollars(value);
              transaction.item_list.items.push({
                sku: id,
                description,
                price,
                currency: `USD`,
                quantity: 1,
              });
              transaction.amount.details.subtotal += value;
            }
          });

          transaction.amount.details.subtotal = centsToDollars(
            transaction.amount.details.subtotal
          );

          return (
            <PaypalExpressBtn
              client={{
                sandbox: paypalAppId,
                production: paypalAppId,
              }}
              env={paypalEnv}
              shipping={1}
              onError={err => console.error(err)}
              onSuccess={token => {
                submitOrder({
                  token,
                  type: `paypal`,
                });
              }}
              transaction={transaction}
            />
          );
        }}
      </Subscribe>
    );
  }
}
