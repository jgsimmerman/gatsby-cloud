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
        value: 0,
      },
      {
        id: `ship-1`,
        description: `Express Shipping`,
        value: 1150,
      },
      {
        id: `ship-2`,
        description: `Overnight Shipping`,
        value: 4999,
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
