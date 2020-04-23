import React from 'react';
import { Subscribe } from 'statable';
import classNames from 'classnames';
import totalsState from '../state/totals';
import formatUsd from '../utils/format-usd';
import Arrow from './arrow';
import ProductList from './product-list';
import Totals from './totals';

export default class InfoMessages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.toggle = this.toggle.bind(this);
  }
  toggle() {
    this.setState({ open: !this.state.open });
  }
  render() {
    const { open } = this.state;
    return (
      <Subscribe to={totalsState}>
        {({ total }) => (
          <div
            className={classNames(
              `zygoteSimpleSummary`,
              open && `zygoteSimpleSummaryOpen`
            )}
          >
            <div className="zygoteSimpleSummaryHeader">
              <div>Order Summary</div>
              <div>
                <span className="zygoteSimpleSummaryTotal">
                  {formatUsd(total)}
                </span>
                <button
                  type="button"
                  className="zygoteSimpleSummaryBtn"
                  onClick={this.toggle}
                >
                  <Arrow width={20} />
                </button>
              </div>
            </div>
            <div className="zygoteSimpleSummaryList">
              <ProductList editable={true} />
              <Totals />
            </div>
          </div>
        )}
      </Subscribe>
    );
  }
  static styles = ({ altBackgroundColor, altBorderColor }) => ({
    '.zygoteSimpleSummary': {
      backgroundColor: altBackgroundColor,
      border: `1px solid ${altBorderColor}`,
      borderRight: 0,
      borderLeft: 0,
      padding: `10px 20px`,
      margin: `30px -20px`,
    },
    '.zygoteSimpleSummaryHeader': {
      display: `flex`,
      fontWeight: `bold`,
      '> div': {
        height: 20,
        minWidth: 20,
        ':nth-of-type(1)': {
          width: `70%`,
        },
        ':nth-of-type(2)': {
          width: `30%`,
          textAlign: `right`,
        },
      },
    },
    '.zygoteSimpleSummaryTotal': {
      display: `inline-block`,
      marginRight: 10,
    },
    '.zygoteSimpleSummaryBtn': {
      cursor: `pointer`,
      border: 0,
      outline: `none`,
      background: `transparent`,
      height: 22,
      padding: 0,
      margin: 0,
      ':hover, :focus': {
        opacity: 0.7,
      },
    },
    '.zygoteSimpleSummaryList': {
      display: `none`,
      paddingTop: 30,
      '.zygoteTotals': {
        marginBottom: 0,
      },
    },
    '.zygoteSimpleSummaryOpen': {
      '.zygoteSimpleSummaryTotal': {
        display: `none`,
      },
      '.zygoteSimpleSummaryBtn': {
        transform: `rotate(180deg)`,
      },
      '.zygoteSimpleSummaryList': {
        display: `block`,
      },
    },
  });
}
