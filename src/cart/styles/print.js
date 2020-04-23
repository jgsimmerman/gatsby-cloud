const printStyles = {
  '@media print': {
    visibility: `visible`,
    '.zygoteBg, .zygoteCloseButton, .zygoteBtn': {
      display: `none`,
    },
    '.zygoteCart': {
      width: `100%`,
    },
  },
};

export default printStyles;
