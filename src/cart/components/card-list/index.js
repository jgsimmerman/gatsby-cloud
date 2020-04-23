import React from 'react';
import Security from './security';
import Visa from './visa';
import Mastercard from './mastercard';
import AmericanExpress from './american-express';
import Discover from './discover';

export default class CardList extends React.Component {
  render() {
    return (
      <div className="zygoteCardList">
        <div>
          <Security />
        </div>
        <div>
          <Visa />
        </div>
        <div>
          <Mastercard />
        </div>
        <div>
          <AmericanExpress />
        </div>
        <div>
          <Discover />
        </div>
      </div>
    );
  }
  static styles = () => ({
    '.zygoteCardList': {
      marginBottom: 20,
      display: `flex`,
      justifyContent: `center`,
      alignItems: `flex-start`,
      div: {
        width: 33,
        display: `inline-block`,
        margin: `0 3px`,
        ':first-of-type': {
          width: 35,
        },
      },
    },
  });
}
