'use strict';

var e = require('../@babel/runtime/helpers/regeneratorRuntime'),
  r = require('../@babel/runtime/helpers/asyncToGenerator'),
  t = require('./session-scope');

function n(e) {
  var r = e && e.errCode,
    t = /^-?\d{1,10}$/.test(String(r)) ? String(r) : '';
  return {
    code: t,
    canceled:
      '-2' === t || /\bcancel(?:led|ed)?\b/i.test(String((e && (e.errMsg || e.message)) || '')),
  };
}

function a(t) {
  var a = Date.now(),
    o = ''.concat(a.toString(36), '-').concat(Math.random().toString(36).slice(2, 8)),
    c = function (e, r) {
      var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 'ok';
      try {
        wx.getRealtimeLogManager &&
          wx.getRealtimeLogManager().info('payment_timing', {
            trace: o,
            flow: t,
            stage: e,
            elapsed_ms: Date.now() - a,
            duration_ms: r,
            outcome: n,
          });
      } catch (e) {}
    };
  return {
    mark: c,
    nativeFailure: function (e) {
      var r = n(e);
      try {
        wx.getRealtimeLogManager &&
          wx.getRealtimeLogManager().info('payment_timing', {
            trace: o,
            flow: t,
            stage: 'cashier_failure',
            elapsed_ms: Date.now() - a,
            outcome: r.canceled ? 'canceled' : 'error',
            native_code: r.code || 'unknown',
          });
      } catch (e) {}
    },
    measure: function (t, n) {
      return r(
        e().mark(function r() {
          var a, o;
          return e().wrap(
            function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return ((a = Date.now()), (o = 'ok'), (e.prev = 2), (e.next = 5), n());

                  case 5:
                    return e.abrupt('return', e.sent);

                  case 8:
                    throw ((e.prev = 8), (e.t0 = e.catch(2)), (o = 'error'), e.t0);

                  case 12:
                    return ((e.prev = 12), c(t, Date.now() - a, o), e.finish(12));

                  case 15:
                  case 'end':
                    return e.stop();
                }
            },
            r,
            null,
            [[2, 8, 12, 15]]
          );
        })
      )();
    },
  };
}

module.exports = {
  createLoginPreparation: function () {
    var n = null,
      o = function () {
        var e = t.current();
        if (n && n.scope === e && Date.now() - n.started < 6e4) return n;
        var r = {
          scope: e,
          started: Date.now(),
        };
        return (
          (r.promise = a('recharge')
            .measure('wx_login', function () {
              return new Promise(function (e, r) {
                return wx.login({
                  success: function (t) {
                    return t.code ? e(t.code) : r(new Error('微信登录失败，请重试'));
                  },
                  fail: r,
                });
              });
            })
            .then(
              function (e) {
                return {
                  code: e,
                };
              },
              function (e) {
                return {
                  error: e,
                };
              }
            )),
          (n = r),
          r
        );
      };
    return {
      prepare: o,
      clear: function () {
        n = null;
      },
      take: function () {
        var a = this;
        return r(
          e().mark(function r() {
            var c, i;
            return e().wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return ((c = o()), (n = null), (e.next = 4), c.promise);

                  case 4:
                    if (((i = e.sent), c.scope === t.current())) {
                      e.next = 7;
                      break;
                    }
                    throw new Error('登录状态已变化，请重新打开充值');

                  case 7:
                    if (!i.error) {
                      e.next = 9;
                      break;
                    }
                    throw i.error;

                  case 9:
                    if (!(Date.now() - c.started >= 6e4)) {
                      e.next = 11;
                      break;
                    }
                    return e.abrupt('return', a.take());

                  case 11:
                    return e.abrupt('return', i.code);

                  case 12:
                  case 'end':
                    return e.stop();
                }
            }, r);
          })
        )();
      },
    };
  },
  timing: a,
  nativePaymentFailure: n,
  cashierError: function (e) {
    var r = n(e),
      t = new Error(
        '微信支付未能完成'.concat(
          r.code ? '（错误码 '.concat(r.code, '）') : '',
          '。请先核对充值结果，确认未支付后可重新充值。'
        )
      );
    return ((t.code = 'PAYMENT_CASHIER_FAILED'), t);
  },
};
