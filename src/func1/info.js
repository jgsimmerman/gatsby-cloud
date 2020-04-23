export async function handler({ body }) {
  console.log(`Received from client:`, JSON.parse(body));

  const response = {
    success: true,
    modifications: [
      {
        id: `january-sale`,
        description: `January Sale`,
        value: -2000,
      },
      {
        id: `tax`,
        description: `Sales Tax`,
        value: 899,
      },
    ],
    shippingMethods: [
      {
        id: `ship-0`,
        description: `Standard Shipping`,
        value: () => {
          if (totals.subtotal < 3001) {
            return 795;
          } else if (totals.subtotal < 4501) {
            return 895;
          } else if (totals.subtotal < 6001) {
            return 995;
          }
        },
      },
      {
        id: `ship-1`,
        description: `Express Shipping`,
        value: () => {
          if (totals.subtotal < 3001) {
            return 1595;
          } else if (totals.subtotal < 4501) {
            return 1795;
          } else if (totals.subtotal < 6001) {
            return 1895;
          }
        },
      },
      {
        id: `ship-2`,
        description: `Overnight Shipping`,
        value: () => {
          if (totals.subtotal < 3001) {
            return 2995;
          } else if (totals.subtotal < 4501) {
            return 3295;
          } else if (totals.subtotal < 6001) {
            return 3495;
          }
        },
      },
      {
        id: `ship-3`,
        description: `Free Shipping`,
        value: () => {
          if (totals.subtotal > 4999) {
            return 0;
          } else return `Spend $50 or more to unlock free shipping!`;
        },
      },
    ],
    selectedShippingMethod: `ship-0`,
    quantityModifications: [
      {
        id: `TESTA`,
        available: `5`,
      },
      {
        id: `TESTB`,
        available: `2`,
      },
    ],
  };

  // Response
  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
}
