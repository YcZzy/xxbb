'use strict';

Component({
  properties: {
    skin: {
      type: String,
      value: 'classic',
    },
    visible: Boolean,
    busy: Boolean,
    locked: Boolean,
    custom: Boolean,
    lite: Boolean,
    ready: {
      type: Boolean,
      value: !0,
    },
    active: {
      type: Boolean,
      value: !0,
    },
    balanceText: {
      type: String,
      value: '--',
    },
    options: Array,
    coins: {
      type: null,
      value: null,
    },
    mode: {
      type: String,
      value: 'preset',
    },
    inputValue: String,
    rangeText: String,
    inputError: String,
    coinsText: {
      type: String,
      value: '--',
    },
    priceText: {
      type: String,
      value: '--',
    },
    actionText: String,
    message: String,
    showRecords: Boolean,
    canCancel: Boolean,
    deadline: Number,
    orderId: String,
    note: {
      type: String,
      value: '充值后不会自动消费。未成年人请勿充值。',
    },
  },
  methods: {
    noop: function () {},
    feedback: function () {
      wx.vibrateShort &&
        wx.vibrateShort({
          type: 'light',
          fail: function () {},
        });
    },
    close: function () {
      this.data.busy || this.triggerEvent('close');
    },
    choose: function (t) {
      if (!this.data.busy && !this.data.locked && this.data.ready) {
        var e = Number(t.currentTarget.dataset.coins);
        this.data.options.some(function (t) {
          return t.coins === e;
        }) &&
          (this.feedback(),
          this.triggerEvent('select', {
            coins: e,
            value: String(e),
          }));
      }
    },
    chooseCustom: function () {
      !this.data.busy &&
        !this.data.locked &&
        this.data.custom &&
        this.data.ready &&
        (this.feedback(),
        this.triggerEvent('custom', {
          value: 'custom',
        }));
    },
    input: function (t) {
      this.data.busy ||
        this.data.locked ||
        !this.data.custom ||
        'custom' !== this.data.mode ||
        this.triggerEvent('amountinput', {
          value: t.detail.value,
        });
    },
    confirm: function () {
      this.data.busy ||
        !this.data.visible ||
        !this.data.active ||
        (this.data.ready && null === this.data.coins) ||
        this.triggerEvent('confirm');
    },
    records: function () {
      this.data.busy || this.triggerEvent('records');
    },
    cancel: function () {
      !this.data.busy && this.data.canCancel && this.triggerEvent('cancel');
    },
    expired: function () {
      !this.data.busy && this.data.visible && this.data.active && this.triggerEvent('expire');
    },
  },
});
