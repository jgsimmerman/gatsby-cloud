import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler'
const Router = require('./router')
import Stripe from 'stripe'

const stripeApiSecret = process.env.stripeApiSecret
const stripe = Stripe(stripeApiSecret)

/**
 * The DEBUG flag will do two things that help during development:
 * 1. we will skip caching on the edge, which makes it easier to
 *    debug.
 * 2. we will return an error message on exception in your Response rather
 *    than the default 404.html page.
 */

const DEBUG = false

addEventListener('fetch', event => {
  try {
    event.respondWith(handleRequest(event.request))
  } catch (e) {
    if (DEBUG) {
      return event.respondWith(
        new Response(e.message || e.toString(), {
          status: 500,
        }),
      )
    }
    event.respondWith(new Response('Internal Error', { status: 500 }))
  }
})

async function handleRequest(request) {
  // const url = new URL(request.url)
  // const apiurl = url.searchParams.get('apiurl')
  // // Rewrite request to point to API url. This also makes the request mutable
  // // so we can add the correct Origin header to make the API server think
  // // that this request isn't cross-site.
  // request = new Request(apiurl, request)
  // request.headers.set('Origin', new URL(apiurl).origin)
	
		const r = new Router()
    // Replace with the approriate paths and handlers
    r.get('.*/bar', () => new Response('responding for /bar'))
     // return the response from the origin
    r.get('/test', request => test(request))
    r.get('/shipping-stripe', request => shipping(request))
    r.get('/order-stripe', request => order(request))
    r.get('/info-stripe', request => info(request))

     // return a default message for the root route

    const resp = await r.route(request)
    return resp
}

async function handleEvent(event) {
  const url = new URL(event.request.url)
  let options = {}

  /**
   * You can add custom logic to how we fetch your assets
   * by configuring the function `mapRequestToAsset`
   */
  // options.mapRequestToAsset = handlePrefix(/^\/docs/)

  try {
    if (DEBUG) {
      // customize caching
      options.cacheControl = {
        bypassCache: true,
      }
    }
    return await getAssetFromKV(event, options)
  } catch (e) {
    // if an error is thrown try to serve the asset at 404.html
    if (!DEBUG) {
      try {
        let notFoundResponse = await getAssetFromKV(event, {
          mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/404.html`, req),
        })

        return new Response(notFoundResponse.body, { ...notFoundResponse, status: 404 })
      } catch (e) {}
    }

    return new Response(e.message || e.toString(), { status: 500 })
  }
}

/**
 * Here's one example of how to modify a request to
 * remove a specific prefix, in this case `/docs` from
 * the url. This can be useful if you are deploying to a
 * route on a zone, or if you only want your static content
 * to exist at a specific path.
 */
function handlePrefix(prefix) {
  return request => {
    // compute the default (e.g. / -> index.html)
    let defaultAssetKey = mapRequestToAsset(request)
    let url = new URL(defaultAssetKey.url)

    // strip the prefix from the path for lookup
    url.pathname = url.pathname.replace(prefix, '/')

    // inherit all other props from the default request
    return new Request(url.toString(), defaultAssetKey)
  }
}

/// Shipping
async function shipping({ body }) {
  const res = await updateShipping({
      stripeApiSecret: stripeApiSecret,
      body,
      verbose: true,
  })
  console.log('shipping')
  
  return new Response({
    statusCode: 200,
    body: JSON.stringify(res),
  })
}

// info
async function info({ body }) {

  const res = await submitStripeInfo({
    stripeApiSecret: stripeApiSecret,
    body,
    verbose: true,
  })
    console.log('info')
    return new Response({
      statusCode: 200,
      body: JSON.stringify(res),
    })
}

// order
async function order({ body }) {

  const res = await submitStripeOrder({
      stripeApiSecret: stripeApiSecret,
      body,
      verbose: true,
    })
  console.log('order')

  return new Response({
    statusCode: 200,
    body: JSON.stringify(res),
  })

}

/////////////////////////////////////////

async function updateShipping({ stripeApiSecret, body, verbose }) {

  if(verbose){
    
  }
  if(typeof body === `string`){
    body = JSON.parse(body)
  }


  let subtotal = body.order.amount

  console.log(`Subtotal from updateShipping ${subtotal}`)
  console.log(`body.order.shipping.address.postal_code from updateShipping ${body.order.shipping.address.postal_code}`)
  let shippingMethods = []


  let shippingOptions = [
    {
      id: `shipping-0`,
      description: `Standard Shipping`,
      value: (subtotal) => {
        if (subtotal == 3500) {
          return 0
        } 
        else if (subtotal < 1000) {
          return 549
        } 
        else if (subtotal < 3000) {
          return 749
        }
        else if (subtotal < 4500) {
          return 895
        }
        else if (subtotal < 5000) {
          return 995
        }
        else if (subtotal >= 5000) {
          return 0 //1195
        }
        // else if (subtotal > 7501) {
        // 	return 0
        // }
      },
    },
    {
      id: `shipping-1`,
      description: `Express Shipping`,
      value: (subtotal) => {
        if (subtotal < 3000) {
          return 1595
        } else if (subtotal < 4500) {
          return 1795
        } else if (subtotal < 6000) {
          return 1895
        }
        else if (subtotal < 7500) {
          return 2195
        }
        else if (subtotal < 10500) {
          return 3095
        }
        else if (subtotal < 14000) {
          return 3395
        }
        else if (subtotal < 17500) {
          return 4195
        }
        else if (subtotal < 21000) {
          return 4795
        }
        else if (subtotal < 35000) {
          return 5495
        }
        else if (subtotal < 50000) {
          return 6796
        }
        else if (subtotal < 75000) {
          return 7995
        }
        else if (subtotal <= 100000) {
          return 9695
        }
        else if (subtotal > 100000) {
          return 9695
        }
      },
      addInfo: ``,
    },
    {
      id: `shipping-2`,
      description: `Overnight Shipping`,
      value: (subtotal) => {
        if (subtotal < 3000) {
          return 2995
        } else if (subtotal < 4500) {
          return 3295
        } else if (subtotal < 6000) {
          return 3495
        }
        else if (subtotal < 7500) {
          return 3995
        }
        else if (subtotal < 10500) {
          return 5695
        }
        else if (subtotal < 14000) {
          return 5995
        }
        else if (subtotal < 17500) {
          return 7195
        }
        else if (subtotal < 21000) {
          return 8195
        }
        else if (subtotal < 35000) {
          return 8995
        }
        else if (subtotal < 50000) {
          return 10995
        }
        else if (subtotal < 75000) {
          return 12595
        }
        else if (subtotal <= 100000) {
          return 14995
        }
        else if (subtotal > 100000) {
          return 16995
        }
      },
      addInfo: ``,
    },
  ]


  shippingMethods = shippingOptions.map(option => 		
    option.value(subtotal)
    )
  let ship = JSON.parse(JSON.stringify(shippingMethods))
  let ship0 = ship[0]
  let ship1 = ship[1]
  let ship2 = ship[2]


  //	let taxRate = createTaxAPI(postalCode)
  let itemTax = Math.ceil(subtotal*.08)

  let tax0 = Math.ceil(ship0*.08)
  let tax1 = Math.ceil(ship1*.08)
  let tax2 = Math.ceil(ship2*.08)




  // const createTaxAPI = (avaCredentials, postalCode) => {
  // 	const api = create({
  // 		baseURL: 'https://sandbox-rest.avatax.com/api/v2/taxrates/',
  // 		headers: {
  // 			Authorization: `Basic ${new Buffer(avaCredentials, 'utf8').toString('base64')}`,
  // 		},
  // 	});

  // 	const getTaxRate = (postalCode) => api.get(`/bypostalcode?country=US&postalCode=${postalCode}`);

  // 	return {
  // 		getTaxRate,
  // 	};
  // };
  
  // let avatax = createTaxAPI(avaCredentials, postalCode)
  // let taxRate = JSON.parse(avatax)
  // let avaTax = fetch({
  // 	method:'get',
  // 	url: `https://sandbox-rest.avatax.com/api/v2/taxrates/bypostalcode?country=US&postalcode=${postalCode}`,
  // 	headers: {
  // 		//'Authorization': 'Basic ' + <Base64Encoded(AVALARA_ACCOUNT_ID + ':' + AVALARA_LICENSE_KEY)>
  // 		Authorization: `Basic ${new Buffer(avaCredentials, 'utf8').toString('base64')}`,

  // 	},
  //  })
  //  .then(function (response) {
  // 		console.log(response.data);
  // 	})
  // 	.catch(function (error) {
  // 		console.log(error.response.data);
  // 	});



  // Prepare response
  let response = {
    "order_update": {
      // "items": [
      //   {
      //     "parent": null,
      //     "type": "tax",
      //     "description": "Sales tax",
      //     "amount": itemTax,
      //     "currency": "usd"
      //   }
      // ],
      "shipping_methods": [
        {
          "id": "shipping-0",
          "description": "Standard shipping",
          "amount": ship0,
          "currency": "usd",

          // Optional delivery estimate and tax items:
          // "tax_items": [
          //   {
          //     "parent": "priority_shipping",
          //     "type": "tax",
          //     "description": "Shipping sales taxes",
          //     "amount": tax0,
          //     "currency": "usd"
          //   }
          // ]
        },
        {
          "id": "shipping-1",
          "description": "Express shipping",
          "amount": ship1,
          "currency": "usd",

          // Optional delivery estimate and tax items:
          "tax_items": [
            {
              "parent": "express",
              "type": "tax",
              "description": "Shipping sales taxes",
              "amount": tax1,
              "currency": "usd"
            }
          ]
        },
        {
          "id": "shipping-2",
          "description": "Overnight shipping",
          "amount": ship2,
          "currency": "usd",

          // Optional delivery estimate and tax items:
          "tax_items": [
            {
              "parent": "overnight_shipping",
              "type": "tax",
              "description": "Shipping sales taxes",
              "amount": tax2,
              "currency": "usd"
            }
          ]
        },
      ]
    }
  }

  return response
}

///////////////////////////////////////////////////////

async function submitStripeInfo({ stripeApiSecret, body, verbose }) {

  if(verbose){
    console.log = console.log
    console.error = console.error
  }
  if(typeof body === `string`){
    body = JSON.parse(body)
  }


  // Create empty result object to be sent later
  let res = {
    messages: {
      error: [],
    },
    modifications: [],
    meta: {},
  }
  // Create stripe customer

    // const customer = await stripe.customers.create(
    // 	{
    // 		email: body.customer.email,
    // 	}
    // )
  // const customerId = customer.id

  // Create stripe order
  let order
  let orderType = `order`
  try {
    const obj = {
      currency: `usd`,
      email: body.infoEmail,
      //customer: customerId,
      items: body.products.map(({ id, quantity, type }) => {
        switch (type) {

        case `plan`:
          if (!body.customer)
            throw new Error(`You must sign in to purchase this subscription.`)
          orderType = `subscription`
          return {
            customer: body.customer,
            plan: id,
            quantity,
          }
        case `sku`:		
        default:
          return {
            type: type || `sku`,
            parent: id,
            quantity,
          }
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
    }
    if (body.coupon) {
      obj.coupon = body.coupon
    }
    // Determine if we are subscribing to plans, or placing an order
    switch (orderType) {

    case `subscription`:
      order = await stripe.subscriptions.create(obj)
      break
    
    case `order`:
    default:
      order = await stripe.orders.create(obj)
      break
    }

    res.success = true
    console.log(`submitStripeInfo received from Stripe:`, order)
  }
  catch (err) {
    order = {}
    console.error(`submitStripeInfo received error from Stripe:`, err)

    // Error messages
    // Create more consumer friendly inventory error message
    if (err.code === `out_of_inventory`) {
      let item = Number(err.param
        .replace(`items[`, ``)
        .replace(`]`, ``))
      if (body.products[item]) {
        res.step = `cart`
        res.messages.error.push(`Sorry! "${body.products[item].name}" is out of stock. Please lower the quantity or remove this product from your cart.`)
        const stock = await stripe.products.retrieve(body.products[item].id)
        let quantity = 999999
        stock.skus.data.forEach(sku => { // Scan for least quantity in product
          console.log(`sku:`, sku)
          quantity = sku.inventory && sku.inventory.quantity < quantity
            ? sku.inventory.quantity
            : quantity
        })
        res.quantityModifications = [
          { id: body.products[item].id, available: quantity },
        ]
      }
    }
    else if (err.message) {
      res.messages.error.push(`The connection timed out. Please try again or contact us.`)
    }

    if (err.param === `coupon`) {
      res.step = `info`
    }
    res.success = false
  }

  // Modifications
  if (order.items) {
    order.items.forEach(({ type, parent, amount, description }) => {
      if (type === `discount` || type === `tax` || type === `shipping`) {
        res.modifications.push({
          id: type === `discount` ? parent : type,
          value: amount,
          description,
        })
      }
    })
  }


  // Get shipping
  if (order.shipping_methods) {
    res.shippingMethods = order.shipping_methods.map(({ id, amount, description }) => {
      return {
        id,
        value: amount,
        description,
      }
    })
  }

  if (order.selected_shipping_method) {
    res.selectedShippingMethod = order.selected_shipping_method
  }
  if (order.id) {
    res.meta.orderId = order.id
  }

  res = {
    ...body,
    ...res,
  }

  console.log(`submitStripeInfo returning:`, res)

  return res
}

///////////////////////////////////////
async function submitStripeOrder({ stripeApiSecret, body, verbose }) {

  if(verbose){
    console.log = console.log
    console.error = console.error
  }
  if(typeof body === `string`){
    body = JSON.parse(body)
  }

  // Validate product prices & stock here
  console.log(`submitStripeOrder received from invoke:`, body)

  // Create empty result object to be sent later
  let res = {
    messages: {
      error: [],
    },
    meta: body.meta,
  }

  // Update shipping method
  if (body.selectedShippingMethod) {
    try {
      const req = await stripe.orders.update(res.meta.orderId, {
        selected_shipping_method: body.selectedShippingMethod,
      })
      res.success = true
      console.log(`submitStripeOrder received from Stripe after updated shipping:`, req)
    }
    catch (err) {
      console.error(err)
      if (err.code === `out_of_inventory` || err.code === `resource_missing`) {
        res.step = `cart`
        res.messages.error.push(`Sorry! One or more items in your cart have gone out of stock. Please remove these products or try again later.`)
      }
      else if (err.message) {
        res.messages.error.push(err.message)
      }
      res.success = false
    }
  }

  // Pay for order
  if (res.success) {
    let req
    try {
      req = await stripe.orders.pay(res.meta.orderId, {
        email: body.infoEmail,
        source: body.payment.id,
      })
      res.success = req.status === `paid`
      console.log(`submitStripeOrder received from Stripe after order placement:`, req)
    }
    catch (err) {
      error(err)
      if (err.code === `out_of_inventory` || err.code === `resource_missing`) {
        res.step = `cart`
        res.messages.error.push(`Sorry! One or more items in your cart have gone out of stock. Please remove these products or try again later.`)
      }
      else if (err.message) {
        res.messages.error.push(err.message)
      }
      res.success = false
    }

  }

  res = {
    ...body,
    ...res,
  }

  console.log(`submitStripeOrder returning:`, res)

  return res
}
