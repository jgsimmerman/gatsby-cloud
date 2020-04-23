import Stripe from 'stripe';

export default async function updateSku({ stripeApiSecret, body, verbose }) {
  if (verbose) {
  }
  const stripe = Stripe(stripeApiSecret);
  if (typeof body === `string`) {
    body = JSON.parse(body);
  }

  stripe.skus.update(
    'sku_GPu4z7x1Q62yja',
    { inventory: { quantity: 3, type: 'finite' } },
    function(err, sku) {
      // asynchronously called
    }
  );
}

// STRIPE-CLI

// > stripe skus update sku_GPu6Hg898ywjUZ -d "inventory[quantity]=03" -d "inventory[type]=finite"
