import dotenv from 'dotenv';
import { submitStripeOrder, sendSparkpostConfirmation } from '../server';
dotenv.config({ silent: true });

export async function handler({ body }) {
  const res = await submitStripeOrder({
    stripeApiSecret: process.env.STRIPE_API_SECRET,
    body,
    verbose: true,
  });

  // if (res.success === true) {
  // 	await sendSparkpostConfirmation({
  // 		sparkpostApiSecret: process.env.SPARKPOST_API_SECRET,
  // 		body,
  // 		from: `noreply@escaladeinc.com`,
  // 		bcc: `krose@escaladesports.com`,
  // 		logo: `https://project-boilerplate.netlify.com/backend-logo.png`,
  // 		verbose: true,
  // 	})
  // }

  return {
    statusCode: 200,
    body: JSON.stringify(res),
  };
}
