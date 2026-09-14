'use strict';

require('../../@babel/runtime/helpers/Arrayincludes');

var e = require('../../@babel/runtime/helpers/regeneratorRuntime'),
  t = require('../../@babel/runtime/helpers/asyncToGenerator'),
  r = require('../../@babel/runtime/helpers/objectSpread2'),
  i = require('../../services/api'),
  n = require('../../utils/session-scope'),
  a = require('../../utils/mascot-theme');

Page({
  data: r(
    r({}, a.state()),
    {},
    {
      busy: !1,
      title: '正在进入专属守候',
      message: '',
      canRetry: !1,
    }
  ),
  onLoad: function () {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
    ((this.campaign = 'laowang_article' === e.campaign ? e.campaign : ''),
      (this.requestId = 'article_'
        .concat(Date.now(), '_')
        .concat(Math.random().toString(36).slice(2, 12))),
      (this.alive = !0),
      (this.revision = 0));
  },
  onShow: function () {
    return (
      (this.visible = !0),
      a.sync(this),
      this.result && this.resultScope !== n.current() && (this.result = null),
      this.result ? this.openHome() : this.enter()
    );
  },
  onHide: function () {
    this.visible = !1;
  },
  onUnload: function () {
    ((this.alive = !1), (this.visible = !1), this.revision++);
  },
  enter: function () {
    var r = this;
    return t(
      e().mark(function t() {
        var a, s, u, c, o;
        return e().wrap(
          function (e) {
            for (;;)
              switch ((e.prev = e.next)) {
                case 0:
                  if (r.alive && r.visible && !r.data.busy) {
                    e.next = 2;
                    break;
                  }
                  return e.abrupt('return');

                case 2:
                  if (r.campaign) {
                    e.next = 5;
                    break;
                  }
                  return (
                    r.setData({
                      title: '入口信息不完整',
                      message: '请重新打开公众号文章中的小程序卡片。',
                      canRetry: !1,
                    }),
                    e.abrupt('return')
                  );

                case 5:
                  return (
                    (a = r.revision),
                    r.setData({
                      busy: !0,
                      title: '正在进入老王的专属守候',
                      message: '',
                      canRetry: !1,
                    }),
                    (e.prev = 7),
                    (e.next = 10),
                    i.ensureSession()
                  );

                case 10:
                  if (((s = e.sent), r.alive && r.revision === a && r.visible)) {
                    e.next = 13;
                    break;
                  }
                  return e.abrupt('return');

                case 13:
                  if (s.token) {
                    e.next = 15;
                    break;
                  }
                  throw new Error('微信登录暂不可用，请重试');

                case 15:
                  return ((e.next = 17), i.enterOfficialArticle(r.campaign, r.requestId));

                case 17:
                  if (((u = e.sent), r.alive && r.revision === a)) {
                    e.next = 20;
                    break;
                  }
                  return e.abrupt('return');

                case 20:
                  if (n.current() === s.token) {
                    e.next = 22;
                    break;
                  }
                  throw new Error('登录状态已变化，请重试');

                case 22:
                  if (
                    (c = u && u.data) &&
                    c.campaign === r.campaign &&
                    '73796455215' === c.anchor_account &&
                    'boolean' == typeof c.subscribed
                  ) {
                    e.next = 25;
                    break;
                  }
                  throw new Error('订阅结果尚未确认，请重试');

                case 25:
                  ((r.result = c),
                    (r.resultScope = s.token),
                    r.visible && r.openHome(),
                    (e.next = 36));
                  break;

                case 30:
                  if (((e.prev = 30), (e.t0 = e.catch(7)), r.alive && r.revision === a)) {
                    e.next = 34;
                    break;
                  }
                  return e.abrupt('return');

                case 34:
                  ((o = [
                    'ENTRY_UNAVAILABLE',
                    'ENTRY_ANCHOR_UNAVAILABLE',
                    'NOT_FOUND',
                    'API_NOT_FOUND',
                  ].includes(e.t0.code)),
                    r.setData({
                      title: o ? '专属入口暂不可用' : '暂时未能确认订阅',
                      message: o
                        ? '可以先进入首页查看爱播守候。'
                        : 'NETWORK_ERROR' === e.t0.code
                          ? '网络连接失败，请检查网络后重试。'
                          : e.t0.message || '网络连接失败，请重试。',
                      canRetry: !o,
                    }));

                case 36:
                  return (
                    (e.prev = 36),
                    r.alive &&
                      r.revision === a &&
                      r.setData({
                        busy: !1,
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
          [[7, 30, 36, 39]]
        );
      })
    )();
  },
  openHome: function () {
    var e = this;
    if (this.alive && this.visible && !this.navigating) {
      this.navigating = !0;
      var t = this.result;
      wx.reLaunch({
        url: '/pages/index/index',
        success: function () {
          t &&
            wx.showToast({
              title: t.subscribed ? '已关注梦幻老王' : '已保留你的订阅设置',
              icon: 'none',
            });
        },
        fail: function () {
          ((e.navigating = !1),
            e.alive &&
              e.setData({
                title: '首页暂未打开',
                message: t ? '订阅设置已保存，可以再次进入首页。' : '请再次尝试进入首页。',
                canRetry: !1,
              }));
        },
      });
    }
  },
  retry: function () {
    return this.result ? this.openHome() : this.enter();
  },
});
