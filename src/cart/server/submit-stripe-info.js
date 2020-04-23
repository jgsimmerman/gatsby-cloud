import Stripe from 'stripe';
import noop from '../utils/noop';

export default async function submitStripeInfo({
  stripeApiSecret,
  body,
  verbose,
}) {
  let log = noop;
  let error = noop;
  if (verbose) {
    log = console.log;
    error = console.error;
  }
  const stripe = Stripe(stripeApiSecret);
  if (typeof body === `string`) {
    body = JSON.parse(body);
  }

  log(`submitStripeInfo received from invoke:`, body);

  // Create empty result object to be sent later
  let res = {
    messages: {
      error: [],
    },
    modifications: [],
    meta: {},
  };
  // Create stripe customer

  // const customer = await stripe.customers.create(
  // 	{
  // 		email: body.customer.email,
  // 	}
  // )
  // const customerId = customer.id

  // Create stripe order
  let order;
  let orderType = `order`;
  try {
    const obj = {
      currency: `usd`,
      email: body.infoEmail,
      //customer: customerId,
      items: body.products.map(({ id, quantity, type }) => {
        switch (type) {
          case `plan`:
            if (!body.customer)
              throw new Error(
                `You must sign in to purchase this subscription.`
              );
            orderType = `subscription`;
            return {
              customer: body.customer,
              plan: id,
              quantity,
            };
          case `sku`:
          default:
            return {
              type: type || `sku`,
              parent: id,
              quantity,
            };
        }
      }),
      shipping: {
        name: body.infoName,
        address: {
          line1: body.shippingAddress1,
          line2: body.shippingAddress2,
          city: body.shippingCity,
          state: body.shippingStateAbbr,
          postal_code: body.shippingZip,
          country: `US`,
        },
      },
    };
    if (body.coupon) {
      obj.coupon = body.coupon;
    }
    // Determine if we are subscribing to plans, or placing an order
    switch (orderType) {
      case `subscription`:
        order = await stripe.subscriptions.create(obj);
        break;

      case `order`:
      default:
        order = await stripe.orders.create(obj);
        break;
    }

    res.success = true;
    log(`submitStripeInfo received from Stripe:`, order);
  } catch (err) {
    order = {};
    error(`submitStripeInfo received error from Stripe:`, err);

    // Error messages
    // Create more consumer friendly inventory error message
    if (err.code === `out_of_inventory`) {
      let item = Number(err.param.replace(`items[`, ``).replace(`]`, ``));
      if (body.products[item]) {
        res.step = `cart`;
        res.messages.error.push(
          `Sorry! "${body.products[item].name}" is out of stock. Please lower the quantity or remove this product from your cart.`
        );
        const stock = await stripe.products.retrieve(body.products[item].id);
        let quantity = 999999;
        stock.skus.data.forEach(sku => {
          // Scan for least quantity in product
          console.log(`sku:`, sku);
          quantity =
            sku.inventory && sku.inventory.quantity < quantity
              ? sku.inventory.quantity
              : quantity;
        });
        res.quantityModifications = [
          { id: body.products[item].id, available: quantity },
        ];
      }
    } else if (err.message) {
      res.messages.error.push(
        `The connection timed out. Please try again or contact us.`
      );
    }

    if (err.param === `coupon`) {
      res.step = `info`;
    }
    res.success = false;
  }

  // Modifications
  if (order.items) {
    order.items.forEach(({ type, parent, amount, description }) => {
      if (type === `discount` || type === `tax` || type === `shipping`) {
        res.modifications.push({
          id: type === `discount` ? parent : type,
          value: amount,
          description,
        });
      }
    });
  }

  // Get shipping
  if (order.shipping_methods) {
    res.shippingMethods = order.shipping_methods.map(
      ({ id, amount, description }) => {
        return {
          id,
          value: amount,
          description,
        };
      }
    );
  }

  if (order.selected_shipping_method) {
    res.selectedShippingMethod = order.selected_shipping_method;
  }
  if (order.id) {
    res.meta.orderId = order.id;
  }

  res = {
    ...body,
    ...res,
  };

  log(`submitStripeInfo returning:`, res);

  return res;
}
