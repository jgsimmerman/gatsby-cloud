import React, { Fragment } from 'react';
import ShippingMethodsList from './list';

// export default class Shipping extends React.Component {
//   render() {
//     return (
//       <Fragment>
//         {loading &&
//           <LoadingAnimation />
//         }
//         {!loading && !!methods.length && (
//           <div className='ShipMethods'>
//             <h2 className="SectionHeader">Test Shipping Options</h2>
//             {methods.length > 1 && methods[0].shippingMethods && <h3>{`This order will arrive in ${methods.length} separate shipments`}</h3>}
//             {methods[0].shippingMethods && (
//               methods.map(({
//                 id,
//                 description,
//                 shippingMethods,
//               }) => (
//                 <div key={`shippingMethodSet${id}`}>
//                   {methods.length > 1 && methods[0].shippingMethods && <div className='zygoteShipMethodsSetDesc'><span>Items from this order:</span> {description}</div>}
//                   <ShippingMethodsList
//                     setId={id}
//                     methods={shippingMethods}
//                     selected={selected[id] ? selected[id] : selected}
//                   />
//                 </div>
//               ))
//             )}
//             {!methods[0].shippingMethods && (
//               <ShippingMethodsList
//                 methods={methods}
//                 selected={selected}
//               />
//             )}
//           </div>
//         )}
//       </Fragment>
//     )
//   }

// }

export default class Shipping extends React.Component {
  render() {
    return (
      <Fragment>
        Instructions for driver:
        <textarea name="forDriver"></textarea>
        <img src="/market-tracking-pixel-52.png" />
      </Fragment>
    );
  }
}
