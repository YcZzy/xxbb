'use strict';

require('../../@babel/runtime/helpers/Arrayincludes');

var e = require('../../@babel/runtime/helpers/objectSpread2'),
  t = require('../../services/call-broadcast'),
  i = require('../../utils/performance-mode'),
  s = require('../../utils/mascot-theme');

Component({
  data: e(
    e(
      {
        inlineArt: {},
        item: null,
        entries: [],
        leaving: !1,
        artFailed: !1,
        callsText: '',
        countClass: '',
        top: 8,
        heartIcon: '/assets/images/call-counter/heart-rose.png',
      },
      s.state()
    ),
    {},
    {
      performanceClass: i.className(),
    }
  ),
  lifetimes: {
    attached: function () {
      this.listen();
    },
    detached: function () {
      ((this.inlineArtStopped = !0), this.unlisten());
    },
  },
  pageLifetimes: {
    show: function () {
      this.listen();
    },
    hide: function () {
      this.unlisten();
    },
  },
  methods: e(
    e({}, require('../../utils/inline-artwork')),
    {},
    {
      listen: function () {
        var e = this;
        if (!this.unsubscribe) {
          this.listening = !0;
          var i = getCurrentPages(),
            s = i.length ? i[i.length - 1].route : '',
            n = [
              'pages/index/index',
              'pages/media/media',
              'pages/live-archive/live-archive',
              'pages/daily-digest/daily-digest',
              'pages/love-call/love-call',
              'pages/viewer-archive/viewer-archive',
            ].includes(s),
            a = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null;
          (this.setData({
            top: n && a ? a.bottom + 12 : 8,
          }),
            (this.unsubscribe = t.subscribe(function (t) {
              return e.present(t);
            })));
        }
      },
      present: function (t) {
        var i = this;
        if (this.listening) {
          if (!t) {
            if (!this.data.item || this.data.leaving) return;
            return 'performance-lite' === this.data.performanceClass
              ? this.clearBanner()
              : (this.setData({
                  leaving: !0,
                }),
                void (this.exitTimer = setTimeout(function () {
                  ((i.exitTimer = null), i.listening && i.clearBanner());
                }, 180)));
          }
          (clearTimeout(this.exitTimer), (this.exitTimer = null));
          var n = s.state(),
            a = n.mascotThemeIsIce ? 'blue' : n.mascotThemeIsMoonTide ? 'teal' : 'rose',
            r = String(t.calls).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          this.setData(
            e(
              e(
                {
                  item: t,
                  entries: [t],
                  leaving: !1,
                },
                n
              ),
              {},
              {
                callsText: r,
                countClass: r.length > 9 ? 'is-long' : r.length > 5 ? 'is-wide' : '',
                heartIcon: '/assets/images/call-counter/heart-'.concat(a, '.png'),
              }
            )
          );
        }
      },
      clearBanner: function () {
        this.setData({
          item: null,
          entries: [],
          leaving: !1,
        });
      },
      unlisten: function () {
        ((this.listening = !1),
          clearTimeout(this.exitTimer),
          (this.exitTimer = null),
          this.unsubscribe && this.unsubscribe(),
          (this.unsubscribe = null),
          this.clearBanner());
      },
      onArtError: function (e) {
        this.data.inlineArt.starlightLive
          ? this.onInlineArtworkError(e)
          : this.setData({
              artFailed: !0,
            });
      },
      dismiss: function () {
        t.dismiss();
      },
    }
  ),
});
