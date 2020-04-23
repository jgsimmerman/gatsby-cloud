import React from 'react';
import setShipping from '../../utils/set-shipping';
import formatUsd from '../../utils/format-usd';
import Radio from '../../components/inputs/radio';
import totalsState from '../../state/totals';

export default class ShippingMethodsList extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    setShipping(e.target.value, this.props.setId);
  }
  render() {
    const { methods, selected, setId } = this.props;
    return (
      <ul className="zygoteShipList">
        {methods &&
          methods.map(({ id, description, value, addInfo }) => (
            <li key={`shipping${id}`}>
              <label className="zygoteShipLabel">
                <div>
                  <Radio
                    type="radio"
                    name={`zygoteShipping${setId || ``}`}
                    value={id}
                    checked={selected === id}
                    onChange={this.handleChange}
                  />
                </div>
                <div>
                  <div>{description}</div>
                  {addInfo && (
                    <div className="zygoteShippingAdditionalInfo">
                      {addInfo}
                    </div>
                  )}
                </div>
                <div>
                  {(typeof value === `number` ? `+` : ``) + formatUsd(value)}
                </div>
              </label>
            </li>
          ))}
      </ul>
    );
  }
  static styles = ({ primaryColor }) => ({
    '.zygoteShipList': {
      listStyleType: `none`,
      margin: 0,
      padding: 0,
      li: {
        marginTop: 10,
      },
    },
    '.zygoteShippingAdditionalInfo': {
      fontSize: `14px`,
      color: primaryColor,
      fontWeight: `bold`,
    },
    '.zygoteShipLabel': {
      display: `flex`,
      cursor: `pointer`,
      position: `relative`,
      '> div': {
        ':first-of-type': {
          width: `10%`,
        },
        ':nth-of-type(2)': {
          width: `70%`,
        },
        ':last-of-type': {
          width: `20%`,
          textAlign: `right`,
        },
      },
    },
  });
}
