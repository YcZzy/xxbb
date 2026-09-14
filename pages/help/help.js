'use strict';

var e = require('../../@babel/runtime/helpers/objectSpread2'),
  t = require('../../@babel/runtime/helpers/slicedToArray'),
  i = require('../../@babel/runtime/helpers/regeneratorRuntime'),
  a = require('../../@babel/runtime/helpers/asyncToGenerator');

require('../../@babel/runtime/helpers/Arrayincludes');

var n = require('../../@babel/runtime/helpers/typeof'),
  r = require('../../config/env'),
  s = require('../../services/api'),
  o = require('../../utils/share'),
  c = require('../../utils/tab-bar'),
  u = require('../../utils/mascot-theme'),
  l = require('../../utils/performance-mode');

var p = {
  live: {
    name: '开播通知',
    templateId: r.SUBSCRIBE_TEMPLATE_ID,
  },
  leave: {
    name: '请假通知',
    templateId: r.LEAVE_SUBSCRIBE_TEMPLATE_ID,
  },
  work: {
    name: '作品通知',
    templateId: r.WORK_SUBSCRIBE_TEMPLATE_ID,
  },
};

function d(e) {
  return Array.from(e || '')[0] || '';
}

function h(e) {
  return Array.isArray(e)
    ? Array.from(
        new Set(
          e
            .map(function (e) {
              return String(e || '').trim();
            })
            .filter(Boolean)
        )
      )
    : [];
}

Page({
  data: {
    performanceClass: l.className(),
    helpForeground: !0,
    mascotThemeSkin: 'classic',
    mascotThemeClass: 'theme-classic',
    mascotThemeIsIce: !1,
    checking: !1,
    testingNotification: !1,
    testPanelVisible: !1,
    testPanelStep: 'loading',
    liveTestQuota: 0,
    leaveTestQuota: 0,
    workTestQuota: 0,
    liveTestEnabled: !1,
    leaveTestEnabled: !1,
    workTestEnabled: !1,
    selectedTestType: '',
    selectedTestName: '',
    selectedTestQuota: 0,
    testIdempotencyKey: '',
    testErrorMessage: '',
    repairPanelVisible: !1,
    repairPanelStep: 'choose',
    repairingNotification: !1,
    selectedRepairType: '',
    selectedRepairName: '',
    repairIdempotencyKey: '',
    repairAuthorizationResult: '',
    repairTemplateId: '',
    repairErrorMessage: '',
    diagnosisVisible: !1,
    diagnosisStatus: '待增加',
    diagnosisTone: 'waiting',
    diagnosisMainStatus: '检测中',
    diagnosisMainTone: 'waiting',
    diagnosisQuotaStatus: '暂未获取',
    diagnosisQuotaTone: 'waiting',
    diagnosisDescription: '回到首页增加通知次数，即可完成授权。',
    anchorVisibilityVisible: !1,
    anchorVisibilityLoading: !1,
    anchorVisibilityError: '',
    anchorVisibilityItems: [],
    anchorVisibilityShownCount: 0,
    anchorVisibilityHiddenCount: 0,
    anchorVisibilitySavingAccount: '',
    favoriteAnchorAccount: '',
    faqVisible: !1,
    activeQuestion: -1,
    questions: [
      {
        title: '为什么每次只能增加一次提醒？',
        answer: '由于微信官方限制，必须用户授权点击才能推送，点击一次推送一次。',
      },
      {
        title: '爱播守候的开关有什么作用？',
        answer: '开关用于选择是否接收该主播的开播提醒，首次开启会申请提醒授权。',
      },
      {
        title: '没有收到推送怎么办？',
        answer:
          '1. 检查推送开关：确保在「状态」或「爱播守候」页面开启了主播提醒开关\n2. 检查通知次数：在「状态」页面查看剩余通知次数是否大于 0\n3. 检查订阅授权：点击上方「检查订阅权限」；也可以点击右上角三个点 → 设置 → 订阅消息，确认允许接收',
      },
      {
        title: '如有其他问题？',
        answer: 'dy 联系 @i播播了么',
      },
    ],
  },
  onLoad: function () {
    o.enableShareMenu();
  },
  onShow: function () {
    (this.setData({
      helpForeground: !0,
    }),
      c.sync(this, 'help'),
      u.sync(this));
  },
  onHide: function () {
    this.setData({
      helpForeground: !1,
    });
  },
  touchFeedback: function () {
    wx.vibrateShort &&
      wx.vibrateShort({
        type: 'light',
        fail: function () {},
      });
  },
  openCardCollection: function () {
    (this.touchFeedback(),
      wx.navigateTo({
        url: '/pages/card-pack/card-pack?view=collection',
      }));
  },
  onShareAppMessage: function () {
    return o.appMessage();
  },
  onShareTimeline: function () {
    return o.timeline();
  },
  onCheckSubscription: function () {
    var e,
      t = this;
    this.data.checking ||
      (this.touchFeedback(),
      this.setData({
        checking: !0,
      }),
      wx.getSetting({
        withSubscriptions: !0,
        success:
          ((e = a(
            i().mark(function e(a) {
              var n, o, c, u, l, p, d, h, f, b, g, m, y, T;
              return i().wrap(
                function (e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        return (
                          (n = a.subscriptionsSetting || {}),
                          (o = n.itemSettings || {}),
                          (c = o[r.SUBSCRIBE_TEMPLATE_ID]),
                          (u = 0),
                          (l = !1),
                          (e.prev = 5),
                          (e.next = 8),
                          s.fetchSubscription(r.ANCHOR.account)
                        );

                      case 8:
                        ((p = e.sent),
                          (d = p && p.data ? p.data : {}),
                          (u = Number(d.quota || 0)),
                          (l = !0),
                          (e.next = 16));
                        break;

                      case 14:
                        ((e.prev = 14), (e.t0 = e.catch(5)));

                      case 16:
                        ((h = '待增加'),
                          (f = 'waiting'),
                          (b = '回到首页增加通知次数，即可完成授权。'),
                          (g = !1 === n.mainSwitch ? '已关闭' : '已开启'),
                          (m = !1 === n.mainSwitch ? 'warning' : 'success'),
                          (y = l ? '剩余 '.concat(u, ' 次') : '暂未获取'),
                          (T = u > 0 ? 'success' : 'waiting'),
                          !1 === n.mainSwitch
                            ? ((h = '已关闭'),
                              (f = 'warning'),
                              (b = '请前往右上角设置，开启订阅消息。'))
                            : 'reject' === c
                              ? ((h = '已拒绝'),
                                (f = 'warning'),
                                (b = '请前往右上角设置，重新允许开播提醒。'))
                              : 'accept' === c
                                ? ((h = '已授权'),
                                  (f = 'success'),
                                  (b =
                                    u > 0
                                      ? '开播提醒权限正常，当前剩余 '.concat(u, ' 次。')
                                      : '微信权限已允许，回到首页增加通知次数即可接收提醒。'))
                                : l &&
                                  u > 0 &&
                                  ((h = '已授权'),
                                  (f = 'success'),
                                  (b = '已获得开播提醒授权，当前剩余 '.concat(u, ' 次。'))),
                          t.setData({
                            checking: !1,
                            diagnosisVisible: !0,
                            diagnosisStatus: h,
                            diagnosisTone: f,
                            diagnosisMainStatus: g,
                            diagnosisMainTone: m,
                            diagnosisQuotaStatus: y,
                            diagnosisQuotaTone: T,
                            diagnosisDescription: b,
                          }));

                      case 25:
                      case 'end':
                        return e.stop();
                    }
                },
                e,
                null,
                [[5, 14]]
              );
            })
          )),
          function (t) {
            return e.apply(this, arguments);
          }),
        fail: function (e) {
          (t.setData({
            checking: !1,
          }),
            wx.showToast({
              title: e.errMsg || '检查失败',
              icon: 'none',
            }));
        },
      }));
  },
  onCloseDiagnosis: function () {
    this.setData({
      diagnosisVisible: !1,
    });
  },
  onPreventTouchMove: function () {},
  onPreventBubble: function () {},
  openAccountSettings: function () {
    var e = this.selectComponent('#helpAccount');
    e && e.data.profile
      ? e.openSettings()
      : wx.showToast({
          title: '个人资料尚未就绪，请稍后再试',
          icon: 'none',
        });
  },
  openFaq: function () {
    (this.touchFeedback(),
      this.setData({
        faqVisible: !0,
      }));
  },
  closeFaq: function () {
    this.setData({
      faqVisible: !1,
    });
  },
  openAnchorVisibility: function () {
    (this.setData({
      anchorVisibilityVisible: !0,
      anchorVisibilityLoading: !0,
      anchorVisibilityError: '',
    }),
      wx.vibrateShort &&
        wx.vibrateShort({
          type: 'light',
          fail: function () {},
        }),
      this.loadAnchorVisibility());
  },
  closeAnchorVisibility: function () {
    this.data.anchorVisibilitySavingAccount ||
      this.setData({
        anchorVisibilityVisible: !1,
      });
  },
  onAnchorVisibilityOverlayTap: function () {
    this.closeAnchorVisibility();
  },
  loadAnchorVisibility: function () {
    var e = this;
    return a(
      i().mark(function n() {
        var o;
        return i().wrap(
          function (n) {
            for (;;)
              switch ((n.prev = n.next)) {
                case 0:
                  if (!e.anchorVisibilityRequest) {
                    n.next = 2;
                    break;
                  }
                  return n.abrupt('return', e.anchorVisibilityRequest);

                case 2:
                  return (
                    e.setData({
                      anchorVisibilityLoading: !0,
                      anchorVisibilityError: '',
                    }),
                    (o = a(
                      i().mark(function a() {
                        var n, o, c, u, l, p, f, b, g, m, y, T, v;
                        return i().wrap(
                          function (i) {
                            for (;;)
                              switch ((i.prev = i.next)) {
                                case 0:
                                  return ((i.prev = 0), (i.next = 3), s.ensureSession());

                                case 3:
                                  return (
                                    (i.next = 5),
                                    Promise.all([
                                      s.fetchAnchors(),
                                      s.fetchSubscriptions(),
                                      s.fetchFavoriteAnchor(),
                                    ])
                                  );

                                case 5:
                                  ((n = i.sent),
                                    (o = t(n, 3)),
                                    (c = o[0]),
                                    (u = o[1]),
                                    (l = o[2]),
                                    (p = (c && c.data && c.data.items) || []),
                                    (f = u && u.data ? u.data : {}),
                                    (b = l && l.data ? l.data : {}),
                                    (g = h(f.hidden_anchor_accounts)),
                                    (m = new Set(g)),
                                    (y = b.selected ? String(b.anchor_account || '') : ''),
                                    (T = {
                                      852703780: '/assets/images/lin-siqi-avatar.jpg',
                                      '99999dbz': '/assets/images/dabin-avatar.jpg',
                                    }),
                                    (v = p.map(function (e) {
                                      var t,
                                        i = String(e.account || '');
                                      return {
                                        account: i,
                                        nickname: String(e.nickname || i),
                                        avatarUrl:
                                          T[i] ||
                                          ((t = e.avatar_url),
                                          t && t.startsWith('/')
                                            ? ''.concat(r.API_BASE_URL).concat(t)
                                            : t || ''),
                                        initial: d(e.nickname || i),
                                        hidden: m.has(i),
                                        isFavorite: i === y,
                                      };
                                    })),
                                    e.persistHiddenAnchorAccounts(g),
                                    e.setAnchorVisibilityItems(v, {
                                      favoriteAnchorAccount: y,
                                    }),
                                    (i.next = 25));
                                  break;

                                case 22:
                                  ((i.prev = 22),
                                    (i.t0 = i.catch(0)),
                                    e.setData({
                                      anchorVisibilityError:
                                        i.t0.message || '守候列表读取失败，请稍后重试',
                                    }));

                                case 25:
                                  return (
                                    (i.prev = 25),
                                    e.setData({
                                      anchorVisibilityLoading: !1,
                                    }),
                                    i.finish(25)
                                  );

                                case 28:
                                case 'end':
                                  return i.stop();
                              }
                          },
                          a,
                          null,
                          [[0, 22, 25, 28]]
                        );
                      })
                    )()),
                    (e.anchorVisibilityRequest = o),
                    (n.prev = 5),
                    (n.next = 8),
                    o
                  );

                case 8:
                  return n.abrupt('return', n.sent);

                case 9:
                  return (
                    (n.prev = 9),
                    e.anchorVisibilityRequest === o && (e.anchorVisibilityRequest = null),
                    n.finish(9)
                  );

                case 12:
                case 'end':
                  return n.stop();
              }
          },
          n,
          null,
          [[5, , 9, 12]]
        );
      })
    )();
  },
  setAnchorVisibilityItems: function (e) {
    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
      i = e.filter(function (e) {
        return e.hidden;
      }).length,
      a = {
        anchorVisibilityItems: e,
        anchorVisibilityShownCount: e.length - i,
        anchorVisibilityHiddenCount: i,
      };
    (void 0 !== t.favoriteAnchorAccount && (a.favoriteAnchorAccount = t.favoriteAnchorAccount),
      this.setData(a));
  },
  persistHiddenAnchorAccounts: function (e) {
    try {
      wx.setStorageSync('media-hidden-anchors', h(e));
    } catch (e) {}
  },
  onToggleAnchorVisibility: function (t) {
    var n = this;
    return a(
      i().mark(function a() {
        var r, o, c, u, l, p;
        return i().wrap(
          function (i) {
            for (;;)
              switch ((i.prev = i.next)) {
                case 0:
                  if (
                    ((r = String(t.currentTarget.dataset.account || '')),
                    (o = n.data.anchorVisibilityItems.find(function (e) {
                      return e.account === r;
                    })) && !n.data.anchorVisibilitySavingAccount)
                  ) {
                    i.next = 4;
                    break;
                  }
                  return i.abrupt('return');

                case 4:
                  if (!o.isFavorite || o.hidden) {
                    i.next = 7;
                    break;
                  }
                  return (
                    wx.showToast({
                      title: '请先在首页切换我的爱播',
                      icon: 'none',
                      duration: 2600,
                    }),
                    i.abrupt('return')
                  );

                case 7:
                  return (
                    (c = !o.hidden),
                    n.setData({
                      anchorVisibilitySavingAccount: r,
                    }),
                    (i.prev = 9),
                    (i.next = 12),
                    s.setAnchorHidden(r, c, !1)
                  );

                case 12:
                  ((u = n.data.anchorVisibilityItems.map(function (t) {
                    return t.account === r
                      ? e(
                          e({}, t),
                          {},
                          {
                            hidden: c,
                          }
                        )
                      : t;
                  })),
                    (l = u
                      .filter(function (e) {
                        return e.hidden;
                      })
                      .map(function (e) {
                        return e.account;
                      })),
                    n.persistHiddenAnchorAccounts(l),
                    n.setAnchorVisibilityItems(u),
                    wx.vibrateShort &&
                      wx.vibrateShort({
                        type: 'light',
                        fail: function () {},
                      }),
                    wx.showToast({
                      title: c ? '已从守候列表隐藏' : '已恢复显示',
                      icon: 'none',
                    }),
                    (i.next = 24));
                  break;

                case 20:
                  ((i.prev = 20),
                    (i.t0 = i.catch(9)),
                    (p =
                      'FAVORITE_ANCHOR_CANNOT_HIDE' === i.t0.code
                        ? '请先在首页切换我的爱播'
                        : i.t0.message || '设置失败，请重试'),
                    wx.showToast({
                      title: p,
                      icon: 'none',
                      duration: 2600,
                    }));

                case 24:
                  return (
                    (i.prev = 24),
                    n.setData({
                      anchorVisibilitySavingAccount: '',
                    }),
                    i.finish(24)
                  );

                case 27:
                case 'end':
                  return i.stop();
              }
          },
          a,
          null,
          [[9, 20, 24, 27]]
        );
      })
    )();
  },
  onRepairNotification: function () {
    this.touchFeedback();
    var e = (function () {
      try {
        var e = wx.getStorageSync('notificationRepairPendingV1');
        return e &&
          'object' === n(e) &&
          p[e.notificationType] &&
          ['accept', 'reject'].includes(e.authorizationResult) &&
          e.idempotencyKey &&
          e.templateId
          ? e
          : null;
      } catch (e) {
        return null;
      }
    })();
    if (e) {
      var t = p[e.notificationType];
      this.setData({
        repairPanelVisible: !0,
        repairPanelStep: 'error',
        repairingNotification: !1,
        selectedRepairType: e.notificationType,
        selectedRepairName: t.name,
        repairIdempotencyKey: e.idempotencyKey,
        repairAuthorizationResult: e.authorizationResult,
        repairTemplateId: e.templateId,
        repairErrorMessage: '微信授权结果已保存，请点击重新同步完成修复。',
      });
    } else
      this.setData({
        repairPanelVisible: !0,
        repairPanelStep: 'choose',
        repairingNotification: !1,
        selectedRepairType: '',
        selectedRepairName: '',
        repairIdempotencyKey: '',
        repairAuthorizationResult: '',
        repairTemplateId: '',
        repairErrorMessage: '',
      });
  },
  onSelectRepairType: function (e) {
    var t = String(e.currentTarget.dataset.type || ''),
      i = p[t];
    if (i) {
      var a = i.templateId;
      a
        ? this.setData({
            selectedRepairType: t,
            selectedRepairName: i.name,
            repairTemplateId: a,
            repairPanelStep: 'confirm',
            repairErrorMessage: '',
          })
        : this.setData({
            selectedRepairType: t,
            selectedRepairName: i.name,
            repairPanelStep: 'error',
            repairErrorMessage: '对应的通知模板尚未配置，请稍后再试。',
          });
    }
  },
  onBackToRepairChoices: function () {
    this.data.repairAuthorizationResult ||
      this.setData({
        repairPanelStep: 'choose',
        selectedRepairType: '',
        selectedRepairName: '',
        repairIdempotencyKey: '',
        repairTemplateId: '',
        repairErrorMessage: '',
      });
  },
  submitNotificationRepair: function () {
    var e = this;
    return a(
      i().mark(function t() {
        var a, n, r, o, c, u, l, p, d;
        return i().wrap(
          function (t) {
            for (;;)
              switch ((t.prev = t.next)) {
                case 0:
                  if (!e.data.repairingNotification && e.data.selectedRepairType) {
                    t.next = 2;
                    break;
                  }
                  return t.abrupt('return');

                case 2:
                  return (
                    (a = e.data.selectedRepairType),
                    (n = e.data.repairTemplateId),
                    (r = e.data.repairAuthorizationResult),
                    (o =
                      e.data.repairIdempotencyKey ||
                      'repair_'
                        .concat(Date.now(), '_')
                        .concat(Math.random().toString(36).slice(2, 12))),
                    e.setData({
                      repairingNotification: !0,
                      repairPanelStep: 'processing',
                      repairIdempotencyKey: o,
                      repairErrorMessage: '',
                    }),
                    (t.prev = 7),
                    (t.next = 10),
                    s.ensureSession()
                  );

                case 10:
                  if (r) {
                    t.next = 18;
                    break;
                  }
                  return (
                    (t.next = 13),
                    new Promise(function (e, t) {
                      wx.requestSubscribeMessage({
                        tmplIds: [n],
                        success: e,
                        fail: t,
                      });
                    })
                  );

                case 13:
                  ((c = t.sent),
                    (r = 'accept' === c[n] ? 'accept' : 'reject'),
                    (u = {
                      notificationType: a,
                      authorizationResult: r,
                      idempotencyKey: o,
                      templateId: n,
                    }),
                    wx.setStorageSync('notificationRepairPendingV1', u),
                    e.setData({
                      repairAuthorizationResult: r,
                    }));

                case 18:
                  return (
                    (t.next = 20),
                    s.repairNotification({
                      notification_type: a,
                      authorization_result: r,
                      template_id: n,
                      idempotency_key: o,
                      confirmation: 'REPAIR',
                    })
                  );

                case 20:
                  ((l = t.sent),
                    (p = l && l.data ? l.data : {}),
                    (d = Number(p.quota || 0)),
                    'live' === a &&
                      (wx.setStorageSync('notifyCount', d),
                      'accept' === r && wx.setStorageSync('pushEnabled', !0)),
                    wx.removeStorageSync('notificationRepairPendingV1'),
                    e.setData({
                      repairingNotification: !1,
                      repairPanelStep: 'accept' === r ? 'success' : 'rejected',
                    }),
                    (t.next = 31));
                  break;

                case 28:
                  ((t.prev = 28),
                    (t.t0 = t.catch(7)),
                    e.setData({
                      repairingNotification: !1,
                      repairPanelStep: 'error',
                      repairErrorMessage: t.t0.errMsg || t.t0.message || '修复失败，请稍后重试',
                    }));

                case 31:
                case 'end':
                  return t.stop();
              }
          },
          t,
          null,
          [[7, 28]]
        );
      })
    )();
  },
  onRetryNotificationRepair: function () {
    this.submitNotificationRepair();
  },
  onCloseRepairPanel: function () {
    'processing' !== this.data.repairPanelStep &&
      this.setData({
        repairPanelVisible: !1,
      });
  },
  onRepairOverlayTap: function () {
    this.onCloseRepairPanel();
  },
  onTestNotification: function () {
    var e = this;
    return a(
      i().mark(function a() {
        var n, o, c, u, l, p, d, h;
        return i().wrap(
          function (i) {
            for (;;)
              switch ((i.prev = i.next)) {
                case 0:
                  if ((e.touchFeedback(), !e.data.testingNotification)) {
                    i.next = 3;
                    break;
                  }
                  return i.abrupt('return');

                case 3:
                  return (
                    e.setData({
                      testingNotification: !0,
                      testPanelVisible: !0,
                      testPanelStep: 'loading',
                      selectedTestType: '',
                      selectedTestName: '',
                      selectedTestQuota: 0,
                      testIdempotencyKey: '',
                      testErrorMessage: '',
                    }),
                    (i.prev = 4),
                    (i.next = 7),
                    Promise.all([
                      s.fetchSubscription(r.ANCHOR.account),
                      s.fetchLeaveSubscription(r.ANCHOR.account),
                      s.fetchWorkSubscription(r.ANCHOR.account).catch(function () {
                        return {
                          data: {
                            quota: 0,
                            enabled: !1,
                          },
                        };
                      }),
                    ])
                  );

                case 7:
                  ((n = i.sent),
                    (o = t(n, 3)),
                    (c = o[0]),
                    (u = o[1]),
                    (l = o[2]),
                    (p = (c && c.data) || {}),
                    (d = (u && u.data) || {}),
                    (h = (l && l.data) || {}),
                    e.setData({
                      testingNotification: !1,
                      testPanelStep: 'choose',
                      liveTestQuota: Number(p.quota || 0),
                      leaveTestQuota: Number(d.quota || 0),
                      workTestQuota: Number(h.quota || 0),
                      liveTestEnabled: Boolean(p.enabled),
                      leaveTestEnabled: Boolean(d.enabled),
                      workTestEnabled: Boolean(h.enabled),
                    }),
                    (i.next = 21));
                  break;

                case 18:
                  ((i.prev = 18),
                    (i.t0 = i.catch(4)),
                    e.setData({
                      testingNotification: !1,
                      testPanelStep: 'error',
                      testErrorMessage: i.t0.message || '读取通知次数失败，请稍后重试',
                    }));

                case 21:
                case 'end':
                  return i.stop();
              }
          },
          a,
          null,
          [[4, 18]]
        );
      })
    )();
  },
  onSelectTestType: function (e) {
    var t = e.currentTarget.dataset.type,
      i = {
        live: {
          name: '开播通知',
          quota: this.data.liveTestQuota,
          enabled: this.data.liveTestEnabled,
        },
        leave: {
          name: '请假通知',
          quota: this.data.leaveTestQuota,
          enabled: this.data.leaveTestEnabled,
        },
        work: {
          name: '作品通知',
          quota: this.data.workTestQuota,
          enabled: this.data.workTestEnabled,
        },
      }[t];
    if (i) {
      var a = i.name,
        n = i.quota;
      !i.enabled || n <= 0
        ? this.setData({
            selectedTestType: t,
            selectedTestName: a,
            selectedTestQuota: n,
            testPanelStep: 'error',
            testErrorMessage:
              n <= 0
                ? '当前没有可用的'.concat(a, '次数，请先增加提醒次数。')
                : ''.concat(a, '当前已关闭，请先开启提醒。'),
          })
        : this.setData({
            selectedTestType: t,
            selectedTestName: a,
            selectedTestQuota: n,
            testIdempotencyKey: 'test_'
              .concat(Date.now(), '_')
              .concat(Math.random().toString(36).slice(2, 12)),
            testPanelStep: 'confirm',
            testErrorMessage: '',
          });
    }
  },
  submitTestNotification: function () {
    var e = this;
    return a(
      i().mark(function t() {
        return i().wrap(
          function (t) {
            for (;;)
              switch ((t.prev = t.next)) {
                case 0:
                  if (!e.data.testingNotification && e.data.selectedTestType) {
                    t.next = 2;
                    break;
                  }
                  return t.abrupt('return');

                case 2:
                  return (
                    e.setData({
                      testingNotification: !0,
                      testPanelStep: 'sending',
                      testErrorMessage: '',
                    }),
                    (t.prev = 3),
                    (t.next = 6),
                    s.sendTestNotification({
                      notification_type: e.data.selectedTestType,
                      idempotency_key: e.data.testIdempotencyKey,
                      confirmation: 'SEND',
                    })
                  );

                case 6:
                  (e.setData({
                    testingNotification: !1,
                    testPanelStep: 'success',
                  }),
                    (t.next = 12));
                  break;

                case 9:
                  ((t.prev = 9),
                    (t.t0 = t.catch(3)),
                    e.setData({
                      testingNotification: !1,
                      testPanelStep: 'error',
                      testErrorMessage: t.t0.message || '发送失败，请稍后重试',
                    }));

                case 12:
                case 'end':
                  return t.stop();
              }
          },
          t,
          null,
          [[3, 9]]
        );
      })
    )();
  },
  onConfirmTestNotification: function () {
    this.submitTestNotification();
  },
  onRetryTestNotification: function () {
    this.data.selectedTestType && this.data.testIdempotencyKey
      ? this.submitTestNotification()
      : this.onTestNotification();
  },
  onBackToTestChoices: function () {
    this.setData({
      testPanelStep: 'choose',
      selectedTestType: '',
      selectedTestName: '',
      selectedTestQuota: 0,
      testIdempotencyKey: '',
      testErrorMessage: '',
    });
  },
  onTestErrorSecondaryAction: function () {
    this.data.selectedTestType ? this.onBackToTestChoices() : this.onCloseTestPanel();
  },
  onCloseTestPanel: function () {
    'sending' !== this.data.testPanelStep &&
      this.setData({
        testingNotification: !1,
        testPanelVisible: !1,
      });
  },
  onTestOverlayTap: function () {
    this.onCloseTestPanel();
  },
  onClearCache: function () {
    (this.touchFeedback(),
      wx.showModal({
        title: '清除本地缓存',
        content: '会清除本机登录状态和显示缓存，不会影响已增加的提醒次数。是否继续？',
        success: function (e) {
          e.confirm &&
            (wx.clearStorageSync(),
            wx.showToast({
              title: '缓存已清除',
              icon: 'success',
            }));
        },
      }));
  },
  onToggleQuestion: function (e) {
    var t = Number(e.currentTarget.dataset.index);
    this.setData({
      activeQuestion: this.data.activeQuestion === t ? -1 : t,
    });
  },
});
