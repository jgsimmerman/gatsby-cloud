!(function(e, t) {
  for (var r in t) e[r] = t[r];
})(
  exports,
  (function(e) {
    var t = {};
    function r(i) {
      if (t[i]) return t[i].exports;
      var s = (t[i] = { i: i, l: !1, exports: {} });
      return e[i].call(s.exports, s, s.exports, r), (s.l = !0), s.exports;
    }
    return (
      (r.m = e),
      (r.c = t),
      (r.d = function(e, t, i) {
        r.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: i });
      }),
      (r.r = function(e) {
        'undefined' != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
          Object.defineProperty(e, '__esModule', { value: !0 });
      }),
      (r.t = function(e, t) {
        if ((1 & t && (e = r(e)), 8 & t)) return e;
        if (4 & t && 'object' == typeof e && e && e.__esModule) return e;
        var i = Object.create(null);
        if (
          (r.r(i),
          Object.defineProperty(i, 'default', { enumerable: !0, value: e }),
          2 & t && 'string' != typeof e)
        )
          for (var s in e)
            r.d(
              i,
              s,
              function(t) {
                return e[t];
              }.bind(null, s)
            );
        return i;
      }),
      (r.n = function(e) {
        var t =
          e && e.__esModule
            ? function() {
                return e.default;
              }
            : function() {
                return e;
              };
        return r.d(t, 'a', t), t;
      }),
      (r.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
      }),
      (r.p = ''),
      r((r.s = 90))
    );
  })([
    function(e, t, r) {
      'use strict';
      const i = r(7),
        s = r(19),
        n = r(5),
        o = r(1),
        a = r(3),
        c = new i.Agent({ keepAlive: !0 }),
        u = new s.Agent({ keepAlive: !0 });
      (p.extend = o.protoExtend),
        (p.method = r(11)),
        (p.BASIC_METHODS = r(25)),
        (p.MAX_BUFFERED_REQUEST_METRICS = 100);
      function p(e, t) {
        if (((this._stripe = e), t))
          throw new a(
            'Support for curried url params was dropped in stripe-node v7.0.0. Instead, pass two ids.'
          );
        (this.basePath = o.makeURLInterpolator(
          this.basePath || e.getApiField('basePath')
        )),
          (this.resourcePath = this.path),
          (this.path = o.makeURLInterpolator(this.path)),
          this.includeBasic &&
            this.includeBasic.forEach(function(e) {
              this[e] = p.BASIC_METHODS[e];
            }, this),
          this.initialize(...arguments);
      }
      (p.prototype = {
        path: '',
        basePath: null,
        initialize() {},
        requestDataProcessor: null,
        validateRequest: null,
        createFullPath(e, t) {
          return n
            .join(
              this.basePath(t),
              this.path(t),
              'function' == typeof e ? e(t) : e
            )
            .replace(/\\/g, '/');
        },
        createResourcePathWithSymbols(e) {
          return '/' + n.join(this.resourcePath, e || '').replace(/\\/g, '/');
        },
        wrapTimeout: o.callbackifyPromiseWithTimeout,
        _timeoutHandler(e, t, r) {
          return () => {
            const i = new TypeError('ETIMEDOUT');
            (i.code = 'ETIMEDOUT'),
              (t._isAborted = !0),
              t.abort(),
              r.call(
                this,
                new a.StripeConnectionError({
                  message: `Request aborted due to timeout being reached (${e}ms)`,
                  detail: i,
                }),
                null
              );
          };
        },
        _responseHandler(e, t) {
          return r => {
            let i = '';
            r.setEncoding('utf8'),
              r.on('data', e => {
                i += e;
              }),
              r.once('end', () => {
                const s = r.headers || {};
                r.requestId = s['request-id'];
                const n = Date.now(),
                  c = n - e._requestStart,
                  u = o.removeNullish({
                    api_version: s['stripe-version'],
                    account: s['stripe-account'],
                    idempotency_key: s['idempotency-key'],
                    method: e._requestEvent.method,
                    path: e._requestEvent.path,
                    status: r.statusCode,
                    request_id: r.requestId,
                    elapsed: c,
                    request_start_time: e._requestStart,
                    request_end_time: n,
                  });
                this._stripe._emitter.emit('response', u);
                try {
                  if (((i = JSON.parse(i)), i.error)) {
                    let e;
                    return (
                      'string' == typeof i.error &&
                        (i.error = {
                          type: i.error,
                          message: i.error_description,
                        }),
                      (i.error.headers = s),
                      (i.error.statusCode = r.statusCode),
                      (i.error.requestId = r.requestId),
                      (e =
                        401 === r.statusCode
                          ? new a.StripeAuthenticationError(i.error)
                          : 403 === r.statusCode
                          ? new a.StripePermissionError(i.error)
                          : 429 === r.statusCode
                          ? new a.StripeRateLimitError(i.error)
                          : a.StripeError.generate(i.error)),
                      t.call(this, e, null)
                    );
                  }
                } catch (e) {
                  return t.call(
                    this,
                    new a.StripeAPIError({
                      message: 'Invalid JSON received from the Stripe API',
                      response: i,
                      exception: e,
                      requestId: s['request-id'],
                    }),
                    null
                  );
                }
                this._recordRequestMetrics(r.requestId, c),
                  Object.defineProperty(i, 'lastResponse', {
                    enumerable: !1,
                    writable: !1,
                    value: r,
                  }),
                  t.call(this, null, i);
              });
          };
        },
        _generateConnectionErrorMessage: e =>
          'An error occurred with our connection to Stripe.' +
          (e > 0 ? ` Request was retried ${e} times.` : ''),
        _errorHandler(e, t, r) {
          return i => {
            e._isAborted ||
              r.call(
                this,
                new a.StripeConnectionError({
                  message: this._generateConnectionErrorMessage(t),
                  detail: i,
                }),
                null
              );
          };
        },
        _shouldRetry: (e, t, r) =>
          !(t >= r) &&
          (!e ||
            ((!e.headers || 'false' !== e.headers['stripe-should-retry']) &&
              (!(!e.headers || 'true' !== e.headers['stripe-should-retry']) ||
                409 === e.statusCode || e.statusCode >= 500))),
        _getSleepTimeInMS(e, t = null) {
          const r = this._stripe.getInitialNetworkRetryDelay(),
            i = this._stripe.getMaxNetworkRetryDelay();
          let s = Math.min(r * Math.pow(e - 1, 2), i);
          return (
            (s *= 0.5 * (1 + Math.random())),
            (s = Math.max(r, s)),
            Number.isInteger(t) && t <= 60 && (s = Math.max(s, t)),
            1e3 * s
          );
        },
        _getMaxNetworkRetries(e = {}) {
          return e.maxNetworkRetries && Number.isInteger(e.maxNetworkRetries)
            ? e.maxNetworkRetries
            : this._stripe.getMaxNetworkRetries();
        },
        _defaultIdempotencyKey(e, t) {
          const r = this._getMaxNetworkRetries(t);
          return 'POST' === e && r > 0
            ? 'stripe-node-retry-' + o.uuid4()
            : null;
        },
        _makeHeaders(e, t, r, i, s, n, a) {
          const c = {
            Authorization: e ? 'Bearer ' + e : this._stripe.getApiField('auth'),
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': t,
            'User-Agent': this._getUserAgentString(),
            'X-Stripe-Client-User-Agent': i,
            'X-Stripe-Client-Telemetry': this._getTelemetryHeader(),
            'Stripe-Version': r,
            'Idempotency-Key': this._defaultIdempotencyKey(s, a),
          };
          return Object.assign(o.removeNullish(c), o.normalizeHeaders(n));
        },
        _getUserAgentString() {
          return `Stripe/v1 NodeBindings/${this._stripe.getConstant(
            'PACKAGE_VERSION'
          )} ${
            this._stripe._appInfo ? this._stripe.getAppInfoAsString() : ''
          }`.trim();
        },
        _getTelemetryHeader() {
          if (
            this._stripe.getTelemetryEnabled() &&
            this._stripe._prevRequestMetrics.length > 0
          ) {
            const e = this._stripe._prevRequestMetrics.shift();
            return JSON.stringify({ last_request_metrics: e });
          }
        },
        _recordRequestMetrics(e, t) {
          this._stripe.getTelemetryEnabled() &&
            e &&
            (this._stripe._prevRequestMetrics.length >
            p.MAX_BUFFERED_REQUEST_METRICS
              ? o.emitWarning(
                  'Request metrics buffer is full, dropping telemetry message.'
                )
              : this._stripe._prevRequestMetrics.push({
                  request_id: e,
                  request_duration_ms: t,
                }));
        },
        _request(e, t, r, n, a, p = {}, l) {
          let d;
          const h = (e, t, r, i, s) =>
              setTimeout(e, this._getSleepTimeInMS(i, s), t, r, i + 1),
            m = (n, a, f) => {
              const g =
                  p.settings &&
                  Number.isInteger(p.settings.timeout) &&
                  p.settings.timeout >= 0
                    ? p.settings.timeout
                    : this._stripe.getApiField('timeout'),
                y = 'http' == this._stripe.getApiField('protocol');
              let x = this._stripe.getApiField('agent');
              null == x && (x = y ? c : u);
              const _ = (y ? i : s).request({
                  host: t || this._stripe.getApiField('host'),
                  port: this._stripe.getApiField('port'),
                  path: r,
                  method: e,
                  agent: x,
                  headers: a,
                  ciphers: 'DEFAULT:!aNULL:!eNULL:!LOW:!EXPORT:!SSLv2:!MD5',
                }),
                v = Date.now(),
                E = o.removeNullish({
                  api_version: n,
                  account: a['Stripe-Account'],
                  idempotency_key: a['Idempotency-Key'],
                  method: e,
                  path: r,
                  request_start_time: v,
                }),
                b = f || 0,
                S = this._getMaxNetworkRetries(p.settings);
              (_._requestEvent = E),
                (_._requestStart = v),
                this._stripe._emitter.emit('request', E),
                _.setTimeout(g, this._timeoutHandler(g, _, l)),
                _.once('response', e =>
                  this._shouldRetry(e, b, S)
                    ? h(m, n, a, b, ((e || {}).headers || {})['retry-after'])
                    : this._responseHandler(_, l)(e)
                ),
                _.on('error', e =>
                  this._shouldRetry(null, b, S)
                    ? h(m, n, a, b, null)
                    : this._errorHandler(_, b, l)(e)
                ),
                _.once('socket', e => {
                  e.connecting
                    ? e.once(y ? 'connect' : 'secureConnect', () => {
                        _.write(d), _.end();
                      })
                    : (_.write(d), _.end());
                });
            },
            f = (t, r) => {
              if (t) return l(t);
              (d = r),
                this._stripe.getClientUserAgent(t => {
                  const r = this._stripe.getApiField('version'),
                    i = this._makeHeaders(
                      a,
                      d.length,
                      r,
                      t,
                      e,
                      p.headers,
                      p.settings
                    );
                  m(r, i);
                });
            };
          this.requestDataProcessor
            ? this.requestDataProcessor(e, n, p.headers, f)
            : f(null, o.stringifyRequestData(n || {}));
        },
      }),
        (e.exports = p);
    },
    function(e, t, r) {
      'use strict';
      const i = r(8).EventEmitter,
        s = r(20).exec,
        n = r(21),
        o = r(10),
        a = (e, t) => Object.prototype.hasOwnProperty.call(e, t),
        c = [
          'api_key',
          'apiKey',
          'idempotency_key',
          'idempotencyKey',
          'stripe_account',
          'stripeAccount',
          'stripe_version',
          'stripeVersion',
          'maxNetworkRetries',
          'timeout',
        ],
        u = (e.exports = {
          isOptionsHash: e => e && 'object' == typeof e && c.some(t => a(e, t)),
          stringifyRequestData: e =>
            n
              .stringify(e, {
                serializeDate: e => Math.floor(e.getTime() / 1e3),
              })
              .replace(/%5B/g, '[')
              .replace(/%5D/g, ']'),
          makeURLInterpolator: (() => {
            const e = {
              '\n': '\\n',
              '"': '\\"',
              '\u2028': '\\u2028',
              '\u2029': '\\u2029',
            };
            return t => {
              const r = t.replace(/["\n\r\u2028\u2029]/g, t => e[t]);
              return e =>
                r.replace(/\{([\s\S]+?)\}/g, (t, r) =>
                  encodeURIComponent(e[r] || '')
                );
            };
          })(),
          extractUrlParams: e => {
            const t = e.match(/\{\w+\}/g);
            return t ? t.map(e => e.replace(/[{}]/g, '')) : [];
          },
          getDataFromArgs(e) {
            if (!Array.isArray(e) || !e[0] || 'object' != typeof e[0])
              return {};
            if (!u.isOptionsHash(e[0])) return e.shift();
            const t = Object.keys(e[0]),
              r = t.filter(e => c.includes(e));
            return (
              r.length > 0 &&
                r.length !== t.length &&
                p(
                  `Options found in arguments (${r.join(
                    ', '
                  )}). Did you mean to pass an options object? See https://github.com/stripe/stripe-node/wiki/Passing-Options.`
                ),
              {}
            );
          },
          getOptionsFromArgs: e => {
            const t = { auth: null, headers: {}, settings: {} };
            if (e.length > 0) {
              const r = e[e.length - 1];
              if ('string' == typeof r) t.auth = e.pop();
              else if (u.isOptionsHash(r)) {
                const r = e.pop(),
                  i = Object.keys(r).filter(e => !c.includes(e));
                i.length &&
                  p(`Invalid options found (${i.join(', ')}); ignoring.`),
                  (r.apiKey || r.api_key) && (t.auth = r.apiKey || r.api_key),
                  (r.idempotencyKey || r.idempotency_key) &&
                    (t.headers['Idempotency-Key'] =
                      r.idempotencyKey || r.idempotency_key),
                  (r.stripeAccount || r.stripe_account) &&
                    (t.headers['Stripe-Account'] =
                      r.stripeAccount || r.stripe_account),
                  (r.stripeVersion || r.stripe_version) &&
                    (t.headers['Stripe-Version'] =
                      r.stripeVersion || r.stripe_version),
                  Number.isInteger(r.maxNetworkRetries) &&
                    (t.settings.maxNetworkRetries = r.maxNetworkRetries),
                  Number.isInteger(r.timeout) &&
                    (t.settings.timeout = r.timeout);
              }
            }
            return t;
          },
          protoExtend(e) {
            const t = this,
              r = a(e, 'constructor')
                ? e.constructor
                : function(...e) {
                    t.apply(this, e);
                  };
            return (
              Object.assign(r, t),
              (r.prototype = Object.create(t.prototype)),
              Object.assign(r.prototype, e),
              r
            );
          },
          secureCompare: (e, t) => {
            if (
              ((e = Buffer.from(e)),
              (t = Buffer.from(t)),
              e.length !== t.length)
            )
              return !1;
            if (o.timingSafeEqual) return o.timingSafeEqual(e, t);
            const r = e.length;
            let i = 0;
            for (let s = 0; s < r; ++s) i |= e[s] ^ t[s];
            return 0 === i;
          },
          removeNullish: e => {
            if ('object' != typeof e)
              throw new Error('Argument must be an object');
            return Object.keys(e).reduce(
              (t, r) => (null != e[r] && (t[r] = e[r]), t),
              {}
            );
          },
          normalizeHeaders: e =>
            e && 'object' == typeof e
              ? Object.keys(e).reduce(
                  (t, r) => ((t[u.normalizeHeader(r)] = e[r]), t),
                  {}
                )
              : e,
          normalizeHeader: e =>
            e
              .split('-')
              .map(e => e.charAt(0).toUpperCase() + e.substr(1).toLowerCase())
              .join('-'),
          checkForStream: e =>
            !(!e.file || !e.file.data) && e.file.data instanceof i,
          callbackifyPromiseWithTimeout: (e, t) =>
            t
              ? e.then(
                  e => {
                    setTimeout(() => {
                      t(null, e);
                    }, 0);
                  },
                  e => {
                    setTimeout(() => {
                      t(e, null);
                    }, 0);
                  }
                )
              : e,
          pascalToCamelCase: e =>
            'OAuth' === e ? 'oauth' : e[0].toLowerCase() + e.substring(1),
          emitWarning: p,
          safeExec: (e, t) => {
            try {
              u._exec(e, t);
            } catch (e) {
              t(e, null);
            }
          },
          _exec: s,
          isObject: e => {
            const t = typeof e;
            return ('function' === t || 'object' === t) && !!e;
          },
          flattenAndStringify: e => {
            const t = {},
              r = (e, i) => {
                Object.keys(e).forEach(s => {
                  const n = e[s],
                    o = i ? `${i}[${s}]` : s;
                  if (u.isObject(n)) {
                    if (!Buffer.isBuffer(n) && !n.hasOwnProperty('data'))
                      return r(n, o);
                    t[o] = n;
                  } else t[o] = String(n);
                });
              };
            return r(e), t;
          },
          uuid4: () =>
            'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, e => {
              const t = (16 * Math.random()) | 0;
              return ('x' === e ? t : (3 & t) | 8).toString(16);
            }),
          validateInteger: (e, t, r) => {
            if (!Number.isInteger(t)) {
              if (void 0 !== r) return r;
              throw new Error(e + ' must be an integer');
            }
            return t;
          },
        });
      function p(e) {
        return 'function' != typeof process.emitWarning
          ? console.warn('Stripe: ' + e)
          : process.emitWarning(e, 'Stripe');
      }
    },
    function(e, t, r) {
      'use strict';
      const i = r(17);
      (c.DEFAULT_HOST = 'api.stripe.com'),
        (c.DEFAULT_PORT = '443'),
        (c.DEFAULT_BASE_PATH = '/v1/'),
        (c.DEFAULT_API_VERSION = null),
        (c.DEFAULT_TIMEOUT = r(7).createServer().timeout),
        (c.PACKAGE_VERSION = r(88).version),
        (c.USER_AGENT = {
          bindings_version: c.PACKAGE_VERSION,
          lang: 'node',
          lang_version: process.version,
          platform: process.platform,
          publisher: 'stripe',
          uname: null,
        }),
        (c.USER_AGENT_SERIALIZED = null),
        (c.MAX_NETWORK_RETRY_DELAY_SEC = 2),
        (c.INITIAL_NETWORK_RETRY_DELAY_SEC = 0.5);
      const s = ['name', 'version', 'url', 'partner_id'],
        n = [
          'apiVersion',
          'maxNetworkRetries',
          'httpAgent',
          'timeout',
          'host',
          'port',
          'telemetry',
        ],
        o = r(8).EventEmitter,
        a = r(1);
      function c(e, t = {}) {
        if (!(this instanceof c)) return new c(e, t);
        const i = this._getPropsFromConfig(t);
        Object.defineProperty(this, '_emitter', {
          value: new o(),
          enumerable: !1,
          configurable: !1,
          writable: !1,
        }),
          (this.on = this._emitter.on.bind(this._emitter)),
          (this.once = this._emitter.once.bind(this._emitter)),
          (this.off = this._emitter.removeListener.bind(this._emitter)),
          (this._api = {
            auth: null,
            host: i.host || c.DEFAULT_HOST,
            port: i.port || c.DEFAULT_PORT,
            basePath: c.DEFAULT_BASE_PATH,
            version: i.apiVersion || c.DEFAULT_API_VERSION,
            timeout: a.validateInteger('timeout', i.timeout, c.DEFAULT_TIMEOUT),
            maxNetworkRetries: a.validateInteger(
              'maxNetworkRetries',
              i.maxNetworkRetries,
              0
            ),
            agent: i.httpAgent || null,
            dev: !1,
          }),
          this._prepResources(),
          this.setApiKey(e),
          (this.errors = r(3)),
          (this.webhooks = r(13)),
          (this._prevRequestMetrics = []),
          this.setTelemetryEnabled(!1 !== i.telemetry);
      }
      (c.StripeResource = r(0)),
        (c.resources = i),
        (c.errors = r(3)),
        (c.webhooks = r(13)),
        (c.prototype = {
          setHost(e, t, r) {
            this._setApiField('host', e),
              t && this.setPort(t),
              r && this.setProtocol(r);
          },
          setProtocol(e) {
            this._setApiField('protocol', e.toLowerCase());
          },
          setPort(e) {
            this._setApiField('port', e);
          },
          setApiVersion(e) {
            e && this._setApiField('version', e);
          },
          setApiKey(e) {
            e && this._setApiField('auth', 'Bearer ' + e);
          },
          setTimeout(e) {
            this._setApiField('timeout', null == e ? c.DEFAULT_TIMEOUT : e);
          },
          setAppInfo(e) {
            if (e && 'object' != typeof e)
              throw new Error('AppInfo must be an object.');
            if (e && !e.name) throw new Error('AppInfo.name is required');
            e = e || {};
            const t = s.reduce(
              (t, r) => (
                'string' == typeof e[r] && ((t = t || {})[r] = e[r]), t
              ),
              void 0
            );
            (c.USER_AGENT_SERIALIZED = void 0), (this._appInfo = t);
          },
          setHttpAgent(e) {
            this._setApiField('agent', e);
          },
          _setApiField(e, t) {
            this._api[e] = t;
          },
          getApiField(e) {
            return this._api[e];
          },
          setClientId(e) {
            this._clientId = e;
          },
          getClientId() {
            return this._clientId;
          },
          getConstant: e => c[e],
          getMaxNetworkRetries() {
            return this.getApiField('maxNetworkRetries');
          },
          setMaxNetworkRetries(e) {
            this._setApiNumberField('maxNetworkRetries', e);
          },
          _setApiNumberField(e, t, r) {
            const i = a.validateInteger(e, t, r);
            this._setApiField(e, i);
          },
          getMaxNetworkRetryDelay() {
            return this.getConstant('MAX_NETWORK_RETRY_DELAY_SEC');
          },
          getInitialNetworkRetryDelay() {
            return this.getConstant('INITIAL_NETWORK_RETRY_DELAY_SEC');
          },
          getClientUserAgent(e) {
            if (c.USER_AGENT_SERIALIZED) return e(c.USER_AGENT_SERIALIZED);
            this.getClientUserAgentSeeded(c.USER_AGENT, t => {
              (c.USER_AGENT_SERIALIZED = t), e(c.USER_AGENT_SERIALIZED);
            });
          },
          getClientUserAgentSeeded(e, t) {
            a.safeExec('uname -a', (r, i) => {
              const s = {};
              for (const t in e) s[t] = encodeURIComponent(e[t]);
              (s.uname = encodeURIComponent(i || 'UNKNOWN')),
                this._appInfo && (s.application = this._appInfo),
                t(JSON.stringify(s));
            });
          },
          getAppInfoAsString() {
            if (!this._appInfo) return '';
            let e = this._appInfo.name;
            return (
              this._appInfo.version && (e += '/' + this._appInfo.version),
              this._appInfo.url && (e += ` (${this._appInfo.url})`),
              e
            );
          },
          setTelemetryEnabled(e) {
            this._enableTelemetry = e;
          },
          getTelemetryEnabled() {
            return this._enableTelemetry;
          },
          _prepResources() {
            for (const e in i) this[a.pascalToCamelCase(e)] = new i[e](this);
          },
          _getPropsFromConfig(e) {
            if (!e) return {};
            const t = 'string' == typeof e;
            if (!(e === Object(e) && !Array.isArray(e)) && !t)
              throw new Error('Config must either be an object or a string');
            if (t) return { apiVersion: e };
            if (Object.keys(e).filter(e => !n.includes(e)).length > 0)
              throw new Error(
                'Config object may only contain the following: ' + n.join(', ')
              );
            return e;
          },
        }),
        (e.exports = c),
        (e.exports.Stripe = c);
    },
    function(e, t, r) {
      'use strict';
      const i = r(1);
      class s extends Error {
        constructor(e = {}) {
          super(e.message),
            this.populate(...arguments),
            (this.type = this.constructor.name);
        }
        populate(e) {
          (this.raw = e),
            e &&
              'object' == typeof e &&
              ((this.rawType = e.type),
              (this.code = e.code),
              (this.param = e.param),
              (this.detail = e.detail),
              (this.headers = e.headers),
              (this.requestId = e.requestId),
              (this.statusCode = e.statusCode),
              (this.message = e.message),
              (this.charge = e.charge),
              (this.decline_code = e.decline_code),
              (this.payment_intent = e.payment_intent),
              (this.payment_method = e.payment_method),
              (this.setup_intent = e.setup_intent),
              (this.source = e.source));
        }
        static generate(e) {
          switch (e.type) {
            case 'card_error':
              return new n(e);
            case 'invalid_request_error':
              return new o(e);
            case 'api_error':
              return new a(e);
            case 'idempotency_error':
              return new c(e);
            case 'invalid_grant':
              return new u(e);
            default:
              return new GenericError('Generic', 'Unknown Error');
          }
        }
        static extend(e) {
          const t = e.type;
          class r extends s {}
          return (
            Object.defineProperty(r, 'name', { value: t }),
            delete e.type,
            Object.assign(r.prototype, e),
            r
          );
        }
      }
      class n extends s {}
      class o extends s {}
      class a extends s {}
      class c extends s {}
      class u extends s {}
      function p(e) {
        this.populate(...arguments),
          (this.stack = new Error(this.message).stack);
      }
      (p.prototype = Object.create(Error.prototype)),
        (p.prototype.type = 'GenericError'),
        (p.prototype.populate = function(e, t) {
          (this.type = e), (this.message = t);
        }),
        (p.extend = i.protoExtend),
        (e.exports = p),
        (e.exports.StripeError = s),
        (e.exports.StripeCardError = n),
        (e.exports.StripeInvalidRequestError = o),
        (e.exports.StripeAPIError = a),
        (e.exports.StripeAuthenticationError = class extends s {}),
        (e.exports.StripePermissionError = class extends s {}),
        (e.exports.StripeRateLimitError = class extends s {}),
        (e.exports.StripeConnectionError = class extends s {}),
        (e.exports.StripeSignatureVerificationError = class extends s {}),
        (e.exports.StripeIdempotencyError = c),
        (e.exports.StripeInvalidGrantError = u);
    },
    function(e, t, r) {
      'use strict';
      var i = Object.prototype.hasOwnProperty,
        s = Array.isArray,
        n = (function() {
          for (var e = [], t = 0; t < 256; ++t)
            e.push('%' + ((t < 16 ? '0' : '') + t.toString(16)).toUpperCase());
          return e;
        })(),
        o = function(e, t) {
          for (
            var r = t && t.plainObjects ? Object.create(null) : {}, i = 0;
            i < e.length;
            ++i
          )
            void 0 !== e[i] && (r[i] = e[i]);
          return r;
        };
      e.exports = {
        arrayToObject: o,
        assign: function(e, t) {
          return Object.keys(t).reduce(function(e, r) {
            return (e[r] = t[r]), e;
          }, e);
        },
        combine: function(e, t) {
          return [].concat(e, t);
        },
        compact: function(e) {
          for (
            var t = [{ obj: { o: e }, prop: 'o' }], r = [], i = 0;
            i < t.length;
            ++i
          )
            for (
              var n = t[i], o = n.obj[n.prop], a = Object.keys(o), c = 0;
              c < a.length;
              ++c
            ) {
              var u = a[c],
                p = o[u];
              'object' == typeof p &&
                null !== p &&
                -1 === r.indexOf(p) &&
                (t.push({ obj: o, prop: u }), r.push(p));
            }
          return (
            (function(e) {
              for (; e.length > 1; ) {
                var t = e.pop(),
                  r = t.obj[t.prop];
                if (s(r)) {
                  for (var i = [], n = 0; n < r.length; ++n)
                    void 0 !== r[n] && i.push(r[n]);
                  t.obj[t.prop] = i;
                }
              }
            })(t),
            e
          );
        },
        decode: function(e, t, r) {
          var i = e.replace(/\+/g, ' ');
          if ('iso-8859-1' === r) return i.replace(/%[0-9a-f]{2}/gi, unescape);
          try {
            return decodeURIComponent(i);
          } catch (e) {
            return i;
          }
        },
        encode: function(e, t, r) {
          if (0 === e.length) return e;
          var i = e;
          if (
            ('symbol' == typeof e
              ? (i = Symbol.prototype.toString.call(e))
              : 'string' != typeof e && (i = String(e)),
            'iso-8859-1' === r)
          )
            return escape(i).replace(/%u[0-9a-f]{4}/gi, function(e) {
              return '%26%23' + parseInt(e.slice(2), 16) + '%3B';
            });
          for (var s = '', o = 0; o < i.length; ++o) {
            var a = i.charCodeAt(o);
            45 === a ||
            46 === a ||
            95 === a ||
            126 === a ||
            (a >= 48 && a <= 57) ||
            (a >= 65 && a <= 90) ||
            (a >= 97 && a <= 122)
              ? (s += i.charAt(o))
              : a < 128
              ? (s += n[a])
              : a < 2048
              ? (s += n[192 | (a >> 6)] + n[128 | (63 & a)])
              : a < 55296 || a >= 57344
              ? (s +=
                  n[224 | (a >> 12)] +
                  n[128 | ((a >> 6) & 63)] +
                  n[128 | (63 & a)])
              : ((o += 1),
                (a = 65536 + (((1023 & a) << 10) | (1023 & i.charCodeAt(o)))),
                (s +=
                  n[240 | (a >> 18)] +
                  n[128 | ((a >> 12) & 63)] +
                  n[128 | ((a >> 6) & 63)] +
                  n[128 | (63 & a)]));
          }
          return s;
        },
        isBuffer: function(e) {
          return (
            !(!e || 'object' != typeof e) &&
            !!(
              e.constructor &&
              e.constructor.isBuffer &&
              e.constructor.isBuffer(e)
            )
          );
        },
        isRegExp: function(e) {
          return '[object RegExp]' === Object.prototype.toString.call(e);
        },
        merge: function e(t, r, n) {
          if (!r) return t;
          if ('object' != typeof r) {
            if (s(t)) t.push(r);
            else {
              if (!t || 'object' != typeof t) return [t, r];
              ((n && (n.plainObjects || n.allowPrototypes)) ||
                !i.call(Object.prototype, r)) &&
                (t[r] = !0);
            }
            return t;
          }
          if (!t || 'object' != typeof t) return [t].concat(r);
          var a = t;
          return (
            s(t) && !s(r) && (a = o(t, n)),
            s(t) && s(r)
              ? (r.forEach(function(r, s) {
                  if (i.call(t, s)) {
                    var o = t[s];
                    o && 'object' == typeof o && r && 'object' == typeof r
                      ? (t[s] = e(o, r, n))
                      : t.push(r);
                  } else t[s] = r;
                }),
                t)
              : Object.keys(r).reduce(function(t, s) {
                  var o = r[s];
                  return i.call(t, s) ? (t[s] = e(t[s], o, n)) : (t[s] = o), t;
                }, a)
          );
        },
      };
    },
    function(e, t) {
      e.exports = require('path');
    },
    function(e, t, r) {
      'use strict';
      const i = r(0),
        s = i.method;
      e.exports = i.extend({
        path: '',
        reject: s({ method: 'POST', path: 'accounts/{account}/reject' }),
        create: s({ method: 'POST', path: 'accounts' }),
        list: s({ method: 'GET', path: 'accounts', methodType: 'list' }),
        update: s({ method: 'POST', path: 'accounts/{id}' }),
        del: s({ method: 'DELETE', path: 'accounts/{id}' }),
        retrieve(e) {
          return 'string' == typeof e
            ? s({ method: 'GET', path: 'accounts/{id}' }).apply(this, arguments)
            : (null == e && [].shift.apply(arguments),
              s({ method: 'GET', path: 'account' }).apply(this, arguments));
        },
        createLoginLink: s({
          method: 'POST',
          path: 'accounts/{account}/login_links',
        }),
        listCapabilities: s({
          method: 'GET',
          path: 'accounts/{account}/capabilities',
          methodType: 'list',
        }),
        retrieveCapability: s({
          method: 'GET',
          path: 'accounts/{account}/capabilities/{capability}',
        }),
        updateCapability: s({
          method: 'POST',
          path: 'accounts/{account}/capabilities/{capability}',
        }),
        createExternalAccount: s({
          method: 'POST',
          path: 'accounts/{account}/external_accounts',
        }),
        deleteExternalAccount: s({
          method: 'DELETE',
          path: 'accounts/{account}/external_accounts/{id}',
        }),
        listExternalAccounts: s({
          method: 'GET',
          path: 'accounts/{account}/external_accounts',
          methodType: 'list',
        }),
        retrieveExternalAccount: s({
          method: 'GET',
          path: 'accounts/{account}/external_accounts/{id}',
        }),
        updateExternalAccount: s({
          method: 'POST',
          path: 'accounts/{account}/external_accounts/{id}',
        }),
        createPerson: s({ method: 'POST', path: 'accounts/{account}/persons' }),
        deletePerson: s({
          method: 'DELETE',
          path: 'accounts/{account}/persons/{person}',
        }),
        listPersons: s({
          method: 'GET',
          path: 'accounts/{account}/persons',
          methodType: 'list',
        }),
        retrievePerson: s({
          method: 'GET',
          path: 'accounts/{account}/persons/{person}',
        }),
        updatePerson: s({
          method: 'POST',
          path: 'accounts/{account}/persons/{person}',
        }),
      });
    },
    function(e, t) {
      e.exports = require('http');
    },
    function(e, t) {
      e.exports = require('events');
    },
    function(e, t, r) {
      'use strict';
      var i = String.prototype.replace,
        s = /%20/g,
        n = r(4),
        o = { RFC1738: 'RFC1738', RFC3986: 'RFC3986' };
      e.exports = n.assign(
        {
          default: o.RFC3986,
          formatters: {
            RFC1738: function(e) {
              return i.call(e, s, '+');
            },
            RFC3986: function(e) {
              return String(e);
            },
          },
        },
        o
      );
    },
    function(e, t) {
      e.exports = require('crypto');
    },
    function(e, t, r) {
      'use strict';
      const i = r(1),
        s = r(12),
        n = r(24).makeAutoPaginationMethods;
      e.exports = function(e) {
        return function(...t) {
          const r = 'function' == typeof t[t.length - 1] && t.pop();
          e.urlParams = i.extractUrlParams(
            this.createResourcePathWithSymbols(e.path || '')
          );
          const o = i.callbackifyPromiseWithTimeout(s(this, t, e, {}), r);
          if ('list' === e.methodType) {
            const r = n(this, t, e, o);
            Object.assign(o, r);
          }
          return o;
        };
      };
    },
    function(e, t, r) {
      'use strict';
      const i = r(1);
      e.exports = function(e, t, r, s) {
        return new Promise((n, o) => {
          try {
            var a = (function(e, t, r, s) {
              const n = i.makeURLInterpolator(r.path || ''),
                o = (r.method || 'GET').toUpperCase(),
                a = r.urlParams || [],
                c = r.encode || (e => e),
                u = r.host,
                p = e.createResourcePathWithSymbols(r.path),
                l = [].slice.call(t),
                d = a.reduce((e, t) => {
                  const r = l.shift();
                  if ('string' != typeof r)
                    throw new Error(
                      `Stripe: Argument "${t}" must be a string, but got: ${r} (on API request to \`${o} ${p}\`)`
                    );
                  return (e[t] = r), e;
                }, {}),
                h = i.getDataFromArgs(l),
                m = c(Object.assign({}, h, s)),
                f = i.getOptionsFromArgs(l);
              if (l.length)
                throw new Error(
                  `Stripe: Unknown arguments (${l}). Did you mean to pass an options object? See https://github.com/stripe/stripe-node/wiki/Passing-Options. (on API request to ${o} \`${p}\`)`
                );
              const g = e.createFullPath(n, d),
                y = Object.assign(f.headers, r.headers);
              r.validator && r.validator(m, { headers: y });
              const x = 'GET' === r.method || 'DELETE' === r.method;
              return {
                requestMethod: o,
                requestPath: g,
                bodyData: x ? {} : m,
                queryData: x ? m : {},
                auth: f.auth,
                headers: y,
                host: u,
                settings: f.settings,
              };
            })(e, t, r, s);
          } catch (e) {
            return void o(e);
          }
          const c = 0 === Object.keys(a.queryData).length,
            u = [
              a.requestPath,
              c ? '' : '?',
              i.stringifyRequestData(a.queryData),
            ].join(''),
            { headers: p, settings: l } = a;
          e._request(
            a.requestMethod,
            a.host,
            u,
            a.bodyData,
            a.auth,
            { headers: p, settings: l },
            function(e, t) {
              e
                ? o(e)
                : n(r.transformResponseData ? r.transformResponseData(t) : t);
            }
          );
        });
      };
    },
    function(e, t, r) {
      'use strict';
      const i = r(10),
        s = r(1),
        n = r(3),
        o = {
          DEFAULT_TOLERANCE: 300,
          constructEvent(e, t, r, i) {
            return (
              this.signature.verifyHeader(e, t, r, i || o.DEFAULT_TOLERANCE),
              JSON.parse(e)
            );
          },
          generateTestHeaderString: function(e) {
            if (!e)
              throw new n.StripeError({ message: 'Options are required' });
            return (
              (e.timestamp =
                Math.floor(e.timestamp) || Math.floor(Date.now() / 1e3)),
              (e.scheme = e.scheme || a.EXPECTED_SCHEME),
              (e.signature =
                e.signature ||
                a._computeSignature(e.timestamp + '.' + e.payload, e.secret)),
              ['t=' + e.timestamp, e.scheme + '=' + e.signature].join(',')
            );
          },
        },
        a = {
          EXPECTED_SCHEME: 'v1',
          _computeSignature: (e, t) =>
            i
              .createHmac('sha256', t)
              .update(e, 'utf8')
              .digest('hex'),
          verifyHeader(e, t, r, i) {
            e = Buffer.isBuffer(e) ? e.toString('utf8') : e;
            const o = (function(e, t) {
              if ('string' != typeof e) return null;
              return e.split(',').reduce(
                (e, r) => {
                  const i = r.split('=');
                  return (
                    't' === i[0] && (e.timestamp = i[1]),
                    i[0] === t && e.signatures.push(i[1]),
                    e
                  );
                },
                { timestamp: -1, signatures: [] }
              );
            })(
              (t = Buffer.isBuffer(t) ? t.toString('utf8') : t),
              this.EXPECTED_SCHEME
            );
            if (!o || -1 === o.timestamp)
              throw new n.StripeSignatureVerificationError({
                message:
                  'Unable to extract timestamp and signatures from header',
                detail: { header: t, payload: e },
              });
            if (!o.signatures.length)
              throw new n.StripeSignatureVerificationError({
                message: 'No signatures found with expected scheme',
                detail: { header: t, payload: e },
              });
            const a = this._computeSignature(`${o.timestamp}.${e}`, r);
            if (!!!o.signatures.filter(s.secureCompare.bind(s, a)).length)
              throw new n.StripeSignatureVerificationError({
                message:
                  'No signatures found matching the expected signature for payload. Are you passing the raw request body you received from Stripe? https://github.com/stripe/stripe-node#webhook-signing',
                detail: { header: t, payload: e },
              });
            const c = Math.floor(Date.now() / 1e3) - o.timestamp;
            if (i > 0 && c > i)
              throw new n.StripeSignatureVerificationError({
                message: 'Timestamp outside the tolerance zone',
                detail: { header: t, payload: e },
              });
            return !0;
          },
        };
      (o.signature = a), (e.exports = o);
    },
    function(e, t, r) {
      const i = r(16),
        s = r(5);
      function n(e) {
        console.log('[dotenv][DEBUG] ' + e);
      }
      const o = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/,
        a = /\\n/g,
        c = /\n|\r|\r\n/;
      function u(e, t) {
        const r = Boolean(t && t.debug),
          i = {};
        return (
          e
            .toString()
            .split(c)
            .forEach(function(e, t) {
              const s = e.match(o);
              if (null != s) {
                const e = s[1];
                let t = s[2] || '';
                const r = t.length - 1,
                  n = '"' === t[0] && '"' === t[r];
                ("'" === t[0] && "'" === t[r]) || n
                  ? ((t = t.substring(1, r)), n && (t = t.replace(a, '\n')))
                  : (t = t.trim()),
                  (i[e] = t);
              } else r && n(`did not match key and value when parsing line ${t + 1}: ${e}`);
            }),
          i
        );
      }
      (e.exports.config = function(e) {
        let t = s.resolve(process.cwd(), '.env'),
          r = 'utf8',
          o = !1;
        e &&
          (null != e.path && (t = e.path),
          null != e.encoding && (r = e.encoding),
          null != e.debug && (o = !0));
        try {
          const e = u(i.readFileSync(t, { encoding: r }), { debug: o });
          return (
            Object.keys(e).forEach(function(t) {
              Object.prototype.hasOwnProperty.call(process.env, t)
                ? o &&
                  n(
                    `"${t}" is already defined in \`process.env\` and will not be overwritten`
                  )
                : (process.env[t] = e[t]);
            }),
            { parsed: e }
          );
        } catch (e) {
          return { error: e };
        }
      }),
        (e.exports.parse = u);
    },
    ,
    function(e, t) {
      e.exports = require('fs');
    },
    function(e, t, r) {
      'use strict';
      const i = r(18);
      e.exports = {
        Accounts: r(6),
        Account: r(6),
        AccountLinks: r(26),
        ApplePayDomains: r(27),
        ApplicationFees: r(28),
        Balance: r(29),
        BalanceTransactions: r(30),
        BitcoinReceivers: r(31),
        Charges: r(32),
        CountrySpecs: r(33),
        Coupons: r(34),
        CreditNotes: r(35),
        Customers: r(36),
        Disputes: r(37),
        EphemeralKeys: r(38),
        Events: r(39),
        ExchangeRates: r(40),
        Files: r(41),
        FileLinks: r(43),
        Invoices: r(44),
        InvoiceItems: r(45),
        IssuerFraudRecords: r(46),
        Mandates: r(47),
        OAuth: r(48),
        Orders: r(49),
        OrderReturns: r(50),
        PaymentIntents: r(51),
        PaymentMethods: r(52),
        Payouts: r(53),
        Plans: r(54),
        Products: r(55),
        Recipients: r(56),
        Refunds: r(57),
        Reviews: r(58),
        SetupIntents: r(59),
        Skus: r(60),
        Sources: r(61),
        Subscriptions: r(62),
        SubscriptionItems: r(63),
        SubscriptionSchedules: r(64),
        TaxRates: r(65),
        ThreeDSecure: r(66),
        Tokens: r(67),
        Topups: r(68),
        Transfers: r(69),
        UsageRecords: r(70),
        UsageRecordSummaries: r(71),
        WebhookEndpoints: r(72),
        Checkout: i('checkout', { Sessions: r(73) }),
        Issuing: i('issuing', {
          Authorizations: r(74),
          Cards: r(75),
          Cardholders: r(76),
          Disputes: r(77),
          Transactions: r(78),
        }),
        Radar: i('radar', {
          EarlyFraudWarnings: r(79),
          ValueLists: r(80),
          ValueListItems: r(81),
        }),
        Reporting: i('reporting', { ReportRuns: r(82), ReportTypes: r(83) }),
        Sigma: i('sigma', { ScheduledQueryRuns: r(84) }),
        Terminal: i('terminal', {
          ConnectionTokens: r(85),
          Locations: r(86),
          Readers: r(87),
        }),
      };
    },
    function(e, t, r) {
      'use strict';
      function i(e, t) {
        for (const r in t) {
          const i = r[0].toLowerCase() + r.substring(1),
            s = new t[r](e);
          this[i] = s;
        }
      }
      (e.exports = function(e, t) {
        return function(e) {
          return new i(e, t);
        };
      }),
        (e.exports.ResourceNamespace = i);
    },
    function(e, t) {
      e.exports = require('https');
    },
    function(e, t) {
      e.exports = require('child_process');
    },
    function(e, t, r) {
      'use strict';
      var i = r(22),
        s = r(23),
        n = r(9);
      e.exports = { formats: n, parse: s, stringify: i };
    },
    function(e, t, r) {
      'use strict';
      var i = r(4),
        s = r(9),
        n = Object.prototype.hasOwnProperty,
        o = {
          brackets: function(e) {
            return e + '[]';
          },
          comma: 'comma',
          indices: function(e, t) {
            return e + '[' + t + ']';
          },
          repeat: function(e) {
            return e;
          },
        },
        a = Array.isArray,
        c = Array.prototype.push,
        u = function(e, t) {
          c.apply(e, a(t) ? t : [t]);
        },
        p = Date.prototype.toISOString,
        l = s.default,
        d = {
          addQueryPrefix: !1,
          allowDots: !1,
          charset: 'utf-8',
          charsetSentinel: !1,
          delimiter: '&',
          encode: !0,
          encoder: i.encode,
          encodeValuesOnly: !1,
          format: l,
          formatter: s.formatters[l],
          indices: !1,
          serializeDate: function(e) {
            return p.call(e);
          },
          skipNulls: !1,
          strictNullHandling: !1,
        },
        h = function e(t, r, s, n, o, c, p, l, h, m, f, g, y) {
          var x,
            _ = t;
          if (
            ('function' == typeof p
              ? (_ = p(r, _))
              : _ instanceof Date
              ? (_ = m(_))
              : 'comma' === s && a(_) && (_ = _.join(',')),
            null === _)
          ) {
            if (n) return c && !g ? c(r, d.encoder, y, 'key') : r;
            _ = '';
          }
          if (
            'string' == typeof (x = _) ||
            'number' == typeof x ||
            'boolean' == typeof x ||
            'symbol' == typeof x ||
            'bigint' == typeof x ||
            i.isBuffer(_)
          )
            return c
              ? [
                  f(g ? r : c(r, d.encoder, y, 'key')) +
                    '=' +
                    f(c(_, d.encoder, y, 'value')),
                ]
              : [f(r) + '=' + f(String(_))];
          var v,
            E = [];
          if (void 0 === _) return E;
          if (a(p)) v = p;
          else {
            var b = Object.keys(_);
            v = l ? b.sort(l) : b;
          }
          for (var S = 0; S < v.length; ++S) {
            var T = v[S];
            (o && null === _[T]) ||
              (a(_)
                ? u(
                    E,
                    e(
                      _[T],
                      'function' == typeof s ? s(r, T) : r,
                      s,
                      n,
                      o,
                      c,
                      p,
                      l,
                      h,
                      m,
                      f,
                      g,
                      y
                    )
                  )
                : u(
                    E,
                    e(
                      _[T],
                      r + (h ? '.' + T : '[' + T + ']'),
                      s,
                      n,
                      o,
                      c,
                      p,
                      l,
                      h,
                      m,
                      f,
                      g,
                      y
                    )
                  ));
          }
          return E;
        };
      e.exports = function(e, t) {
        var r,
          i = e,
          c = (function(e) {
            if (!e) return d;
            if (
              null !== e.encoder &&
              void 0 !== e.encoder &&
              'function' != typeof e.encoder
            )
              throw new TypeError('Encoder has to be a function.');
            var t = e.charset || d.charset;
            if (
              void 0 !== e.charset &&
              'utf-8' !== e.charset &&
              'iso-8859-1' !== e.charset
            )
              throw new TypeError(
                'The charset option must be either utf-8, iso-8859-1, or undefined'
              );
            var r = s.default;
            if (void 0 !== e.format) {
              if (!n.call(s.formatters, e.format))
                throw new TypeError('Unknown format option provided.');
              r = e.format;
            }
            var i = s.formatters[r],
              o = d.filter;
            return (
              ('function' == typeof e.filter || a(e.filter)) && (o = e.filter),
              {
                addQueryPrefix:
                  'boolean' == typeof e.addQueryPrefix
                    ? e.addQueryPrefix
                    : d.addQueryPrefix,
                allowDots: void 0 === e.allowDots ? d.allowDots : !!e.allowDots,
                charset: t,
                charsetSentinel:
                  'boolean' == typeof e.charsetSentinel
                    ? e.charsetSentinel
                    : d.charsetSentinel,
                delimiter: void 0 === e.delimiter ? d.delimiter : e.delimiter,
                encode: 'boolean' == typeof e.encode ? e.encode : d.encode,
                encoder: 'function' == typeof e.encoder ? e.encoder : d.encoder,
                encodeValuesOnly:
                  'boolean' == typeof e.encodeValuesOnly
                    ? e.encodeValuesOnly
                    : d.encodeValuesOnly,
                filter: o,
                formatter: i,
                serializeDate:
                  'function' == typeof e.serializeDate
                    ? e.serializeDate
                    : d.serializeDate,
                skipNulls:
                  'boolean' == typeof e.skipNulls ? e.skipNulls : d.skipNulls,
                sort: 'function' == typeof e.sort ? e.sort : null,
                strictNullHandling:
                  'boolean' == typeof e.strictNullHandling
                    ? e.strictNullHandling
                    : d.strictNullHandling,
              }
            );
          })(t);
        'function' == typeof c.filter
          ? (i = (0, c.filter)('', i))
          : a(c.filter) && (r = c.filter);
        var p,
          l = [];
        if ('object' != typeof i || null === i) return '';
        p =
          t && t.arrayFormat in o
            ? t.arrayFormat
            : t && 'indices' in t
            ? t.indices
              ? 'indices'
              : 'repeat'
            : 'indices';
        var m = o[p];
        r || (r = Object.keys(i)), c.sort && r.sort(c.sort);
        for (var f = 0; f < r.length; ++f) {
          var g = r[f];
          (c.skipNulls && null === i[g]) ||
            u(
              l,
              h(
                i[g],
                g,
                m,
                c.strictNullHandling,
                c.skipNulls,
                c.encode ? c.encoder : null,
                c.filter,
                c.sort,
                c.allowDots,
                c.serializeDate,
                c.formatter,
                c.encodeValuesOnly,
                c.charset
              )
            );
        }
        var y = l.join(c.delimiter),
          x = !0 === c.addQueryPrefix ? '?' : '';
        return (
          c.charsetSentinel &&
            ('iso-8859-1' === c.charset
              ? (x += 'utf8=%26%2310003%3B&')
              : (x += 'utf8=%E2%9C%93&')),
          y.length > 0 ? x + y : ''
        );
      };
    },
    function(e, t, r) {
      'use strict';
      var i = r(4),
        s = Object.prototype.hasOwnProperty,
        n = Array.isArray,
        o = {
          allowDots: !1,
          allowPrototypes: !1,
          arrayLimit: 20,
          charset: 'utf-8',
          charsetSentinel: !1,
          comma: !1,
          decoder: i.decode,
          delimiter: '&',
          depth: 5,
          ignoreQueryPrefix: !1,
          interpretNumericEntities: !1,
          parameterLimit: 1e3,
          parseArrays: !0,
          plainObjects: !1,
          strictNullHandling: !1,
        },
        a = function(e) {
          return e.replace(/&#(\d+);/g, function(e, t) {
            return String.fromCharCode(parseInt(t, 10));
          });
        },
        c = function(e, t) {
          return e && 'string' == typeof e && t.comma && e.indexOf(',') > -1
            ? e.split(',')
            : e;
        },
        u = function(e, t) {
          if (n(e)) {
            for (var r = [], i = 0; i < e.length; i += 1) r.push(t(e[i]));
            return r;
          }
          return t(e);
        },
        p = function(e, t, r, i) {
          if (e) {
            var n = r.allowDots ? e.replace(/\.([^.[]+)/g, '[$1]') : e,
              o = /(\[[^[\]]*])/g,
              a = r.depth > 0 && /(\[[^[\]]*])/.exec(n),
              u = a ? n.slice(0, a.index) : n,
              p = [];
            if (u) {
              if (
                !r.plainObjects &&
                s.call(Object.prototype, u) &&
                !r.allowPrototypes
              )
                return;
              p.push(u);
            }
            for (
              var l = 0;
              r.depth > 0 && null !== (a = o.exec(n)) && l < r.depth;

            ) {
              if (
                ((l += 1),
                !r.plainObjects &&
                  s.call(Object.prototype, a[1].slice(1, -1)) &&
                  !r.allowPrototypes)
              )
                return;
              p.push(a[1]);
            }
            return (
              a && p.push('[' + n.slice(a.index) + ']'),
              (function(e, t, r, i) {
                for (var s = i ? t : c(t, r), n = e.length - 1; n >= 0; --n) {
                  var o,
                    a = e[n];
                  if ('[]' === a && r.parseArrays) o = [].concat(s);
                  else {
                    o = r.plainObjects ? Object.create(null) : {};
                    var u =
                        '[' === a.charAt(0) && ']' === a.charAt(a.length - 1)
                          ? a.slice(1, -1)
                          : a,
                      p = parseInt(u, 10);
                    r.parseArrays || '' !== u
                      ? !isNaN(p) &&
                        a !== u &&
                        String(p) === u &&
                        p >= 0 &&
                        r.parseArrays &&
                        p <= r.arrayLimit
                        ? ((o = [])[p] = s)
                        : (o[u] = s)
                      : (o = { 0: s });
                  }
                  s = o;
                }
                return s;
              })(p, t, r, i)
            );
          }
        };
      e.exports = function(e, t) {
        var r = (function(e) {
          if (!e) return o;
          if (
            null !== e.decoder &&
            void 0 !== e.decoder &&
            'function' != typeof e.decoder
          )
            throw new TypeError('Decoder has to be a function.');
          if (
            void 0 !== e.charset &&
            'utf-8' !== e.charset &&
            'iso-8859-1' !== e.charset
          )
            throw new TypeError(
              'The charset option must be either utf-8, iso-8859-1, or undefined'
            );
          var t = void 0 === e.charset ? o.charset : e.charset;
          return {
            allowDots: void 0 === e.allowDots ? o.allowDots : !!e.allowDots,
            allowPrototypes:
              'boolean' == typeof e.allowPrototypes
                ? e.allowPrototypes
                : o.allowPrototypes,
            arrayLimit:
              'number' == typeof e.arrayLimit ? e.arrayLimit : o.arrayLimit,
            charset: t,
            charsetSentinel:
              'boolean' == typeof e.charsetSentinel
                ? e.charsetSentinel
                : o.charsetSentinel,
            comma: 'boolean' == typeof e.comma ? e.comma : o.comma,
            decoder: 'function' == typeof e.decoder ? e.decoder : o.decoder,
            delimiter:
              'string' == typeof e.delimiter || i.isRegExp(e.delimiter)
                ? e.delimiter
                : o.delimiter,
            depth:
              'number' == typeof e.depth || !1 === e.depth ? +e.depth : o.depth,
            ignoreQueryPrefix: !0 === e.ignoreQueryPrefix,
            interpretNumericEntities:
              'boolean' == typeof e.interpretNumericEntities
                ? e.interpretNumericEntities
                : o.interpretNumericEntities,
            parameterLimit:
              'number' == typeof e.parameterLimit
                ? e.parameterLimit
                : o.parameterLimit,
            parseArrays: !1 !== e.parseArrays,
            plainObjects:
              'boolean' == typeof e.plainObjects
                ? e.plainObjects
                : o.plainObjects,
            strictNullHandling:
              'boolean' == typeof e.strictNullHandling
                ? e.strictNullHandling
                : o.strictNullHandling,
          };
        })(t);
        if ('' === e || null == e)
          return r.plainObjects ? Object.create(null) : {};
        for (
          var l =
              'string' == typeof e
                ? (function(e, t) {
                    var r,
                      p = {},
                      l = t.ignoreQueryPrefix ? e.replace(/^\?/, '') : e,
                      d =
                        t.parameterLimit === 1 / 0 ? void 0 : t.parameterLimit,
                      h = l.split(t.delimiter, d),
                      m = -1,
                      f = t.charset;
                    if (t.charsetSentinel)
                      for (r = 0; r < h.length; ++r)
                        0 === h[r].indexOf('utf8=') &&
                          ('utf8=%E2%9C%93' === h[r]
                            ? (f = 'utf-8')
                            : 'utf8=%26%2310003%3B' === h[r] &&
                              (f = 'iso-8859-1'),
                          (m = r),
                          (r = h.length));
                    for (r = 0; r < h.length; ++r)
                      if (r !== m) {
                        var g,
                          y,
                          x = h[r],
                          _ = x.indexOf(']='),
                          v = -1 === _ ? x.indexOf('=') : _ + 1;
                        -1 === v
                          ? ((g = t.decoder(x, o.decoder, f, 'key')),
                            (y = t.strictNullHandling ? null : ''))
                          : ((g = t.decoder(
                              x.slice(0, v),
                              o.decoder,
                              f,
                              'key'
                            )),
                            (y = u(c(x.slice(v + 1), t), function(e) {
                              return t.decoder(e, o.decoder, f, 'value');
                            }))),
                          y &&
                            t.interpretNumericEntities &&
                            'iso-8859-1' === f &&
                            (y = a(y)),
                          x.indexOf('[]=') > -1 && (y = n(y) ? [y] : y),
                          s.call(p, g)
                            ? (p[g] = i.combine(p[g], y))
                            : (p[g] = y);
                      }
                    return p;
                  })(e, r)
                : e,
            d = r.plainObjects ? Object.create(null) : {},
            h = Object.keys(l),
            m = 0;
          m < h.length;
          ++m
        ) {
          var f = h[m],
            g = p(f, l[f], r, 'string' == typeof e);
          d = i.merge(d, g, r);
        }
        return i.compact(d);
      };
    },
    function(e, t, r) {
      'use strict';
      const i = r(12),
        s = r(1);
      function n() {
        return 'undefined' != typeof Symbol && Symbol.asyncIterator
          ? Symbol.asyncIterator
          : '@@asyncIterator';
      }
      function o(e) {
        if (e.length < 2) return;
        const t = e[1];
        if ('function' != typeof t)
          throw Error(
            'The second argument to autoPagingEach, if present, must be a callback function; receieved ' +
              typeof t
          );
        return t;
      }
      function a(e) {
        if (0 === e.length) return;
        const t = e[0];
        if ('function' != typeof t)
          throw Error(
            'The first argument to autoPagingEach, if present, must be a callback function; receieved ' +
              typeof t
          );
        if (2 === t.length) return t;
        if (t.length > 2)
          throw Error(
            'The `onItem` callback function passed to autoPagingEach must accept at most two arguments; got ' +
              t
          );
        return function(e, r) {
          r(t(e));
        };
      }
      function c(e, t) {
        return new Promise((r, i) => {
          e()
            .then(function i(s) {
              if (s.done) return void r();
              const n = s.value;
              return new Promise(e => {
                t(n, e);
              }).then(t => (!1 === t ? i({ done: !0 }) : e().then(i)));
            })
            .catch(i);
        });
      }
      e.exports.makeAutoPaginationMethods = function(e, t, r, u) {
        const p = { currentPromise: null };
        let l = u,
          d = 0;
        function h(s) {
          if (!s || !s.data || 'number' != typeof s.data.length)
            throw Error(
              'Unexpected: Stripe API response does not have a well-formed `data` array.'
            );
          if (d < s.data.length) {
            const e = s.data[d];
            return (d += 1), { value: e, done: !1 };
          }
          if (s.has_more) {
            d = 0;
            const n = (function(e) {
              const t = e.data.length - 1,
                r = e.data[t],
                i = r && r.id;
              if (!i)
                throw Error(
                  'Unexpected: No `id` found on the last item while auto-paging a list.'
                );
              return i;
            })(s);
            return (l = i(e, t, r, { starting_after: n })), l.then(h);
          }
          return { value: void 0, done: !0 };
        }
        function m() {
          return (function(e, t) {
            if (e.currentPromise) return e.currentPromise;
            return (
              (e.currentPromise = new Promise(t).then(
                t => ((e.currentPromise = void 0), t)
              )),
              e.currentPromise
            );
          })(p, (e, t) =>
            l
              .then(h)
              .then(e)
              .catch(t)
          );
        }
        const f = (function(e) {
            return function() {
              const t = [].slice.call(arguments),
                r = a(t),
                i = o(t);
              if (t.length > 2)
                throw Error(
                  'autoPagingEach takes up to two arguments; received:',
                  t
                );
              const n = c(e, r);
              return s.callbackifyPromiseWithTimeout(n, i);
            };
          })(m),
          g = (function(e) {
            return function(t, r) {
              const i = t && t.limit;
              if (!i)
                throw Error(
                  'You must pass a `limit` option to autoPagingToArray, eg; `autoPagingToArray({limit: 1000});`.'
                );
              if (i > 1e4)
                throw Error(
                  'You cannot specify a limit of more than 10,000 items to fetch in `autoPagingToArray`; use `autoPagingEach` to iterate through longer lists.'
                );
              const n = new Promise((t, r) => {
                const s = [];
                e(e => {
                  if ((s.push(e), s.length >= i)) return !1;
                })
                  .then(() => {
                    t(s);
                  })
                  .catch(r);
              });
              return s.callbackifyPromiseWithTimeout(n, r);
            };
          })(f),
          y = {
            autoPagingEach: f,
            autoPagingToArray: g,
            next: m,
            return: () => ({}),
            [n()]: () => y,
          };
        return y;
      };
    },
    function(e, t, r) {
      'use strict';
      const i = r(11);
      e.exports = {
        create: i({ method: 'POST' }),
        list: i({ method: 'GET', methodType: 'list' }),
        retrieve: i({ method: 'GET', path: '/{id}' }),
        update: i({ method: 'POST', path: '{id}' }),
        del: i({ method: 'DELETE', path: '{id}' }),
      };
    },
    function(e, t, r) {
      'use strict';
      const i = r(0);
      e.exports = i.extend({ path: 'account_links', includeBasic: ['create'] });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0);
      e.exports = i.extend({
        path: 'apple_pay/domains',
        includeBasic: ['create', 'del', 'list', 'retrieve'],
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0),
        s = i.method;
      e.exports = i.extend({
        path: 'application_fees',
        includeBasic: ['list', 'retrieve'],
        createRefund: s({ method: 'POST', path: '/{id}/refunds' }),
        listRefunds: s({
          method: 'GET',
          path: '/{id}/refunds',
          methodType: 'list',
        }),
        retrieveRefund: s({ method: 'GET', path: '/{fee}/refunds/{id}' }),
        updateRefund: s({ method: 'POST', path: '/{fee}/refunds/{id}' }),
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0),
        s = i.method;
      e.exports = i.extend({ path: 'balance', retrieve: s({ method: 'GET' }) });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0);
      e.exports = i.extend({
        path: 'balance_transactions',
        includeBasic: ['list', 'retrieve'],
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0),
        s = i.method;
      e.exports = i.extend({
        path: 'bitcoin/receivers',
        includeBasic: ['list', 'retrieve'],
        listTransactions: s({
          method: 'GET',
          path: '/{receiver}/transactions',
          methodType: 'list',
        }),
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0),
        s = i.method;
      e.exports = i.extend({
        path: 'charges',
        includeBasic: ['create', 'list', 'retrieve', 'update'],
        capture: s({ method: 'POST', path: '/{charge}/capture' }),
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0);
      e.exports = i.extend({
        path: 'country_specs',
        includeBasic: ['list', 'retrieve'],
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0);
      e.exports = i.extend({
        path: 'coupons',
        includeBasic: ['create', 'del', 'list', 'retrieve', 'update'],
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0),
        s = i.method;
      e.exports = i.extend({
        path: 'credit_notes',
        includeBasic: ['create', 'list', 'retrieve', 'update'],
        preview: s({ method: 'GET', path: '/preview' }),
        voidCreditNote: s({ method: 'POST', path: '/{id}/void' }),
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0),
        s = i.method;
      e.exports = i.extend({
        path: 'customers',
        includeBasic: ['create', 'del', 'list', 'retrieve', 'update'],
        deleteDiscount: s({ method: 'DELETE', path: '/{customer}/discount' }),
        updateSource: s({ method: 'POST', path: '/{customer}/sources/{id}' }),
        deleteSource: s({ method: 'DELETE', path: '/{customer}/sources/{id}' }),
        verifySource: s({
          method: 'POST',
          path: '/{customer}/sources/{sourceId}/verify',
        }),
        createBalanceTransaction: s({
          method: 'POST',
          path: '/{customer}/balance_transactions',
        }),
        listBalanceTransactions: s({
          method: 'GET',
          path: '/{customer}/balance_transactions',
          methodType: 'list',
        }),
        retrieveBalanceTransaction: s({
          method: 'GET',
          path: '/{customer}/balance_transactions/{transaction}',
        }),
        updateBalanceTransaction: s({
          method: 'POST',
          path: '/{customer}/balance_transactions/{transaction}',
        }),
        createSource: s({ method: 'POST', path: '/{customer}/sources' }),
        listSources: s({
          method: 'GET',
          path: '/{customer}/sources',
          methodType: 'list',
        }),
        retrieveSource: s({ method: 'GET', path: '/{customer}/sources/{id}' }),
        createTaxId: s({ method: 'POST', path: '/{customer}/tax_ids' }),
        deleteTaxId: s({ method: 'DELETE', path: '/{customer}/tax_ids/{id}' }),
        listTaxIds: s({
          method: 'GET',
          path: '/{customer}/tax_ids',
          methodType: 'list',
        }),
        retrieveTaxId: s({ method: 'GET', path: '/{customer}/tax_ids/{id}' }),
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0),
        s = i.method;
      e.exports = i.extend({
        path: 'disputes',
        includeBasic: ['list', 'retrieve', 'update'],
        close: s({ method: 'POST', path: '/{dispute}/close' }),
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0),
        s = i.method;
      e.exports = i.extend({
        path: 'ephemeral_keys',
        includeBasic: ['del'],
        create: s({
          method: 'POST',
          validator: (e, t) => {
            if (!t.headers || !t.headers['Stripe-Version'])
              throw new Error(
                'stripe_version must be specified to create an ephemeral key'
              );
          },
        }),
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0);
      e.exports = i.extend({
        path: 'events',
        includeBasic: ['list', 'retrieve'],
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0);
      e.exports = i.extend({
        path: 'exchange_rates',
        includeBasic: ['list', 'retrieve'],
      });
    },
    function(e, t, r) {
      'use strict';
      const { multipartRequestDataProcessor: i } = r(42),
        s = r(0),
        n = s.method;
      e.exports = s.extend({
        path: 'files',
        includeBasic: ['list', 'retrieve'],
        requestDataProcessor: i,
        create: n({
          method: 'POST',
          headers: { 'Content-Type': 'multipart/form-data' },
          host: 'files.stripe.com',
        }),
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(1),
        { StripeError: s } = r(3);
      class n extends s {}
      const o = (e, t, r) => {
        const s = (
          Math.round(1e16 * Math.random()) + Math.round(1e16 * Math.random())
        ).toString();
        r['Content-Type'] = 'multipart/form-data; boundary=' + s;
        let n = Buffer.alloc(0);
        function o(e) {
          const t = n,
            r = e instanceof Buffer ? e : Buffer.from(e);
          (n = Buffer.alloc(t.length + r.length + 2)),
            t.copy(n),
            r.copy(n, t.length),
            n.write('\r\n', n.length - 2);
        }
        function a(e) {
          return `"${e.replace(/"|"/g, '%22').replace(/\r\n|\r|\n/g, ' ')}"`;
        }
        for (const e in i.flattenAndStringify(t)) {
          const r = t[e];
          o('--' + s),
            r.hasOwnProperty('data')
              ? (o(
                  `Content-Disposition: form-data; name=${a(e)}; filename=${a(
                    r.name || 'blob'
                  )}`
                ),
                o('Content-Type: ' + (r.type || 'application/octet-stream')),
                o(''),
                o(r.data))
              : (o('Content-Disposition: form-data; name=' + a(e)),
                o(''),
                o(r));
        }
        return o(`--${s}--`), n;
      };
      e.exports.multipartRequestDataProcessor = (e, t, r, s) => {
        if (((t = t || {}), 'POST' !== e))
          return s(null, i.stringifyRequestData(t));
        return i.checkForStream(t)
          ? ((e, t, r, i) => {
              const s = [];
              t.file.data
                .on('data', e => {
                  s.push(e);
                })
                .once('end', () => {
                  const e = Object.assign({}, t);
                  e.file.data = Buffer.concat(s);
                  const n = o(0, e, r);
                  i(null, n);
                })
                .on('error', e => {
                  i(
                    new n({
                      message:
                        'An error occurred while attempting to process the file for upload.',
                      detail: e,
                    }),
                    null
                  );
                });
            })(0, t, r, s)
          : s(null, o(0, t, r));
      };
    },
    function(e, t, r) {
      'use strict';
      const i = r(0);
      e.exports = i.extend({
        path: 'file_links',
        includeBasic: ['create', 'list', 'retrieve', 'update'],
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0),
        s = i.method;
      e.exports = i.extend({
        path: 'invoices',
        includeBasic: ['create', 'del', 'list', 'retrieve', 'update'],
        finalizeInvoice: s({ method: 'POST', path: '/{invoice}/finalize' }),
        markUncollectible: s({
          method: 'POST',
          path: '/{invoice}/mark_uncollectible',
        }),
        pay: s({ method: 'POST', path: '/{invoice}/pay' }),
        sendInvoice: s({ method: 'POST', path: '/{invoice}/send' }),
        voidInvoice: s({ method: 'POST', path: '/{invoice}/void' }),
        listUpcomingLineItems: s({
          method: 'GET',
          path: 'upcoming/lines',
          methodType: 'list',
        }),
        retrieveUpcoming: s({ method: 'GET', path: 'upcoming' }),
        listLineItems: s({
          method: 'GET',
          path: '/{invoice}/lines',
          methodType: 'list',
        }),
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0);
      e.exports = i.extend({
        path: 'invoiceitems',
        includeBasic: ['create', 'del', 'list', 'retrieve', 'update'],
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0);
      e.exports = i.extend({
        path: 'issuer_fraud_records',
        includeBasic: ['list', 'retrieve'],
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0);
      e.exports = i.extend({ path: 'mandates', includeBasic: ['retrieve'] });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0),
        s = i.method,
        n = r(1),
        o = 'connect.stripe.com';
      e.exports = i.extend({
        basePath: '/',
        authorizeUrl(e, t) {
          e = e || {};
          let r = 'oauth/authorize';
          return (
            (t = t || {}).express && (r = 'express/' + r),
            e.response_type || (e.response_type = 'code'),
            e.client_id || (e.client_id = this._stripe.getClientId()),
            e.scope || (e.scope = 'read_write'),
            `https://${o}/${r}?${n.stringifyRequestData(e)}`
          );
        },
        token: s({ method: 'POST', path: 'oauth/token', host: o }),
        deauthorize(e) {
          return (
            e.client_id || (e.client_id = this._stripe.getClientId()),
            s({ method: 'POST', path: 'oauth/deauthorize', host: o }).apply(
              this,
              arguments
            )
          );
        },
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0),
        s = i.method;
      e.exports = i.extend({
        path: 'orders',
        includeBasic: ['create', 'list', 'retrieve', 'update'],
        pay: s({ method: 'POST', path: '/{id}/pay' }),
        returnOrder: s({ method: 'POST', path: '/{id}/returns' }),
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0);
      e.exports = i.extend({
        path: 'order_returns',
        includeBasic: ['list', 'retrieve'],
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0),
        s = i.method;
      e.exports = i.extend({
        path: 'payment_intents',
        includeBasic: ['create', 'list', 'retrieve', 'update'],
        cancel: s({ method: 'POST', path: '/{intent}/cancel' }),
        capture: s({ method: 'POST', path: '/{intent}/capture' }),
        confirm: s({ method: 'POST', path: '/{intent}/confirm' }),
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0),
        s = i.method;
      e.exports = i.extend({
        path: 'payment_methods',
        includeBasic: ['create', 'list', 'retrieve', 'update'],
        attach: s({ method: 'POST', path: '/{paymentMethod}/attach' }),
        detach: s({ method: 'POST', path: '/{paymentMethod}/detach' }),
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0),
        s = i.method;
      e.exports = i.extend({
        path: 'payouts',
        includeBasic: ['create', 'list', 'retrieve', 'update'],
        cancel: s({ method: 'POST', path: '/{payout}/cancel' }),
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0);
      e.exports = i.extend({
        path: 'plans',
        includeBasic: ['create', 'del', 'list', 'retrieve', 'update'],
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0);
      e.exports = i.extend({
        path: 'products',
        includeBasic: ['create', 'del', 'list', 'retrieve', 'update'],
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0),
        s = i.method;
      e.exports = i.extend({
        path: 'recipients',
        includeBasic: ['create', 'del', 'list', 'retrieve', 'update'],
        createCard: s({ method: 'POST', path: '/{id}/cards' }),
        listCards: s({
          method: 'GET',
          path: '/{id}/cards',
          methodType: 'list',
        }),
        retrieveCard: s({
          method: 'GET',
          path: '/{recipientId}/cards/{cardId}',
        }),
        updateCard: s({
          method: 'POST',
          path: '/{recipientId}/cards/{cardId}',
        }),
        deleteCard: s({
          method: 'DELETE',
          path: '/{recipientId}/cards/{cardId}',
        }),
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0);
      e.exports = i.extend({
        path: 'refunds',
        includeBasic: ['create', 'list', 'retrieve', 'update'],
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0),
        s = i.method;
      e.exports = i.extend({
        path: 'reviews',
        includeBasic: ['list', 'retrieve'],
        approve: s({ method: 'POST', path: '/{review}/approve' }),
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0),
        s = i.method;
      e.exports = i.extend({
        path: 'setup_intents',
        includeBasic: ['create', 'list', 'retrieve', 'update'],
        cancel: s({ method: 'POST', path: '/{intent}/cancel' }),
        confirm: s({ method: 'POST', path: '/{intent}/confirm' }),
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0);
      e.exports = i.extend({
        path: 'skus',
        includeBasic: ['create', 'del', 'list', 'retrieve', 'update'],
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0),
        s = i.method;
      e.exports = i.extend({
        path: 'sources',
        includeBasic: ['create', 'retrieve', 'update'],
        verify: s({ method: 'POST', path: '/{source}/verify' }),
        listSourceTransactions: s({
          method: 'GET',
          path: '/{source}/source_transactions',
          methodType: 'list',
        }),
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0),
        s = i.method;
      e.exports = i.extend({
        path: 'subscriptions',
        includeBasic: ['create', 'list', 'retrieve', 'update', 'del'],
        deleteDiscount: s({
          method: 'DELETE',
          path: '/{subscriptionExposedId}/discount',
        }),
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0),
        s = i.method;
      e.exports = i.extend({
        path: 'subscription_items',
        includeBasic: ['create', 'del', 'list', 'retrieve', 'update'],
        createUsageRecord: s({
          method: 'POST',
          path: '/{subscriptionItem}/usage_records',
        }),
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0),
        s = i.method;
      e.exports = i.extend({
        path: 'subscription_schedules',
        includeBasic: ['create', 'list', 'retrieve', 'update'],
        cancel: s({ method: 'POST', path: '/{schedule}/cancel' }),
        release: s({ method: 'POST', path: '/{schedule}/release' }),
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0);
      e.exports = i.extend({
        path: 'tax_rates',
        includeBasic: ['create', 'list', 'retrieve', 'update'],
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0);
      e.exports = i.extend({
        path: '3d_secure',
        includeBasic: ['create', 'retrieve'],
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0);
      e.exports = i.extend({
        path: 'tokens',
        includeBasic: ['create', 'retrieve'],
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0),
        s = i.method;
      e.exports = i.extend({
        path: 'topups',
        includeBasic: ['create', 'list', 'retrieve', 'update'],
        cancel: s({ method: 'POST', path: '/{topup}/cancel' }),
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0),
        s = i.method;
      e.exports = i.extend({
        path: 'transfers',
        includeBasic: ['create', 'list', 'retrieve', 'update'],
        createReversal: s({ method: 'POST', path: '/{id}/reversals' }),
        listReversals: s({
          method: 'GET',
          path: '/{id}/reversals',
          methodType: 'list',
        }),
        retrieveReversal: s({
          method: 'GET',
          path: '/{transfer}/reversals/{id}',
        }),
        updateReversal: s({
          method: 'POST',
          path: '/{transfer}/reversals/{id}',
        }),
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0),
        s = i.method;
      e.exports = i.extend({
        path: 'subscription_items',
        create: s({ method: 'POST', path: '/{id}/usage_records' }),
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0),
        s = i.method;
      e.exports = i.extend({
        path: 'subscription_items',
        list: s({
          method: 'GET',
          path: '{subscriptionItem}/usage_record_summaries',
          methodType: 'list',
        }),
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0);
      e.exports = i.extend({
        path: 'webhook_endpoints',
        includeBasic: ['create', 'del', 'list', 'retrieve', 'update'],
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0);
      e.exports = i.extend({
        path: 'checkout/sessions',
        includeBasic: ['create', 'retrieve'],
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0),
        s = i.method;
      e.exports = i.extend({
        path: 'issuing/authorizations',
        includeBasic: ['list', 'retrieve', 'update'],
        approve: s({ method: 'POST', path: '/{authorization}/approve' }),
        decline: s({ method: 'POST', path: '/{authorization}/decline' }),
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0),
        s = i.method;
      e.exports = i.extend({
        path: 'issuing/cards',
        includeBasic: ['create', 'list', 'retrieve', 'update'],
        retrieveDetails: s({ method: 'GET', path: '/{card}/details' }),
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0);
      e.exports = i.extend({
        path: 'issuing/cardholders',
        includeBasic: ['create', 'list', 'retrieve', 'update'],
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0);
      e.exports = i.extend({
        path: 'issuing/disputes',
        includeBasic: ['create', 'list', 'retrieve', 'update'],
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0);
      e.exports = i.extend({
        path: 'issuing/transactions',
        includeBasic: ['list', 'retrieve', 'update'],
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0);
      e.exports = i.extend({
        path: 'radar/early_fraud_warnings',
        includeBasic: ['list', 'retrieve'],
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0);
      e.exports = i.extend({
        path: 'radar/value_lists',
        includeBasic: ['create', 'del', 'list', 'retrieve', 'update'],
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0);
      e.exports = i.extend({
        path: 'radar/value_list_items',
        includeBasic: ['create', 'del', 'list', 'retrieve'],
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0);
      e.exports = i.extend({
        path: 'reporting/report_runs',
        includeBasic: ['create', 'list', 'retrieve'],
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0);
      e.exports = i.extend({
        path: 'reporting/report_types',
        includeBasic: ['list', 'retrieve'],
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0);
      e.exports = i.extend({
        path: 'sigma/scheduled_query_runs',
        includeBasic: ['list', 'retrieve'],
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0);
      e.exports = i.extend({
        path: 'terminal/connection_tokens',
        includeBasic: ['create'],
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0);
      e.exports = i.extend({
        path: 'terminal/locations',
        includeBasic: ['create', 'del', 'list', 'retrieve', 'update'],
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0);
      e.exports = i.extend({
        path: 'terminal/readers',
        includeBasic: ['create', 'del', 'list', 'retrieve', 'update'],
      });
    },
    function(e) {
      e.exports = JSON.parse(
        '{"_from":"stripe@^7.14.0","_id":"stripe@7.15.0","_inBundle":false,"_integrity":"sha512-TmouNGv1rIU7cgw7iFKjdQueJSwYKdPRPBuO7eNjrRliZUnsf2bpJqYe+n6ByarUJr38KmhLheVUxDyRawByPQ==","_location":"/stripe","_phantomChildren":{},"_requested":{"type":"range","registry":true,"raw":"stripe@^7.14.0","name":"stripe","escapedName":"stripe","rawSpec":"^7.14.0","saveSpec":null,"fetchSpec":"^7.14.0"},"_requiredBy":["/"],"_resolved":"https://registry.npmjs.org/stripe/-/stripe-7.15.0.tgz","_shasum":"03593caec169b698997c091b07d21da701eeee18","_spec":"stripe@^7.14.0","_where":"/home/jacob/succulents/april/cart-works","author":{"name":"Stripe","email":"support@stripe.com","url":"https://stripe.com/"},"bugs":{"url":"https://github.com/stripe/stripe-node/issues"},"bugs:":"https://github.com/stripe/stripe-node/issues","bundleDependencies":false,"contributors":[{"name":"Ask Bjørn Hansen","email":"ask@develooper.com","url":"http://www.askask.com/"},{"name":"Michelle Bu","email":"michelle@stripe.com"},{"name":"Alex Sexton","email":"alex@stripe.com"},{"name":"James Padolsey"}],"dependencies":{"qs":"^6.6.0"},"deprecated":false,"description":"Stripe API wrapper","devDependencies":{"chai":"~4.2.0","chai-as-promised":"~7.1.1","coveralls":"^3.0.0","eslint":"^5.16.0","eslint-config-prettier":"^4.1.0","eslint-plugin-chai-friendly":"^0.4.0","eslint-plugin-prettier":"^3.0.1","mocha":"~6.1.4","mocha-junit-reporter":"^1.23.1","nock":"^10.0.6","nyc":"^14.1.0","prettier":"^1.16.4"},"engines":{"node":"^6 || ^8.1 || >=10.*"},"homepage":"https://github.com/stripe/stripe-node","keywords":["stripe","payment processing","credit cards","api"],"license":"MIT","main":"lib/stripe.js","name":"stripe","repository":{"type":"git","url":"git://github.com/stripe/stripe-node.git"},"scripts":{"clean":"rm -rf ./.nyc_output ./node_modules/.cache ./coverage","coveralls":"cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js","fix":"yarn lint --fix","lint":"eslint --ext .js,.jsx .","mocha":"nyc mocha","mocha-only":"mocha","report":"nyc -r text -r lcov report","test":"npm run lint && npm run mocha"},"version":"7.15.0"}'
      );
    },
    ,
    function(e, t, r) {
      'use strict';
      r.r(t),
        r.d(t, 'handler', function() {
          return c;
        });
      var i = r(14),
        s = r.n(i),
        n = r(2),
        o = r.n(n);
      s.a.config({ silent: !0 });
      const a = o()(process.env.STRIPE_API_SECRET);
      async function c({ body: e }) {
        (e = JSON.parse(e)), console.log('Received from client:', e);
        const t = { messages: { error: [] }, modifications: [], meta: {} };
        let r;
        try {
          (r = await a.orders.create({
            currency: 'usd',
            email: e.infoEmail,
            items: e.products.map(({ id: e, quantity: t, type: r }) => ({
              type: r || 'sku',
              parent: e,
              quantity: t,
            })),
            shipping: {
              name: e.infoName,
              address: {
                line1: e.shippingAddress1,
                line2: e.shippingAddress2,
                city: e.shippingCity,
                postal_code: e.shippingZip,
                country: 'US',
              },
            },
          })),
            console.log('Received from Stripe:', r);
        } catch (i) {
          if (
            ((r = {}),
            console.error('Received from Stripe:', i),
            'out_of_inventory' === i.code || 'resource_missing' === i.code)
          ) {
            let r = Number(i.param.replace('items[', '').replace(']', ''));
            e.products[r] &&
              ((t.step = 'cart'),
              t.messages.error.push(
                `Sorry! "${e.products[r].name}" is out of stock. Please lower the quantity or remove this product from your cart.`
              ));
          } else i.message && t.messages.error.push(i.message);
        }
        if (r.items)
          for (let e = r.items.length; e--; ) {
            const i = r.items[e];
            'tax' === i.type &&
              t.modifications.push({
                id: 'tax',
                value: i.amount / 100,
                description: i.description,
              });
          }
        return (
          (t.shippingMethods = [
            {
              id: 'ship1',
              description: 'Pickleball paddle, Basketball',
              shippingMethods: [
                { id: 'method1', value: 0, description: 'Standard shipping' },
                { id: 'method2', value: 5, description: 'Express shipping' },
              ],
            },
            {
              id: 'ship2',
              description: 'Crossbow',
              shippingMethods: [
                { id: 'method1', value: 0, description: 'Standard shipping' },
                { id: 'method2', value: 5, description: 'Express shipping' },
              ],
            },
          ]),
          (t.selectedShippingMethod = { ship1: 'method1', ship2: 'method1' }),
          (t.success = 200 === r.statusCode),
          r.id && (t.meta.orderId = r.id),
          console.log('Sending to client:', t),
          { statusCode: 200, body: JSON.stringify(t) }
        );
      }
    },
  ])
);
