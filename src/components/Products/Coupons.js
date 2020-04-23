// import React from "react"
// import { graphql, StaticQuery } from "gatsby"

// export default props => (
//   <StaticQuery
//     query={graphql`
//       query Coupons {
//         coupons: allStripeCoupon {
//           edges{
//             node {
//               id
//               duration
//               percent_off
//               object
//             }
//           }
//         }
//       }
//     `}

//     render={({ coupons }) => (
//       <div>
//         {coupons.edges.map(({ node: coupon }) => (
//           <p key={coupon.id}>Object: {coupon.object} | Percent Off: {coupon.percent_off} | id: {coupon.id} | Duration: {coupon.duration}</p>
//         ))}
//       </div>
//     )}
//   />
// )
