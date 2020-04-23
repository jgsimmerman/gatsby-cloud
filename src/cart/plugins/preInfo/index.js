const preInfo = async ({ preFetchData, info }) => {
  let subtotal = info.subtotal;

  let shippingOptions = [
    {
      id: `shipping-0`,
      description: `Standard Shipping`,
      value: subtotal => {
        if (subtotal < 1000) {
          return 549;
        } else if (subtotal < 3000) {
          return 749;
        } else if (subtotal < 4500) {
          return 895;
        } else if (subtotal < 5000) {
          return 995;
        } else if (subtotal >= 5000) {
          return 0; //1195
        }
        // else if (subtotal > 7501) {
        // 	return 0
        // }
      },
    },
    {
      id: `shipping-1`,
      description: `Express Shipping`,
      value: subtotal => {
        if (subtotal < 3000) {
          return 1595;
        } else if (subtotal < 4500) {
          return 1795;
        } else if (subtotal < 6000) {
          return 1895;
        } else if (subtotal < 7500) {
          return 2195;
        } else if (subtotal < 10500) {
          return 3095;
        } else if (subtotal < 14000) {
          return 3395;
        } else if (subtotal < 17500) {
          return 4195;
        } else if (subtotal < 21000) {
          return 4795;
        } else if (subtotal < 35000) {
          return 5495;
        } else if (subtotal < 50000) {
          return 6796;
        } else if (subtotal < 75000) {
          return 7995;
        } else if (subtotal <= 100000) {
          return 9695;
        } else if (subtotal > 100000) {
          return 9695;
        }
      },
    },
    {
      id: `shipping-2`,
      description: `Overnight Shipping`,
      value: subtotal => {
        if (subtotal < 3000) {
          return 2995;
        } else if (subtotal < 4500) {
          return 3295;
        } else if (subtotal < 6000) {
          return 3495;
        } else if (subtotal < 7500) {
          return 3995;
        } else if (subtotal < 10500) {
          return 5695;
        } else if (subtotal < 14000) {
          return 5995;
        } else if (subtotal < 17500) {
          return 7195;
        } else if (subtotal < 21000) {
          return 8195;
        } else if (subtotal < 35000) {
          return 8995;
        } else if (subtotal < 50000) {
          return 10995;
        } else if (subtotal < 75000) {
          return 12595;
        } else if (subtotal <= 100000) {
          return 14995;
        } else if (subtotal > 100000) {
          return 16995;
        }
      },
    },
  ];

  info.shippingMethods = shippingOptions.map(option => ({
    id: option.id,
    description: option.description,
    value: `${option.value(subtotal)}`, //place value inside of quotes
    addInfo: `${option.addInfo}`,
  }));

  console.log(`preinfo plugin: ${shippingMethods}`);

  return {
    info,
  };
};

export default { preInfo };
