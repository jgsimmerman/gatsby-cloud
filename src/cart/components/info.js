import React, { Fragment } from 'react';
import { Subscribe } from 'statable';
import messagesState from '../state/status-messages';

export default class InfoMessages extends React.Component {
  render() {
    return (
      <Subscribe to={messagesState}>
        {({ info }) => (
          <Fragment>
            {info && (
              <ul className="zygoteInfo">
                {info.map((info, index) => (
                  <li key={`info${index}`}>{info}</li>
                ))}
              </ul>
            )}
          </Fragment>
        )}
      </Subscribe>
    );
  }
  static styles = () => ({
    '.zygoteInfo': {
      listStyleType: `none`,
      margin: 0,
      padding: 0,
      '> li': {
        margin: `10px 0`,
        padding: `7px 10px`,
        background: `rgba(0, 255, 0, .1)`,
        border: `1px solid rgba(0, 255, 0, .6)`,
      },
    },
  });
}
