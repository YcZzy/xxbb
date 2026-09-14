'use strict';

var t = require('../../@babel/runtime/helpers/objectSpread2'),
  e = require('../../services/lottery-clock').clock,
  i = require('../../services/lottery-demo').subscribeLotteryDemo;

Component({
  properties: {
    account: {
      type: String,
      value: '',
    },
    roomId: {
      type: String,
      value: '',
    },
    theme: {
      type: String,
      value: '',
    },
    lite: {
      type: Boolean,
      value: !1,
    },
  },
  data: {
    visible: !1,
    urgent: !1,
    pending: !1,
    mock: !1,
    text: '',
  },
  observers: {
    'account, roomId': function () {
      this.watchLottery();
    },
  },
  lifetimes: {
    attached: function () {
      ((this._foreground = !0), this.watchLottery());
    },
    detached: function () {
      ((this._foreground = !1), this.stopLottery());
    },
  },
  pageLifetimes: {
    show: function () {
      ((this._foreground = !0), this.watchLottery());
    },
    hide: function () {
      ((this._foreground = !1),
        this.stopLottery(),
        this.setData({
          visible: !1,
        }));
    },
  },
  methods: {
    stopLottery: function () {
      (this._unsubscribe && this._unsubscribe(), (this._unsubscribe = null), (this._watchKey = ''));
    },
    watchLottery: function () {
      var o = this,
        s = ''.concat(this.data.account, ':').concat(this.data.roomId);
      if (!this._foreground || !this._unsubscribe || this._watchKey !== s)
        if ((this.stopLottery(), this._foreground && this.data.account && this.data.roomId)) {
          this._watchKey = s;
          var r = function (e) {
            o._foreground &&
              o.setData(
                t(
                  {
                    mock: !1,
                  },
                  e
                )
              );
          };
          this._unsubscribe =
            i(this.data.account, this.data.roomId, r) ||
            e.subscribe(this.data.account, this.data.roomId, r);
        } else
          this.data.visible &&
            this.setData({
              visible: !1,
            });
    },
  },
});
