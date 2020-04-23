import React from 'react';
import SmallButton from '../small-button';

export default class Toggle extends React.Component {
  render() {
    return (
      <button
        className="zygoteToggle"
        onClick={this.props.onClick}
        type="button"
      >
        <SmallButton>+</SmallButton>{' '}
        <span className="zygoteToggleMsg">{this.props.children}</span>
      </button>
    );
  }
  static styles = () => ({
    '.zygoteToggle': {
      marginTop: 35,
      cursor: `pointer`,
      background: `transparent`,
      outline: `none`,
      border: 0,
      fontSize: `1em`,
      ':hover, :focus': {
        opacity: 0.6,
      },
    },
    '.zygoteToggleMsg': {
      position: `relative`,
      marginLeft: 5,
      top: -4,
      fontSize: `.85em`,
    },
  });
}
