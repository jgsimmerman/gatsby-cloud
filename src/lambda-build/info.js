!(function(e, n) {
  for (var t in n) e[t] = n[t];
})(
  exports,
  (function(e) {
    var n = {};
    function t(i) {
      if (n[i]) return n[i].exports;
      var r = (n[i] = { i: i, l: !1, exports: {} });
      return e[i].call(r.exports, r, r.exports, t), (r.l = !0), r.exports;
    }
    return (
      (t.m = e),
      (t.c = n),
      (t.d = function(e, n, i) {
        t.o(e, n) || Object.defineProperty(e, n, { enumerable: !0, get: i });
      }),
      (t.r = function(e) {
        'undefined' != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
          Object.defineProperty(e, '__esModule', { value: !0 });
      }),
      (t.t = function(e, n) {
        if ((1 & n && (e = t(e)), 8 & n)) return e;
        if (4 & n && 'object' == typeof e && e && e.__esModule) return e;
        var i = Object.create(null);
        if (
          (t.r(i),
          Object.defineProperty(i, 'default', { enumerable: !0, value: e }),
          2 & n && 'string' != typeof e)
        )
          for (var r in e)
            t.d(
              i,
              r,
              function(n) {
                return e[n];
              }.bind(null, r)
            );
        return i;
      }),
      (t.n = function(e) {
        var n =
          e && e.__esModule
            ? function() {
                return e.default;
              }
            : function() {
                return e;
              };
        return t.d(n, 'a', n), n;
      }),
      (t.o = function(e, n) {
        return Object.prototype.hasOwnProperty.call(e, n);
      }),
      (t.p = ''),
      t((t.s = 92))
    );
  })({
    92: function(e, n, t) {
      'use strict';
      async function i({ body: e }) {
        console.log('Received from client:', JSON.parse(e));
        const n = {
          success: !0,
          modifications: [
            { id: 'january-sale', description: 'January Sale', value: -2e3 },
            { id: 'tax', description: 'Sales Tax', value: 899 },
          ],
          shippingMethods: [
            { id: 'ship-0', description: 'Standard Shipping', value: 0 },
            { id: 'ship-1', description: 'Express Shipping', value: 1150 },
            { id: 'ship-2', description: 'Overnight Shipping', value: 4999 },
          ],
          selectedShippingMethod: 'ship-0',
          quantityModifications: [
            { id: 'TESTA', available: '5' },
            { id: 'TESTB', available: '2' },
          ],
        };
        return { statusCode: 200, body: JSON.stringify(n) };
      }
      t.r(n),
        t.d(n, 'handler', function() {
          return i;
        });
    },
  })
);
