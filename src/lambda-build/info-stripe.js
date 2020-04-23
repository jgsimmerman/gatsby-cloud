!(function(e, t) {
  for (var r in t) e[r] = t[r];
})(
  exports,
  (function(e) {
    var t = {};
    function r(i) {
      if (t[i]) return t[i].exports;
      var n = (t[i] = { i: i, l: !1, exports: {} });
      return e[i].call(n.exports, n, n.exports, r), (n.l = !0), n.exports;
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
          for (var n in e)
            r.d(
              i,
              n,
              function(t) {
                return e[t];
              }.bind(null, n)
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
      r((r.s = 91))
    );
  })([
    function(e, t, r) {
      'use strict';
      const i = r(7),
        n = r(19),
        s = r(5),
        o = r(1),
        a = r(3),
        c = new i.Agent({ keepAlive: !0 }),
        u = new n.Agent({ keepAlive: !0 });
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
          return s
            .join(
              this.basePath(t),
              this.path(t),
              'function' == typeof e ? e(t) : e
            )
            .replace(/\\/g, '/');
        },
        createResourcePathWithSymbols(e) {
          return '/' + s.join(this.resourcePath, e || '').replace(/\\/g, '/');
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
                const n = r.headers || {};
                r.requestId = n['request-id'];
                const s = Date.now(),
                  c = s - e._requestStart,
                  u = o.removeNullish({
                    api_version: n['stripe-version'],
                    account: n['stripe-account'],
                    idempotency_key: n['idempotency-key'],
                    method: e._requestEvent.method,
                    path: e._requestEvent.path,
                    status: r.statusCode,
                    request_id: r.requestId,
                    elapsed: c,
                    request_start_time: e._requestStart,
                    request_end_time: s,
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
                      (i.error.headers = n),
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
                      requestId: n['request-id'],
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
          let n = Math.min(r * Math.pow(e - 1, 2), i);
          return (
            (n *= 0.5 * (1 + Math.random())),
            (n = Math.max(r, n)),
            Number.isInteger(t) && t <= 60 && (n = Math.max(n, t)),
            1e3 * n
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
        _makeHeaders(e, t, r, i, n, s, a) {
          const c = {
            Authorization: e ? 'Bearer ' + e : this._stripe.getApiField('auth'),
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': t,
            'User-Agent': this._getUserAgentString(),
            'X-Stripe-Client-User-Agent': i,
            'X-Stripe-Client-Telemetry': this._getTelemetryHeader(),
            'Stripe-Version': r,
            'Idempotency-Key': this._defaultIdempotencyKey(n, a),
          };
          return Object.assign(o.removeNullish(c), o.normalizeHeaders(s));
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
        _request(e, t, r, s, a, p = {}, d) {
          let l;
          const h = (e, t, r, i, n) =>
              setTimeout(e, this._getSleepTimeInMS(i, n), t, r, i + 1),
            m = (s, a, f) => {
              const g =
                  p.settings &&
                  Number.isInteger(p.settings.timeout) &&
                  p.settings.timeout >= 0
                    ? p.settings.timeout
                    : this._stripe.getApiField('timeout'),
                y = 'http' == this._stripe.getApiField('protocol');
              let v = this._stripe.getApiField('agent');
              null == v && (v = y ? c : u);
              const _ = (y ? i : n).request({
                  host: t || this._stripe.getApiField('host'),
                  port: this._stripe.getApiField('port'),
                  path: r,
                  method: e,
                  agent: v,
                  headers: a,
                  ciphers: 'DEFAULT:!aNULL:!eNULL:!LOW:!EXPORT:!SSLv2:!MD5',
                }),
                x = Date.now(),
                b = o.removeNullish({
                  api_version: s,
                  account: a['Stripe-Account'],
                  idempotency_key: a['Idempotency-Key'],
                  method: e,
                  path: r,
                  request_start_time: x,
                }),
                E = f || 0,
                S = this._getMaxNetworkRetries(p.settings);
              (_._requestEvent = b),
                (_._requestStart = x),
                this._stripe._emitter.emit('request', b),
                _.setTimeout(g, this._timeoutHandler(g, _, d)),
                _.once('response', e =>
                  this._shouldRetry(e, E, S)
                    ? h(m, s, a, E, ((e || {}).headers || {})['retry-after'])
                    : this._responseHandler(_, d)(e)
                ),
                _.on('error', e =>
                  this._shouldRetry(null, E, S)
                    ? h(m, s, a, E, null)
                    : this._errorHandler(_, E, d)(e)
                ),
                _.once('socket', e => {
                  e.connecting
                    ? e.once(y ? 'connect' : 'secureConnect', () => {
                        _.write(l), _.end();
                      })
                    : (_.write(l), _.end());
                });
            },
            f = (t, r) => {
              if (t) return d(t);
              (l = r),
                this._stripe.getClientUserAgent(t => {
                  const r = this._stripe.getApiField('version'),
                    i = this._makeHeaders(
                      a,
                      l.length,
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
            ? this.requestDataProcessor(e, s, p.headers, f)
            : f(null, o.stringifyRequestData(s || {}));
        },
      }),
        (e.exports = p);
    },
    function(e, t, r) {
      'use strict';
      const i = r(8).EventEmitter,
        n = r(20).exec,
        s = r(21),
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
            s
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
            for (let n = 0; n < r; ++n) i |= e[n] ^ t[n];
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
          _exec: n,
          isObject: e => {
            const t = typeof e;
            return ('function' === t || 'object' === t) && !!e;
          },
          flattenAndStringify: e => {
            const t = {},
              r = (e, i) => {
                Object.keys(e).forEach(n => {
                  const s = e[n],
                    o = i ? `${i}[${n}]` : n;
                  if (u.isObject(s)) {
                    if (!Buffer.isBuffer(s) && !s.hasOwnProperty('data'))
                      return r(s, o);
                    t[o] = s;
                  } else t[o] = String(s);
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
      const n = ['name', 'version', 'url', 'partner_id'],
        s = [
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
            const t = n.reduce(
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
              const n = {};
              for (const t in e) n[t] = encodeURIComponent(e[t]);
              (n.uname = encodeURIComponent(i || 'UNKNOWN')),
                this._appInfo && (n.application = this._appInfo),
                t(JSON.stringify(n));
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
            if (Object.keys(e).filter(e => !s.includes(e)).length > 0)
              throw new Error(
                'Config object may only contain the following: ' + s.join(', ')
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
      class n extends Error {
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
              return new s(e);
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
          class r extends n {}
          return (
            Object.defineProperty(r, 'name', { value: t }),
            delete e.type,
            Object.assign(r.prototype, e),
            r
          );
        }
      }
      class s extends n {}
      class o extends n {}
      class a extends n {}
      class c extends n {}
      class u extends n {}
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
        (e.exports.StripeError = n),
        (e.exports.StripeCardError = s),
        (e.exports.StripeInvalidRequestError = o),
        (e.exports.StripeAPIError = a),
        (e.exports.StripeAuthenticationError = class extends n {}),
        (e.exports.StripePermissionError = class extends n {}),
        (e.exports.StripeRateLimitError = class extends n {}),
        (e.exports.StripeConnectionError = class extends n {}),
        (e.exports.StripeSignatureVerificationError = class extends n {}),
        (e.exports.StripeIdempotencyError = c),
        (e.exports.StripeInvalidGrantError = u);
    },
    function(e, t, r) {
      'use strict';
      var i = Object.prototype.hasOwnProperty,
        n = Array.isArray,
        s = (function() {
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
              var s = t[i], o = s.obj[s.prop], a = Object.keys(o), c = 0;
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
                if (n(r)) {
                  for (var i = [], s = 0; s < r.length; ++s)
                    void 0 !== r[s] && i.push(r[s]);
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
          for (var n = '', o = 0; o < i.length; ++o) {
            var a = i.charCodeAt(o);
            45 === a ||
            46 === a ||
            95 === a ||
            126 === a ||
            (a >= 48 && a <= 57) ||
            (a >= 65 && a <= 90) ||
            (a >= 97 && a <= 122)
              ? (n += i.charAt(o))
              : a < 128
              ? (n += s[a])
              : a < 2048
              ? (n += s[192 | (a >> 6)] + s[128 | (63 & a)])
              : a < 55296 || a >= 57344
              ? (n +=
                  s[224 | (a >> 12)] +
                  s[128 | ((a >> 6) & 63)] +
                  s[128 | (63 & a)])
              : ((o += 1),
                (a = 65536 + (((1023 & a) << 10) | (1023 & i.charCodeAt(o)))),
                (n +=
                  s[240 | (a >> 18)] +
                  s[128 | ((a >> 12) & 63)] +
                  s[128 | ((a >> 6) & 63)] +
                  s[128 | (63 & a)]));
          }
          return n;
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
        merge: function e(t, r, s) {
          if (!r) return t;
          if ('object' != typeof r) {
            if (n(t)) t.push(r);
            else {
              if (!t || 'object' != typeof t) return [t, r];
              ((s && (s.plainObjects || s.allowPrototypes)) ||
                !i.call(Object.prototype, r)) &&
                (t[r] = !0);
            }
            return t;
          }
          if (!t || 'object' != typeof t) return [t].concat(r);
          var a = t;
          return (
            n(t) && !n(r) && (a = o(t, s)),
            n(t) && n(r)
              ? (r.forEach(function(r, n) {
                  if (i.call(t, n)) {
                    var o = t[n];
                    o && 'object' == typeof o && r && 'object' == typeof r
                      ? (t[n] = e(o, r, s))
                      : t.push(r);
                  } else t[n] = r;
                }),
                t)
              : Object.keys(r).reduce(function(t, n) {
                  var o = r[n];
                  return i.call(t, n) ? (t[n] = e(t[n], o, s)) : (t[n] = o), t;
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
        n = i.method;
      e.exports = i.extend({
        path: '',
        reject: n({ method: 'POST', path: 'accounts/{account}/reject' }),
        create: n({ method: 'POST', path: 'accounts' }),
        list: n({ method: 'GET', path: 'accounts', methodType: 'list' }),
        update: n({ method: 'POST', path: 'accounts/{id}' }),
        del: n({ method: 'DELETE', path: 'accounts/{id}' }),
        retrieve(e) {
          return 'string' == typeof e
            ? n({ method: 'GET', path: 'accounts/{id}' }).apply(this, arguments)
            : (null == e && [].shift.apply(arguments),
              n({ method: 'GET', path: 'account' }).apply(this, arguments));
        },
        createLoginLink: n({
          method: 'POST',
          path: 'accounts/{account}/login_links',
        }),
        listCapabilities: n({
          method: 'GET',
          path: 'accounts/{account}/capabilities',
          methodType: 'list',
        }),
        retrieveCapability: n({
          method: 'GET',
          path: 'accounts/{account}/capabilities/{capability}',
        }),
        updateCapability: n({
          method: 'POST',
          path: 'accounts/{account}/capabilities/{capability}',
        }),
        createExternalAccount: n({
          method: 'POST',
          path: 'accounts/{account}/external_accounts',
        }),
        deleteExternalAccount: n({
          method: 'DELETE',
          path: 'accounts/{account}/external_accounts/{id}',
        }),
        listExternalAccounts: n({
          method: 'GET',
          path: 'accounts/{account}/external_accounts',
          methodType: 'list',
        }),
        retrieveExternalAccount: n({
          method: 'GET',
          path: 'accounts/{account}/external_accounts/{id}',
        }),
        updateExternalAccount: n({
          method: 'POST',
          path: 'accounts/{account}/external_accounts/{id}',
        }),
        createPerson: n({ method: 'POST', path: 'accounts/{account}/persons' }),
        deletePerson: n({
          method: 'DELETE',
          path: 'accounts/{account}/persons/{person}',
        }),
        listPersons: n({
          method: 'GET',
          path: 'accounts/{account}/persons',
          methodType: 'list',
        }),
        retrievePerson: n({
          method: 'GET',
          path: 'accounts/{account}/persons/{person}',
        }),
        updatePerson: n({
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
        n = /%20/g,
        s = r(4),
        o = { RFC1738: 'RFC1738', RFC3986: 'RFC3986' };
      e.exports = s.assign(
        {
          default: o.RFC3986,
          formatters: {
            RFC1738: function(e) {
              return i.call(e, n, '+');
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
        n = r(12),
        s = r(24).makeAutoPaginationMethods;
      e.exports = function(e) {
        return function(...t) {
          const r = 'function' == typeof t[t.length - 1] && t.pop();
          e.urlParams = i.extractUrlParams(
            this.createResourcePathWithSymbols(e.path || '')
          );
          const o = i.callbackifyPromiseWithTimeout(n(this, t, e, {}), r);
          if ('list' === e.methodType) {
            const r = s(this, t, e, o);
            Object.assign(o, r);
          }
          return o;
        };
      };
    },
    function(e, t, r) {
      'use strict';
      const i = r(1);
      e.exports = function(e, t, r, n) {
        return new Promise((s, o) => {
          try {
            var a = (function(e, t, r, n) {
              const s = i.makeURLInterpolator(r.path || ''),
                o = (r.method || 'GET').toUpperCase(),
                a = r.urlParams || [],
                c = r.encode || (e => e),
                u = r.host,
                p = e.createResourcePathWithSymbols(r.path),
                d = [].slice.call(t),
                l = a.reduce((e, t) => {
                  const r = d.shift();
                  if ('string' != typeof r)
                    throw new Error(
                      `Stripe: Argument "${t}" must be a string, but got: ${r} (on API request to \`${o} ${p}\`)`
                    );
                  return (e[t] = r), e;
                }, {}),
                h = i.getDataFromArgs(d),
                m = c(Object.assign({}, h, n)),
                f = i.getOptionsFromArgs(d);
              if (d.length)
                throw new Error(
                  `Stripe: Unknown arguments (${d}). Did you mean to pass an options object? See https://github.com/stripe/stripe-node/wiki/Passing-Options. (on API request to ${o} \`${p}\`)`
                );
              const g = e.createFullPath(s, l),
                y = Object.assign(f.headers, r.headers);
              r.validator && r.validator(m, { headers: y });
              const v = 'GET' === r.method || 'DELETE' === r.method;
              return {
                requestMethod: o,
                requestPath: g,
                bodyData: v ? {} : m,
                queryData: v ? m : {},
                auth: f.auth,
                headers: y,
                host: u,
                settings: f.settings,
              };
            })(e, t, r, n);
          } catch (e) {
            return void o(e);
          }
          const c = 0 === Object.keys(a.queryData).length,
            u = [
              a.requestPath,
              c ? '' : '?',
              i.stringifyRequestData(a.queryData),
            ].join(''),
            { headers: p, settings: d } = a;
          e._request(
            a.requestMethod,
            a.host,
            u,
            a.bodyData,
            a.auth,
            { headers: p, settings: d },
            function(e, t) {
              e
                ? o(e)
                : s(r.transformResponseData ? r.transformResponseData(t) : t);
            }
          );
        });
      };
    },
    function(e, t, r) {
      'use strict';
      const i = r(10),
        n = r(1),
        s = r(3),
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
              throw new s.StripeError({ message: 'Options are required' });
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
              throw new s.StripeSignatureVerificationError({
                message:
                  'Unable to extract timestamp and signatures from header',
                detail: { header: t, payload: e },
              });
            if (!o.signatures.length)
              throw new s.StripeSignatureVerificationError({
                message: 'No signatures found with expected scheme',
                detail: { header: t, payload: e },
              });
            const a = this._computeSignature(`${o.timestamp}.${e}`, r);
            if (!!!o.signatures.filter(n.secureCompare.bind(n, a)).length)
              throw new s.StripeSignatureVerificationError({
                message:
                  'No signatures found matching the expected signature for payload. Are you passing the raw request body you received from Stripe? https://github.com/stripe/stripe-node#webhook-signing',
                detail: { header: t, payload: e },
              });
            const c = Math.floor(Date.now() / 1e3) - o.timestamp;
            if (i > 0 && c > i)
              throw new s.StripeSignatureVerificationError({
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
        n = r(5);
      function s(e) {
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
              const n = e.match(o);
              if (null != n) {
                const e = n[1];
                let t = n[2] || '';
                const r = t.length - 1,
                  s = '"' === t[0] && '"' === t[r];
                ("'" === t[0] && "'" === t[r]) || s
                  ? ((t = t.substring(1, r)), s && (t = t.replace(a, '\n')))
                  : (t = t.trim()),
                  (i[e] = t);
              } else r && s(`did not match key and value when parsing line ${t + 1}: ${e}`);
            }),
          i
        );
      }
      (e.exports.config = function(e) {
        let t = n.resolve(process.cwd(), '.env'),
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
                  s(
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
    function(e, t, r) {
      'use strict';
      r.d(t, 'a', function() {
        return c;
      }),
        r.d(t, 'b', function() {
          return d;
        }),
        r.d(t, 'c', function() {
          return l;
        });
      var i = r(2),
        n = r.n(i);
      function s() {}
      function o(e, t) {
        var r = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var i = Object.getOwnPropertySymbols(e);
          t &&
            (i = i.filter(function(t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            r.push.apply(r, i);
        }
        return r;
      }
      function a(e, t, r) {
        return (
          t in e
            ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[t] = r),
          e
        );
      }
      async function c({ stripeApiSecret: e, body: t, verbose: r }) {
        let i = s,
          c = s;
        r && ((i = console.log), (c = console.error));
        const u = n()(e);
        'string' == typeof t && (t = JSON.parse(t)),
          i('submitStripeInfo received from invoke:', t);
        let p,
          d = { messages: { error: [] }, modifications: [], meta: {} },
          l = 'order';
        try {
          const e = {
            currency: 'usd',
            email: t.infoEmail,
            items: t.products.map(({ id: e, quantity: r, type: i }) => {
              switch (i) {
                case 'plan':
                  if (!t.customer)
                    throw new Error(
                      'You must sign in to purchase this subscription.'
                    );
                  return (
                    (l = 'subscription'),
                    { customer: t.customer, plan: e, quantity: r }
                  );
                case 'sku':
                default:
                  return { type: i || 'sku', parent: e, quantity: r };
              }
            }),
            shipping: {
              name: t.infoName,
              address: {
                line1: t.shippingAddress1,
                line2: t.shippingAddress2,
                city: t.shippingCity,
                state: t.shippingStateAbbr,
                postal_code: t.shippingZip,
                country: 'US',
              },
            },
          };
          switch ((t.coupon && (e.coupon = t.coupon), l)) {
            case 'subscription':
              p = await u.subscriptions.create(e);
              break;
            case 'order':
            default:
              p = await u.orders.create(e);
          }
          (d.success = !0), i('submitStripeInfo received from Stripe:', p);
        } catch (e) {
          if (
            ((p = {}),
            c('submitStripeInfo received error from Stripe:', e),
            'out_of_inventory' === e.code)
          ) {
            let r = Number(e.param.replace('items[', '').replace(']', ''));
            if (t.products[r]) {
              (d.step = 'cart'),
                d.messages.error.push(
                  `Sorry! "${t.products[r].name}" is out of stock. Please lower the quantity or remove this product from your cart.`
                );
              const e = await u.products.retrieve(t.products[r].id);
              let i = 999999;
              e.skus.data.forEach(e => {
                console.log('sku:', e),
                  (i =
                    e.inventory && e.inventory.quantity < i
                      ? e.inventory.quantity
                      : i);
              }),
                (d.quantityModifications = [
                  { id: t.products[r].id, available: i },
                ]);
            }
          } else
            e.message &&
              d.messages.error.push(
                'The connection timed out. Please try again or contact us.'
              );
          'coupon' === e.param && (d.step = 'info'), (d.success = !1);
        }
        return (
          p.items &&
            p.items.forEach(
              ({ type: e, parent: t, amount: r, description: i }) => {
                ('discount' !== e && 'tax' !== e && 'shipping' !== e) ||
                  d.modifications.push({
                    id: 'discount' === e ? t : e,
                    value: r,
                    description: i,
                  });
              }
            ),
          p.shipping_methods &&
            (d.shippingMethods = p.shipping_methods.map(
              ({ id: e, amount: t, description: r }) => ({
                id: e,
                value: t,
                description: r,
              })
            )),
          p.selected_shipping_method &&
            (d.selectedShippingMethod = p.selected_shipping_method),
          p.id && (d.meta.orderId = p.id),
          (d = (function(e) {
            for (var t = 1; t < arguments.length; t++) {
              var r = null != arguments[t] ? arguments[t] : {};
              t % 2
                ? o(Object(r), !0).forEach(function(t) {
                    a(e, t, r[t]);
                  })
                : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    e,
                    Object.getOwnPropertyDescriptors(r)
                  )
                : o(Object(r)).forEach(function(t) {
                    Object.defineProperty(
                      e,
                      t,
                      Object.getOwnPropertyDescriptor(r, t)
                    );
                  });
            }
            return e;
          })({}, t, {}, d)),
          i('submitStripeInfo returning:', d),
          d
        );
      }
      function u(e, t) {
        var r = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var i = Object.getOwnPropertySymbols(e);
          t &&
            (i = i.filter(function(t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            r.push.apply(r, i);
        }
        return r;
      }
      function p(e, t, r) {
        return (
          t in e
            ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[t] = r),
          e
        );
      }
      async function d({ stripeApiSecret: e, body: t, verbose: r }) {
        let i = s,
          o = s;
        r && ((i = console.log), (o = console.error));
        const a = n()(e);
        'string' == typeof t && (t = JSON.parse(t)),
          i('submitStripeOrder received from invoke:', t);
        let c = { messages: { error: [] }, meta: t.meta };
        if (t.selectedShippingMethod)
          try {
            const e = await a.orders.update(c.meta.orderId, {
              selected_shipping_method: t.selectedShippingMethod,
            });
            (c.success = !0),
              i(
                'submitStripeOrder received from Stripe after updated shipping:',
                e
              );
          } catch (e) {
            o(e),
              'out_of_inventory' === e.code || 'resource_missing' === e.code
                ? ((c.step = 'cart'),
                  c.messages.error.push(
                    'Sorry! One or more items in your cart have gone out of stock. Please remove these products or try again later.'
                  ))
                : e.message && c.messages.error.push(e.message),
              (c.success = !1);
          }
        if (c.success) {
          let e;
          try {
            (e = await a.orders.pay(c.meta.orderId, {
              email: t.infoEmail,
              source: t.payment.id,
            })),
              (c.success = 'paid' === e.status),
              i(
                'submitStripeOrder received from Stripe after order placement:',
                e
              );
          } catch (e) {
            o(e),
              'out_of_inventory' === e.code || 'resource_missing' === e.code
                ? ((c.step = 'cart'),
                  c.messages.error.push(
                    'Sorry! One or more items in your cart have gone out of stock. Please remove these products or try again later.'
                  ))
                : e.message && c.messages.error.push(e.message),
              (c.success = !1);
          }
        }
        return (
          (c = (function(e) {
            for (var t = 1; t < arguments.length; t++) {
              var r = null != arguments[t] ? arguments[t] : {};
              t % 2
                ? u(Object(r), !0).forEach(function(t) {
                    p(e, t, r[t]);
                  })
                : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    e,
                    Object.getOwnPropertyDescriptors(r)
                  )
                : u(Object(r)).forEach(function(t) {
                    Object.defineProperty(
                      e,
                      t,
                      Object.getOwnPropertyDescriptor(r, t)
                    );
                  });
            }
            return e;
          })({}, t, {}, c)),
          i('submitStripeOrder returning:', c),
          c
        );
      }
      r(89);
      async function l({ stripeApiSecret: e, body: t, verbose: r }) {
        n()(e);
        'string' == typeof t && (t = JSON.parse(t));
        let i = t.order.amount;
        console.log('Subtotal from updateShipping ' + i),
          console.log(
            'body.order.shipping.address.postal_code from updateShipping ' +
              t.order.shipping.address.postal_code
          );
        let s = [];
        s = [
          {
            id: 'shipping-0',
            description: 'Standard Shipping',
            value: e =>
              3500 == e
                ? 0
                : e < 1e3
                ? 549
                : e < 3e3
                ? 749
                : e < 4500
                ? 895
                : e < 5e3
                ? 995
                : e >= 5e3
                ? 0
                : void 0,
          },
          {
            id: 'shipping-1',
            description: 'Express Shipping',
            value: e =>
              e < 3e3
                ? 1595
                : e < 4500
                ? 1795
                : e < 6e3
                ? 1895
                : e < 7500
                ? 2195
                : e < 10500
                ? 3095
                : e < 14e3
                ? 3395
                : e < 17500
                ? 4195
                : e < 21e3
                ? 4795
                : e < 35e3
                ? 5495
                : e < 5e4
                ? 6796
                : e < 75e3
                ? 7995
                : e <= 1e5 || e > 1e5
                ? 9695
                : void 0,
            addInfo: '',
          },
          {
            id: 'shipping-2',
            description: 'Overnight Shipping',
            value: e =>
              e < 3e3
                ? 2995
                : e < 4500
                ? 3295
                : e < 6e3
                ? 3495
                : e < 7500
                ? 3995
                : e < 10500
                ? 5695
                : e < 14e3
                ? 5995
                : e < 17500
                ? 7195
                : e < 21e3
                ? 8195
                : e < 35e3
                ? 8995
                : e < 5e4
                ? 10995
                : e < 75e3
                ? 12595
                : e <= 1e5
                ? 14995
                : e > 1e5
                ? 16995
                : void 0,
            addInfo: '',
          },
        ].map(e => e.value(i));
        let o = JSON.parse(JSON.stringify(s)),
          a = o[0],
          c = o[1],
          u = o[2];
        Math.ceil(0.08 * i), Math.ceil(0.08 * a);
        return {
          order_update: {
            shipping_methods: [
              {
                id: 'shipping-0',
                description: 'Standard shipping',
                amount: a,
                currency: 'usd',
              },
              {
                id: 'shipping-1',
                description: 'Express shipping',
                amount: c,
                currency: 'usd',
                tax_items: [
                  {
                    parent: 'express',
                    type: 'tax',
                    description: 'Shipping sales taxes',
                    amount: Math.ceil(0.08 * c),
                    currency: 'usd',
                  },
                ],
              },
              {
                id: 'shipping-2',
                description: 'Overnight shipping',
                amount: u,
                currency: 'usd',
                tax_items: [
                  {
                    parent: 'overnight_shipping',
                    type: 'tax',
                    description: 'Shipping sales taxes',
                    amount: Math.ceil(0.08 * u),
                    currency: 'usd',
                  },
                ],
              },
            ],
          },
        };
      }
    },
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
            n = new t[r](e);
          this[i] = n;
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
        n = r(23),
        s = r(9);
      e.exports = { formats: s, parse: n, stringify: i };
    },
    function(e, t, r) {
      'use strict';
      var i = r(4),
        n = r(9),
        s = Object.prototype.hasOwnProperty,
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
        d = n.default,
        l = {
          addQueryPrefix: !1,
          allowDots: !1,
          charset: 'utf-8',
          charsetSentinel: !1,
          delimiter: '&',
          encode: !0,
          encoder: i.encode,
          encodeValuesOnly: !1,
          format: d,
          formatter: n.formatters[d],
          indices: !1,
          serializeDate: function(e) {
            return p.call(e);
          },
          skipNulls: !1,
          strictNullHandling: !1,
        },
        h = function e(t, r, n, s, o, c, p, d, h, m, f, g, y) {
          var v,
            _ = t;
          if (
            ('function' == typeof p
              ? (_ = p(r, _))
              : _ instanceof Date
              ? (_ = m(_))
              : 'comma' === n && a(_) && (_ = _.join(',')),
            null === _)
          ) {
            if (s) return c && !g ? c(r, l.encoder, y, 'key') : r;
            _ = '';
          }
          if (
            'string' == typeof (v = _) ||
            'number' == typeof v ||
            'boolean' == typeof v ||
            'symbol' == typeof v ||
            'bigint' == typeof v ||
            i.isBuffer(_)
          )
            return c
              ? [
                  f(g ? r : c(r, l.encoder, y, 'key')) +
                    '=' +
                    f(c(_, l.encoder, y, 'value')),
                ]
              : [f(r) + '=' + f(String(_))];
          var x,
            b = [];
          if (void 0 === _) return b;
          if (a(p)) x = p;
          else {
            var E = Object.keys(_);
            x = d ? E.sort(d) : E;
          }
          for (var S = 0; S < x.length; ++S) {
            var T = x[S];
            (o && null === _[T]) ||
              (a(_)
                ? u(
                    b,
                    e(
                      _[T],
                      'function' == typeof n ? n(r, T) : r,
                      n,
                      s,
                      o,
                      c,
                      p,
                      d,
                      h,
                      m,
                      f,
                      g,
                      y
                    )
                  )
                : u(
                    b,
                    e(
                      _[T],
                      r + (h ? '.' + T : '[' + T + ']'),
                      n,
                      s,
                      o,
                      c,
                      p,
                      d,
                      h,
                      m,
                      f,
                      g,
                      y
                    )
                  ));
          }
          return b;
        };
      e.exports = function(e, t) {
        var r,
          i = e,
          c = (function(e) {
            if (!e) return l;
            if (
              null !== e.encoder &&
              void 0 !== e.encoder &&
              'function' != typeof e.encoder
            )
              throw new TypeError('Encoder has to be a function.');
            var t = e.charset || l.charset;
            if (
              void 0 !== e.charset &&
              'utf-8' !== e.charset &&
              'iso-8859-1' !== e.charset
            )
              throw new TypeError(
                'The charset option must be either utf-8, iso-8859-1, or undefined'
              );
            var r = n.default;
            if (void 0 !== e.format) {
              if (!s.call(n.formatters, e.format))
                throw new TypeError('Unknown format option provided.');
              r = e.format;
            }
            var i = n.formatters[r],
              o = l.filter;
            return (
              ('function' == typeof e.filter || a(e.filter)) && (o = e.filter),
              {
                addQueryPrefix:
                  'boolean' == typeof e.addQueryPrefix
                    ? e.addQueryPrefix
                    : l.addQueryPrefix,
                allowDots: void 0 === e.allowDots ? l.allowDots : !!e.allowDots,
                charset: t,
                charsetSentinel:
                  'boolean' == typeof e.charsetSentinel
                    ? e.charsetSentinel
                    : l.charsetSentinel,
                delimiter: void 0 === e.delimiter ? l.delimiter : e.delimiter,
                encode: 'boolean' == typeof e.encode ? e.encode : l.encode,
                encoder: 'function' == typeof e.encoder ? e.encoder : l.encoder,
                encodeValuesOnly:
                  'boolean' == typeof e.encodeValuesOnly
                    ? e.encodeValuesOnly
                    : l.encodeValuesOnly,
                filter: o,
                formatter: i,
                serializeDate:
                  'function' == typeof e.serializeDate
                    ? e.serializeDate
                    : l.serializeDate,
                skipNulls:
                  'boolean' == typeof e.skipNulls ? e.skipNulls : l.skipNulls,
                sort: 'function' == typeof e.sort ? e.sort : null,
                strictNullHandling:
                  'boolean' == typeof e.strictNullHandling
                    ? e.strictNullHandling
                    : l.strictNullHandling,
              }
            );
          })(t);
        'function' == typeof c.filter
          ? (i = (0, c.filter)('', i))
          : a(c.filter) && (r = c.filter);
        var p,
          d = [];
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
              d,
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
        var y = d.join(c.delimiter),
          v = !0 === c.addQueryPrefix ? '?' : '';
        return (
          c.charsetSentinel &&
            ('iso-8859-1' === c.charset
              ? (v += 'utf8=%26%2310003%3B&')
              : (v += 'utf8=%E2%9C%93&')),
          y.length > 0 ? v + y : ''
        );
      };
    },
    function(e, t, r) {
      'use strict';
      var i = r(4),
        n = Object.prototype.hasOwnProperty,
        s = Array.isArray,
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
          if (s(e)) {
            for (var r = [], i = 0; i < e.length; i += 1) r.push(t(e[i]));
            return r;
          }
          return t(e);
        },
        p = function(e, t, r, i) {
          if (e) {
            var s = r.allowDots ? e.replace(/\.([^.[]+)/g, '[$1]') : e,
              o = /(\[[^[\]]*])/g,
              a = r.depth > 0 && /(\[[^[\]]*])/.exec(s),
              u = a ? s.slice(0, a.index) : s,
              p = [];
            if (u) {
              if (
                !r.plainObjects &&
                n.call(Object.prototype, u) &&
                !r.allowPrototypes
              )
                return;
              p.push(u);
            }
            for (
              var d = 0;
              r.depth > 0 && null !== (a = o.exec(s)) && d < r.depth;

            ) {
              if (
                ((d += 1),
                !r.plainObjects &&
                  n.call(Object.prototype, a[1].slice(1, -1)) &&
                  !r.allowPrototypes)
              )
                return;
              p.push(a[1]);
            }
            return (
              a && p.push('[' + s.slice(a.index) + ']'),
              (function(e, t, r, i) {
                for (var n = i ? t : c(t, r), s = e.length - 1; s >= 0; --s) {
                  var o,
                    a = e[s];
                  if ('[]' === a && r.parseArrays) o = [].concat(n);
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
                        ? ((o = [])[p] = n)
                        : (o[u] = n)
                      : (o = { 0: n });
                  }
                  n = o;
                }
                return n;
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
          var d =
              'string' == typeof e
                ? (function(e, t) {
                    var r,
                      p = {},
                      d = t.ignoreQueryPrefix ? e.replace(/^\?/, '') : e,
                      l =
                        t.parameterLimit === 1 / 0 ? void 0 : t.parameterLimit,
                      h = d.split(t.delimiter, l),
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
                          v = h[r],
                          _ = v.indexOf(']='),
                          x = -1 === _ ? v.indexOf('=') : _ + 1;
                        -1 === x
                          ? ((g = t.decoder(v, o.decoder, f, 'key')),
                            (y = t.strictNullHandling ? null : ''))
                          : ((g = t.decoder(
                              v.slice(0, x),
                              o.decoder,
                              f,
                              'key'
                            )),
                            (y = u(c(v.slice(x + 1), t), function(e) {
                              return t.decoder(e, o.decoder, f, 'value');
                            }))),
                          y &&
                            t.interpretNumericEntities &&
                            'iso-8859-1' === f &&
                            (y = a(y)),
                          v.indexOf('[]=') > -1 && (y = s(y) ? [y] : y),
                          n.call(p, g)
                            ? (p[g] = i.combine(p[g], y))
                            : (p[g] = y);
                      }
                    return p;
                  })(e, r)
                : e,
            l = r.plainObjects ? Object.create(null) : {},
            h = Object.keys(d),
            m = 0;
          m < h.length;
          ++m
        ) {
          var f = h[m],
            g = p(f, d[f], r, 'string' == typeof e);
          l = i.merge(l, g, r);
        }
        return i.compact(l);
      };
    },
    function(e, t, r) {
      'use strict';
      const i = r(12),
        n = r(1);
      function s() {
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
            .then(function i(n) {
              if (n.done) return void r();
              const s = n.value;
              return new Promise(e => {
                t(s, e);
              }).then(t => (!1 === t ? i({ done: !0 }) : e().then(i)));
            })
            .catch(i);
        });
      }
      e.exports.makeAutoPaginationMethods = function(e, t, r, u) {
        const p = { currentPromise: null };
        let d = u,
          l = 0;
        function h(n) {
          if (!n || !n.data || 'number' != typeof n.data.length)
            throw Error(
              'Unexpected: Stripe API response does not have a well-formed `data` array.'
            );
          if (l < n.data.length) {
            const e = n.data[l];
            return (l += 1), { value: e, done: !1 };
          }
          if (n.has_more) {
            l = 0;
            const s = (function(e) {
              const t = e.data.length - 1,
                r = e.data[t],
                i = r && r.id;
              if (!i)
                throw Error(
                  'Unexpected: No `id` found on the last item while auto-paging a list.'
                );
              return i;
            })(n);
            return (d = i(e, t, r, { starting_after: s })), d.then(h);
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
            d
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
              const s = c(e, r);
              return n.callbackifyPromiseWithTimeout(s, i);
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
              const s = new Promise((t, r) => {
                const n = [];
                e(e => {
                  if ((n.push(e), n.length >= i)) return !1;
                })
                  .then(() => {
                    t(n);
                  })
                  .catch(r);
              });
              return n.callbackifyPromiseWithTimeout(s, r);
            };
          })(f),
          y = {
            autoPagingEach: f,
            autoPagingToArray: g,
            next: m,
            return: () => ({}),
            [s()]: () => y,
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
        n = i.method;
      e.exports = i.extend({
        path: 'application_fees',
        includeBasic: ['list', 'retrieve'],
        createRefund: n({ method: 'POST', path: '/{id}/refunds' }),
        listRefunds: n({
          method: 'GET',
          path: '/{id}/refunds',
          methodType: 'list',
        }),
        retrieveRefund: n({ method: 'GET', path: '/{fee}/refunds/{id}' }),
        updateRefund: n({ method: 'POST', path: '/{fee}/refunds/{id}' }),
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0),
        n = i.method;
      e.exports = i.extend({ path: 'balance', retrieve: n({ method: 'GET' }) });
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
        n = i.method;
      e.exports = i.extend({
        path: 'bitcoin/receivers',
        includeBasic: ['list', 'retrieve'],
        listTransactions: n({
          method: 'GET',
          path: '/{receiver}/transactions',
          methodType: 'list',
        }),
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0),
        n = i.method;
      e.exports = i.extend({
        path: 'charges',
        includeBasic: ['create', 'list', 'retrieve', 'update'],
        capture: n({ method: 'POST', path: '/{charge}/capture' }),
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
        n = i.method;
      e.exports = i.extend({
        path: 'credit_notes',
        includeBasic: ['create', 'list', 'retrieve', 'update'],
        preview: n({ method: 'GET', path: '/preview' }),
        voidCreditNote: n({ method: 'POST', path: '/{id}/void' }),
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0),
        n = i.method;
      e.exports = i.extend({
        path: 'customers',
        includeBasic: ['create', 'del', 'list', 'retrieve', 'update'],
        deleteDiscount: n({ method: 'DELETE', path: '/{customer}/discount' }),
        updateSource: n({ method: 'POST', path: '/{customer}/sources/{id}' }),
        deleteSource: n({ method: 'DELETE', path: '/{customer}/sources/{id}' }),
        verifySource: n({
          method: 'POST',
          path: '/{customer}/sources/{sourceId}/verify',
        }),
        createBalanceTransaction: n({
          method: 'POST',
          path: '/{customer}/balance_transactions',
        }),
        listBalanceTransactions: n({
          method: 'GET',
          path: '/{customer}/balance_transactions',
          methodType: 'list',
        }),
        retrieveBalanceTransaction: n({
          method: 'GET',
          path: '/{customer}/balance_transactions/{transaction}',
        }),
        updateBalanceTransaction: n({
          method: 'POST',
          path: '/{customer}/balance_transactions/{transaction}',
        }),
        createSource: n({ method: 'POST', path: '/{customer}/sources' }),
        listSources: n({
          method: 'GET',
          path: '/{customer}/sources',
          methodType: 'list',
        }),
        retrieveSource: n({ method: 'GET', path: '/{customer}/sources/{id}' }),
        createTaxId: n({ method: 'POST', path: '/{customer}/tax_ids' }),
        deleteTaxId: n({ method: 'DELETE', path: '/{customer}/tax_ids/{id}' }),
        listTaxIds: n({
          method: 'GET',
          path: '/{customer}/tax_ids',
          methodType: 'list',
        }),
        retrieveTaxId: n({ method: 'GET', path: '/{customer}/tax_ids/{id}' }),
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0),
        n = i.method;
      e.exports = i.extend({
        path: 'disputes',
        includeBasic: ['list', 'retrieve', 'update'],
        close: n({ method: 'POST', path: '/{dispute}/close' }),
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0),
        n = i.method;
      e.exports = i.extend({
        path: 'ephemeral_keys',
        includeBasic: ['del'],
        create: n({
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
        n = r(0),
        s = n.method;
      e.exports = n.extend({
        path: 'files',
        includeBasic: ['list', 'retrieve'],
        requestDataProcessor: i,
        create: s({
          method: 'POST',
          headers: { 'Content-Type': 'multipart/form-data' },
          host: 'files.stripe.com',
        }),
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(1),
        { StripeError: n } = r(3);
      class s extends n {}
      const o = (e, t, r) => {
        const n = (
          Math.round(1e16 * Math.random()) + Math.round(1e16 * Math.random())
        ).toString();
        r['Content-Type'] = 'multipart/form-data; boundary=' + n;
        let s = Buffer.alloc(0);
        function o(e) {
          const t = s,
            r = e instanceof Buffer ? e : Buffer.from(e);
          (s = Buffer.alloc(t.length + r.length + 2)),
            t.copy(s),
            r.copy(s, t.length),
            s.write('\r\n', s.length - 2);
        }
        function a(e) {
          return `"${e.replace(/"|"/g, '%22').replace(/\r\n|\r|\n/g, ' ')}"`;
        }
        for (const e in i.flattenAndStringify(t)) {
          const r = t[e];
          o('--' + n),
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
        return o(`--${n}--`), s;
      };
      e.exports.multipartRequestDataProcessor = (e, t, r, n) => {
        if (((t = t || {}), 'POST' !== e))
          return n(null, i.stringifyRequestData(t));
        return i.checkForStream(t)
          ? ((e, t, r, i) => {
              const n = [];
              t.file.data
                .on('data', e => {
                  n.push(e);
                })
                .once('end', () => {
                  const e = Object.assign({}, t);
                  e.file.data = Buffer.concat(n);
                  const s = o(0, e, r);
                  i(null, s);
                })
                .on('error', e => {
                  i(
                    new s({
                      message:
                        'An error occurred while attempting to process the file for upload.',
                      detail: e,
                    }),
                    null
                  );
                });
            })(0, t, r, n)
          : n(null, o(0, t, r));
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
        n = i.method;
      e.exports = i.extend({
        path: 'invoices',
        includeBasic: ['create', 'del', 'list', 'retrieve', 'update'],
        finalizeInvoice: n({ method: 'POST', path: '/{invoice}/finalize' }),
        markUncollectible: n({
          method: 'POST',
          path: '/{invoice}/mark_uncollectible',
        }),
        pay: n({ method: 'POST', path: '/{invoice}/pay' }),
        sendInvoice: n({ method: 'POST', path: '/{invoice}/send' }),
        voidInvoice: n({ method: 'POST', path: '/{invoice}/void' }),
        listUpcomingLineItems: n({
          method: 'GET',
          path: 'upcoming/lines',
          methodType: 'list',
        }),
        retrieveUpcoming: n({ method: 'GET', path: 'upcoming' }),
        listLineItems: n({
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
        n = i.method,
        s = r(1),
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
            `https://${o}/${r}?${s.stringifyRequestData(e)}`
          );
        },
        token: n({ method: 'POST', path: 'oauth/token', host: o }),
        deauthorize(e) {
          return (
            e.client_id || (e.client_id = this._stripe.getClientId()),
            n({ method: 'POST', path: 'oauth/deauthorize', host: o }).apply(
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
        n = i.method;
      e.exports = i.extend({
        path: 'orders',
        includeBasic: ['create', 'list', 'retrieve', 'update'],
        pay: n({ method: 'POST', path: '/{id}/pay' }),
        returnOrder: n({ method: 'POST', path: '/{id}/returns' }),
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
        n = i.method;
      e.exports = i.extend({
        path: 'payment_intents',
        includeBasic: ['create', 'list', 'retrieve', 'update'],
        cancel: n({ method: 'POST', path: '/{intent}/cancel' }),
        capture: n({ method: 'POST', path: '/{intent}/capture' }),
        confirm: n({ method: 'POST', path: '/{intent}/confirm' }),
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0),
        n = i.method;
      e.exports = i.extend({
        path: 'payment_methods',
        includeBasic: ['create', 'list', 'retrieve', 'update'],
        attach: n({ method: 'POST', path: '/{paymentMethod}/attach' }),
        detach: n({ method: 'POST', path: '/{paymentMethod}/detach' }),
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0),
        n = i.method;
      e.exports = i.extend({
        path: 'payouts',
        includeBasic: ['create', 'list', 'retrieve', 'update'],
        cancel: n({ method: 'POST', path: '/{payout}/cancel' }),
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
        n = i.method;
      e.exports = i.extend({
        path: 'recipients',
        includeBasic: ['create', 'del', 'list', 'retrieve', 'update'],
        createCard: n({ method: 'POST', path: '/{id}/cards' }),
        listCards: n({
          method: 'GET',
          path: '/{id}/cards',
          methodType: 'list',
        }),
        retrieveCard: n({
          method: 'GET',
          path: '/{recipientId}/cards/{cardId}',
        }),
        updateCard: n({
          method: 'POST',
          path: '/{recipientId}/cards/{cardId}',
        }),
        deleteCard: n({
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
        n = i.method;
      e.exports = i.extend({
        path: 'reviews',
        includeBasic: ['list', 'retrieve'],
        approve: n({ method: 'POST', path: '/{review}/approve' }),
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0),
        n = i.method;
      e.exports = i.extend({
        path: 'setup_intents',
        includeBasic: ['create', 'list', 'retrieve', 'update'],
        cancel: n({ method: 'POST', path: '/{intent}/cancel' }),
        confirm: n({ method: 'POST', path: '/{intent}/confirm' }),
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
        n = i.method;
      e.exports = i.extend({
        path: 'sources',
        includeBasic: ['create', 'retrieve', 'update'],
        verify: n({ method: 'POST', path: '/{source}/verify' }),
        listSourceTransactions: n({
          method: 'GET',
          path: '/{source}/source_transactions',
          methodType: 'list',
        }),
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0),
        n = i.method;
      e.exports = i.extend({
        path: 'subscriptions',
        includeBasic: ['create', 'list', 'retrieve', 'update', 'del'],
        deleteDiscount: n({
          method: 'DELETE',
          path: '/{subscriptionExposedId}/discount',
        }),
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0),
        n = i.method;
      e.exports = i.extend({
        path: 'subscription_items',
        includeBasic: ['create', 'del', 'list', 'retrieve', 'update'],
        createUsageRecord: n({
          method: 'POST',
          path: '/{subscriptionItem}/usage_records',
        }),
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0),
        n = i.method;
      e.exports = i.extend({
        path: 'subscription_schedules',
        includeBasic: ['create', 'list', 'retrieve', 'update'],
        cancel: n({ method: 'POST', path: '/{schedule}/cancel' }),
        release: n({ method: 'POST', path: '/{schedule}/release' }),
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
        n = i.method;
      e.exports = i.extend({
        path: 'topups',
        includeBasic: ['create', 'list', 'retrieve', 'update'],
        cancel: n({ method: 'POST', path: '/{topup}/cancel' }),
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0),
        n = i.method;
      e.exports = i.extend({
        path: 'transfers',
        includeBasic: ['create', 'list', 'retrieve', 'update'],
        createReversal: n({ method: 'POST', path: '/{id}/reversals' }),
        listReversals: n({
          method: 'GET',
          path: '/{id}/reversals',
          methodType: 'list',
        }),
        retrieveReversal: n({
          method: 'GET',
          path: '/{transfer}/reversals/{id}',
        }),
        updateReversal: n({
          method: 'POST',
          path: '/{transfer}/reversals/{id}',
        }),
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0),
        n = i.method;
      e.exports = i.extend({
        path: 'subscription_items',
        create: n({ method: 'POST', path: '/{id}/usage_records' }),
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0),
        n = i.method;
      e.exports = i.extend({
        path: 'subscription_items',
        list: n({
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
        n = i.method;
      e.exports = i.extend({
        path: 'issuing/authorizations',
        includeBasic: ['list', 'retrieve', 'update'],
        approve: n({ method: 'POST', path: '/{authorization}/approve' }),
        decline: n({ method: 'POST', path: '/{authorization}/decline' }),
      });
    },
    function(e, t, r) {
      'use strict';
      const i = r(0),
        n = i.method;
      e.exports = i.extend({
        path: 'issuing/cards',
        includeBasic: ['create', 'list', 'retrieve', 'update'],
        retrieveDetails: n({ method: 'GET', path: '/{card}/details' }),
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
    function(e, t) {},
    ,
    function(e, t, r) {
      'use strict';
      r.r(t),
        r.d(t, 'handler', function() {
          return o;
        });
      var i = r(14),
        n = r.n(i),
        s = r(15);
      async function o({ body: e }) {
        const t = await Object(s.a)({
          stripeApiSecret: process.env.STRIPE_API_SECRET,
          body: e,
          verbose: !0,
        });
        return { statusCode: 200, body: JSON.stringify(t) };
      }
      n.a.config({ silent: !0 });
    },
  ])
);
