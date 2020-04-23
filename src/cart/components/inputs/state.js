import React from 'react';
import Select from './select';
// import settingsState from '../../state/settings'

import { getStateList } from '@escaladesports/us-states-lib';

export default class StateInput extends React.Component {
  static defaultProps = {
    label: `State`,
    autoComplete: `address-level1`,
    required: true,
    name: `state`,
  };
  render() {
    const { label, autoComplete, required, name, step, value } = this.props;

    try {
      var states = getStateList(JSON.parse(this.props.showStates));
    } catch (e) {
      states = getStateList();
    }

    return (
      <Select
        label={label}
        required={required}
        autoComplete={autoComplete}
        name={name}
        step={step}
        value={value}
      >
        {states.map((state, index) => {
          if (state === `Hawaii` || state === `Alaska`) return null;
          return (
            <option key={`state${index}`} value={state}>
              {state}
            </option>
          );
        })}
      </Select>
    );
  }
}
