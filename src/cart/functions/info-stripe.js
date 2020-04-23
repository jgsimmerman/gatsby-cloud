import dotenv from 'dotenv';
import { submitStripeInfo } from '../server';
dotenv.config({ silent: true });

export async function handler({ body }) {
  const res = await submitStripeInfo({
    stripeApiSecret: process.env.STRIPE_API_SECRET,
    body,
    verbose: true,
  });

  // Response
  return {
    statusCode: 200,
    body: JSON.stringify(res),
  };
}
