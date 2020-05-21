import stepState from '../state/step'
import productsState from '../state/products'
import totalsState from '../state/totals'
import metaState from '../state/meta'
import getFormValues from './get-form-values'
import clearMessages from './clear-messages'
import submitInfo from './submit-info'
import centsToDollars from './cents-to-dollars'

function getValue(id){
	const { modifications } = totalsState.state
	for (let i = modifications.length; i--;){
		if(modifications[i].id === id){
			return modifications[i].value
		}
	}
	return 0
}

export default function changeStep(step) {
	const prevStep = stepState.state.step
	const { products } = productsState.state
	const { total } = totalsState.state
	const { meta } = metaState.state
	const vals = getFormValues()

	let gtmStep = () => {
		switch(prevStep){
		case `cart`:
			return `checkout`
		default:
			return prevStep
		}
	}


	const productInfo = products.map(product => product.extra || product)
	// This may be a duplication
	const ecommerceOrderEvent = {
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
	}

	// const lightrailLineItems = products.map(prod => ({
	// 	productId: prod.name,
	// 	unitPrice: prod.price,
	// 	quantity: prod.quantity,
	// 	taxRate: 0,
	// }))
	// console.log('lightrailLineItems: ', lightrailLineItems)
	if(`dataLayer` in window){
		const data = {
			event: `zygoteStep-${gtmStep()}`,
			allProductInfo: productInfo,
			ecommerceOrderEvent,
			customer: vals,
		}

		console.log(`Step ${gtmStep()} [GTM DATA]: `, data)
		window.dataLayer.push(data)
	}

	stepState.setState({ step })
	clearMessages()
	if (step === `shipping`) {
		submitInfo()
	}

	const cartEl = document.querySelector(`.zygoteCart`)
	if (cartEl){
		cartEl.scrollTop = 0
	}
}