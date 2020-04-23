import dotenv from 'dotenv';
import { updateShipping, sendSparkpostConfirmation } from '../server';
dotenv.config({ silent: true });

export async function handler({ body }) {
  const res = await updateShipping({
    stripeApiSecret: process.env.STRIPE_API_SECRET,
    body,
    verbose: true,
  });

  console.log(JSON.stringify(res));

  return {
    statusCode: 200,
    body: JSON.stringify(res),
  };
}
