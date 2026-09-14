'use strict';

Component({
  properties: {
    deadline: Number,
    orderId: String,
    active: {
      type: Boolean,
      value: !0,
    },
    notifyExpired: {
      type: Boolean,
      value: !0,
    },
  },
  data: {
    clock: '',
    expired: !1,
  },
  lifetimes: {
    attached: function () {
      ((this.alive = !0), (this.foreground = !0), this.syncClock());
    },
    detached: function () {
      ((this.alive = !1), clearTimeout(this.timer));
    },
  },
  observers: {
    'deadline, orderId, active, notifyExpired': function () {
      this.alive && this.syncClock();
    },
  },
  pageLifetimes: {
    hide: function () {
      ((this.foreground = !1), clearTimeout(this.timer));
    },
    show: function () {
      ((this.foreground = !0), this.syncClock());
    },
  },
  methods: {
    syncClock: function () {
      var t = this;
      if (
        (clearTimeout(this.timer),
        this.alive && this.foreground && this.data.active && this.data.deadline)
      ) {
        var e = Math.max(0, Math.ceil((this.data.deadline - Date.now()) / 1e3)),
          i = ''
            .concat(String(Math.floor(e / 60)).padStart(2, '0'), ':')
            .concat(String(e % 60).padStart(2, '0'));
        (i !== this.data.clock &&
          this.setData({
            clock: i,
            expired: 0 === e,
          }),
          e
            ? (this.timer = setTimeout(function () {
                return t.syncClock();
              }, 1e3))
            : !1 !== this.data.notifyExpired &&
              this.notifiedOrder !== this.data.orderId &&
              ((this.notifiedOrder = this.data.orderId), this.triggerEvent('expire')));
      }
    },
  },
});
