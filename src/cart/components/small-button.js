import React from 'react';
import classNames from 'classnames';

export default class SmallButton extends React.Component {
  render() {
    const { onClick, children, secondary } = this.props;
    return (
      <div
        className={classNames(
          `zygoteSmBtn`,
          !secondary ? `zygotePrimarySmBtn` : `zygoteSecondarySmBtn`
        )}
        onClick={onClick}
      >
        <span>{children}</span>
      </div>
    );
  }
  static styles = ({ primaryColor, backgroundColor, borderColor }) => ({
    '.zygoteSmBtn': {
      display: `inline-block`,
      position: `relative`,
      width: 20,
      height: 20,
      borderRadius: `100%`,
      textAlign: `center`,
      fontWeight: `bold`,
      fontSize: 22,
      span: {
        position: `absolute`,
        marginTop: -2,
        top: `50%`,
        left: `50%`,
        transform: `translate(-50%, -50%)`,
      },
    },
    '.zygotePrimarySmBtn': {
      backgroundColor: primaryColor,
      color: backgroundColor,
    },
    '.zygoteSecondarySmBtn': {
      backgroundColor: borderColor,
      color: backgroundColor,
    },
  });
}
