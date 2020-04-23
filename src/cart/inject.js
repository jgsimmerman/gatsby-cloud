import React from 'react';
import { render } from 'react-dom';

import addToCart from './utils/add-to-cart';
import toggleCart from './utils/toggle-cart';
import openCart from './utils/open-cart';
import Cart from './components';

function initZygoteButtons(e) {
  console.log(`Event: `, e);
  const dataId = e.target.dataset.id;
  const dataPrice = e.target.dataset.price;
  const dataToggle = e.target.dataset.zygoteToggle;
  if (dataToggle) {
    toggleCart();
  }
  if (dataId && dataPrice) {
    const data = e.target.dataset;
    let updated = {};
    Object.keys(data).map(k => {
      updated[k] = data[k];
    });
    if (!updated.qty) updated.qty = 1;
    addToCart(updated);
    if (data.open) {
      openCart();
    }
  }
}

function queryRender(query, component) {
  const els = document.querySelectorAll(`[data-zygote-${query}]`);
  for (let i = els.length; i--; ) {
    if (els[i].dataset.zygoteProcessed) {
      continue;
    }
    render(component, els[i]);
    els[i].dataset.zygoteProcessed = true;
  }
}

class ZygoteInject {
  constructor() {
    this.inject();
    document.addEventListener(`click`, initZygoteButtons);
  }
  componentDidMount() {
    console.log(`Zygote Mounted`);
  }
  componentWillUnmount() {
    document.removeEventListener(`click`, initZygoteButtons);
  }
  inject() {
    queryRender(`modal`, <Cart />);
  }
}

export default ZygoteInject;
