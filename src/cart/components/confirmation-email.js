import React from 'react';
import { Email, Item, Image } from 'react-html-email';

export default class ConfirmationEmail extends React.Component {
  render() {
    const { logo, infoName } = this.props;
    return (
      <Email title="Hello World!">
        <Item>
          <Image src={logo} width={1000} height={278} />
        </Item>
        <Item>Hello {infoName}!</Item>
      </Email>
    );
  }
}
