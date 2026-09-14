'use strict';

require('../@babel/runtime/helpers/Arrayincludes');

var e = require('../@babel/runtime/helpers/regeneratorRuntime'),
  r = require('../@babel/runtime/helpers/objectSpread2'),
  t = require('../@babel/runtime/helpers/asyncToGenerator'),
  a = require('../services/api'),
  n = require('./favorite-anchor-recharge'),
  i = require('./session-scope'),
  c = require('./payment-preparation'),
  s = require('./recharge-amount'),
  o = {
    tipRechargeCoins: null,
    tipRechargeYuan: '--',
    tipRechargeOptions: [],
    tipRechargeCustom: !1,
    tipRechargeInput: '',
    tipRechargeMode: '',
    tipRechargeRange: '',
    tipRechargeLocked: !1,
    tipRechargeDone: !1,
    tipRechargeReady: !1,
    tipRechargeAction: '加载充值金额',
    tipRechargeCanCancel: !1,
    tipRechargeDeadline: 0,
    tipRechargeOrderId: '',
  },
  u = function () {
    var u = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
      d = u.scope,
      p = void 0 === d ? 'digest-tip' : d,
      h = u.noun,
      g = void 0 === h ? '打赏' : h,
      R = u.returnText,
      l = void 0 === R ? '返回打赏' : R;
    return {
      goRecharge: function () {
        var u = this;
        return t(
          e().mark(function t() {
            var d, h, R, l, f, b, m, x, k, _, v, C, y, D, w, T, I, L, O, A, q, B, E;
            return e().wrap(
              function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      if (
                        !(u.data.demo || u.data.busy || u.intent) &&
                        u.data.foreground &&
                        u.data.active
                      ) {
                        e.next = 2;
                        break;
                      }
                      return e.abrupt('return');

                    case 2:
                      return (
                        (d = u.revision),
                        u.setData(
                          r(
                            r({}, o),
                            {},
                            {
                              dialog: 'recharge',
                              busy: !0,
                              message: '',
                            }
                          )
                        ),
                        (h = c.timing('recharge_open')),
                        (e.prev = 5),
                        (e.next = 8),
                        a.ensureSession()
                      );

                    case 8:
                      if (((l = e.sent), u.current(d))) {
                        e.next = 11;
                        break;
                      }
                      return e.abrupt('return');

                    case 11:
                      if (l.token) {
                        e.next = 13;
                        break;
                      }
                      throw new Error('请重新登录后充值');

                    case 13:
                      return (
                        (u.tipRechargeLogin = u.tipRechargeLogin || c.createLoginPreparation()),
                        u.tipRechargeLogin.prepare(),
                        (u.tipRechargeSession = l.token),
                        (u.tipRechargeContext = {
                          order_id: u.data.recoveryId || p + ':' + l.token,
                        }),
                        (f = u.tipRechargeBalanceRead = {}),
                        (b = i.current()),
                        (m = h
                          .measure('wallet', function () {
                            return u.returnFromTipRecharge();
                          })
                          .catch(function () {
                            return null;
                          })
                          .then(function (e) {
                            return (
                              u.current(d) &&
                                u.tipRechargeBalanceRead === f &&
                                i.current() === b &&
                                u.setData({
                                  balance: e,
                                }),
                              e
                            );
                          })),
                        (e.next = 22),
                        h.measure('checkout_config', function () {
                          return a.fetchLoveCallCenter();
                        })
                      );

                    case 22:
                      if (((x = e.sent), 'wallet' !== p || u.data.requiredCoins)) {
                        e.next = 27;
                        break;
                      }
                      ((e.t0 = u.data.balance), (e.next = 30));
                      break;

                    case 27:
                      return ((e.next = 29), m);

                    case 29:
                      e.t0 = e.sent;

                    case 30:
                      if (((k = e.t0), u.current(d))) {
                        e.next = 33;
                        break;
                      }
                      return e.abrupt('return');

                    case 33:
                      if (
                        (u.setData({
                          balance: k,
                        }),
                        (u.tipRechargeCenter = x.data || {}),
                        (_ = n.read(u.tipRechargeContext.order_id)),
                        (v = (u.tipRechargeCenter.records || []).filter(function (e) {
                          return (
                            'recharge' === e.kind &&
                            'pending' === e.status &&
                            (!u.data.preferredOrderId || e.order_id === u.data.preferredOrderId)
                          );
                        })),
                        !u.data.preferredOrderId ||
                          !_ ||
                          _.order_id === u.data.preferredOrderId ||
                          _.recovery_order_id === u.data.preferredOrderId)
                      ) {
                        e.next = 39;
                        break;
                      }
                      throw new Error('订单信息不一致，请关闭后重新打开');

                    case 39:
                      if (!u.data.preferredOrderId || _ || v.length) {
                        e.next = 42;
                        break;
                      }
                      return (
                        u.setData({
                          message: '该订单状态已变化，请返回明细刷新',
                          tipRechargeReady: !1,
                        }),
                        e.abrupt('return')
                      );

                    case 42:
                      ((C = new Set()), (y = ''), (u.tipRechargeRemote = null), (D = 0));

                    case 46:
                      if (!(D < 3)) {
                        e.next = 83;
                        break;
                      }
                      if (
                        ((w =
                          !_ &&
                          v.find(function (e) {
                            return !C.has(e.order_id);
                          })),
                        (u.tipRechargeRemote = w || null),
                        (_ && _.order_id) || w)
                      ) {
                        e.next = 51;
                        break;
                      }
                      return e.abrupt('break', 83);

                    case 51:
                      return (
                        (e.prev = 51),
                        (e.next = 54),
                        n.inspect(u.tipRechargeContext, w, function () {
                          return u.current(d);
                        })
                      );

                    case 54:
                      if (((T = e.sent), u.current(d))) {
                        e.next = 57;
                        break;
                      }
                      return e.abrupt('return');

                    case 57:
                      if (T) {
                        e.next = 59;
                        break;
                      }
                      return e.abrupt('break', 83);

                    case 59:
                      if (
                        ((u.tipRechargeRemote = null),
                        (_ = n.read(u.tipRechargeContext.order_id)),
                        !['failed', 'refunded'].includes(T.status))
                      ) {
                        e.next = 65;
                        break;
                      }
                      return (
                        C.add(T.order_id),
                        (y =
                          'PAYMENT_NOT_FOUND' === T.error_code
                            ? '上笔充值未完成，已解除占用，可重新选择金额。'
                            : 'failed' === T.status
                              ? '上笔充值已关闭，可重新选择金额。'
                              : '上笔充值已退款，可重新选择金额。'),
                        e.abrupt('continue', 80)
                      );

                    case 65:
                      if ('delivered' !== T.status) {
                        e.next = 72;
                        break;
                      }
                      return (
                        (e.next = 68),
                        u.returnFromTipRecharge().catch(function () {
                          return null;
                        })
                      );

                    case 68:
                      if (((I = e.sent), u.current(d))) {
                        e.next = 71;
                        break;
                      }
                      return e.abrupt('return');

                    case 71:
                      u.setData({
                        balance: I,
                      });

                    case 72:
                      return ((y = ''), e.abrupt('break', 83));

                    case 76:
                      return (
                        (e.prev = 76),
                        (e.t1 = e.catch(51)),
                        (y = '暂未查清上笔支付结果，可稍后在充值明细核对，请勿重复付款。'),
                        e.abrupt('break', 83)
                      );

                    case 80:
                      (D++, (e.next = 46));
                      break;

                    case 83:
                      (_ ||
                        u.tipRechargeRemote ||
                        (u.tipRechargeRemote =
                          v.find(function (e) {
                            return !C.has(e.order_id);
                          }) || null),
                        (L = _ || u.tipRechargeRemote),
                        u.tipRechargeRemote && C.size && (y = '还有上笔充值待核对，请先查看结果。'),
                        (O = u.getRechargeQuote
                          ? u.getRechargeQuote(u.tipRechargeCenter, k)
                          : n.quote(
                              u.tipRechargeCenter,
                              u.data.balance,
                              null !== (R = u.data.payableCoins) && void 0 !== R ? R : u.data.coins
                            )),
                        (A = s.limits(u.tipRechargeCenter)),
                        (q = !0 === u.tipRechargeCenter.coin_enabled && A),
                        (B = (u.tipRechargeCenter.recharge_options || [])
                          .filter(function (e) {
                            return [100, 1e3].includes(e.coins) && e.price_cents === e.coins;
                          })
                          .map(function (e) {
                            return r(
                              r({}, e),
                              {},
                              {
                                priceText: n.yuan(e.coins),
                              }
                            );
                          })),
                        (E = L ? (_ ? _.coins : L.coin_amount) : O && O.coins),
                        u.setData({
                          tipRechargeOptions: B,
                          tipRechargeCustom: Boolean(q),
                          tipRechargeRange: q ? s.rangeText(A) : '',
                          tipRechargeMode: B.some(function (e) {
                            return e.coins === E;
                          })
                            ? String(E)
                            : 'custom',
                          tipRechargeInput: E ? n.yuan(E) : '',
                          tipRechargeLocked: Boolean(L),
                          tipRechargeDone: Boolean(_ && _.settled),
                          tipRechargeReady: Boolean(L || O),
                          message:
                            y ||
                            (_ && _.settled
                              ? '充值已到账，尚未'.concat(g, '。')
                              : _ && _.can_resume_payment
                                ? '上笔充值未支付，可按原金额重新充值。'
                                : L
                                  ? '上笔支付结果待核对，不会重复创建订单。'
                                  : O
                                    ? ''
                                    : '充值暂不可用，请稍后刷新，尚未扣费。'),
                        }),
                        u.setTipRechargeAmount(E),
                        (e.next = 98));
                      break;

                    case 95:
                      ((e.prev = 95),
                        (e.t2 = e.catch(5)),
                        u.current(d) &&
                          u.setData({
                            message: e.t2.message || '充值暂不可用，请稍后重试',
                          }));

                    case 98:
                      return (
                        (e.prev = 98),
                        u.current(d) &&
                          (u.setData({
                            busy: !1,
                          }),
                          u.updateTipRechargeAction(),
                          h.mark('checkout_ready')),
                        e.finish(98)
                      );

                    case 101:
                    case 'end':
                      return e.stop();
                  }
              },
              t,
              null,
              [
                [5, 95, 98, 101],
                [51, 76],
              ]
            );
          })
        )();
      },
      setTipRechargeAmount: function (e) {
        var r = s.validCoins(e);
        (this.setData({
          tipRechargeCoins: r ? e : null,
          tipRechargeYuan: r ? n.yuan(e) : '--',
        }),
          this.updateTipRechargeAction());
      },
      updateTipRechargeAction: function () {
        var e = this.tipRechargeContext && n.read(this.tipRechargeContext.order_id),
          r = this.tipRechargeRemote,
          t = e ? e.expires_at_local || 0 : n.deadline(r),
          a = t && t <= Date.now();
        this.setData({
          tipRechargeCanCancel:
            !this.data.tipRechargeDone && Boolean(e ? e.can_cancel : r && r.can_cancel),
          tipRechargeDeadline: this.data.tipRechargeDone ? 0 : t,
          tipRechargeOrderId: e ? e.order_id || '' : r ? r.order_id : '',
          tipRechargeAction: this.data.tipRechargeDone
            ? l
            : this.data.tipRechargeReady
              ? a
                ? '核对过期订单'
                : this.tipRechargeRemote || (e && e.opened && !e.can_resume_payment)
                  ? '确认充值结果'
                  : e
                    ? ''
                        .concat(e.opened || e.retry_pending ? '重新充值' : '继续充值', ' · ¥')
                        .concat(this.data.tipRechargeYuan)
                    : ''
              : '刷新充值状态',
        });
      },
      cancelTipRecharge: function () {
        var r = this;
        return t(
          e().mark(function t() {
            var a, c, s, o, u, d;
            return e().wrap(
              function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      if (
                        !r.data.busy &&
                        r.data.tipRechargeCanCancel &&
                        r.tipRechargeContext &&
                        r.data.foreground &&
                        r.data.active
                      ) {
                        e.next = 2;
                        break;
                      }
                      return e.abrupt('return');

                    case 2:
                      if (
                        ((a = r.revision),
                        (c = r.tipRechargeContext),
                        (s = i.current()),
                        (o = function () {
                          return r.current(a) && r.tipRechargeContext === c && i.current() === s;
                        }),
                        r.setData({
                          busy: !0,
                          message: '正在核对并取消原订单',
                        }),
                        (u = !1),
                        (e.prev = 6),
                        s === r.tipRechargeSession)
                      ) {
                        e.next = 9;
                        break;
                      }
                      throw new Error('登录状态已变化，请重新打开充值');

                    case 9:
                      return ((e.next = 11), n.cancel(c, r.tipRechargeRemote, o));

                    case 11:
                      if (((d = e.sent), o() && d)) {
                        e.next = 14;
                        break;
                      }
                      return e.abrupt('return');

                    case 14:
                      ((r.tipRechargeRemote = null),
                        (u = ['failed', 'refunded'].includes(d.status)),
                        r.setData({
                          tipRechargeDone: 'delivered' === d.status,
                          message:
                            'delivered' === d.status
                              ? '原订单已付款到账，未取消，也不会重复充值。'
                              : u
                                ? '订单已取消，已到账的 i币不受影响。'
                                : '支付结果暂未查清，未取消订单，请稍后核对。',
                        }),
                        (e.next = 22));
                      break;

                    case 19:
                      ((e.prev = 19),
                        (e.t0 = e.catch(6)),
                        o() &&
                          r.setData({
                            message: e.t0.message || '暂时无法取消，请稍后重试原订单',
                          }));

                    case 22:
                      return (
                        (e.prev = 22),
                        o() &&
                          (r.setData({
                            busy: !1,
                          }),
                          r.updateTipRechargeAction()),
                        e.finish(22)
                      );

                    case 25:
                      if (!o() || !u) {
                        e.next = 31;
                        break;
                      }
                      if (!r.data.preferredOrderId || !r.onWalletRechargeCanceled) {
                        e.next = 28;
                        break;
                      }
                      return e.abrupt('return', r.onWalletRechargeCanceled());

                    case 28:
                      return ((e.next = 30), r.goRecharge());

                    case 30:
                      o() &&
                        r.setData({
                          message: '原订单已关闭，可重新选择充值金额。',
                        });

                    case 31:
                    case 'end':
                      return e.stop();
                  }
              },
              t,
              null,
              [[6, 19, 22, 25]]
            );
          })
        )();
      },
      expireTipRecharge: function () {
        if (
          !this.data.busy &&
          !this.data.tipRechargeDone &&
          'recharge' === this.data.dialog &&
          this.tipRechargeExpiryChecked !== this.data.tipRechargeOrderId
        )
          return (
            (this.tipRechargeExpiryChecked = this.data.tipRechargeOrderId),
            this.goRecharge()
          );
      },
      chooseTipRecharge: function (e) {
        if (!this.data.busy && !this.data.tipRechargeLocked) {
          var r = e.detail.value;
          if ('custom' === r && this.data.tipRechargeCustom)
            return (
              this.setData({
                tipRechargeMode: r,
                tipRechargeInput: '',
                message: '',
              }),
              void this.setTipRechargeAmount(null)
            );
          var t = this.data.tipRechargeOptions.find(function (e) {
            return String(e.coins) === r;
          });
          t &&
            (this.setData({
              tipRechargeMode: r,
              message: '',
            }),
            this.setTipRechargeAmount(t.coins));
        }
      },
      changeTipRecharge: function (e) {
        if (!this.data.busy && !this.data.tipRechargeLocked && this.data.tipRechargeCustom) {
          var r = String(e.detail.value || ''),
            t = s.parse(r, s.limits(this.tipRechargeCenter));
          (this.setData({
            tipRechargeInput: r,
            message: '',
          }),
            this.setTipRechargeAmount(t));
        }
      },
      returnFromTipRecharge: function () {
        return t(
          e().mark(function r() {
            var t, n;
            return e().wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return ((e.next = 2), a.fetchMyCoinWallet());

                  case 2:
                    if (
                      ((t = e.sent),
                      (n = t.data && t.data.balance),
                      Number.isInteger(n) && !(n < 0))
                    ) {
                      e.next = 6;
                      break;
                    }
                    throw new Error('充值已确认，余额尚未同步，请稍后刷新');

                  case 6:
                    return e.abrupt('return', n);

                  case 7:
                  case 'end':
                    return e.stop();
                }
            }, r);
          })
        )();
      },
      confirmTipRecharge: function () {
        var s = this;
        return t(
          e().mark(function t() {
            var o, u, d, h, R, l, f, b, m, x, k, _, v, C, y, D, w, T, I, L, O;
            return e().wrap(
              function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      if (
                        !s.data.busy &&
                        !s.data.demo &&
                        'recharge' === s.data.dialog &&
                        s.data.foreground &&
                        s.data.active
                      ) {
                        e.next = 2;
                        break;
                      }
                      return e.abrupt('return');

                    case 2:
                      if (s.data.tipRechargeReady) {
                        e.next = 4;
                        break;
                      }
                      return e.abrupt('return', s.goRecharge());

                    case 4:
                      if (s.data.tipRechargeCoins && s.tipRechargeContext) {
                        e.next = 6;
                        break;
                      }
                      return e.abrupt('return');

                    case 6:
                      return (
                        (o = c.timing('recharge')).mark('payment_tap'),
                        (s.tipRechargeBalanceRead = null),
                        (u = s.revision),
                        (d = s.tipRechargeContext),
                        (h = s.data.tipRechargeDone),
                        (R = i.current()),
                        (l = function () {
                          return s.current(u) && i.current() === R && s.tipRechargeContext === d;
                        }),
                        s.setData({
                          busy: !0,
                          message: '',
                        }),
                        (e.prev = 15),
                        (e.next = 18),
                        o.measure('ensure_session', function () {
                          return a.ensureSession();
                        })
                      );

                    case 18:
                      if (((f = e.sent), s.current(u))) {
                        e.next = 21;
                        break;
                      }
                      return e.abrupt('return');

                    case 21:
                      if (
                        f.token === s.tipRechargeSession &&
                        d.order_id === (s.data.recoveryId || p + ':' + f.token)
                      ) {
                        e.next = 23;
                        break;
                      }
                      throw new Error('登录状态已变化，请关闭后重新打开充值');

                    case 23:
                      if (
                        ((R = i.current()),
                        (s.tipRechargeLogin = s.tipRechargeLogin || c.createLoginPreparation()),
                        (b = n.read(d.order_id)),
                        h ||
                          s.tipRechargeRemote ||
                          (b && b.opened && !b.can_resume_payment) ||
                          s.tipRechargeLogin.prepare(),
                        (m = 'delivered'),
                        s.data.tipRechargeDone)
                      ) {
                        e.next = 64;
                        break;
                      }
                      if (!s.tipRechargeRemote) {
                        e.next = 42;
                        break;
                      }
                      return ((x = s.tipRechargeRemote), (e.next = 33), n.inspect(d, x, l));

                    case 33:
                      if (((k = e.sent), l())) {
                        e.next = 36;
                        break;
                      }
                      return e.abrupt('return');

                    case 36:
                      if (
                        k &&
                        'recharge' === k.kind &&
                        k.order_id === x.order_id &&
                        k.coin_amount === x.coin_amount &&
                        ['pending', 'delivered', 'failed', 'refunded'].includes(k.status)
                      ) {
                        e.next = 38;
                        break;
                      }
                      throw new Error('充值结果不一致，请在明细中核对');

                    case 38:
                      ((m = k.status), (s.tipRechargeRemote = null), (e.next = 64));
                      break;

                    case 42:
                      if (((_ = !1), n.read(d.order_id))) {
                        e.next = 57;
                        break;
                      }
                      return (
                        (e.next = 46),
                        o.measure('checkout_config', function () {
                          return a.fetchLoveCallCenter();
                        })
                      );

                    case 46:
                      if (((e.t0 = e.sent.data), e.t0)) {
                        e.next = 49;
                        break;
                      }
                      e.t0 = {};

                    case 49:
                      if (((v = e.t0), l())) {
                        e.next = 52;
                        break;
                      }
                      return e.abrupt('return');

                    case 52:
                      if (
                        (C = n.quote(v, 0, s.data.tipRechargeCoins)) &&
                        C.coins === s.data.tipRechargeCoins &&
                        !(v.records || []).some(function (e) {
                          return 'recharge' === e.kind && 'pending' === e.status;
                        })
                      ) {
                        e.next = 56;
                        break;
                      }
                      throw (
                        s.setData({
                          tipRechargeReady: !1,
                        }),
                        new Error('充值档位或订单已变化，请刷新后确认，尚未扣费')
                      );

                    case 56:
                      _ = !0 === v.recharge_prepare_supported;

                    case 57:
                      if (l() && s.data.foreground && s.data.active) {
                        e.next = 59;
                        break;
                      }
                      return e.abrupt('return');

                    case 59:
                      return (
                        (y = n.read(d.order_id)),
                        (D = !(
                          (y && y.opened && !0 !== y.can_resume_payment) ||
                          (y && y.expires_at_local && y.expires_at_local <= Date.now())
                        )),
                        (e.next = 63),
                        n.run(
                          d,
                          {
                            coins: s.data.tipRechargeCoins,
                            balanceBefore: s.data.balance,
                            preparePayment: _,
                          },
                          function (e) {
                            l() &&
                              (s.setData({
                                message: e,
                              }),
                              s.updateTipRechargeAction());
                          },
                          function () {
                            return (
                              l() &&
                              s.data.foreground &&
                              s.data.active &&
                              'recharge' === s.data.dialog
                            );
                          },
                          D,
                          l,
                          s.tipRechargeLogin,
                          o
                        )
                      );

                    case 63:
                      m = e.sent;

                    case 64:
                      if (l()) {
                        e.next = 66;
                        break;
                      }
                      return e.abrupt('return');

                    case 66:
                      if (!['delivered', 'canceled_delivered'].includes(m)) {
                        e.next = 84;
                        break;
                      }
                      return (
                        s.setData({
                          tipRechargeDone: !0,
                          message: '充值已到账，尚未'.concat(g, '。'),
                        }),
                        (e.next = 70),
                        s.returnFromTipRecharge()
                      );

                    case 70:
                      if (((I = e.sent), l())) {
                        e.next = 73;
                        break;
                      }
                      return e.abrupt('return');

                    case 73:
                      if (
                        (s.setData({
                          balance: I,
                        }),
                        !s.onWalletRechargeDelivered)
                      ) {
                        e.next = 81;
                        break;
                      }
                      if (
                        !(
                          (L = n.read(d.order_id)) &&
                          Number.isInteger(L.balance_before) &&
                          I < L.balance_before + L.coins
                        )
                      ) {
                        e.next = 79;
                        break;
                      }
                      return (
                        s.setData({
                          message: '充值已确认，余额尚未同步，请刷新原订单，不要重复充值。',
                        }),
                        e.abrupt('return')
                      );

                    case 79:
                      return (
                        'canceled_delivered' !== m &&
                          (n.clear(d.order_id),
                          (s.tipRechargeRemote = null),
                          s.onWalletRechargeDelivered({
                            balance: I,
                            coins: s.data.tipRechargeCoins,
                            recoveryId: s.data.recoveryId || '',
                          })),
                        e.abrupt('return')
                      );

                    case 81:
                      (I >=
                        (null !== (w = s.data.payableCoins) && void 0 !== w ? w : s.data.coins) &&
                      'canceled_delivered' !== m
                        ? (n.clear(d.order_id),
                          (s.tipRechargeRemote = null),
                          s.data.foreground && s.data.active
                            ? s.setData({
                                dialog: 'confirm',
                              })
                            : (s.awaitingRecharge = !0))
                        : I <
                            (null !== (T = s.data.payableCoins) && void 0 !== T
                              ? T
                              : s.data.coins) &&
                          (h && (n.clear(d.order_id), (s.tipRechargeRemote = null)),
                          s.setData(
                            r(
                              r(
                                {},
                                h
                                  ? {
                                      dialog: '',
                                    }
                                  : {}
                              ),
                              {},
                              {
                                message: '充值已到账，当前余额仍不足本次'.concat(
                                  g,
                                  '，可稍后再试。'
                                ),
                              }
                            )
                          )),
                        (e.next = 87));
                      break;

                    case 84:
                      (['failed', 'refunded'].includes(m) && (s.tipRechargeRemote = null),
                        (O = n.read(d.order_id)),
                        s.setData({
                          tipRechargeReady: !['failed', 'refunded'].includes(m),
                          message:
                            {
                              pending:
                                O && O.can_resume_payment
                                  ? '上笔充值未支付，可按原金额重新充值。'
                                  : '充值结果待确认，可稍后在充值明细核对，请勿重复付款。',
                              canceled_pending:
                                O && O.can_resume_payment
                                  ? '已退出支付，未'.concat(g, '，可点击重新充值。')
                                  : '已退出支付，结果待核对，未'.concat(
                                      g,
                                      '，可稍后查看充值明细。'
                                    ),
                              failed: '本次充值未完成，未'.concat(g, '。'),
                              refunded: '充值已退款，未'.concat(g, '。'),
                              stopped: '操作已暂停，未'.concat(g, '。'),
                            }[m] || '充值尚未确认，未'.concat(g, '。'),
                        }));

                    case 87:
                      e.next = 92;
                      break;

                    case 89:
                      ((e.prev = 89),
                        (e.t1 = e.catch(15)),
                        l() &&
                          s.setData({
                            message: e.t1.message || '充值结果待确认，请重试原订单',
                          }));

                    case 92:
                      if (((e.prev = 92), !s.current(u))) {
                        e.next = 99;
                        break;
                      }
                      if (l()) {
                        e.next = 97;
                        break;
                      }
                      return (
                        s.setData({
                          busy: !1,
                          balance: null,
                          tipRechargeReady: !1,
                          tipRechargeDone: !1,
                          message: '登录状态已变化，请关闭后重新打开充值',
                        }),
                        e.abrupt('return')
                      );

                    case 97:
                      (s.setData({
                        busy: !1,
                        tipRechargeLocked: Boolean(n.read(d.order_id) || s.tipRechargeRemote),
                      }),
                        s.updateTipRechargeAction());

                    case 99:
                      return e.finish(92);

                    case 100:
                    case 'end':
                      return e.stop();
                  }
              },
              t,
              null,
              [[15, 89, 92, 100]]
            );
          })
        )();
      },
    };
  };

module.exports = {
  data: o,
  methods: u(),
  createMethods: u,
};
