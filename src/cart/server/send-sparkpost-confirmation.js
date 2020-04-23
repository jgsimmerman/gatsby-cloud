// import SparkPost from 'sparkpost'
// import React from 'react'
// import noop from '../utils/noop'
// import DefaultEmailTemplate from '../components/confirmation-email'
// import { renderEmail } from 'react-html-email'

// export default async function sendSparkpostConfirmation({
// 	sparkpostApiSecret,
// 	from,
// 	bcc = [],
// 	subject = `Order Confirmation`,
// 	body,
// 	logo,
// 	verbose,
// 	emailTemplate,
// }) {
// 	let log = noop
// 	let error = noop
// 	if(verbose){
// 		log = console.log
// 		error = console.error
// 	}
// 	if(typeof body === `string`){
// 		body = JSON.parse(body)
// 	}
// 	const sparkpost = new SparkPost(sparkpostApiSecret)
// 	if(typeof bcc === `string`) bcc = [ bcc ]

// 	log(`sendSparkpostConfirmation received from invoke:`, body)

// 	const html = renderEmail(
// 		emailTemplate ||
// 		<DefaultEmailTemplate
// 			{...body}
// 			logo={logo}
// 		/>
// 	)
// 	console.log(`sendSparkpostConfirmation created email template:`, html)

// 	const transmission = {
// 		content: {
// 			from,
// 			subject,
// 			html,
// 		},
// 		recipients: [
// 			{
// 				address: body.infoEmail,
// 			},
// 			...bcc.map(email => ({
// 				address: {
// 					email,
// 					header_to: body.infoEmail,
// 				},
// 			})),
// 		],
// 	}

// 	log(`sendSparkpostConfirmation sending to SparkPost:`, transmission)

// 	try {
// 		let data = await sparkpost.transmissions.send(transmission)
// 		log(`sendSparkpostConfirmation received from SparkPost:`, data)
// 	}
// 	catch(err){
// 		error(err)
// 	}

// 	return true
// }
