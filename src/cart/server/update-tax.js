// import { create } from 'apisauce';

// let credentials = 'MjAwMDE2NzI2Mjo5OUYxNzM2OEQzMEUzMTg1'

// const getTax = () => {
//   const api = create({
//     baseURL: `https://rest.avatax.com/api/v2/taxrates/`,
//     headers: {
//       Authorization: `Basic ${credentials}`,
//     },
//   });

//   const getTaxRate = (postalCode) => api.get(`bypostalcode?country=US&postalCode=${postalcode}`);

//   return {
//     getTaxRate,
//   };
// };
// export default getTax();

// // import { create } from 'apisauce';
// // //let apisauce = require('apisauce');
// // const axios = require('axios');
// // let postalcode = 29069;
// // let rate1 = 0;

// // let taxRate = (postalcode) => axios({
// //                 url:`https://rest.avatax.com/api/v2/taxrates/bypostalcode?country=US&postalCode=${postalcode}`,
// //                 method: 'get',
// //                 headers: {'Authorization': 'Basic MjAwMDE2NzI2Mjo5OUYxNzM2OEQzMEUzMTg1'}
// //             })
// //             .then(  function (response) {
// //               // handle success
// //               console.log(`SUCCESS: `, response.data.totalRate);
// //               rate1 = response.data.totalRate
// //               return response.data.totalRate
// //             })

// // let rate2 = taxRate(postalcode)
// // //console.log(`tax rate: ${taxRate}`)
// // console.log('test' + rate2)

// // let rate3 = rate2.then((result ) => {
// //   rate1 = result
// //   console.log(`.then ${result}`)
// // })

// // console.log(`rate1 ${rate1}`)

// // let accountid = 2000167262

// // // curl -X GET -H 'Accept: application/json' -H 'Authorization: Basic MjAwMDE2NzI2Mjo5OUYxNzM2OEQzMEUzMTg1'    'https://rest.avatax.com/api/v2/taxrates/bypostalcode?country=US&postalCode=29069'

// // // {
// // //   "totalRate":0.080000,"rates":
// // //   [
// // //     {
// // //       "rate":0.060000,"name":"SC STATE TAX","type":"State"
// // //     },
// // //     {
// // //       "rate":0.010000,"name":"SC COUNTY TAX","type":"County"
// // //     },
// // //     {
// // //       "rate":0.010000,"name":"SC SPECIAL TAX","type":"Special"
// // //     }
// // //   ]
// // // }
// // /*
// //   let AVALARA_ACCOUNT_ID="2000167262"
// // 	let AVALARA_LICENSE_KEY="D303D661F7C29A84"
// //   const postalCode = body.order.shipping.address.postal_code
// // 	let taxRate = createTaxAPI(postalCode)
// // */
// // const getTax = (postalCode) => {
// //   const api = create({
// //     baseURL: 'https://sandbox-rest.avatax.com/api/v2/taxrates/',
// //     // headers: {
// //     //   'Authorization': `Basic ${new Buffer('2000167262:D303D661F7C29A84', 'utf8').toString('base64')}`,
// //     //   'Content-Type': `application/json`,
// //     // },
// //   });

// //   const getTaxRate = (postalCode) => api.get(`/bypostalcode?country=US&postalCode=${postalCode}`);

// //   return {
// //     getTaxRate,
// //   };
// // };
// // export default getTax();
