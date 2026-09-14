'use strict';

require('../@babel/runtime/helpers/Arrayincludes');

var e = require('../@babel/runtime/helpers/regeneratorRuntime'),
  r = require('../@babel/runtime/helpers/typeof'),
  t = require('../@babel/runtime/helpers/objectSpread2'),
  n = require('../@babel/runtime/helpers/asyncToGenerator'),
  a = require('../services/api'),
  u = require('./session-scope');

function i(e, r) {
  if (
    !e ||
    'recharge' !== e.kind ||
    e.order_id !== r.order_id ||
    e.coin_amount !== r.coin_amount ||
    !['prepared', 'pending', 'delivered', 'failed', 'refunded'].includes(e.status)
  )
    throw new Error('充值订单信息不一致，已停止确认，请在明细中核对');
}

function c() {
  return (c = n(
    e().mark(function n(c) {
      var s,
        o,
        b,
        p,
        d,
        l,
        f,
        k,
        x,
        v,
        m,
        h,
        w,
        _,
        g,
        y = arguments;
      return e().wrap(function (n) {
        for (;;)
          switch ((n.prev = n.next)) {
            case 0:
              if (
                ((s = y.length > 1 && void 0 !== y[1] ? y[1] : {}),
                (o = s.isCurrent),
                (b =
                  void 0 === o
                    ? function () {
                        return !0;
                      }
                    : o),
                (p = s.canRetry),
                (d = void 0 === p ? b : p),
                (l = s.retry),
                (f = void 0 === l || l),
                c &&
                  'recharge' === c.kind &&
                  c.order_id &&
                  Number.isInteger(c.coin_amount) &&
                  !(c.coin_amount <= 0))
              ) {
                n.next = 3;
                break;
              }
              throw new Error('充值订单信息不完整，已停止确认');

            case 3:
              ((k = t({}, c)),
                (x = u.current()),
                (v = function () {
                  return b() && u.current() === x;
                }),
                (m = null),
                (h = e().mark(function r() {
                  var t, n;
                  return e().wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            if (((t = _[w]), v())) {
                              e.next = 3;
                              break;
                            }
                            return e.abrupt('return', {
                              v: null,
                            });

                          case 3:
                            if (!t) {
                              e.next = 12;
                              break;
                            }
                            if (d()) {
                              e.next = 6;
                              break;
                            }
                            return e.abrupt('return', 'break');

                          case 6:
                            return (
                              (e.next = 8),
                              new Promise(function (e) {
                                return setTimeout(e, t);
                              })
                            );

                          case 8:
                            if (v()) {
                              e.next = 10;
                              break;
                            }
                            return e.abrupt('return', {
                              v: null,
                            });

                          case 10:
                            if (d()) {
                              e.next = 12;
                              break;
                            }
                            return e.abrupt('return', 'break');

                          case 12:
                            if (((e.prev = 12), v())) {
                              e.next = 15;
                              break;
                            }
                            return e.abrupt('return', {
                              v: null,
                            });

                          case 15:
                            if (!t || d()) {
                              e.next = 17;
                              break;
                            }
                            return e.abrupt('return', 'break');

                          case 17:
                            return ((e.next = 19), a.confirmLoveCallOrder(k.order_id));

                          case 19:
                            ((n = e.sent), (e.next = 29));
                            break;

                          case 22:
                            if (((e.prev = 22), (e.t0 = e.catch(12)), v())) {
                              e.next = 26;
                              break;
                            }
                            return e.abrupt('return', {
                              v: null,
                            });

                          case 26:
                            if (f) {
                              e.next = 28;
                              break;
                            }
                            throw e.t0;

                          case 28:
                            return e.abrupt('return', 'continue');

                          case 29:
                            if (v()) {
                              e.next = 31;
                              break;
                            }
                            return e.abrupt('return', {
                              v: null,
                            });

                          case 31:
                            if (
                              (i(n && n.data, k),
                              (m = n.data),
                              !['delivered', 'failed', 'refunded'].includes(m.status))
                            ) {
                              e.next = 35;
                              break;
                            }
                            return e.abrupt('return', {
                              v: m,
                            });

                          case 35:
                            if ('unpaid' !== m.payment_state) {
                              e.next = 37;
                              break;
                            }
                            return e.abrupt('return', {
                              v: m,
                            });

                          case 37:
                          case 'end':
                            return e.stop();
                        }
                    },
                    r,
                    null,
                    [[12, 22]]
                  );
                })),
                (w = 0),
                (_ = f ? [0, 1e3, 2e3, 4e3, 8e3] : [0]));

            case 9:
              if (!(w < _.length)) {
                n.next = 21;
                break;
              }
              return n.delegateYield(h(), 't0', 11);

            case 11:
              if ('break' !== (g = n.t0)) {
                n.next = 14;
                break;
              }
              return n.abrupt('break', 21);

            case 14:
              if ('continue' !== g) {
                n.next = 16;
                break;
              }
              return n.abrupt('continue', 18);

            case 16:
              if ('object' !== r(g)) {
                n.next = 18;
                break;
              }
              return n.abrupt('return', g.v);

            case 18:
              (w++, (n.next = 9));
              break;

            case 21:
              return n.abrupt(
                'return',
                m ||
                  t(
                    t({}, k),
                    {},
                    {
                      status: 'pending',
                      payment_state: 'unknown',
                    }
                  )
              );

            case 22:
            case 'end':
              return n.stop();
          }
      }, n);
    })
  )).apply(this, arguments);
}

module.exports = {
  confirm: function (e) {
    return c.apply(this, arguments);
  },
};
