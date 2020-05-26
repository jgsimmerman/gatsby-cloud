import Stripe from 'stripe'
import noop from '../utils/noop'
const Lightrail = require('lightrail-client');
import * as uuid from "uuid";

export default async function submitStripeOrder({ stripeApiSecret, lightrailAPIKey, body, verbose }) {
	let log = noop
	let error = noop
	if(verbose){
		log = console.log
		error = console.error
	}
	Lightrail.configure({
		apiKey: lightrailAPIKey
	})
	const stripe = Stripe(stripeApiSecret)
	if(typeof body === `string`){
		body = JSON.parse(body)
	}

	/*    Lightrail  */

	/*
		TODO
		1. Get Customers working
		2. Attach giftcards to customers
		3. Award rewards to customers
	*/
	////////////// VALUES /////////////////////////
	let valueId = "transactionTestValueId1"
	const value = await Lightrail.values.getValue(valueId);

        if (!value.body) {
            await Lightrail.values.createValue({
                id: valueId,
                code: "TRANSACTION_TEST_CODE_1",
								currency: "USD",
                usesRemaining: 100,
                balance: 500 // must be 0 for totals test
            });
				}
				
	//////////////
	const contactId = uuid.v4().substring(0,24)
	const contactParams = {
		id: contactId,
		email: body.infoEmail,
		metadata: {
			name: body.infoName
		}
	}

	const contact = await Lightrail.contacts.createContact(contactParams)
	// await Lightrail.contacts.attachContactToValue(contact, {valueId: 'cCB_PK_HSLFfGipsIIWBhl_Qef0'});

	const lineItems = body.products.map(prod => ({
		productId: prod.name,
		unitPrice: prod.price,
		quantity: prod.quantity,
		taxRate: 0,
	}))

	const ship = body.shippingMethods.find(method => method.id == body.selectedShippingMethod)


	console.log('SHIP', ship)
	const shipItem = {
		productId: ship.description,
		unitPrice: ship.value,
		variantId: ship.id
	}

	lineItems.push(shipItem)

	console.log('Lightrail lineItems: ', lineItems)
	const transactionId = uuid.v4().substring(0, 24)
	const transaction = {
		id: transactionId,
		currency: "USD",
		lineItems,
		sources: [
			{
				rail: "lightrail",
				contactId: contact.body.id,
				//contactId: '0a0fe50d-a688-4ba1-a',
				//code: "First_Test_LIGHTRAIL", 
				//valueId: '468c0bb8-5d8d25ec-44ec91c1'

			},
			{
				rail: 'stripe',
				source: 'tok_visa',// body.payment.id.toString(),
				//customer: body.meta.customerId
			},
		],
		simulate: true
	}
	console.log('SOURCES: ', transaction.sources)
	console.log('transaction in submit-stripe-order: ', transaction)

	/*     End Lightrail    */

	// Validate product prices & stock here
	//console.log(`submitStripeOrder received from invoke:`, body)
	body.transaction = transaction
	// Create empty result object to be sent later
	//console.log('BODY.META ', body.meta)
	console.log('body.payment.id ', body.payment.id)
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
			//log(`submitStripeOrder received from Stripe after updated shipping:`, req)
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

	// Pay for order
	if (res.success) {
		let req
		try {
			req = await Lightrail.transactions.checkout(transaction)

			// req = await stripe.orders.pay(res.meta.orderId, {
			// 	email: body.infoEmail,
			// 	source: body.payment.id,
			// })
			res.success //= req.status === `paid`
			//console.log(`submitStripeOrder received from Lightrail after order placement:`, req)
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

	log(`submitStripeOrder returning:`, res)

	return res
}