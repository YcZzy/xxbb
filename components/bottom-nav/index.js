'use strict';

Component({
  properties: {
    current: {
      type: String,
      value: 'home',
    },
    skin: {
      type: String,
      value: 'classic',
    },
  },
  data: {
    navigatingKey: '',
    jellyMoving: !1,
    jellyDirection: 'right',
    items: [
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
        icon: '报',
        path: '/pages/daily-digest/daily-digest',
      },
      {
        key: 'help',
        label: '帮助',
        icon: '?',
        path: '/pages/help/help',
      },
    ],
  },
  lifetimes: {
    detached: function () {
      (clearTimeout(this.jellyTimer), clearTimeout(this.navigateTimer));
    },
  },
  methods: {
    moveJellyTo: function (e) {
      var t = this,
        i = this.data.navigatingKey || this.data.current,
        a = this.data.items.findIndex(function (e) {
          return e.key === i;
        }),
        n = this.data.items.findIndex(function (t) {
          return t.key === e;
        });
      return (
        !(n < 0 || n === a) &&
        (clearTimeout(this.jellyTimer),
        this.setData(
          {
            navigatingKey: e,
            jellyDirection: n > a ? 'right' : 'left',
            jellyMoving: !1,
          },
          function () {
            wx.nextTick(function () {
              (t.setData({
                jellyMoving: !0,
              }),
                (t.jellyTimer = setTimeout(function () {
                  t.setData({
                    jellyMoving: !1,
                  });
                }, 540)));
            });
          }
        ),
        !0)
      );
    },
    onNavigate: function (e) {
      var t = this,
        i = e.currentTarget.dataset.key,
        a = this.data.items.find(function (e) {
          return e.key === i;
        });
      a &&
        a.key !== this.data.current &&
        !this.data.navigatingKey &&
        this.moveJellyTo(a.key) &&
        (this.navigateTimer = setTimeout(function () {
          wx.switchTab({
            url: a.path,
            fail: function () {
              return t.setData({
                navigatingKey: '',
                jellyMoving: !1,
              });
            },
          });
        }, 160));
    },
  },
});
