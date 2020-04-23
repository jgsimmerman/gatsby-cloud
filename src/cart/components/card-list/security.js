import React from 'react';

export default class SecurityIcon extends React.Component {
  render() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 12.19 11.04"
        className="zygoteSecurityIcon"
      >
        <g id="Layer_2" data-name="Layer 2">
          <g id="Layer_1-2" data-name="Layer 1">
            <rect
              className="cls-1"
              fill="none"
              stroke="#666667"
              strokeMiterlimit="10"
              x="0.16"
              y="0.16"
              width="11.86"
              height="7.2"
              strokeWidth="0.33px"
            />
            <rect
              className="cls-2"
              x="0.16"
              y="1.55"
              width="11.86"
              height="0.72"
              fill="#bfbebe"
            />
            <rect
              className="cls-2"
              x="0.16"
              y="3.12"
              width="11.86"
              height="0.34"
              fill="#bfbebe"
            />
            <path
              className="cls-3"
              stroke="#666667"
              strokeMiterlimit="10"
              d="M8.15,9.94H4v-5a2.09,2.09,0,0,1,4.17,0ZM4.73,9.2H7.4V4.92a1.34,1.34,0,1,0-2.67,0Z"
              fill="#fff"
              strokeWidth="0.37px"
            />
            <rect
              className="cls-4"
              stroke="#666667"
              x="3.49"
              y="5.72"
              width="5.15"
              height="5.15"
              strokeMiterlimit="10"
              strokeWidth="0.33px"
              fill="#fff"
            />
            <polyline
              className="cls-5"
              fill="none"
              stroke="#666667"
              points="4.5 8.34 5.91 9.61 7.63 6.61"
              strokeMiterlimit="10"
              strokeWidth="0.65px"
            />
          </g>
        </g>
      </svg>
    );
  }
  static styles = () => ({
    '.zygoteSecurityIcon': {},
  });
}
