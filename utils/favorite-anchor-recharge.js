'use strict';

require('../@babel/runtime/helpers/Arrayincludes');

var e = require('../@babel/runtime/helpers/regeneratorRuntime'),
  r = require('../@babel/runtime/helpers/asyncToGenerator'),
  n = require('../@babel/runtime/helpers/objectSpread2'),
  t = require('../@babel/runtime/helpers/slicedToArray'),
  a = require('../@babel/runtime/helpers/createForOfIteratorHelper'),
  i = require('../services/api'),
  u = require('../config/env'),
  o = require('./recharge-confirmation'),
  c = require('./session-scope'),
  d = require('./payment-preparation'),
  s = require('./recharge-amount'),
  p = function (e) {
    return 'favorite-recharge:'.concat(u.API_BASE_URL, ':').concat(e);
  },
  _ = function (e) {
    return wx.getStorageSync(p(e)) || null;
  },
  l = function (e, r) {
    return wx.setStorageSync(p(e), r);
  },
  f = function (e) {
    return wx.removeStorageSync(p(e));
  },
  b = s.yuan,
  x = function (e) {
    return Number.isFinite(e && e.server_time) && Number.isFinite(e.expires_at)
      ? Date.now() + 1e3 * (e.expires_at - e.server_time)
      : 0;
  };

function m() {
  if ('function' != typeof wx.requestVirtualPayment) throw new Error('请升级微信后再支付');
  var e = wx.getSystemInfoSync(),
    r = function (e, r) {
      var n,
        i = String(e || '')
          .split('.')
          .map(Number),
        u = a(r.entries());
      try {
        for (u.s(); !(n = u.n()).done; ) {
          var o = t(n.value, 2),
            c = o[0],
            d = o[1];
          if (!Number.isFinite(i[c])) return !1;
          if (i[c] !== d) return i[c] > d;
        }
      } catch (e) {
        u.e(e);
      } finally {
        u.f();
      }
      return !0;
    };
  if (
    !(
      'ios' !== e.platform ||
      (r(e.version, [8, 0, 68]) && r(String(e.system || '').replace(/^iOS\s*/i, ''), [15]))
    )
  )
    throw new Error('iOS 支付需要 iOS 15、微信 8.0.68 或以上版本');
}

function y(e, r) {
  if (
    !e ||
    'recharge' !== e.kind ||
    e.coin_amount !== r.coins ||
    !e.order_id ||
    (r.order_id && e.order_id !== r.order_id) ||
    !['prepared', 'pending', 'delivered', 'failed', 'refunded'].includes(e.status)
  )
    throw new Error('充值订单信息不一致，已停止支付');
}

function k(e, r, t) {
  y(r, t);
  var a = n(
    n({}, t),
    {},
    {
      order_id: r.order_id,
      settled: 'delivered' === r.status,
      opened: Boolean(t.opened) || !0 === r.payment_attempted,
      can_cancel: 'pending' === r.status && !0 === r.can_cancel,
      expires_at_local: x(r),
      can_resume_payment:
        'pending' === r.status && 'unpaid' === r.payment_state && !1 !== r.can_resume_payment,
    }
  );
  return (['failed', 'refunded'].includes(r.status) ? f(e) : l(e, a), a);
}

function h() {
  return (h = r(
    e().mark(function r(t, a) {
      var u,
        o,
        d,
        s,
        p,
        l,
        f,
        b,
        m,
        h = arguments;
      return e().wrap(function (e) {
        for (;;)
          switch ((e.prev = e.next)) {
            case 0:
              if (
                ((u =
                  h.length > 2 && void 0 !== h[2]
                    ? h[2]
                    : function () {
                        return !0;
                      }),
                (o = c.current()),
                (d = function () {
                  return u() && c.current() === o;
                }),
                (s = _(t.order_id)),
                (p =
                  s ||
                  (a && {
                    coins: a.coin_amount,
                    order_id: a.order_id,
                    opened: !1 !== a.payment_attempted,
                    canceled: !1,
                  })) && p.order_id)
              ) {
                e.next = 7;
                break;
              }
              return e.abrupt('return', null);

            case 7:
              if (
                s ||
                'pending' !== a.status ||
                !0 !== a.can_cancel ||
                (void 0 !== a.can_resume_payment && 'unpaid' !== a.payment_state) ||
                'PAYMENT_UNPAID' === a.error_code ||
                (x(a) && !(x(a) > Date.now()))
              ) {
                e.next = 12;
                break;
              }
              if (d()) {
                e.next = 10;
                break;
              }
              return e.abrupt('return', null);

            case 10:
              return (
                k(
                  t.order_id,
                  a,
                  n(
                    n({}, p),
                    {},
                    {
                      opened: !1,
                    }
                  )
                ),
                e.abrupt('return', a)
              );

            case 12:
              if (d()) {
                e.next = 14;
                break;
              }
              return e.abrupt('return', null);

            case 14:
              return ((e.next = 16), i.confirmLoveCallOrder(p.order_id));

            case 16:
              if (((l = e.sent), d())) {
                e.next = 19;
                break;
              }
              return e.abrupt('return', null);

            case 19:
              (y((f = l.data), p), (b = 0));

            case 22:
              if ('RECHARGE_REPLACED_UNPAID' !== f.error_code || !f.replacement_order_id) {
                e.next = 38;
                break;
              }
              if (!(b >= 8)) {
                e.next = 25;
                break;
              }
              throw new Error('充值记录已更新，请从最新充值明细重新进入');

            case 25:
              return ((e.next = 27), i.fetchLoveCallOrder(f.replacement_order_id));

            case 27:
              if (((m = e.sent.data), d())) {
                e.next = 30;
                break;
              }
              return e.abrupt('return', null);

            case 30:
              if (
                m &&
                m.retry_of_order_id === f.order_id &&
                m.order_id === f.replacement_order_id
              ) {
                e.next = 32;
                break;
              }
              throw new Error('充值订单关联信息不一致');

            case 32:
              (y(m, {
                coins: p.coins,
              }),
                (p = n(
                  n({}, p),
                  {},
                  {
                    recovery_order_id: p.recovery_order_id || p.order_id,
                    order_id: m.order_id,
                    opened: !1 !== m.payment_attempted,
                    retry_pending: !1,
                  }
                )),
                (f = m));

            case 35:
              (b++, (e.next = 22));
              break;

            case 38:
              return (k(t.order_id, f, p), e.abrupt('return', f));

            case 40:
            case 'end':
              return e.stop();
          }
      }, r);
    })
  )).apply(this, arguments);
}

function v() {
  return (v = r(
    e().mark(function r(n, t) {
      var a,
        u,
        o,
        d,
        s,
        p = arguments;
      return e().wrap(function (e) {
        for (;;)
          switch ((e.prev = e.next)) {
            case 0:
              if (
                ((a =
                  p.length > 2 && void 0 !== p[2]
                    ? p[2]
                    : function () {
                        return !0;
                      }),
                (u = c.current()),
                (o = function () {
                  return a() && c.current() === u;
                }),
                (d =
                  _(n.order_id) ||
                  (t && {
                    coins: t.coin_amount,
                    order_id: t.order_id,
                    opened: !0,
                  })) &&
                  d.order_id &&
                  o())
              ) {
                e.next = 6;
                break;
              }
              return e.abrupt('return', null);

            case 6:
              return ((e.next = 8), i.cancelLoveCallOrder(d.order_id));

            case 8:
              if (((s = e.sent), o())) {
                e.next = 11;
                break;
              }
              return e.abrupt('return', null);

            case 11:
              return (k(n.order_id, s.data, d), e.abrupt('return', s.data));

            case 13:
            case 'end':
              return e.stop();
          }
      }, r);
    })
  )).apply(this, arguments);
}

function g() {
  return (g = r(
    e().mark(function t(a, u, s) {
      var p,
        f,
        b,
        x,
        h,
        v,
        g,
        w,
        S,
        q,
        E,
        N,
        C,
        P,
        D,
        O,
        A,
        L,
        I,
        F,
        R,
        T,
        B,
        M,
        U,
        G,
        H,
        V,
        Y = arguments;
      return e().wrap(
        function (t) {
          for (;;)
            switch ((t.prev = t.next)) {
              case 0:
                if (
                  ((p =
                    Y.length > 3 && void 0 !== Y[3]
                      ? Y[3]
                      : function () {
                          return !0;
                        }),
                  (f = !(Y.length > 4 && void 0 !== Y[4]) || Y[4]),
                  (b = Y.length > 5 && void 0 !== Y[5] ? Y[5] : p),
                  (x = Y.length > 6 && void 0 !== Y[6] ? Y[6] : null),
                  (h = Y.length > 7 && void 0 !== Y[7] ? Y[7] : null),
                  (v = c.current()),
                  (g = function () {
                    return b() && c.current() === v;
                  }),
                  (w = _(a.order_id)),
                  (S = h || d.timing('recharge')),
                  (q = x || d.createLoginPreparation()),
                  (E = null),
                  (N =
                    !f || (w && w.opened && !w.can_resume_payment)
                      ? null
                      : q.take().then(
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
                  (C = function (e) {
                    return ((w = k(a.order_id, e, w)), e.status);
                  }),
                  w)
                ) {
                  t.next = 19;
                  break;
                }
                if ((m(), u)) {
                  t.next = 17;
                  break;
                }
                throw new Error('请先读取充值金额');

              case 17:
                ((w = n(
                  {
                    request_id: 'favorite_'
                      .concat(Date.now(), '_')
                      .concat(Math.random().toString(36).slice(2, 12)),
                    coins: u.coins,
                    order_id: '',
                    opened: !1,
                  },
                  Number.isInteger(u.balanceBefore)
                    ? {
                        balance_before: u.balanceBefore,
                      }
                    : {}
                )),
                  l(a.order_id, w));

              case 19:
                if (w.order_id) {
                  t.next = 40;
                  break;
                }
                if (!(P = f && u && !0 === u.preparePayment)) {
                  t.next = 29;
                  break;
                }
                return (
                  (t.next = 24),
                  S.measure('login_wait', function () {
                    return N;
                  })
                );

              case 24:
                if (!(D = t.sent).error) {
                  t.next = 27;
                  break;
                }
                throw D.error;

              case 27:
                if (g() && p()) {
                  t.next = 29;
                  break;
                }
                return t.abrupt('return', 'stopped');

              case 29:
                return (
                  s('正在准备充值，尚未扣费'),
                  (t.next = 32),
                  S.measure(P ? 'prepare_payment' : 'create_order', function () {
                    return i.createLoveCallOrder(
                      n(
                        {
                          kind: 'recharge',
                          coins: w.coins,
                          request_id: w.request_id,
                        },
                        P
                          ? {
                              prepare_payment: !0,
                              login_code: D.code,
                            }
                          : {}
                      )
                    );
                  })
                );

              case 32:
                if (
                  ((O = t.sent), (A = C(O.data)), !['delivered', 'failed', 'refunded'].includes(A))
                ) {
                  t.next = 36;
                  break;
                }
                return t.abrupt('return', A);

              case 36:
                if (!P || !O.data.pay_data) {
                  t.next = 40;
                  break;
                }
                if ('pending' === A && !0 === O.data.payment_attempted) {
                  t.next = 39;
                  break;
                }
                throw new Error('充值支付状态不一致，已停止支付');

              case 39:
                E = O.data.pay_data;

              case 40:
                if (
                  ((L = (function () {
                    var n = r(
                      e().mark(function r() {
                        var n;
                        return e().wrap(function (e) {
                          for (;;)
                            switch ((e.prev = e.next)) {
                              case 0:
                                if (g()) {
                                  e.next = 2;
                                  break;
                                }
                                return e.abrupt('return', 'stopped');

                              case 2:
                                return ((e.next = 4), i.confirmLoveCallOrder(w.order_id));

                              case 4:
                                if (((n = e.sent), g())) {
                                  e.next = 7;
                                  break;
                                }
                                return e.abrupt('return', 'stopped');

                              case 7:
                                return e.abrupt('return', C(n.data));

                              case 8:
                              case 'end':
                                return e.stop();
                            }
                        }, r);
                      })
                    );
                    return function () {
                      return n.apply(this, arguments);
                    };
                  })()),
                  E || (!w.opened && !w.settled) || w.retry_pending)
                ) {
                  t.next = 48;
                  break;
                }
                return (s('正在核对原充值订单'), (t.next = 45), L());

              case 45:
                if ('pending' === (I = t.sent) && w.can_resume_payment && f) {
                  t.next = 48;
                  break;
                }
                return t.abrupt('return', I);

              case 48:
                if (f && !(w.expires_at_local && w.expires_at_local <= Date.now())) {
                  t.next = 50;
                  break;
                }
                return t.abrupt('return', L());

              case 50:
                if (E || (!w.opened && !w.retry_pending)) {
                  t.next = 72;
                  break;
                }
                if (g() && p()) {
                  t.next = 53;
                  break;
                }
                return t.abrupt('return', 'stopped');

              case 53:
                return (
                  (F = w.order_id),
                  (w = n(
                    n({}, w),
                    {},
                    {
                      retry_pending: !0,
                    }
                  )),
                  l(a.order_id, w),
                  s('正在核对并准备重新充值'),
                  (t.next = 59),
                  S.measure('retry_order', function () {
                    return i.retryLoveCallOrder(F);
                  })
                );

              case 59:
                if (((R = t.sent), g())) {
                  t.next = 62;
                  break;
                }
                return t.abrupt('return', 'stopped');

              case 62:
                if ((T = R.data) && T.retry_of_order_id === F) {
                  t.next = 65;
                  break;
                }
                throw new Error('重试订单关联信息不一致，已停止支付');

              case 65:
                if (
                  (y(T, {
                    coins: w.coins,
                  }),
                  'pending' !== T.status || T.order_id !== F)
                ) {
                  t.next = 68;
                  break;
                }
                throw new Error('支付单号未更新，请刷新充值状态');

              case 68:
                if (
                  ((w = k(
                    a.order_id,
                    T,
                    n(
                      n({}, w),
                      {},
                      {
                        recovery_order_id: w.recovery_order_id || F,
                        order_id: '',
                        opened: !1,
                        retry_pending: !1,
                      }
                    )
                  )),
                  'pending' === T.status && !w.opened)
                ) {
                  t.next = 71;
                  break;
                }
                return t.abrupt('return', T.status);

              case 71:
                s('正在准备微信支付');

              case 72:
                if ((m(), !N)) {
                  t.next = 79;
                  break;
                }
                return ((t.next = 76), N);

              case 76:
                ((t.t0 = t.sent), (t.next = 83));
                break;

              case 79:
                return ((t.next = 81), q.take());

              case 81:
                ((t.t1 = t.sent),
                  (t.t0 = {
                    code: t.t1,
                  }));

              case 83:
                if (!(B = t.t0).error) {
                  t.next = 86;
                  break;
                }
                throw B.error;

              case 86:
                if (g() && p()) {
                  t.next = 88;
                  break;
                }
                return t.abrupt('return', 'stopped');

              case 88:
                if (!(w.expires_at_local && w.expires_at_local <= Date.now())) {
                  t.next = 90;
                  break;
                }
                return t.abrupt('return', L());

              case 90:
                if (!E) {
                  t.next = 94;
                  break;
                }
                ((t.t2 = {
                  data: E,
                }),
                  (t.next = 97));
                break;

              case 94:
                return (
                  (t.next = 96),
                  S.measure('pay_data', function () {
                    return i.loveCallPayData(w.order_id, B.code);
                  })
                );

              case 96:
                t.t2 = t.sent;

              case 97:
                if (
                  ((M = t.t2),
                  (U = JSON.parse(M.data.signData)),
                  'short_series_coin' === M.data.mode &&
                    U.buyQuantity === w.coins &&
                    U.outTradeNo === w.order_id &&
                    0 === U.env &&
                    'CNY' === U.currencyType)
                ) {
                  t.next = 101;
                  break;
                }
                throw new Error('微信支付金额不一致，已停止支付');

              case 101:
                if (g() && p()) {
                  t.next = 103;
                  break;
                }
                return t.abrupt('return', 'stopped');

              case 103:
                if (!(w.expires_at_local && w.expires_at_local <= Date.now())) {
                  t.next = 105;
                  break;
                }
                return t.abrupt('return', L());

              case 105:
                if ((s('等待微信支付'), g() && p())) {
                  t.next = 108;
                  break;
                }
                return t.abrupt('return', 'stopped');

              case 108:
                return (
                  (w = n(
                    n({}, w),
                    {},
                    {
                      opened: !0,
                      canceled: !1,
                      can_resume_payment: !1,
                    }
                  )),
                  l(a.order_id, w),
                  (t.prev = 110),
                  S.mark('cashier_invoked'),
                  (t.next = 114),
                  S.measure('cashier_roundtrip', function () {
                    return new Promise(function (e, r) {
                      return wx.requestVirtualPayment(
                        n(
                          n({}, M.data),
                          {},
                          {
                            success: e,
                            fail: r,
                          }
                        )
                      );
                    });
                  })
                );

              case 114:
                t.next = 132;
                break;

              case 116:
                return (
                  (t.prev = 116),
                  (t.t3 = t.catch(110)),
                  S.nativeFailure(t.t3),
                  (G = d.nativePaymentFailure(t.t3).canceled),
                  (w = n(
                    n({}, w),
                    {},
                    {
                      canceled: G,
                    }
                  )),
                  l(a.order_id, w),
                  (t.next = 124),
                  L().catch(function () {
                    return 'pending';
                  })
                );

              case 124:
                if ('delivered' !== (H = t.sent)) {
                  t.next = 127;
                  break;
                }
                return t.abrupt('return', 'canceled_delivered');

              case 127:
                if ('failed' !== H && 'refunded' !== H) {
                  t.next = 129;
                  break;
                }
                return t.abrupt('return', H);

              case 129:
                if (!G) {
                  t.next = 131;
                  break;
                }
                return t.abrupt('return', 'canceled_pending');

              case 131:
                throw d.cashierError(t.t3);

              case 132:
                if (g()) {
                  t.next = 134;
                  break;
                }
                return t.abrupt('return', 'stopped');

              case 134:
                return (
                  s('正在确认充值到账'),
                  (t.next = 137),
                  o.confirm(
                    {
                      kind: 'recharge',
                      order_id: w.order_id,
                      coin_amount: w.coins,
                    },
                    {
                      isCurrent: g,
                      canRetry: function () {
                        return g() && p();
                      },
                    }
                  )
                );

              case 137:
                return ((V = t.sent), t.abrupt('return', V && g() ? C(V) : 'stopped'));

              case 139:
              case 'end':
                return t.stop();
            }
        },
        t,
        null,
        [[110, 116]]
      );
    })
  )).apply(this, arguments);
}

module.exports = {
  quote: function (e, r, n) {
    if (
      !Number.isSafeInteger(r) ||
      r < 0 ||
      !Number.isSafeInteger(n) ||
      n <= r ||
      !e ||
      !0 !== e.coin_enabled ||
      100 !== e.coins_per_yuan
    )
      return null;
    var t = n - r,
      a = s.limits(e),
      i = 0;
    return (
      a && (i = Math.max(t, a.min_coins)) > a.max_coins && (i = 0),
      i ||
        (i =
          (e.recharge_options || [])
            .filter(function (e) {
              return (
                s.validCoins(e.coins) && e.coins >= Math.max(t, 100) && e.price_cents === e.coins
              );
            })
            .map(function (e) {
              return e.coins;
            })
            .sort(function (e, r) {
              return e - r;
            })[0] || 0),
      i
        ? {
            coins: i,
            shortage: t,
            yuan: b(i),
            remaining: i - t,
          }
        : null
    );
  },
  read: _,
  clear: f,
  run: function (e, r, n) {
    return g.apply(this, arguments);
  },
  inspect: function (e, r) {
    return h.apply(this, arguments);
  },
  cancel: function (e, r) {
    return v.apply(this, arguments);
  },
  deadline: x,
  yuan: b,
};
