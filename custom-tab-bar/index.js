'use strict';

var e = require('../utils/tab-bar'),
  t = require('../utils/mascot-theme'),
  i = [
    {
      key: 'home',
      label: '状态',
      icon: '⌂',
      path: '/pages/index/index',
    },
    {
      key: 'media',
      label: '爱播守候',
      icon: '守',
      path: '/pages/media/media',
    },
    {
      key: 'history',
      label: '星光早报',
      icon: '',
      path: '/pages/daily-digest/daily-digest',
    },
    {
      key: 'archive',
      label: '星光档案',
      icon: '',
      path: '/pages/live-archive/live-archive',
    },
    {
      key: 'help',
      label: '帮助',
      icon: '?',
      path: '/pages/help/help',
    },
  ];

Component({
  data: {
    selected: 'home',
    hidden: !1,
    skin: 'classic',
    navigating: !1,
    pressingKey: '',
    jellyReady: !1,
    jellyMoving: !1,
    jellyDirection: 'right',
    items: i,
  },
  lifetimes: {
    attached: function () {
      this.syncFromPage();
    },
    detached: function () {
      (clearTimeout(this.tapFeedbackTimer), clearTimeout(this.jellyTimer));
    },
  },
  methods: {
    syncFromPage: function () {
      var e = getCurrentPages(),
        a = e[e.length - 1],
        n = a && a.route ? '/'.concat(a.route) : i[0].path,
        s =
          i.find(function (e) {
            return e.path === n;
          }) || i[0],
        l = t.selectedTheme();
      (l !== this.data.skin &&
        this.setData({
          skin: l,
        }),
        (this.currentRouteKey = s.key),
        this.syncSelection(s.key));
    },
    syncSelection: function (a) {
      var n = this,
        s = String(a || '');
      if (
        i.some(function (e) {
          return e.key === s;
        })
      ) {
        var l = t.selectedTheme();
        (l !== this.data.skin &&
          this.setData({
            skin: l,
          }),
          (this.currentRouteKey = s));
        var r = e.takeFeedback(s);
        (!r && this.data.selected === s && this.data.jellyMoving) ||
          (clearTimeout(this.jellyTimer),
          this.setData(
            {
              selected: s,
              jellyReady: !0,
              jellyMoving: r,
            },
            function () {
              r &&
                (n.jellyTimer = setTimeout(function () {
                  n.setData({
                    jellyMoving: !1,
                  });
                }, 210));
            }
          ));
      }
    },
    playTapFeedback: function (e) {
      var t = this;
      (clearTimeout(this.tapFeedbackTimer),
        this.setData({
          pressingKey: e,
        }),
        wx.vibrateShort &&
          wx.vibrateShort({
            type: 'light',
            fail: function () {},
          }),
        (this.tapFeedbackTimer = setTimeout(function () {
          t.setData({
            pressingKey: '',
          });
        }, 240)));
    },
    onNavigate: function (t) {
      var a = this,
        n = String(t.currentTarget.dataset.key || ''),
        s = i.find(function (e) {
          return e.key === n;
        });
      if (s) {
        this.playTapFeedback(s.key);
        var l = this.currentRouteKey || this.data.selected;
        if (!this.data.navigating && s.key !== l) {
          var r = e.begin(l, s.key);
          (clearTimeout(this.jellyTimer),
            this.setData({
              selected: s.key,
              jellyReady: !0,
              jellyMoving: !0,
              navigating: !0,
            }),
            (this.jellyTimer = setTimeout(function () {
              a.setData({
                jellyMoving: !1,
              });
            }, 210)),
            wx.switchTab({
              url: s.path,
              success: function () {
                return e.confirm(s.key);
              },
              fail: function () {
                (e.rollback(l, r), a.syncSelection(l));
              },
              complete: function () {
                return a.setData({
                  navigating: !1,
                });
              },
            }));
        }
      }
    },
  },
});
