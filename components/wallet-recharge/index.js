'use strict';

var e = require('../../@babel/runtime/helpers/objectSpread2'),
  i = require('../../utils/digest-tip-recharge'),
  t = require('../../utils/favorite-anchor-recharge');

Component({
  properties: {
    skin: {
      type: String,
      value: 'classic',
    },
    visible: Boolean,
    requiredCoins: {
      type: Number,
      value: 0,
    },
    recoveryId: String,
    preferredOrderId: String,
    active: {
      type: Boolean,
      value: !0,
    },
    lite: Boolean,
  },
  data: e(
    e({}, i.data),
    {},
    {
      foreground: !0,
      busy: !1,
      demo: !1,
      balance: null,
      coins: 0,
      dialog: '',
      message: '',
    }
  ),
  lifetimes: {
    created: function () {
      ((this.alive = !0), (this.revision = 0));
    },
    attached: function () {
      this.syncVisible();
    },
    detached: function () {
      ((this.alive = !1), this.revision++);
    },
  },
  observers: {
    'visible, recoveryId, requiredCoins, preferredOrderId': function () {
      this.alive && this.syncVisible();
    },
    active: function (e) {
      e &&
        this.alive &&
        (this.flushDelivery(),
        !this.data.visible ||
          this.data.dialog ||
          this.data.busy ||
          this.data.tipRechargeDone ||
          this.goRecharge());
    },
  },
  pageLifetimes: {
    hide: function () {
      this.setData({
        foreground: !1,
      });
    },
    show: function () {
      (this.setData({
        foreground: !0,
      }),
        this.flushDelivery(),
        !this.data.visible ||
          this.data.dialog ||
          this.data.busy ||
          this.data.tipRechargeDone ||
          this.goRecharge());
    },
  },
  methods: e(
    e(
      {},
      i.createMethods({
        scope: 'wallet',
        noun: '消费',
        returnText: '返回原页面',
      })
    ),
    {},
    {
      current: function (e) {
        return this.alive && this.revision === e;
      },
      syncVisible: function () {
        if (!this.data.visible)
          return (
            (this.opened = ''),
            this.revision++,
            (this.delivery = null),
            void this.setData({
              dialog: '',
              busy: !1,
            })
          );
        var t = ''
          .concat(this.data.recoveryId, ':')
          .concat(this.data.requiredCoins, ':')
          .concat(this.data.preferredOrderId || '');
        return this.opened !== t
          ? ((this.opened = t),
            this.revision++,
            (this.delivery = null),
            this.setData(
              e(
                e({}, i.data),
                {},
                {
                  balance: null,
                  busy: !1,
                  coins: this.data.requiredCoins,
                }
              )
            ),
            this.goRecharge())
          : void 0;
      },
      getRechargeQuote: function (e, i) {
        return this.data.requiredCoins > 0
          ? null === i
            ? null
            : t.quote(e, 0, Math.max(100, this.data.requiredCoins - i))
          : t.quote(e, 0, 100);
      },
      onWalletRechargeDelivered: function (e) {
        ((this.delivery = e), this.flushDelivery());
      },
      flushDelivery: function () {
        if (
          this.delivery &&
          this.data.visible &&
          this.data.foreground &&
          this.data.active &&
          this.alive
        ) {
          var e = this.delivery;
          ((this.delivery = null),
            this.setData({
              dialog: '',
            }),
            this.triggerEvent('delivered', e));
        }
      },
      closeDialog: function () {
        this.data.busy || this.triggerEvent('close');
      },
      onWalletRechargeCanceled: function () {
        this.triggerEvent('close', {
          canceled: !0,
        });
      },
      openRecords: function () {
        this.data.busy ||
          wx.navigateTo({
            url: '/pages/wallet-records/wallet-records',
          });
      },
    }
  ),
});
