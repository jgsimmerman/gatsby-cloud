import { getStateList } from '@escaladesports/us-states-lib'

import fetch from './fetch'
import stepState from '../state/step'
import settingsState from '../state/settings'
import productsState from '../state/products'
import totalsState from '../state/totals'
import errorCheck from './error-check'
import getFormValues from './get-form-values'
import clearMessages from './clear-messages'
import messagesState from '../state/status-messages'
import validateAllInput from './validate-all-input'
import displayError from './display-error'
import metaState from '../state/meta'
import shippingState from '../state/shipping'
import successState from '../state/success'
import * as uuid from "uuid";

// const Lightrail = require('lightrail');
 
// Lightrail.configure({
//   apiKey: '<LIGHTRAIL API KEY>'
// })

var table = getStateList(JSON.parse(`["all-abbrv"]`))

export default async function submitOrder(opt = {}) {
	console.log(`CALLED SUBMIT ORDER [zygote cart]`)
	const { type, token } = opt
	clearMessages()
	if (!token) {
		validateAllInput()
	}

	await timeout()

	// Check for required fields
	if (errorCheck()) return
	stepState.setState({ processing: true })

	const body = getFormValues()
	body.shippingStateAbbr = table[body.shippingState]
	body.billingStateAbbr = body.sameBilling ? body.shippingStateAbbr : table[body.billingState]

	if (type === `paypal`) {
		body.paymentType = `paypal`
		body.payment = token
	}
	else if (settingsState.state.stripeApiKey && window.zygoteStripeInstance) {
		if (token && type === `stripe`) {
			body.payment = token
		}
		else {
			// Get token from payment inputs
			const { token } = await (body.sameBilling // If shipping is the same as billing, use it instead
				? window.zygoteStripeInstance.createToken({
					name: body.infoName,
					address_line1: body.shippingAddress1,
					address_line2: body.shippingAddress2,
					address_city: body.shippingCity,
					address_state: body.shippingState,
					address_zip: body.shippingZip,
				})
				: window.zygoteStripeInstance.createToken({
					name: body.billingName,
					address_line1: body.billingAddress1,
					address_line2: body.billingAddress2,
					address_city: body.billingCity,
					address_state: body.billingState,
					address_zip: body.billingZip,
				}))
			body.payment = token
		}
		body.paymentType = `stripe`
	}
	else {
		body.paymentType = `standard`
	}

	body.products = productsState.state.products
	const lineItems = body.products.map(prod => ({
		productId: prod.name,
		unitPrice: prod.price,
		quantity: prod.quantity,
		taxRate: 0,
	}))
	console.log('Lightrail lineItems: ', lineItems)
	const transaction = {
		id: uuid.v4().substring(0, 24),
		currency: "USD",
		lineItems,
		sources: [
			{
				rail: "lightrail",
				code: "First_Test_LIGHTRAIL"
			},
			{
				rail: 'stripe',
				code: body.payment.id
			}
		]
	}


	console.log('token: ', body.payment)
	console.log('body.payment.id: ', body.payment.id)
	//console.log('Lightrail ', body.products)
	const {
		subtotal,
		modifications,
		total,
	} = totalsState.state
	body.totals = {
		subtotal,
		modifications,
		total,
	}
	body.event = `order`

	console.log(`BODY SENT TO WEBHOOK [zygote cart]: `, transaction)

	let data
	try {
		data = await fetch(settingsState.state.orderWebhook, transaction)
	}
	catch (err) {
		data = {}
		console.error(err)
	}

	console.log(`DATA FROM ORDER WEBOOK [zygote cart]: `, data)
	// if (!data.success) {
	// 	if (!messagesState.state.errors.length) {
	// 		displayError(settingsState.state.orderSubmitError)
	// 	}
	// 	if (data.returnTo) {
	// 		stepState.setState({ step: data.returnTo })
	// 	}
	// 	else {
	// 		stepState.setState({ step: `payment` })
	// 	}
	// }
	// else {
		successState.setState({
			totals: { ...totalsState.state },
			products: [...productsState.state.products],
			meta: { ...metaState.state.meta },
		})
		stepState.setState({ step: `success`, vals: {} })
		totalsState.reset()
		productsState.reset()
		metaState.reset()
		shippingState.reset()
	//}

	stepState.setState({ processing: false })
}

function timeout(n = 1) {
	return new Promise((resolve) => {
		setTimeout(resolve, n)
	})
}