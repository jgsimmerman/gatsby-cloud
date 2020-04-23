// import React from "react"
// import { graphql, StaticQuery } from "gatsby"

// export default props => (
//   <StaticQuery
//     query={graphql`
//       query SkusForProduct {
//         skus: allStripeSku {
//           edges {
//             node {
//               id
//               currency
//               price
//               attributes {
//                 name
//               }
//               inventory {
//                 quantity
//               }
//             }
//           }
//         }
//       }
//     `}

//     render={({ skus }) => (
//       <div>
//         {skus.edges.map(({ node: sku }) => (
//           <p key={sku.id}>{sku.attributes.name} - {sku.id} - {sku.inventory.quantity}</p>
//         ))}
//       </div>
//     )}
//   />
// )
