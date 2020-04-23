import React, { Fragment } from 'react';
import { Subscribe } from 'statable';
import totalsState from '../state/totals';
import LoadingAnimation from './loading-animation';
import formatUsd from '../utils/format-usd';

class TotalsList extends React.Component {
  render() {
    const { subtotal, modifications, total, loading } = this.props.totals;
    if (!total) return null;
    return (
      <Fragment>
        <li>
          <div>Subtotal</div>
          <div>{formatUsd(subtotal)}</div>
        </li>
        {loading && (
          <li>
            <LoadingAnimation />
          </li>
        )}
        {!loading && (
          <Fragment>
            {modifications.map(
              ({ description, displayValue, value }, index) => (
                <li key={`mod${index}`}>
                  <div>{description}</div>
                  <div>{displayValue || formatUsd(value)}</div>
                </li>
              )
            )}
            <li className="zygoteGrandTotal">
              <div>Total</div>
              <div>{formatUsd(total)}</div>
            </li>
          </Fragment>
        )}
      </Fragment>
    );
  }
}

export default class Totals extends React.Component {
  render() {
    const { totals } = this.props;
    return (
      <ul className="zygoteTotals">
        <Subscribe to={totalsState}>
          {totalsS => <TotalsList totals={totals ? totals : totalsS} />}
        </Subscribe>
      </ul>
    );
  }
  static styles = ({ borderColor }) => ({
    '.zygoteTotals': {
      listStyleType: `none`,
      margin: 0,
      marginTop: 30,
      marginBottom: 30,
      padding: 0,
      borderTop: `1px solid ${borderColor}`,
      li: {
        margin: `10px 0`,
        ':after': {
          content: `""`,
          display: `block`,
          clear: `both`,
        },
        '> div': {
          width: `50%`,
          float: `left`,
          ':last-of-type': {
            textAlign: `right`,
          },
        },
      },
    },
    '.zygoteGrandTotal': {
      fontWeight: `bold`,
      paddingTop: 20,
      borderTop: `1px solid ${borderColor}`,
    },
  });
}
