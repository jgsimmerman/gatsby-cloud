import { State } from 'statable';

const defaults = {
  selected: false,
  loading: false,
  methods: [],
  address: {},
};

const shippingState = new State(
  { ...defaults },
  {
    reset() {
      this.setState({ ...defaults });
    },
  }
);

export function findShippingMethod(id) {
  const { methods } = shippingState.state;
  for (let i = methods.length; i--; ) {
    const method = methods[i];
    if (method.shippingMethods) {
      for (let i = method.shippingMethods.length; i--; ) {
        const innerMethod = method.shippingMethods[i];
        if (innerMethod.id === id) {
          return innerMethod;
        }
      }
    } else {
      if (method.id === id) {
        return method;
      }
    }
  }
  return false;
}

export default shippingState;
