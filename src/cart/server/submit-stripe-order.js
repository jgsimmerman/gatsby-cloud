import Stripe from 'stripe'
import noop from '../utils/noop'
const Lightrail = require('lightrail-client');
 

export default async function submitStripeOrder({ stripeApiSecret, lightrailAPIKey, transaction, verbose }) {
	let log = noop
	let error = noop
	if(verbose){
		log = console.log
		error = console.error
	}
	const stripe = Stripe(stripeApiSecret)
	if(typeof transaction === `string`){
		transaction = JSON.parse(transaction)
	}

	Lightrail.configure({
		apiKey: lightrailAPIKey
	})

	// Validate product prices & stock here
	log(`submitStripeOrder received from invoke:`, body)

	// Create empty result object to be sent later
	// let res = {
	// 	messages: {
	// 		error: [],
	// 	},
	// 	meta: transaction.meta,
	// }

	// Update shipping method
	// if (body.selectedShippingMethod) {
	// 	try {
	// 		const req = await stripe.orders.update(res.meta.orderId, {
	// 			selected_shipping_method: body.selectedShippingMethod,
	// 		})
	// 		res.success = true
	// 		log(`submitStripeOrder received from Stripe after updated shipping:`, req)
	// 	}
	// 	catch (err) {
	// 		error(err)
	// 		if (err.code === `out_of_inventory` || err.code === `resource_missing`) {
	// 			res.step = `cart`
	// 			res.messages.error.push(`Sorry! One or more items in your cart have gone out of stock. Please remove these products or try again later.`)
	// 		}
	// 		else if (err.message) {
	// 			res.messages.error.push(err.message)
	// 		}
	// 		res.success = false
	// 	}
	// }

	// Pay for order
	//if (res.success) {
		let req
		try {
			req = await Lightrail.transactions.checkout(transaction)
			// req = await stripe.orders.pay(res.meta.orderId, {
			// 	email: body.infoEmail,
			// 	source: body.payment.id,
			// })
			//res.success = req.status === `paid`
			log(`submitStripeOrder received from Stripe after order placement:`, req)
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

	//}
	console.log('req.transaction.totals ', req.transaction.totals);
	res = {
		...transaction,
		...res,
	}

	log(`submitStripeOrder returning:`, res)

	return res
}