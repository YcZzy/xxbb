'use strict';

require('../@babel/runtime/helpers/Arrayincludes');

var e = require('../@babel/runtime/helpers/slicedToArray'),
  a = require('../@babel/runtime/helpers/objectSpread2'),
  r = require('../@babel/runtime/helpers/regeneratorRuntime'),
  t = require('../@babel/runtime/helpers/asyncToGenerator'),
  s = require('../services/api'),
  i = require('../config/env'),
  n = require('./favorite-anchor-recharge'),
  o = require('./coin-pricing'),
  c = {
    anchor: 2999,
    mascot: 998,
    benefit: 0,
  },
  u = {
    INSUFFICIENT_COINS: '余额已变化，本单未扣费，请重新确认',
    COIN_UNPUBLISHED: 'i币暂不可用，本单未扣费',
    CHECKOUT_EXPIRED: '确认已过期，请取消后重新查询，尚未购买',
    USER_CANCELLED: '已取消，未扣费',
    ANCHOR_UNAVAILABLE: '该主播暂不支持新增，未扣费',
    DELIVERY_REVIEW_REQUIRED: '已扣费，主播状态有变化，请联系管理员处理此订单',
  },
  f = {
    setFavoritePurchaseOffer: function (e) {
      var a = e.promotion,
        r =
          a &&
          !0 === a.available &&
          998 === a.coin_amount &&
          'ibo_starlight' === a.mascot_code &&
          1 === a.free_additions &&
          1e3 * Number(a.ends_at) > Date.now(),
        t = new Date(1e3 * Number((a && a.ends_at) || 0) + 288e5),
        s = function (e) {
          return String(e).padStart(2, '0');
        },
        i = o.valid(e.pricing, c.anchor, e.coin_amount);
      (this.setData({
        favoritePurchaseEnabled: 'user' === e.access_scope && !0 === e.enabled && i,
        favoriteAnchorPrice: i ? e.coin_amount : c.anchor,
        favoriteAnchorPricing: (i && e.pricing) || null,
        favoritePurchasePrivateReady: 'user' === e.access_scope,
        favoriteStandaloneSupported: !0 === e.standalone_mascot_supported,
        favoriteMascotThemeGift: Boolean(
          e.mascot_theme_gift &&
          'ibo_soft_gold' === e.mascot_theme_gift.theme_code &&
          !0 === e.mascot_theme_gift.permanent
        ),
        favoritePurchasePromotion: r ? a : null,
        favoritePurchaseBenefit: e.benefit || null,
        favoritePurchaseEndText: r
          ? ''
              .concat(t.getUTCMonth() + 1, '月')
              .concat(t.getUTCDate(), '日 ')
              .concat(s(t.getUTCHours()), ':')
              .concat(s(t.getUTCMinutes()), ' 截止')
          : '',
        favoriteMascotOwned: Boolean(e.benefit && e.benefit.mascot_owned),
      }),
        this.mascotSkinItems &&
          this.setData({
            mascotSkinItems: this.mascotSkinItems(this.data.mascotSkinCampaign),
          }));
    },
    openStandaloneMascotPurchase: function () {
      var e = this;
      return t(
        r().mark(function a() {
          var t, s, i;
          return r().wrap(function (a) {
            for (;;)
              switch ((a.prev = a.next)) {
                case 0:
                  if (
                    !(
                      e.data.favoritePurchaseBusy ||
                      e.data.favoritePurchaseLoading ||
                      e.favoritePurchaseAction
                    )
                  ) {
                    a.next = 2;
                    break;
                  }
                  return a.abrupt('return');

                case 2:
                  return (
                    e.cancelFavoriteLookup(),
                    (t = e.favoriteLookupGeneration),
                    (s = e.data.favoritePurchaseOrder),
                    (i = s && ['prepared', 'pending', 'paid'].includes(s.status)),
                    e.setData({
                      mascotSkinSheetVisible: !1,
                      favoritePickerVisible: !1,
                      favoriteAnchorRequestDialogVisible: !0,
                      favoritePurchaseDetails: !1,
                      favoritePurchaseMessage: '',
                    }),
                    i ||
                      ((e.favoritePurchaseRequest = null),
                      e.setData({
                        favoritePurchaseStandalone: !0,
                        favoritePurchaseBenefitOnly: !1,
                        favoritePurchaseOrder: null,
                        favoritePurchaseStage: 'review',
                        favoriteAnchorRequestAccount: '',
                        favoritePurchaseKind: 'mascot',
                        favoritePurchaseBalance: null,
                        favoritePurchasePrice: 998,
                        favoritePurchasePrimary: '加载购买状态',
                        favoritePurchaseProfile: {
                          account: '',
                          nickname: 'i播播了么吉祥物',
                          initial: 'i',
                          standalone: !0,
                        },
                      })),
                    (a.next = 10),
                    e.loadFavoritePurchaseOffer()
                  );

                case 10:
                  if (!e.favoritePurchaseDisposed && t === e.favoriteLookupGeneration) {
                    a.next = 12;
                    break;
                  }
                  return a.abrupt('return');

                case 12:
                  if (!e.data.favoritePurchaseOrder) {
                    a.next = 16;
                    break;
                  }
                  (e.setData({
                    favoritePurchaseMessage: '已有未完成订单，请先确认或取消，不会新建扣费',
                  }),
                    (a.next = 27));
                  break;

                case 16:
                  if (e.data.favoriteMascotOwned) {
                    a.next = 27;
                    break;
                  }
                  if (e.data.favoriteStandaloneSupported) {
                    a.next = 21;
                    break;
                  }
                  (e.setData({
                    favoritePurchaseMessage: '独立购买暂未就绪，请稍后重试，未扣费',
                  }),
                    (a.next = 27));
                  break;

                case 21:
                  if (e.data.favoritePurchasePromotion && e.data.favoritePurchaseEnabled) {
                    a.next = 25;
                    break;
                  }
                  (e.setData({
                    favoritePurchaseMessage: '本次限时购买暂不可用，未扣费',
                  }),
                    (a.next = 27));
                  break;

                case 25:
                  return ((a.next = 27), e.refreshFavoritePurchaseWallet());

                case 27:
                  e.updateFavoritePurchaseSummary();

                case 28:
                case 'end':
                  return a.stop();
              }
          }, a);
        })
      )();
    },
    activatePurchasedMascot: function () {
      var e = this;
      return t(
        r().mark(function a() {
          return r().wrap(
            function (a) {
              for (;;)
                switch ((a.prev = a.next)) {
                  case 0:
                    if (!e.data.favoritePurchaseBusy) {
                      a.next = 2;
                      break;
                    }
                    return a.abrupt('return');

                  case 2:
                    if (
                      (e.setData({
                        favoritePurchaseBusy: !0,
                      }),
                      (a.prev = 3),
                      !e.loadMascotSkinState)
                    ) {
                      a.next = 7;
                      break;
                    }
                    return (
                      (a.next = 7),
                      e.loadMascotSkinState(void 0, {
                        fresh: !0,
                      })
                    );

                  case 7:
                    if (e.data.favoriteMascotOwned) {
                      a.next = 9;
                      break;
                    }
                    throw new Error('权益尚未确认，请稍后刷新');

                  case 9:
                    (e.applyMascotSkin && e.applyMascotSkin('ibo_starlight'),
                      e.setData({
                        favoriteAnchorRequestDialogVisible: !1,
                      }),
                      (a.next = 16));
                    break;

                  case 13:
                    ((a.prev = 13),
                      (a.t0 = a.catch(3)),
                      e.setData({
                        favoritePurchaseMessage: a.t0.message || '暂时无法读取权益',
                      }));

                  case 16:
                    return (
                      (a.prev = 16),
                      e.setData({
                        favoritePurchaseBusy: !1,
                      }),
                      a.finish(16)
                    );

                  case 19:
                  case 'end':
                    return a.stop();
                }
            },
            a,
            null,
            [[3, 13, 16, 19]]
          );
        })
      )();
    },
    useStandaloneMascotBenefit: function () {
      var e = this;
      return t(
        r().mark(function a() {
          var t, i;
          return r().wrap(
            function (a) {
              for (;;)
                switch ((a.prev = a.next)) {
                  case 0:
                    if (
                      ((t = e.data.favoritePurchaseOrder),
                      !(
                        e.data.favoritePurchaseBusy ||
                        (t && ['prepared', 'pending', 'paid'].includes(t.status))
                      ))
                    ) {
                      a.next = 3;
                      break;
                    }
                    return a.abrupt('return');

                  case 3:
                    return (
                      e.setData({
                        favoritePurchaseBusy: !0,
                        favoritePurchaseMessage: '',
                      }),
                      (a.prev = 4),
                      (a.next = 7),
                      s.fetchFavoriteAnchorPurchaseOffer()
                    );

                  case 7:
                    if (
                      ((i = a.sent),
                      e.setFavoritePurchaseOffer(i.data || {}),
                      !i.data.pending_order)
                    ) {
                      a.next = 13;
                      break;
                    }
                    return (
                      e.setFavoritePurchaseOrder(i.data.pending_order),
                      e.setData({
                        favoritePurchaseMessage: '请先处理已有订单，赋能未消耗',
                      }),
                      a.abrupt('return')
                    );

                  case 13:
                    if (
                      e.data.favoritePurchaseBenefit &&
                      e.data.favoritePurchaseBenefit.available
                    ) {
                      a.next = 16;
                      break;
                    }
                    return (
                      e.setData({
                        favoritePurchaseMessage: '当前没有可用赋能，不会转为付费添加',
                      }),
                      a.abrupt('return')
                    );

                  case 16:
                    ((e.favoritePurchaseRequest = null),
                      e.setData({
                        favoritePurchaseStandalone: !1,
                        favoritePurchaseBenefitOnly: !0,
                        favoritePurchaseOrder: null,
                        favoritePurchaseProfile: null,
                        favoritePurchaseStage: 'input',
                        favoritePurchaseKind: 'benefit',
                        favoriteAnchorRequestAccount: '',
                        favoritePurchaseMessage: '1 次免费添加赋能，确认添加后才消耗',
                      }),
                      (a.next = 23));
                    break;

                  case 20:
                    ((a.prev = 20),
                      (a.t0 = a.catch(4)),
                      e.setData({
                        favoritePurchaseMessage: a.t0.message || '暂时无法读取赋能，请稍后重试',
                      }));

                  case 23:
                    return (
                      (a.prev = 23),
                      e.setData({
                        favoritePurchaseBusy: !1,
                      }),
                      e.updateFavoritePurchaseSummary(),
                      a.finish(23)
                    );

                  case 27:
                  case 'end':
                    return a.stop();
                }
            },
            a,
            null,
            [[4, 20, 23, 27]]
          );
        })
      )();
    },
    onFavoritePurchaseAvatarError: function () {
      this.data.favoritePurchaseProfile &&
        this.setData({
          favoritePurchaseProfile: a(
            a({}, this.data.favoritePurchaseProfile),
            {},
            {
              avatar_url: '',
            }
          ),
        });
    },
    loadFavoritePurchaseOffer: function () {
      var e = this;
      return t(
        r().mark(function a() {
          var t;
          return r().wrap(
            function (a) {
              for (;;)
                switch ((a.prev = a.next)) {
                  case 0:
                    if (!e.data.favoritePurchaseLoading && !e.favoritePurchaseAction) {
                      a.next = 2;
                      break;
                    }
                    return a.abrupt('return');

                  case 2:
                    return (
                      e.setData({
                        favoritePurchaseLoading: !0,
                      }),
                      (a.prev = 3),
                      (a.next = 6),
                      s.fetchFavoriteAnchorPurchaseOffer()
                    );

                  case 6:
                    if (
                      ((t = a.sent),
                      e.setFavoritePurchaseOffer(t.data || {}),
                      !t.data.pending_order)
                    ) {
                      a.next = 13;
                      break;
                    }
                    if (
                      (e.setFavoritePurchaseOrder(t.data.pending_order),
                      !(t.data.pending_order.coin_amount > 0))
                    ) {
                      a.next = 13;
                      break;
                    }
                    return ((a.next = 13), e.refreshFavoritePurchaseWallet());

                  case 13:
                    (e.data.favoritePurchaseEnabled ||
                      e.setData({
                        favoritePurchaseMessage: e.data.favoritePurchasePrivateReady
                          ? '立即新增暂未开放，可先免费推荐'
                          : '专属守候正在升级，可先免费推荐',
                      }),
                      (a.next = 19));
                    break;

                  case 16:
                    ((a.prev = 16),
                      (a.t0 = a.catch(3)),
                      e.setData({
                        favoritePurchaseEnabled: !1,
                        favoriteStandaloneSupported: !1,
                        favoritePurchasePromotion: null,
                        favoritePurchaseMessage: ['NOT_FOUND', 'API_NOT_FOUND'].includes(a.t0.code)
                          ? '立即新增即将开放，免费推荐不受影响'
                          : '暂时无法读取新增服务，请稍后重试',
                      }));

                  case 19:
                    return (
                      (a.prev = 19),
                      e.setData({
                        favoritePurchaseLoading: !1,
                      }),
                      e.updateFavoritePurchaseSummary(),
                      a.finish(19)
                    );

                  case 23:
                  case 'end':
                    return a.stop();
                }
            },
            a,
            null,
            [[3, 16, 19, 23]]
          );
        })
      )();
    },
    refreshFavoritePurchaseWallet: function () {
      var a = this;
      return t(
        r().mark(function t() {
          var i, n, o, c, u, f;
          return r().wrap(
            function (r) {
              for (;;)
                switch ((r.prev = r.next)) {
                  case 0:
                    return (
                      a.setData({
                        favoritePurchaseBalance: null,
                        favoritePurchaseBalanceText: '--',
                      }),
                      (r.prev = 1),
                      (r.next = 4),
                      Promise.all([
                        s.fetchFavoriteAnchorWallet(),
                        s.fetchLoveCallCenter().catch(function () {
                          return null;
                        }),
                      ])
                    );

                  case 4:
                    if (
                      ((i = r.sent),
                      (n = e(i, 2)),
                      (o = n[0]),
                      (c = n[1]),
                      (a.favoriteRechargeCenter = c && c.data),
                      (u = o.data && o.data.balance),
                      Number.isInteger(u) && !(u < 0))
                    ) {
                      r.next = 12;
                      break;
                    }
                    throw new Error('余额暂不可用');

                  case 12:
                    (a.setData({
                      favoritePurchaseBalance: u,
                      favoritePurchaseBalanceText: String(u),
                    }),
                      (r.next = 19));
                    break;

                  case 15:
                    ((r.prev = 15),
                      (r.t0 = r.catch(1)),
                      (f = a.data.favoritePurchaseOrder),
                      a.setData({
                        favoritePurchaseMessage:
                          f && 'prepared' !== f.status
                            ? '订单状态以上方结果为准，钱包余额暂未同步'
                            : '暂时读不到余额，请点击刷新；不会发起扣费',
                      }));

                  case 19:
                    a.updateFavoritePurchaseSummary();

                  case 20:
                  case 'end':
                    return r.stop();
                }
            },
            t,
            null,
            [[1, 15]]
          );
        })
      )();
    },
    favoriteRechargeState: function () {
      var e = this.data.favoritePurchaseOrder;
      return e ? n.read(e.order_id) : null;
    },
    updateFavoritePurchaseSummary: function () {
      var e = this.data.favoritePurchaseOrder,
        a = e ? e.purchase_kind : this.data.favoritePurchaseKind,
        r = e ? e.coin_amount : 'anchor' === a ? this.data.favoriteAnchorPrice : c[a],
        t = this.data.favoritePurchaseBalance,
        s = this.favoriteRechargeState(),
        i = n.quote(this.favoriteRechargeCenter, t, r),
        o = this.data.favoritePurchaseProfile,
        u = 'benefit' === a ? '使用权益，免费添加' : '确认购买 · '.concat(r, ' i币');
      (e && 'prepared' !== e.status
        ? (u =
            {
              pending: '继续确认原订单',
              paid: '继续完成订单',
              failed: '重新输入',
              already_exists: '选为我的爱播',
            }[e.status] || ('mascot' === a ? '使用赠送权益添加这位爱播' : '选为我的爱播'))
        : o && o.already_monitored
          ? (u = '免费选为我的爱播')
          : s
            ? (u = s.settled ? '核对充值余额' : '继续核对充值')
            : r > 0 && null === t
              ? (u = '刷新余额')
              : r > t && (u = i ? '充值 i币' : '读取充值金额'),
        this.data.favoritePurchaseStandalone &&
          ((!e && this.data.favoriteMascotOwned) || (e && 'delivered' === e.status)
            ? (u = '使用形象')
            : (e && 'prepared' !== e.status) ||
                (this.data.favoriteStandaloneSupported &&
                  this.data.favoritePurchasePromotion &&
                  this.data.favoritePurchaseEnabled)
              ? e && 'failed' === e.status && (u = '返回收藏')
              : (u = '刷新购买状态')),
        this.setData({
          favoritePurchaseKind: a,
          favoritePurchasePrice: r,
          favoritePurchaseDiscounted: 'anchor' === a && r > 0 && r < c.anchor,
          favoritePurchasePlan: i,
          favoritePurchaseShortage: null === t ? 0 : Math.max(0, r - t),
          favoritePurchaseRechargePending: Boolean(s),
          favoritePurchaseRechargeAmountText: s ? n.yuan(s.coins) : '',
          favoritePurchasePrimary: u,
        }));
    },
    setFavoritePurchaseOrder: function (e) {
      var r = (e && e.purchase_kind) || 'anchor';
      if (
        !e ||
        !['prepared', 'pending', 'paid', 'delivered', 'failed', 'already_exists'].includes(
          e.status
        ) ||
        void 0 === c[r] ||
        (!['failed', 'already_exists'].includes(e.status) &&
          !('anchor' === r ? o.valid(e.pricing, c.anchor, e.coin_amount) : e.coin_amount === c[r]))
      )
        throw new Error('订单信息异常，已停止支付');
      var t = String(e.avatar_url || ''),
        s = a(
          a({}, e),
          {},
          {
            purchase_kind: r,
            initial: String(e.nickname || '?').slice(0, 1),
            avatar_url: t.startsWith('/') ? i.API_BASE_URL + t : t,
          }
        );
      if (
        ('prepared' !== e.status && n.clear(e.order_id),
        e.standalone && ('mascot' !== r || '' !== e.account))
      )
        throw new Error('独立订单信息异常，已停止支付');
      (this.setData({
        favoritePurchaseOrder: s,
        favoritePurchaseStage: 'payment',
        favoritePurchaseStandalone: !0 === e.standalone,
        favoritePurchaseProfile: s,
        favoriteAnchorRequestAccount: e.account,
        favoritePurchaseMessage:
          u[e.error_code] ||
          {
            prepared: '',
            pending: '购买结果确认中，请继续原订单，不要重复付款',
            paid: '已扣费，正在完成发放，请继续原订单',
            delivered:
              'mascot' === r
                ? '吉祥物已解锁，1 次免费添加权益已到账，尚未使用。'
                : '已加入你的专属守候列表',
            already_exists: '你已可守候这位爱播，无需重复购买',
            failed: '本次未完成购买，已充值的 i币仍保留在钱包',
          }[e.status],
      }),
        this.updateFavoritePurchaseSummary());
    },
    prepareFavoriteAnchorPurchase: function () {
      var e = this;
      return t(
        r().mark(function t() {
          var n, o, c, u, f, h, d, v;
          return r().wrap(
            function (r) {
              for (;;)
                switch ((r.prev = r.next)) {
                  case 0:
                    if (
                      !(
                        e.data.favoritePurchaseBusy ||
                        e.data.favoriteAnchorRequestSaving ||
                        e.data.favoritePurchaseLoading
                      )
                    ) {
                      r.next = 2;
                      break;
                    }
                    return r.abrupt('return');

                  case 2:
                    if (e.data.favoritePurchaseEnabled) {
                      r.next = 7;
                      break;
                    }
                    return ((r.next = 5), e.loadFavoritePurchaseOffer());

                  case 5:
                    if (e.data.favoritePurchaseEnabled) {
                      r.next = 7;
                      break;
                    }
                    return r.abrupt('return');

                  case 7:
                    if (!e.data.favoritePurchaseOrder) {
                      r.next = 9;
                      break;
                    }
                    return r.abrupt('return');

                  case 9:
                    if (
                      ((n = String(e.data.favoriteAnchorRequestAccount || '')
                        .trim()
                        .replace(/^@+/, '')
                        .trim()
                        .toLowerCase()),
                      /^[a-z0-9_.-]{3,64}$/.test(n))
                    ) {
                      r.next = 13;
                      break;
                    }
                    return (
                      e.setData({
                        favoritePurchaseMessage: '请输入完整抖音号，点和下划线也要填写',
                      }),
                      r.abrupt('return')
                    );

                  case 13:
                    return (
                      e.cancelFavoriteLookup(),
                      (o = e.favoriteLookupGeneration),
                      e.setData({
                        favoritePurchaseBusy: !0,
                        favoritePurchaseStage: 'lookup',
                        favoritePurchaseProfile: null,
                        favoritePurchaseMessage: '',
                        favoritePurchaseDetails: !1,
                      }),
                      (r.prev = 16),
                      (r.next = 19),
                      s.startFavoriteAnchorLookup(n)
                    );

                  case 19:
                    ((c = r.sent), (u = Date.now() + 9e4));

                  case 21:
                    if (o !== e.favoriteLookupGeneration) {
                      r.next = 68;
                      break;
                    }
                    if ('ready' !== (f = c.data || {}).status) {
                      r.next = 51;
                      break;
                    }
                    if (f.account === n && f.nickname && f.lookup_id) {
                      r.next = 26;
                      break;
                    }
                    throw new Error('资料不完整，请重新查询');

                  case 26:
                    return ((r.next = 28), s.fetchFavoriteAnchorPurchaseOffer());

                  case 28:
                    if (((h = r.sent), o === e.favoriteLookupGeneration)) {
                      r.next = 31;
                      break;
                    }
                    return r.abrupt('return');

                  case 31:
                    if ((e.setFavoritePurchaseOffer(h.data || {}), !h.data.pending_order)) {
                      r.next = 38;
                      break;
                    }
                    if (
                      (e.setFavoritePurchaseOrder(h.data.pending_order),
                      !(h.data.pending_order.coin_amount > 0))
                    ) {
                      r.next = 37;
                      break;
                    }
                    return ((r.next = 37), e.refreshFavoritePurchaseWallet());

                  case 37:
                    return r.abrupt('return');

                  case 38:
                    if (
                      !e.data.favoritePurchaseBenefitOnly ||
                      f.already_monitored ||
                      (e.data.favoritePurchaseBenefit && e.data.favoritePurchaseBenefit.available)
                    ) {
                      r.next = 40;
                      break;
                    }
                    throw new Error('免费添加赋能已失效或使用，不会转为付费添加');

                  case 40:
                    if (
                      ((d = String(f.avatar_url || '')),
                      (v = f.already_monitored
                        ? 'anchor'
                        : e.data.favoritePurchaseBenefit && e.data.favoritePurchaseBenefit.available
                          ? 'benefit'
                          : e.data.favoritePurchasePromotion
                            ? 'mascot'
                            : 'anchor'),
                      e.setData({
                        favoritePurchaseProfile: a(
                          a({}, f),
                          {},
                          {
                            initial: f.nickname.slice(0, 1),
                            avatar_url: d.startsWith('/') ? i.API_BASE_URL + d : d,
                          }
                        ),
                        favoritePurchaseKind: v,
                      }),
                      'benefit' === v || f.already_monitored)
                    ) {
                      r.next = 46;
                      break;
                    }
                    return ((r.next = 46), e.refreshFavoritePurchaseWallet());

                  case 46:
                    if (o === e.favoriteLookupGeneration) {
                      r.next = 48;
                      break;
                    }
                    return r.abrupt('return');

                  case 48:
                    return (
                      e.setData({
                        favoritePurchaseStage: 'review',
                      }),
                      e.updateFavoritePurchaseSummary(),
                      r.abrupt('return')
                    );

                  case 51:
                    if ('failed' !== f.status) {
                      r.next = 53;
                      break;
                    }
                    throw new Error(f.message || '暂未取得资料，请稍后重试');

                  case 53:
                    if (['queued', 'running'].includes(f.status) && f.lookup_id) {
                      r.next = 55;
                      break;
                    }
                    throw new Error('查询结果异常，请稍后重试');

                  case 55:
                    if (!(Date.now() >= u)) {
                      r.next = 57;
                      break;
                    }
                    throw new Error('查询较慢，请稍后重试，尚未扣费');

                  case 57:
                    return (
                      e.setData({
                        favoritePurchaseMessage:
                          'queued' === f.status
                            ? '正在排队查找，尚未扣费'
                            : '正在核实主播资料，尚未扣费',
                      }),
                      (r.next = 60),
                      new Promise(function (a) {
                        ((e.favoriteLookupWait = a), (e.favoriteLookupTimer = setTimeout(a, 1200)));
                      })
                    );

                  case 60:
                    if (((e.favoriteLookupWait = null), o === e.favoriteLookupGeneration)) {
                      r.next = 63;
                      break;
                    }
                    return r.abrupt('return');

                  case 63:
                    return ((r.next = 65), s.fetchFavoriteAnchorLookup(f.lookup_id));

                  case 65:
                    ((c = r.sent), (r.next = 21));
                    break;

                  case 68:
                    r.next = 75;
                    break;

                  case 70:
                    if (((r.prev = 70), (r.t0 = r.catch(16)), o === e.favoriteLookupGeneration)) {
                      r.next = 74;
                      break;
                    }
                    return r.abrupt('return');

                  case 74:
                    e.setData({
                      favoritePurchaseStage: 'input',
                      favoritePurchaseMessage: r.t0.message || '查询失败，尚未扣费',
                    });

                  case 75:
                    return (
                      (r.prev = 75),
                      o === e.favoriteLookupGeneration &&
                        e.setData({
                          favoritePurchaseBusy: !1,
                        }),
                      r.finish(75)
                    );

                  case 78:
                  case 'end':
                    return r.stop();
                }
            },
            t,
            null,
            [[16, 70, 75, 78]]
          );
        })
      )();
    },
    cancelFavoriteLookup: function () {
      ((this.favoriteLookupGeneration = (this.favoriteLookupGeneration || 0) + 1),
        clearTimeout(this.favoriteLookupTimer),
        this.favoriteLookupWait && this.favoriteLookupWait(),
        (this.favoriteLookupWait = null),
        'lookup' === this.data.favoritePurchaseStage &&
          this.setData({
            favoritePurchaseStage: 'input',
            favoritePurchaseBusy: !1,
          }));
    },
    chooseFavoritePurchase: function (e) {
      if (
        !(
          this.data.favoritePurchaseBusy ||
          this.data.favoritePurchaseStandalone ||
          this.data.favoritePurchaseOrder
        ) &&
        this.data.favoritePurchasePromotion
      ) {
        var a = e.detail.value;
        ['anchor', 'mascot'].includes(a) &&
          (this.setData({
            favoritePurchaseKind: a,
            favoritePurchaseMessage: '',
          }),
          this.updateFavoritePurchaseSummary());
      }
    },
    toggleFavoritePurchaseDetails: function () {
      this.setData({
        favoritePurchaseDetails: !this.data.favoritePurchaseDetails,
      });
    },
    createFavoritePurchaseCheckout: function (e) {
      var i = this;
      return t(
        r().mark(function t() {
          var n, o, c;
          return r().wrap(function (r) {
            for (;;)
              switch ((r.prev = r.next)) {
                case 0:
                  if (
                    ((n = i.data.favoritePurchaseProfile),
                    !(o = i.data.favoritePurchaseStandalone) ||
                      ('mascot' === e && i.data.favoriteStandaloneSupported))
                  ) {
                    r.next = 4;
                    break;
                  }
                  throw new Error('独立购买暂未就绪，未扣费');

                case 4:
                  return (
                    (i.favoritePurchaseRequest &&
                      i.favoritePurchaseRequest.douyin_account === n.account &&
                      i.favoritePurchaseRequest.purchase_kind === e &&
                      Boolean(i.favoritePurchaseRequest.standalone) === o) ||
                      (i.favoritePurchaseRequest = a(
                        a(
                          {
                            douyin_account: n.account,
                            purchase_kind: e,
                          },
                          o
                            ? {
                                standalone: !0,
                              }
                            : {}
                        ),
                        {},
                        {
                          request_id: 'anchor_'
                            .concat(Date.now(), '_')
                            .concat(Math.random().toString(36).slice(2, 12)),
                        }
                      )),
                    (r.next = 7),
                    s.createFavoriteAnchorPurchase(
                      a(
                        a({}, i.favoritePurchaseRequest),
                        {},
                        {
                          lookup_id: n.lookup_id,
                        }
                      )
                    )
                  );

                case 7:
                  if (
                    (c = r.sent).data.account === n.account &&
                    (c.data.purchase_kind || 'anchor') === e &&
                    (!0 === c.data.standalone) === o
                  ) {
                    r.next = 10;
                    break;
                  }
                  throw new Error('订单项目不一致，已停止支付');

                case 10:
                  i.setFavoritePurchaseOrder(c.data);

                case 11:
                case 'end':
                  return r.stop();
              }
          }, t);
        })
      )();
    },
    submitFavoritePurchase: function () {
      var e = this;
      return t(
        r().mark(function a() {
          var t, i, n, o, c, u, f, h, d, v, P, l;
          return r().wrap(
            function (a) {
              for (;;)
                switch ((a.prev = a.next)) {
                  case 0:
                    if (
                      !(
                        e.data.favoritePurchaseBusy ||
                        e.data.favoritePurchaseLoading ||
                        e.favoritePurchaseAction
                      )
                    ) {
                      a.next = 2;
                      break;
                    }
                    return a.abrupt('return');

                  case 2:
                    if (((t = e.data.favoritePurchaseOrder), !e.data.favoritePurchaseStandalone)) {
                      a.next = 8;
                      break;
                    }
                    if (!((!t && e.data.favoriteMascotOwned) || (t && 'delivered' === t.status))) {
                      a.next = 6;
                      break;
                    }
                    return a.abrupt('return', e.activatePurchasedMascot());

                  case 6:
                    if (
                      (t && 'prepared' !== t.status) ||
                      (e.data.favoriteStandaloneSupported &&
                        e.data.favoritePurchasePromotion &&
                        e.data.favoritePurchaseEnabled)
                    ) {
                      a.next = 8;
                      break;
                    }
                    return a.abrupt('return', e.openStandaloneMascotPurchase());

                  case 8:
                    if (e.data.favoritePurchasePrivateReady) {
                      a.next = 11;
                      break;
                    }
                    return (
                      e.setData({
                        favoritePurchaseMessage: '专属守候正在升级，未发起购买，可先免费推荐',
                      }),
                      a.abrupt('return')
                    );

                  case 11:
                    if (
                      ((i = e.data.favoritePurchaseOrder), (n = e.data.favoritePurchaseProfile))
                    ) {
                      a.next = 15;
                      break;
                    }
                    return a.abrupt('return');

                  case 15:
                    if (!i || 'failed' !== i.status) {
                      a.next = 17;
                      break;
                    }
                    return a.abrupt('return', e.resetFavoriteAnchorPurchase());

                  case 17:
                    if (!i || !['delivered', 'already_exists'].includes(i.status)) {
                      a.next = 21;
                      break;
                    }
                    if ('mascot' !== i.purchase_kind || 'delivered' !== i.status) {
                      a.next = 20;
                      break;
                    }
                    return a.abrupt('return', e.useFavoritePurchaseGift());

                  case 20:
                    return a.abrupt('return', e.selectPurchasedFavoriteAnchor(i));

                  case 21:
                    if (
                      ((o = e.data.favoritePurchaseKind),
                      (c = e.data.favoritePurchasePrice),
                      (u = e.favoriteRechargeState()),
                      (f = e.data.favoritePurchasePlan),
                      (h = e.data.favoritePurchaseBalance),
                      (d = !i || 'prepared' === i.status),
                      (e.favoritePurchaseAction = !0),
                      e.setData({
                        favoritePurchaseBusy: !0,
                        favoritePurchaseMessage: '',
                      }),
                      (a.prev = 29),
                      !i)
                    ) {
                      a.next = 40;
                      break;
                    }
                    return ((a.next = 33), s.fetchFavoriteAnchorPurchase(i.order_id));

                  case 33:
                    if (
                      (v = a.sent).data.order_id === i.order_id &&
                      v.data.account === i.account &&
                      (v.data.purchase_kind || 'anchor') === i.purchase_kind &&
                      Boolean(v.data.standalone) === Boolean(i.standalone)
                    ) {
                      a.next = 36;
                      break;
                    }
                    throw new Error('订单信息不一致，请重试原订单');

                  case 36:
                    if (
                      (e.setFavoritePurchaseOrder(v.data),
                      v.data.status === i.status && v.data.coin_amount === i.coin_amount)
                    ) {
                      a.next = 39;
                      break;
                    }
                    return a.abrupt('return');

                  case 39:
                    i = e.data.favoritePurchaseOrder;

                  case 40:
                    if (!(d && !n.already_monitored && c > 0) || u) {
                      a.next = 53;
                      break;
                    }
                    if (!(null === h || (h < c && !f))) {
                      a.next = 46;
                      break;
                    }
                    return ((a.next = 44), e.refreshFavoritePurchaseWallet());

                  case 44:
                    return (
                      null !== e.data.favoritePurchaseBalance &&
                        e.setData({
                          favoritePurchaseMessage:
                            e.data.favoritePurchaseBalance < c && !e.data.favoritePurchasePlan
                              ? '充值暂不可用，请稍后重试，尚未扣费'
                              : '金额已更新，请确认后继续',
                        }),
                      a.abrupt('return')
                    );

                  case 46:
                    if (!(h < c)) {
                      a.next = 53;
                      break;
                    }
                    return ((a.next = 49), e.refreshFavoritePurchaseWallet());

                  case 49:
                    if ((P = e.data.favoritePurchasePlan) && P.coins === f.coins) {
                      a.next = 53;
                      break;
                    }
                    return (
                      e.setData({
                        favoritePurchaseMessage: '余额或充值金额已变化，请重新确认',
                      }),
                      a.abrupt('return')
                    );

                  case 53:
                    if (i) {
                      a.next = 57;
                      break;
                    }
                    return ((a.next = 56), e.createFavoritePurchaseCheckout(o));

                  case 56:
                    i = e.data.favoritePurchaseOrder;

                  case 57:
                    if ('already_exists' !== i.status) {
                      a.next = 61;
                      break;
                    }
                    return ((a.next = 60), e.selectPurchasedFavoriteAnchor(i));

                  case 60:
                    return a.abrupt('return');

                  case 61:
                    if (i.coin_amount === c) {
                      a.next = 64;
                      break;
                    }
                    return (
                      e.setData({
                        favoritePurchaseMessage: '价格已更新，请核对金额后重新确认，尚未发起扣款',
                      }),
                      a.abrupt('return')
                    );

                  case 64:
                    if (!n.already_monitored) {
                      a.next = 70;
                      break;
                    }
                    if (
                      (e.setData({
                        favoritePurchaseMessage: '主播状态已变化，尚未购买，请核对新方案后再确认',
                      }),
                      !(i.coin_amount > 0))
                    ) {
                      a.next = 69;
                      break;
                    }
                    return ((a.next = 69), e.refreshFavoritePurchaseWallet());

                  case 69:
                    return a.abrupt('return');

                  case 70:
                    if (
                      ['prepared', 'pending', 'paid'].includes(i.status) &&
                      !e.favoritePurchaseDisposed
                    ) {
                      a.next = 72;
                      break;
                    }
                    return a.abrupt('return');

                  case 72:
                    if (!('prepared' === i.status && c > 0 && (u || (null !== h && h < c)))) {
                      a.next = 75;
                      break;
                    }
                    return (
                      e.setData({
                        favoriteRechargeVisible: !0,
                      }),
                      a.abrupt('return')
                    );

                  case 75:
                    if (!e.favoritePurchaseDisposed) {
                      a.next = 77;
                      break;
                    }
                    return a.abrupt('return');

                  case 77:
                    return ((a.next = 79), e.finishFavoritePurchaseOrder(i));

                  case 79:
                    a.next = 98;
                    break;

                  case 81:
                    if (
                      ((a.prev = 81), (a.t0 = a.catch(29)), 'ANCHOR_ORDER_PENDING' !== a.t0.code)
                    ) {
                      a.next = 97;
                      break;
                    }
                    return ((a.prev = 84), (a.next = 87), s.fetchFavoriteAnchorPurchaseOffer());

                  case 87:
                    if (
                      ((l = a.sent),
                      e.setFavoritePurchaseOffer(l.data || {}),
                      !l.data.pending_order)
                    ) {
                      a.next = 93;
                      break;
                    }
                    return (
                      e.setFavoritePurchaseOrder(l.data.pending_order),
                      e.setData({
                        favoritePurchaseMessage: '已找回未完成订单，请核对主播和金额后继续',
                      }),
                      a.abrupt('return')
                    );

                  case 93:
                    a.next = 97;
                    break;

                  case 95:
                    ((a.prev = 95), (a.t1 = a.catch(84)));

                  case 97:
                    e.setData({
                      favoritePurchaseMessage:
                        a.t0.message || '结果待确认，请继续原订单，不要重复付款',
                    });

                  case 98:
                    return (
                      (a.prev = 98),
                      (e.favoritePurchaseAction = !1),
                      e.setData({
                        favoritePurchaseBusy: !1,
                      }),
                      e.updateFavoritePurchaseSummary(),
                      a.finish(98)
                    );

                  case 103:
                  case 'end':
                    return a.stop();
                }
            },
            a,
            null,
            [
              [29, 81, 98, 103],
              [84, 95],
            ]
          );
        })
      )();
    },
    finishFavoritePurchaseOrder: function (e) {
      var a = this;
      return t(
        r().mark(function t() {
          var i, n;
          return r().wrap(function (r) {
            for (;;)
              switch ((r.prev = r.next)) {
                case 0:
                  if (
                    (a.setData({
                      favoritePurchaseMessage:
                        'benefit' === e.purchase_kind ? '正在使用免费权益' : '正在确认购买结果',
                    }),
                    'benefit' !== e.purchase_kind)
                  ) {
                    r.next = 7;
                    break;
                  }
                  return ((r.next = 4), s.redeemFavoriteAnchorBenefit(e.order_id));

                case 4:
                  ((r.t0 = r.sent), (r.next = 10));
                  break;

                case 7:
                  return ((r.next = 9), s.confirmFavoriteAnchorPurchase(e.order_id));

                case 9:
                  r.t0 = r.sent;

                case 10:
                  if (
                    (i = r.t0).data.order_id === e.order_id &&
                    i.data.account === e.account &&
                    (i.data.purchase_kind || 'anchor') === e.purchase_kind &&
                    Boolean(i.data.standalone) === Boolean(e.standalone) &&
                    (['already_exists', 'failed'].includes(i.data.status) ||
                      i.data.coin_amount === e.coin_amount)
                  ) {
                    r.next = 13;
                    break;
                  }
                  throw new Error('订单结果不一致，请继续核对原订单');

                case 13:
                  if ((a.setFavoritePurchaseOrder(i.data), 'delivered' !== i.data.status)) {
                    r.next = 27;
                    break;
                  }
                  if (
                    (wx.vibrateShort &&
                      wx.vibrateShort({
                        type: 'light',
                        fail: function () {},
                      }),
                    'mascot' !== e.purchase_kind)
                  ) {
                    r.next = 24;
                    break;
                  }
                  return ((r.next = 19), s.fetchFavoriteAnchorPurchaseOffer());

                case 19:
                  if (
                    ((n = r.sent), a.setFavoritePurchaseOffer(n.data || {}), !a.loadMascotSkinState)
                  ) {
                    r.next = 24;
                    break;
                  }
                  return (
                    (r.next = 24),
                    a.loadMascotSkinState(void 0, {
                      fresh: !0,
                    })
                  );

                case 24:
                  if (e.standalone) {
                    r.next = 27;
                    break;
                  }
                  return ((r.next = 27), a.loadFavoriteAnchorOptions());

                case 27:
                  if (!(e.coin_amount > 0)) {
                    r.next = 30;
                    break;
                  }
                  return ((r.next = 30), a.refreshFavoritePurchaseWallet());

                case 30:
                case 'end':
                  return r.stop();
              }
          }, t);
        })
      )();
    },
    useFavoritePurchaseGift: function () {
      var e = this;
      return t(
        r().mark(function a() {
          var t;
          return r().wrap(function (a) {
            for (;;)
              switch ((a.prev = a.next)) {
                case 0:
                  if (!e.data.favoritePurchaseOrder.standalone) {
                    a.next = 2;
                    break;
                  }
                  return a.abrupt('return', e.useStandaloneMascotBenefit());

                case 2:
                  return (
                    (t = e.data.favoritePurchaseOrder.account),
                    (a.next = 5),
                    e.resetFavoriteAnchorPurchase()
                  );

                case 5:
                  return (
                    e.setData({
                      favoriteAnchorRequestAccount: t,
                    }),
                    (a.next = 8),
                    e.prepareFavoriteAnchorPurchase()
                  );

                case 8:
                  if (
                    !e.data.favoritePurchaseProfile ||
                    e.data.favoritePurchaseProfile.account !== t ||
                    'benefit' !== e.data.favoritePurchaseKind ||
                    'review' !== e.data.favoritePurchaseStage
                  ) {
                    a.next = 11;
                    break;
                  }
                  return ((a.next = 11), e.submitFavoritePurchase());

                case 11:
                case 'end':
                  return a.stop();
              }
          }, a);
        })
      )();
    },
    confirmFavoriteAnchorPurchase: function () {
      return this.submitFavoritePurchase();
    },
    acceptFavoriteAnchorIdentity: function () {
      return this.submitFavoritePurchase();
    },
    rechargeForFavoriteAnchor: function () {
      return this.submitFavoritePurchase();
    },
    closeFavoriteRecharge: function () {
      (this.setData({
        favoriteRechargeVisible: !1,
      }),
        this.updateFavoritePurchaseSummary());
    },
    favoriteRechargeDelivered: function (e) {
      var a = this;
      return t(
        r().mark(function t() {
          var s;
          return r().wrap(function (r) {
            for (;;)
              switch ((r.prev = r.next)) {
                case 0:
                  if (
                    ((s = a.data.favoritePurchaseOrder),
                    a.setData({
                      favoriteRechargeVisible: !1,
                    }),
                    s && e.detail.recoveryId === s.order_id && !a.favoritePurchaseDisposed)
                  ) {
                    r.next = 4;
                    break;
                  }
                  return r.abrupt('return');

                case 4:
                  return ((r.next = 6), a.refreshFavoritePurchaseWallet());

                case 6:
                  (a.setData({
                    favoritePurchaseMessage: '充值已到账，尚未购买，请核对后确认购买。',
                  }),
                    a.updateFavoritePurchaseSummary());

                case 8:
                case 'end':
                  return r.stop();
              }
          }, t);
        })
      )();
    },
    resetFavoriteAnchorPurchase: function () {
      var e = this;
      return t(
        r().mark(function a() {
          var t, i, o, c;
          return r().wrap(
            function (a) {
              for (;;)
                switch ((a.prev = a.next)) {
                  case 0:
                    if (
                      ((t = e.data.favoritePurchaseOrder),
                      (i = e.data.favoritePurchaseStandalone),
                      'lookup' !== e.data.favoritePurchaseStage)
                    ) {
                      a.next = 5;
                      break;
                    }
                    return (e.cancelFavoriteLookup(), a.abrupt('return'));

                  case 5:
                    if (
                      !(
                        e.data.favoritePurchaseBusy ||
                        (t &&
                          !['prepared', 'failed', 'already_exists', 'delivered'].includes(t.status))
                      )
                    ) {
                      a.next = 7;
                      break;
                    }
                    return a.abrupt('return');

                  case 7:
                    if (
                      ((o = e.favoriteRechargeState()),
                      e.setData({
                        favoritePurchaseBusy: !0,
                      }),
                      (a.prev = 9),
                      !t || 'prepared' !== t.status)
                    ) {
                      a.next = 20;
                      break;
                    }
                    return ((a.next = 13), s.cancelFavoriteAnchorPurchase(t.order_id));

                  case 13:
                    if ((c = a.sent).data.order_id === t.order_id && c.data.account === t.account) {
                      a.next = 16;
                      break;
                    }
                    throw new Error('订单信息不一致，请核对原订单');

                  case 16:
                    if ('failed' === c.data.status) {
                      a.next = 19;
                      break;
                    }
                    return (e.setFavoritePurchaseOrder(c.data), a.abrupt('return'));

                  case 19:
                    n.clear(t.order_id);

                  case 20:
                    ((e.favoritePurchaseRequest = null),
                      e.setData({
                        favoritePurchaseOrder: null,
                        favoritePurchaseProfile: null,
                        favoritePurchaseStandalone: !1,
                        favoritePurchaseBenefitOnly: !1,
                        favoritePurchaseStage: 'input',
                        favoritePurchaseMessage: o
                          ? '已取消购买。充值结果可在 i币明细查看，已到账的 i币保留在钱包'
                          : '',
                      }),
                      i &&
                        e.setData({
                          favoriteAnchorRequestDialogVisible: !1,
                          mascotSkinSheetVisible: !0,
                        }),
                      (a.next = 28));
                    break;

                  case 25:
                    ((a.prev = 25),
                      (a.t0 = a.catch(9)),
                      e.setData({
                        favoritePurchaseMessage: a.t0.message || '请先确认原订单状态',
                      }));

                  case 28:
                    return (
                      (a.prev = 28),
                      e.setData({
                        favoritePurchaseBusy: !1,
                      }),
                      a.finish(28)
                    );

                  case 31:
                  case 'end':
                    return a.stop();
                }
            },
            a,
            null,
            [[9, 25, 28, 31]]
          );
        })
      )();
    },
    openFavoriteRechargeRecords: function () {
      this.data.favoritePurchaseBusy ||
        wx.navigateTo({
          url: '/pages/wallet-records/wallet-records',
        });
    },
    selectPurchasedFavoriteAnchor: function (e) {
      var a = this;
      return t(
        r().mark(function t() {
          return r().wrap(
            function (r) {
              for (;;)
                switch ((r.prev = r.next)) {
                  case 0:
                    return (
                      a.setData({
                        favoritePurchaseBusy: !0,
                      }),
                      (r.prev = 1),
                      (r.next = 4),
                      a.loadFavoriteAnchorOptions()
                    );

                  case 4:
                    return (
                      a.setData({
                        favoriteAnchorCandidate: e.account,
                      }),
                      (r.next = 7),
                      a.confirmFavoriteAnchor()
                    );

                  case 7:
                    (a.data.favoriteAnchorAccount === e.account &&
                      a.setData({
                        favoriteAnchorRequestDialogVisible: !1,
                      }),
                      (r.next = 13));
                    break;

                  case 10:
                    ((r.prev = 10),
                      (r.t0 = r.catch(1)),
                      a.setData({
                        favoritePurchaseMessage:
                          '主播已加入，列表刷新失败，可稍后重新选择，不会重复收费',
                      }));

                  case 13:
                    return (
                      (r.prev = 13),
                      a.setData({
                        favoritePurchaseBusy: !1,
                      }),
                      r.finish(13)
                    );

                  case 16:
                  case 'end':
                    return r.stop();
                }
            },
            t,
            null,
            [[1, 10, 13, 16]]
          );
        })
      )();
    },
  };

module.exports = {
  data: {
    favoritePurchaseStandalone: !1,
    favoriteStandaloneSupported: !1,
    favoritePurchaseBenefitOnly: !1,
    favoritePurchasePrivateReady: !1,
    favoritePurchaseEnabled: !1,
    favoritePurchaseLoading: !1,
    favoritePurchaseBusy: !1,
    favoritePurchaseOrder: null,
    favoritePurchaseStage: 'input',
    favoritePurchaseProfile: null,
    favoritePurchasePromotion: null,
    favoritePurchaseBenefit: null,
    favoritePurchaseEndText: '',
    favoriteMascotOwned: !1,
    favoriteMascotThemeGift: !1,
    favoritePurchaseMessage: '',
    favoritePurchaseBalance: null,
    favoritePurchaseBalanceText: '--',
    favoritePurchaseKind: 'anchor',
    favoritePurchasePrice: 2999,
    favoriteAnchorPrice: 2999,
    favoriteAnchorPricing: null,
    favoritePurchaseDiscounted: !1,
    favoritePurchasePrimary: '读取余额',
    favoritePurchasePlan: null,
    favoritePurchaseShortage: 0,
    favoritePurchaseRechargePending: !1,
    favoritePurchaseRechargeAmountText: '',
    favoritePurchaseDetails: !1,
    favoriteRechargeVisible: !1,
  },
  methods: f,
};
