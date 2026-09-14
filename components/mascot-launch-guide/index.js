'use strict';

Component({
  properties: {
    blocked: {
      type: Boolean,
      value: !1,
    },
    opened: {
      type: Boolean,
      value: !1,
    },
    owned: {
      type: Boolean,
      value: !1,
    },
    enabled: {
      type: Boolean,
      value: !0,
    },
    text: {
      type: String,
      value: '吉祥物上新啦',
    },
    theme: {
      type: String,
      value: 'classic',
    },
    lite: {
      type: Boolean,
      value: !1,
    },
  },
  data: {
    visible: !1,
    inViewport: !0,
    displayText: '吉祥物上新啦',
    letters: [],
  },
  observers: {
    'blocked, opened, owned, enabled': function () {
      this.syncGuide();
    },
    text: function () {
      this.syncText();
    },
  },
  lifetimes: {
    attached: function () {
      ((this._attached = !0),
        (this._foreground = !0),
        (this._seenThisVisit = !1),
        this.syncText(),
        this.syncGuide());
    },
    ready: function () {
      this.observeViewport();
    },
    detached: function () {
      ((this._attached = !1),
        (this._foreground = !1),
        this.clearTimers(),
        this._viewportObserver && this._viewportObserver.disconnect());
    },
  },
  pageLifetimes: {
    show: function () {
      (this._foreground || (this._seenThisVisit = !1), (this._foreground = !0), this.syncGuide());
    },
    hide: function () {
      ((this._foreground = !1), this.clearTimers(), this.setVisible(!1));
    },
  },
  methods: {
    syncText: function () {
      if (this._attached) {
        var e = 'string' == typeof this.data.text ? this.data.text.trim() : '',
          t = Array.from(e),
          i =
            t.length > 0 &&
            t.length <= 6 &&
            !/[\x00-\x1f\x7f-\x9f\u200b-\u200f\u2028-\u202e\u2060-\u206f\ufeff]/.test(e)
              ? e
              : '吉祥物上新啦';
        (i === this.data.displayText && this.data.letters.length) ||
          this.setData({
            displayText: i,
            letters: Array.from(i),
          });
      }
    },
    observeViewport: function () {
      var e = this;
      this._attached &&
        this.createIntersectionObserver &&
        ((this._viewportObserver = this.createIntersectionObserver({
          thresholds: [0],
        })),
        this._viewportObserver.relativeToViewport().observe('.launch-guide-viewport', function (t) {
          if (e._attached) {
            var i = t.intersectionRatio > 0;
            i !== e.data.inViewport &&
              e.setData({
                inViewport: i,
              });
          }
        }));
    },
    clearTimers: function () {
      (clearTimeout(this._seenTimer),
        clearTimeout(this._hideTimer),
        (this._seenTimer = this._hideTimer = null));
    },
    markSeen: function () {
      this._seenThisVisit = !0;
    },
    setVisible: function (e) {
      this.data.visible !== e &&
        this._attached &&
        (this.setData({
          visible: e,
        }),
        this.triggerEvent('visibilitychange', {
          visible: e,
        }));
    },
    syncGuide: function () {
      var e = this;
      if (this._attached) {
        if (!this.data.opened && !this.data.owned)
          return this._foreground && !this.data.blocked && this.data.enabled
            ? void (
                this.data.visible ||
                this._seenThisVisit ||
                (this.setVisible(!0),
                (this._seenTimer = setTimeout(function () {
                  return e.markSeen();
                }, 1600)),
                (this._hideTimer = setTimeout(function () {
                  return e.dismiss();
                }, 7e3)))
              )
            : (this.clearTimers(), void this.setVisible(!1));
        this.dismiss();
      }
    },
    dismiss: function () {
      (this.clearTimers(), this.markSeen(), this.setVisible(!1));
    },
    openCollection: function () {
      this.data.visible &&
        this._foreground &&
        !this.data.blocked &&
        (this.dismiss(), this.triggerEvent('open'));
    },
  },
});
