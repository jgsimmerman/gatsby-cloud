import React from 'react';
import { IMaskMixin } from 'react-imask';

const InputMaskMixin = IMaskMixin(({ inputRef, ...props }) => {
  return <input ref={inputRef} {...props} />;
});

export default InputMaskMixin;
