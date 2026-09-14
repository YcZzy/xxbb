'use strict';

require('../../@babel/runtime/helpers/Arrayincludes');

var e = require('../../@babel/runtime/helpers/regeneratorRuntime'),
  t = require('../../@babel/runtime/helpers/asyncToGenerator'),
  i = require('../../@babel/runtime/helpers/objectSpread2'),
  n = require('../../services/api'),
  a = require('../../utils/digest-tip-recharge'),
  r = require('../../utils/remote-art'),
  s = require('../../utils/session-scope'),
  o = require('../../utils/coin-pricing'),
  c = [
    '今日星光，已为大人收好',
    '大人且慢，小的还有一句',
    '卷已呈上，小的候着呢',
    '大人看得尽兴，小的就开心',
    '小的捧着早报，来请个安',
    '大人辛苦，容小的说句悄悄话',
    '这一卷热闹，可还合大人心意',
    '早报已呈，小的斗胆开个口',
  ],
  d = [
    '赏小的一盏茶，\n润润嗓子可好？',
    '这一卷星光早报，\n可值大人一个赏？',
    '大人赏个彩头，\n小的在这儿谢啦。',
    '小的两手空空，\n来接大人的赏。',
    '若这一卷合心意，\n大人赏小的一点？',
    '小的端好茶盏，\n等大人添点甜。',
    '早报翻到这里，\n要不要赏个彩头？',
    '给小的添点茶钱，\n小的先行谢过啦。',
    '大人的一点心意，\n小的双手接着。',
    '小的来讨个赏，\n大人随心就好。',
    '卷尾讨个小彩头，\n大人意下如何？',
    '赏与不赏都随心，\n小的给大人请安。',
  ],
  u = [
    '愿大人日日欢喜，\n夜夜好眠。',
    '愿大人所念皆如愿，\n所行皆坦途。',
    '愿大人今日顺意，\n明日更胜今日。',
    '愿大人抬头见喜，\n低头拾得好运。',
    '愿大人心中有光，\n一路皆是晴朗。',
    '愿大人三餐有味，\n四季常安。',
    '愿大人烦恼退散，\n快乐准时来报。',
    '愿大人工作顺手，\n生活顺心。',
    '愿大人爱播常见，\n好消息常伴。',
    '愿大人游戏尽兴，\n把把都有好心情。',
    '愿大人一路生花，\n万事慢慢如愿。',
    '愿大人喜乐常在，\n好梦一觉到天明。',
  ],
  p = '',
  l = '',
  h = '',
  f = function (e, t) {
    var i = e.filter(function (e) {
      return e !== t;
    });
    return i[Math.floor(Math.random() * i.length)];
  },
  g = function () {
    return new Promise(function (e, t) {
      return wx.login({
        success: function (i) {
          return i.code ? e(i.code) : t(new Error('微信登录失败'));
        },
        fail: t,
      });
    });
  },
  b = function (e, t, i) {
    if (!/^\d{1,5}$/.test(String(e))) return null;
    var n = Number(e);
    return Number.isInteger(n) && n >= t && n <= i ? n : null;
  };

Component({
  properties: {
    skin: {
      type: String,
      value: 'classic',
    },
    date: {
      type: String,
      value: '',
    },
    active: {
      type: Boolean,
      value: !0,
    },
    lite: {
      type: Boolean,
      value: !1,
    },
  },
  data: i(
    i({}, a.data),
    {},
    {
      shown: !1,
      dismissed: !1,
      available: !1,
      offerLoading: !1,
      offerError: '',
      foreground: !0,
      busy: !1,
      scene: 'asking',
      motion: 'waiting',
      poseX: 0,
      poseY: 0,
      dialog: '',
      artSrc: '',
      askLead: '',
      askLine: '',
      thanksLine: '',
      coins: 9,
      payableCoins: 9,
      customPayable: 9,
      goldDiscount: !1,
      pendingUnpaid: !1,
      input: '9',
      minCoins: 1,
      maxCoins: 2e4,
      balance: null,
      message: '',
      inputError: '',
      pending: !1,
      foreignPending: !1,
      tipSending: !1,
    }
  ),
  lifetimes: {
    created: function () {
      ((this.alive = !0),
        (this.revision = 0),
        (this.timers = []),
        (this.completed = new Set()),
        (this.tipScope = s.current()));
    },
    ready: function () {
      var e = this;
      (this.warmArtwork(),
        this.createIntersectionObserver &&
          ((this.endObserver = this.createIntersectionObserver({
            thresholds: [0, 0.01],
          })),
          this.endObserver.relativeToViewport().observe('.tip-entry', function (t) {
            e.alive && ((e.bottomVisible = t.intersectionRatio > 0), e.revealWhenVisible());
          }),
          (this.exitObserver = this.createIntersectionObserver({
            thresholds: [0, 0.01],
          })),
          this.exitObserver
            .relativeToViewport({
              bottom: 96,
            })
            .observe('.tip-entry', function (t) {
              if (e.alive) {
                var i = e.nearBottom;
                ((e.nearBottom = t.intersectionRatio > 0),
                  i && !e.nearBottom && e.data.active && e.data.foreground && e.resetEncounter());
              }
            })));
    },
    detached: function () {
      ((this.preparedTipLogin = null),
        (this.alive = !1),
        this.revision++,
        this.stopMotion(),
        this.endObserver && this.endObserver.disconnect(),
        this.exitObserver && this.exitObserver.disconnect());
    },
  },
  observers: {
    active: function (e) {
      this.alive &&
        (e
          ? (this.revealWhenVisible(), this.resumeNavigation())
          : ((this.preparedTipLogin = null), this.settleMotion()));
    },
    date: function () {
      ((this.revision = Number(this.revision || 0) + 1),
        this.stopMotion(),
        (this.preparedTipLogin = null),
        (this.offerLoaded = !1),
        (this.intent = null),
        (this.deferredThanks = null),
        (this.awaitingRecharge = !1),
        (this.awaitingRecords = !1),
        this.setData({
          shown: !1,
          dismissed: !1,
          available: !1,
          offerLoading: !1,
          offerError: '',
          busy: !1,
          scene: 'asking',
          motion: 'waiting',
          poseX: 0,
          poseY: 0,
          dialog: '',
          coins: 9,
          payableCoins: 9,
          customPayable: 9,
          goldDiscount: !1,
          pendingUnpaid: !1,
          input: '9',
          balance: null,
          message: '',
          inputError: '',
          pending: !1,
          foreignPending: !1,
          tipSending: !1,
        }),
        this.revealWhenVisible());
    },
  },
  pageLifetimes: {
    hide: function () {
      ((this.preparedTipLogin = null),
        (this.freshVisit = !this.data.busy && !this.awaitingRecharge && !this.awaitingRecords),
        this.settleMotion(),
        this.setData({
          foreground: !1,
        }));
    },
    show: function () {
      if (
        (this.syncTipSession(),
        this.warmArtwork(),
        this.freshVisit && this.resetEncounter(),
        (this.freshVisit = !1),
        this.setData({
          foreground: !0,
        }),
        this.revealWhenVisible(),
        this.deferredThanks)
      ) {
        var e = this.deferredThanks;
        ((this.deferredThanks = null), this.playThanks(e));
      } else
        'thanking' === this.data.scene &&
          (this.setData({
            scene: 'thanks',
          }),
          this.pose(5));
      return this.resumeNavigation();
    },
  },
  methods: i(
    i({}, a.methods),
    {},
    {
      warmArtwork: function () {
        var e = this;
        if (this.alive && !this.artLoading) {
          var t = r.cached('tip');
          t
            ? this.setData({
                artSrc: t,
              })
            : (this.artLoading = r
                .load('tip')
                .then(function (t) {
                  e.alive &&
                    e.setData({
                      artSrc: t,
                    });
                })
                .catch(function () {})
                .finally(function () {
                  e.artLoading = null;
                }));
        }
      },
      onArtworkError: function () {
        (this.setData({
          artSrc: '',
        }),
          r.invalidate('tip'));
      },
      noop: function () {},
      resetEncounter: function () {
        return (
          !(
            !this.alive ||
            this.data.busy ||
            this.data.dialog ||
            this.awaitingRecharge ||
            this.awaitingRecords ||
            this.deferredThanks
          ) &&
          (this.stopMotion(),
          this.setData({
            shown: !1,
            dismissed: !1,
            scene: 'asking',
            motion: 'waiting',
            available: !1,
            poseX: 0,
            poseY: 0,
            message: this.intent || this.data.foreignPending ? this.data.message : '',
          }),
          !0)
        );
      },
      revealWhenVisible: function () {
        if (this.alive && this.bottomVisible) return this.reveal();
      },
      resumeNavigation: function () {
        if (this.data.foreground && this.data.active && !this.data.busy)
          return this.awaitingRecords
            ? ((this.awaitingRecords = !1), this.refreshAfterRecords())
            : this.awaitingRecharge
              ? ((this.awaitingRecharge = !1),
                this.prepareTip({
                  allowRecharge: !1,
                }))
              : void 0;
      },
      current: function (e) {
        return this.alive && this.revision === e;
      },
      syncTipSession: function () {
        var e = s.current();
        return (
          this.tipScope === e ||
          ((this.tipScope = e),
          this.revision++,
          (this.preparedTipLogin = null),
          (this.intent = this.deferredThanks = null),
          (this.awaitingRecords = this.awaitingRecharge = !1),
          this.stopMotion(),
          this.setData({
            busy: !1,
            tipSending: !1,
            balance: null,
            dialog: '',
            pending: !1,
            foreignPending: !1,
            available: !1,
            offerLoading: !1,
            scene: 'asking',
            motion: 'speaking',
            poseX: 0,
            poseY: 0,
            goldDiscount: !1,
            payableCoins: this.data.coins,
            customPayable: this.data.coins,
            pendingUnpaid: !1,
            offerError: '登录状态已变化，请重新加载打赏',
            message: '上笔结果请在明细中核对。',
          }),
          !1)
        );
      },
      currentTip: function (e, t) {
        return !!this.current(e) && (t === s.current() || (this.syncTipSession(), !1));
      },
      prepareTipLogin: function () {
        var e = s.current(),
          t = this.preparedTipLogin;
        if (t && t.scope === e && Date.now() - t.createdAt < 6e4) return t;
        var i = {
          scope: e,
          createdAt: Date.now(),
        };
        return (
          (i.promise = g().then(
            function (e) {
              return {
                code: e,
              };
            },
            function () {
              return null;
            }
          )),
          (this.preparedTipLogin = i),
          i
        );
      },
      takeTipLogin: function () {
        var i = this;
        return t(
          e().mark(function t() {
            var n, a;
            return e().wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return (
                      (n = i.prepareTipLogin()),
                      (i.preparedTipLogin = null),
                      (e.next = 4),
                      n.promise
                    );

                  case 4:
                    if (((a = e.sent), n.scope === s.current())) {
                      e.next = 7;
                      break;
                    }
                    throw new Error('登录状态已变化，请重新确认');

                  case 7:
                    return e.abrupt('return', a && Date.now() - n.createdAt < 6e4 ? a.code : g());

                  case 8:
                  case 'end':
                    return e.stop();
                }
            }, t);
          })
        )();
      },
      stopMotion: function () {
        ((this.timers || []).forEach(clearTimeout), (this.timers = []));
      },
      settleMotion: function () {
        (this.stopMotion(),
          'leaving' === this.data.motion
            ? this.finishDismiss()
            : 'entering' === this.data.motion &&
              this.setData({
                motion: 'speaking',
              }),
          'thanking' === this.data.scene &&
            (this.setData({
              scene: 'thanks',
            }),
            this.pose(5)));
      },
      later: function (e, t) {
        this.timers.push(setTimeout(e, t));
      },
      pose: function (e) {
        var t = [0, 0, 1, 1, 2, 3][e] || 0;
        this.setData({
          poseX: (-t % 4) * 100,
          poseY: 100 * -Math.floor(t / 4),
        });
      },
      reveal: function () {
        var n = this;
        return t(
          e().mark(function t() {
            var a;
            return e().wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    if (
                      !n.data.shown &&
                      !n.data.dismissed &&
                      n.data.active &&
                      n.data.foreground &&
                      /^\d{4}-\d{2}-\d{2}$/.test(n.data.date)
                    ) {
                      e.next = 2;
                      break;
                    }
                    return e.abrupt('return');

                  case 2:
                    return (
                      (a = r.cached('tip')),
                      n.setData(
                        i(
                          {
                            artSrc: a,
                            shown: !0,
                            motion: n.data.lite || !a ? 'speaking' : 'entering',
                          },
                          ((p = f(c, p)),
                          (l = f(d, l)),
                          {
                            askLead: p,
                            askLine: l,
                          })
                        )
                      ),
                      n.warmArtwork(),
                      n.pose(0),
                      !n.data.lite &&
                        a &&
                        n.later(function () {
                          return n.setData({
                            motion: 'speaking',
                          });
                        }, 2400),
                      (e.next = 9),
                      n.loadOffer()
                    );

                  case 9:
                  case 'end':
                    return e.stop();
                }
            }, t);
          })
        )();
      },
      loadOffer: function () {
        var a = this;
        return t(
          e().mark(function t() {
            var r, c, d, u, p, l, h, f, g, b, v, m;
            return e().wrap(
              function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      if (
                        !a.data.offerLoading &&
                        !a.data.dismissed &&
                        'leaving' !== a.data.motion
                      ) {
                        e.next = 2;
                        break;
                      }
                      return e.abrupt('return', !1);

                    case 2:
                      return (
                        a.syncTipSession(),
                        (r = a.revision),
                        (c = a.tipScope),
                        a.setData({
                          offerLoading: !0,
                          offerError: '',
                        }),
                        (e.prev = 6),
                        (e.next = 9),
                        n.fetchDigestTip(a.data.date)
                      );

                    case 9:
                      if (
                        ((u = e.sent),
                        !a.current(r) || c || a.tipScope || (a.tipScope = s.current()),
                        a.currentTip(r, a.tipScope))
                      ) {
                        e.next = 13;
                        break;
                      }
                      return e.abrupt('return', !1);

                    case 13:
                      if (a.current(r) && !a.data.dismissed && 'leaving' !== a.data.motion) {
                        e.next = 15;
                        break;
                      }
                      return e.abrupt('return', !1);

                    case 15:
                      if (
                        ((p = u.data || {}),
                        (l =
                          !0 === p.enabled &&
                          1 === p.min_coins &&
                          Number.isInteger(p.max_coins) &&
                          p.max_coins >= 9 &&
                          p.max_coins <= 2e4 &&
                          9 === p.default_coins &&
                          (!p.pricing || o.valid(p.pricing, 9, p.pricing.coin_amount))),
                        (a.offerLoaded = !0),
                        (h = p.pending_order),
                        (f = h && 'digest_tip' === h.kind && h.digest_date === a.data.date),
                        (g =
                          l &&
                          !0 === p.gold_discount &&
                          p.pricing &&
                          p.pricing.policy === o.GOLD_POLICY),
                        !f)
                      ) {
                        e.next = 26;
                        break;
                      }
                      if (
                        ((b = h.pricing ? h.pricing.original_coins : h.coin_amount),
                        o.valid(h.pricing, b, h.coin_amount))
                      ) {
                        e.next = 25;
                        break;
                      }
                      throw new Error('订单价格异常，请在明细中核对');

                    case 25:
                      a.intent = {
                        order_id: h.order_id,
                        coins: b,
                        payable: h.coin_amount,
                        date: h.digest_date,
                      };

                    case 26:
                      return (
                        (v = f ? a.intent.coins : a.data.coins),
                        (m = a.intent
                          ? null !== (d = a.intent.payable) && void 0 !== d
                            ? d
                            : a.intent.coins
                          : g
                            ? o.discounted(v)
                            : v),
                        a.setData(
                          i(
                            {
                              available: l,
                              offerError: l ? '' : '打赏暂未开放',
                              minCoins: 1,
                              maxCoins: l ? p.max_coins : 2e4,
                              goldDiscount: Boolean(g),
                              payableCoins: m,
                              customPayable: m,
                              pendingUnpaid: Boolean(f && h.can_cancel),
                              pending: Boolean(f || a.intent),
                              foreignPending: Boolean(h && !f),
                            },
                            f
                              ? {
                                  coins: v,
                                  input: String(v),
                                }
                              : {}
                          )
                        ),
                        e.abrupt('return', l)
                      );

                    case 32:
                      return (
                        (e.prev = 32),
                        (e.t0 = e.catch(6)),
                        a.currentTip(r, a.tipScope) &&
                          a.setData({
                            available: !1,
                            offerError:
                              {
                                NOT_FOUND: '打赏接口尚未上线',
                                API_NOT_FOUND: '打赏接口尚未上线',
                                COIN_NOT_ENABLED: '打赏暂未开放',
                                COIN_NOT_CONFIGURED: '支付配置尚未完成',
                              }[e.t0.code] || '暂时无法打赏，请稍后重试',
                          }),
                        e.abrupt('return', !1)
                      );

                    case 36:
                      return (
                        (e.prev = 36),
                        a.currentTip(r, a.tipScope) &&
                          a.setData({
                            offerLoading: !1,
                          }),
                        e.finish(36)
                      );

                    case 39:
                    case 'end':
                      return e.stop();
                  }
              },
              t,
              null,
              [[6, 32, 36, 39]]
            );
          })
        )();
      },
      dismiss: function () {
        var e = this;
        this.data.busy ||
          'leaving' === this.data.motion ||
          (this.stopMotion(),
          !this.data.lite && this.data.foreground
            ? (this.setData({
                motion: 'leaving',
                available: !1,
                dialog: '',
              }),
              this.later(function () {
                return e.finishDismiss();
              }, 900))
            : this.finishDismiss());
      },
      finishDismiss: function () {
        (this.stopMotion(),
          this.setData({
            dismissed: !0,
            available: !1,
            dialog: '',
            motion: 'waiting',
          }));
      },
      openCustom: function () {
        this.data.busy ||
          this.intent ||
          this.data.foreignPending ||
          !this.data.available ||
          this.setData({
            dialog: 'custom',
            input: String(this.data.coins),
            customPayable: this.data.payableCoins,
            message: '',
            inputError: '',
          });
      },
      changeAmount: function (e) {
        if (!this.data.busy && !this.intent) {
          var t = String(e.detail.value || ''),
            i = b(t, this.data.minCoins, this.data.maxCoins);
          this.setData({
            input: t,
            customPayable: null === i ? 0 : this.data.goldDiscount ? o.discounted(i) : i,
            inputError:
              t && null === i
                ? '请输入 '
                    .concat(this.data.minCoins, '～')
                    .concat(this.data.maxCoins, ' 的整数 i币')
                : '',
          });
        }
      },
      useCustom: function () {
        var i = this;
        return t(
          e().mark(function t() {
            var n;
            return e().wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    if (
                      !i.data.busy &&
                      !i.intent &&
                      'custom' === i.data.dialog &&
                      i.data.foreground &&
                      i.data.active
                    ) {
                      e.next = 2;
                      break;
                    }
                    return e.abrupt('return');

                  case 2:
                    if (null !== (n = b(i.data.input, i.data.minCoins, i.data.maxCoins))) {
                      e.next = 6;
                      break;
                    }
                    return (
                      i.setData({
                        inputError: '请输入 '
                          .concat(i.data.minCoins, '～')
                          .concat(i.data.maxCoins, ' 的整数 i币'),
                      }),
                      e.abrupt('return')
                    );

                  case 6:
                    return (
                      i.setData({
                        coins: n,
                        payableCoins: i.data.goldDiscount ? o.discounted(n) : n,
                        dialog: '',
                      }),
                      (e.next = 9),
                      i.prepareTip()
                    );

                  case 9:
                  case 'end':
                    return e.stop();
                }
            }, t);
          })
        )();
      },
      closeDialog: function () {
        this.data.busy ||
          ((this.preparedTipLogin = null),
          this.setData({
            dialog: '',
          }));
      },
      onWalletRechargeDelivered: function (e) {
        var t = e.balance;
        this.syncTipSession() &&
          this.setData({
            balance: t,
            dialog: '',
            message:
              t >= this.data.payableCoins
                ? '充值已到账，可直接打赏。'
                : '充值已到账，当前余额仍不足本次打赏。',
          });
      },
      prepareTip: function () {
        var i = arguments,
          a = this;
        return t(
          e().mark(function t() {
            var r, s, c, d, u, p, l, h, f;
            return e().wrap(
              function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      if (((r = i.length > 0 && void 0 !== i[0] ? i[0] : {}), a.syncTipSession())) {
                        e.next = 3;
                        break;
                      }
                      return e.abrupt('return');

                    case 3:
                      if (
                        !(
                          a.data.busy ||
                          a.data.dialog ||
                          'asking' !== a.data.scene ||
                          a.data.dismissed
                        ) &&
                        a.data.available &&
                        a.data.foreground &&
                        a.data.active
                      ) {
                        e.next = 5;
                        break;
                      }
                      return e.abrupt('return');

                    case 5:
                      if (((s = !1 !== r.allowRecharge), !a.data.foreignPending)) {
                        e.next = 9;
                        break;
                      }
                      return (s && a.openRecords(), e.abrupt('return'));

                    case 9:
                      if (!a.intent) {
                        e.next = 13;
                        break;
                      }
                      if (!s) {
                        e.next = 12;
                        break;
                      }
                      return e.abrupt('return', a.confirmTip());

                    case 12:
                      return e.abrupt('return');

                    case 13:
                      if (null !== b(a.data.coins, a.data.minCoins, a.data.maxCoins)) {
                        e.next = 16;
                        break;
                      }
                      return (
                        a.setData({
                          message: '打赏金额无效，请重新选择。',
                        }),
                        e.abrupt('return')
                      );

                    case 16:
                      return (
                        a.setData({
                          payableCoins: a.data.goldDiscount
                            ? o.discounted(a.data.coins)
                            : a.data.coins,
                        }),
                        (c = a.revision),
                        (d = a.tipScope),
                        (u = function () {
                          return a.currentTip(c, d);
                        }),
                        a.setData({
                          busy: !0,
                          message: '',
                        }),
                        (p = !1),
                        (l = !1),
                        (e.prev = 22),
                        (e.next = 25),
                        n.fetchMyCoinWallet()
                      );

                    case 25:
                      if (((h = e.sent), u())) {
                        e.next = 28;
                        break;
                      }
                      return e.abrupt('return');

                    case 28:
                      if (((f = h.data && h.data.balance), Number.isInteger(f) && !(f < 0))) {
                        e.next = 31;
                        break;
                      }
                      throw new Error('余额暂不可用，请稍后重试');

                    case 31:
                      (a.setData({
                        balance: f,
                      }),
                        f < a.data.payableCoins
                          ? (p = !1 !== r.allowRecharge) ||
                            a.setData({
                              message: 'i币余额不足，已保留打赏金额，可稍后再赏。',
                            })
                          : (l = s && a.data.foreground && a.data.active),
                        (e.next = 38));
                      break;

                    case 35:
                      ((e.prev = 35),
                        (e.t0 = e.catch(22)),
                        u() &&
                          a.setData({
                            message: e.t0.message || '余额暂不可用，请稍后重试',
                          }));

                    case 38:
                      return (
                        (e.prev = 38),
                        u() &&
                          a.setData({
                            busy: !1,
                          }),
                        e.finish(38)
                      );

                    case 41:
                      if (!p || !u()) {
                        e.next = 46;
                        break;
                      }
                      return ((e.next = 44), a.goRecharge());

                    case 44:
                      e.next = 49;
                      break;

                    case 46:
                      if (!l || !u()) {
                        e.next = 49;
                        break;
                      }
                      return ((e.next = 49), a.confirmTip());

                    case 49:
                    case 'end':
                      return e.stop();
                  }
              },
              t,
              null,
              [[22, 35, 38, 41]]
            );
          })
        )();
      },
      openRecords: function () {
        var e = this;
        !this.data.busy &&
          this.data.foreground &&
          this.data.active &&
          ((this.awaitingRecords = !0),
          this.setData({
            dialog: '',
          }),
          wx.navigateTo({
            url: '/pages/wallet-records/wallet-records?from=digest-tip',
            fail: function () {
              ((e.awaitingRecords = !1),
                e.alive &&
                  e.setData({
                    message: '暂时无法打开明细，请稍后重试',
                  }));
            },
          }));
      },
      refreshAfterRecords: function () {
        var i = this;
        return t(
          e().mark(function t() {
            var a, r, s, o, c;
            return e().wrap(
              function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      if (i.syncTipSession()) {
                        e.next = 2;
                        break;
                      }
                      return e.abrupt('return');

                    case 2:
                      if (
                        ((a = i.revision),
                        (r = i.tipScope),
                        (s = function () {
                          return i.currentTip(a, r);
                        }),
                        (o = i.intent),
                        i.setData({
                          busy: !0,
                        }),
                        (e.prev = 7),
                        !o || !o.order_id)
                      ) {
                        e.next = 17;
                        break;
                      }
                      return ((e.next = 11), n.fetchLoveCallOrder(o.order_id));

                    case 11:
                      if (((c = e.sent), s())) {
                        e.next = 14;
                        break;
                      }
                      return e.abrupt('return');

                    case 14:
                      if (i.validOrder(c.data, o)) {
                        e.next = 16;
                        break;
                      }
                      throw new Error('订单结果不一致，请在明细中核对');

                    case 16:
                      i.consumeReceipt(c.data);

                    case 17:
                      if (!s()) {
                        e.next = 20;
                        break;
                      }
                      return ((e.next = 20), i.loadOffer());

                    case 20:
                      e.next = 25;
                      break;

                    case 22:
                      ((e.prev = 22),
                        (e.t0 = e.catch(7)),
                        s() &&
                          i.setData({
                            message: e.t0.message || '订单状态暂不可用，请稍后重试',
                          }));

                    case 25:
                      return (
                        (e.prev = 25),
                        s() &&
                          i.setData({
                            busy: !1,
                          }),
                        e.finish(25)
                      );

                    case 28:
                    case 'end':
                      return e.stop();
                  }
              },
              t,
              null,
              [[7, 22, 25, 28]]
            );
          })
        )();
      },
      validOrder: function (e, t) {
        var i;
        return (
          e &&
          'digest_tip' === e.kind &&
          e.coin_amount === (null !== (i = t.payable) && void 0 !== i ? i : t.coins) &&
          o.valid(e.pricing, t.coins, e.coin_amount) &&
          e.digest_date === t.date &&
          'string' == typeof e.order_id &&
          (!t.order_id || e.order_id === t.order_id)
        );
      },
      confirmTip: function () {
        var i = this;
        return t(
          e().mark(function t() {
            var a, r, s, c, d, u, p, l, h, f, g;
            return e().wrap(
              function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      if (i.syncTipSession()) {
                        e.next = 2;
                        break;
                      }
                      return e.abrupt('return');

                    case 2:
                      if (
                        !(
                          i.data.busy ||
                          i.data.dialog ||
                          'asking' !== i.data.scene ||
                          i.data.dismissed ||
                          !i.data.available ||
                          i.data.foreignPending
                        ) &&
                        i.data.foreground &&
                        i.data.active
                      ) {
                        e.next = 4;
                        break;
                      }
                      return e.abrupt('return');

                    case 4:
                      return (
                        (a = i.revision),
                        (r = i.tipScope),
                        (s = function () {
                          return i.currentTip(a, r);
                        }),
                        i.intent ||
                          (i.intent = {
                            request_id: 'tip_'
                              .concat(Date.now(), '_')
                              .concat(Math.random().toString(36).slice(2, 12)),
                            coins: i.data.coins,
                            payable: i.data.payableCoins,
                            date: i.data.date,
                          }),
                        (c = i.intent),
                        (d = i.takeTipLogin()),
                        i.stopMotion(),
                        i.setData({
                          busy: !0,
                          tipSending: !0,
                          dialog: '',
                          motion: 'speaking',
                          message: '',
                        }),
                        (u = !1),
                        (e.prev = 13),
                        (e.next = 16),
                        d
                      );

                    case 16:
                      if (((p = e.sent), s() && i.data.foreground && i.data.active)) {
                        e.next = 19;
                        break;
                      }
                      return e.abrupt('return');

                    case 19:
                      if (c.order_id) {
                        e.next = 34;
                        break;
                      }
                      return (
                        (e.next = 22),
                        n.createLoveCallOrder({
                          kind: 'digest_tip',
                          request_id: c.request_id,
                          coins: c.coins,
                          digest_date: c.date,
                        })
                      );

                    case 22:
                      if (((l = e.sent), s())) {
                        e.next = 25;
                        break;
                      }
                      return e.abrupt('return');

                    case 25:
                      if (((h = l.data), i.validOrder(h, c))) {
                        e.next = 33;
                        break;
                      }
                      if (
                        !(
                          h &&
                          'digest_tip' === h.kind &&
                          h.digest_date === c.date &&
                          h.can_cancel &&
                          o.valid(h.pricing, c.coins, h.coin_amount)
                        )
                      ) {
                        e.next = 32;
                        break;
                      }
                      throw (
                        (c.order_id = h.order_id),
                        (c.payable = h.coin_amount),
                        i.setData({
                          payableCoins: h.coin_amount,
                          pendingUnpaid: !0,
                        }),
                        new Error('价格已更新，请核对金额后重新确认，尚未发起扣款')
                      );

                    case 32:
                      throw new Error('订单金额或早报日期不一致，已停止扣款');

                    case 33:
                      c.order_id = l.data.order_id;

                    case 34:
                      if (s() && i.data.foreground && i.data.active) {
                        e.next = 36;
                        break;
                      }
                      return e.abrupt('return');

                    case 36:
                      return ((e.next = 38), n.confirmLoveCallOrder(c.order_id, p));

                    case 38:
                      if (((f = e.sent), s())) {
                        e.next = 41;
                        break;
                      }
                      return e.abrupt('return');

                    case 41:
                      if (((g = f.data), i.validOrder(g, c))) {
                        e.next = 44;
                        break;
                      }
                      throw new Error('订单结果不一致，请在明细中核对');

                    case 44:
                      ((u = i.consumeReceipt(g)), (e.next = 59));
                      break;

                    case 47:
                      if (((e.prev = 47), (e.t0 = e.catch(13)), s())) {
                        e.next = 51;
                        break;
                      }
                      return e.abrupt('return');

                    case 51:
                      if ('ORDER_PENDING' !== e.t0.code) {
                        e.next = 57;
                        break;
                      }
                      return ((i.intent = null), (e.next = 55), i.loadOffer());

                    case 55:
                      e.next = 58;
                      break;

                    case 57:
                      ['INVALID_TIP_AMOUNT', 'INVALID_DIGEST_DATE', 'INVALID_REQUEST_ID'].includes(
                        e.t0.code
                      ) && (i.intent = null);

                    case 58:
                      s() &&
                        i.setData({
                          pending: Boolean(i.intent),
                          message: e.t0.message || '打赏结果待确认，请勿重复提交新订单。',
                        });

                    case 59:
                      return (
                        (e.prev = 59),
                        s() &&
                          i.setData({
                            busy: !1,
                            tipSending: !1,
                            pending: Boolean(i.intent),
                          }),
                        e.finish(59)
                      );

                    case 62:
                      if (!u || !s()) {
                        e.next = 65;
                        break;
                      }
                      return ((e.next = 65), i.goRecharge());

                    case 65:
                    case 'end':
                      return e.stop();
                  }
              },
              t,
              null,
              [[13, 47, 59, 62]]
            );
          })
        )();
      },
      consumeReceipt: function (e) {
        if ('delivered' === e.status)
          ((this.intent = null),
            this.setData({
              pending: !1,
              dialog: '',
              message: '',
              balance:
                Number.isInteger(e.platform_balance) && e.platform_balance >= 0
                  ? e.platform_balance
                  : null,
            }),
            this.playThanks(e));
        else {
          if ('failed' === e.status || 'refunded' === e.status) {
            this.intent = null;
            var t = 'failed' === e.status && 'INSUFFICIENT_COINS' === e.error_code;
            return (
              this.setData({
                pending: !1,
                dialog: '',
                message: t ? 'i币余额不足，本次未完成打赏。' : '本次打赏未完成，请在明细中查看。',
              }),
              t
            );
          }
          this.setData({
            pending: !0,
            pendingUnpaid: Boolean(e.can_cancel),
            message: '打赏结果待确认，请继续确认同一订单，不会重复扣款。',
          });
        }
        return !1;
      },
      playThanks: function (e) {
        e &&
          'delivered' === e.status &&
          'digest_tip' === e.kind &&
          e.digest_date === this.data.date &&
          !this.completed.has(e.order_id) &&
          (this.data.foreground
            ? (this.completed.add(e.order_id), this.animateThanks())
            : (this.deferredThanks = e));
      },
      animateThanks: function () {
        var e = this;
        (this.stopMotion(),
          (h = f(u, h)),
          this.setData({
            scene: this.data.lite ? 'thanks' : 'thanking',
            motion: 'speaking',
            thanksLine: h,
          }),
          wx.vibrateShort &&
            wx.vibrateShort({
              type: 'light',
              fail: function () {},
            }),
          this.data.lite
            ? this.pose(5)
            : (this.pose(2),
              this.later(function () {
                return e.pose(3);
              }, 300),
              this.later(function () {
                return e.pose(4);
              }, 650),
              this.later(function () {
                return e.pose(3);
              }, 1150),
              this.later(function () {
                return e.pose(4);
              }, 1500),
              this.later(function () {
                (e.pose(5),
                  e.setData({
                    scene: 'thanks',
                  }));
              }, 2200)));
      },
    }
  ),
});
