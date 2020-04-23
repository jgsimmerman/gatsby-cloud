// import Stripe from "stripe";

// // const coupons = async ({ response, info, preFetchData }) => {
// const coupons = async ({ response, info, preFetchData, data }) => {
//   var stripe = require('stripe')('sk_live_');

//   let coupon = stripe.coupons.retrieve(
//       info.coupon,
//       function(err, coupon) {
//         // asynchronously called
//       }
//     );

//   //************************************** */

//   const coupons = data.coupons.edges

//   let couponObj = {
//     id: '',
//     percent_off: 0,
//     valid: false,
//   }

//   couponObj = coupons.map(({ node: coupons }) => ({
//       id: coupons.id,
//       percent_off: coupons.percent_off,
//       valid: coupons.valid,
//     })
//   );
//   console.log(couponObj);
//   //*********************************** */

//   let discount = info.subtotal * coupon.percent_off;

//   if (info.coupon) {
//       const check = {
//           code: info.coupon,
//           order: {
//               products: response.products,
//           }
//       }

//       let coupon = {
//         code: '',
//         discount: 0,
//         label: '',
//         type: '',
//       };
//       if(check.code) {
//         let couponArray = couponObj.find(obj => obj.id == check.code)
//         coupon.code = couponArray.id;
//         coupon.discount = info.subtotal*couponArray.percent_off;
//         coupon.label = couponArray.name;
//         coupon.type = couponArray.object;
//       }

//       let coupon.discount = info.subtotal * coupon.percent_off;

//     //   await fetch(`https://api.com/coupons`, { // Get packing dimensions
//     //       method: `post`,
//     //       body: JSON.stringify(check),
//     // })
//     // .then(res => res.json())
//     .then(coupon => {
//       if (coupon) {
//         if (!coupon.valid) { // Not a valid coupon
//           response.messages.info.push(
//             coupon.reason && coupon.reason.length > 0 ? `${coupon.error}. ${coupon.reason[0]}` : coupon.error
//           )
//           info.coupon = ''
//         }
//         else {
//           response.modifications.push({ // Add valid coupon to modifications array
//             id: coupon.code,
//             description: coupon.label,
//             value: coupon.discount,
//             type: coupon.type
//           })
//         }
//       }
//     })
//     .catch(error => console.log(`Request failed`, error))
//   }

//   return response
// }

// export default coupons;

// export const query = graphql`
//   query Coupons {
//     coupons: allStripeCoupon {
//       edges{
//         node {
//           id
//           duration
//           percent_off
//           object
//         }
//       }
//     }
//   }`;
