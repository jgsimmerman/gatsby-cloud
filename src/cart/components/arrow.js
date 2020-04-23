import React from 'react';

export default class Arrow extends React.Component {
  render() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 65.24 34.57"
        width={this.props.width}
      >
        <g>
          <polyline
            fill="none"
            stroke="#333"
            strokeMiterlimit="10"
            strokeWidth="2.76px"
            points="64.26 0.98 32.62 32.62 0.98 0.98"
          />
        </g>
      </svg>
    );
  }
}
