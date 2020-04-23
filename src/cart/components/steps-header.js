import React from 'react';
import classNames from 'classnames';
import { Subscribe } from 'statable';

import changeStep from '../utils/change-step';
import stepState from '../state/step';

export default class StepsHeader extends React.Component {
  render() {
    const { step } = this.props;
    return (
      <Subscribe to={stepState}>
        {({ skip }) => (
          <ul className="zygoteStepsHeader">
            <li
              role="button"
              className={classNames(
                `zygoteStepLink`,
                step === `info` && `zygoteActiveStepLink`,
                step !== `info` && `zygoteClickableStepLink`
              )}
              onClick={step === `info` ? null : () => changeStep(`info`)}
            >
              1. Details
            </li>
            {!skip.shipping && (
              <li
                role="button"
                className={classNames(
                  `zygoteStepLink`,
                  step === `shipping` && `zygoteActiveStepLink`,
                  step === `payment` && `zygoteClickableStepLink`
                )}
                onClick={
                  step === `payment` ? () => changeStep(`shipping`) : null
                }
              >
                2. Shipping
              </li>
            )}
            <li
              className={classNames(
                `zygoteStepLink`,
                step === `payment` && `zygoteActiveStepLink`
              )}
            >
              {skip.shipping ? `2.` : `3.`} Payment
            </li>
          </ul>
        )}
      </Subscribe>
    );
  }
  static styles = ({ primaryColor }) => ({
    '.zygoteStepsHeader': {
      listStyleType: `none`,
      padding: 0,
      margin: 0,
      fontWeight: `bold`,
      textAlign: `center`,
      color: `#C0BFBF`,
      fontSize: `.8em`,
    },
    '.zygoteStepLink': {
      display: `inline-block`,
      padding: 10,
      width: 100,
      borderBottom: `3px solid #C0BFBF`,
      cursor: `default !important`,
    },
    '.zygoteActiveStepLink, .zygoteClickableStepLink': {
      color: primaryColor,
      borderBottom: `3px solid ${primaryColor}`,
      cursor: `default !important`,
    },
    '.zygoteClickableStepLink': {
      cursor: `pointer !important`,
    },
  });
}
