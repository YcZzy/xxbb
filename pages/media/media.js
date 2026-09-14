'use strict';

require('../../@babel/runtime/helpers/Arrayincludes');

var e = require('../../@babel/runtime/helpers/regeneratorRuntime'),
  t = require('../../@babel/runtime/helpers/asyncToGenerator'),
  a = require('../../@babel/runtime/helpers/objectSpread2'),
  n = require('../../config/env'),
  r = require('../../services/api'),
  i = require('../../utils/share'),
  o = require('../../utils/tab-bar'),
  c = require('../../utils/mascot-theme'),
  s = require('../../utils/view-cache'),
  u = require('../../utils/performance-mode'),
  l = Math.max(1e3, 1e3 * n.STATUS_REFRESH_SECONDS),
  h = Math.max(15e3, l);

function d(e) {
  return Array.from(e || '')[0] || '';
}

function f(e) {
  return String(Math.max(0, Math.round(Number(e) || 0))).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function v(e) {
  return e && e.startsWith('/') ? ''.concat(n.API_BASE_URL).concat(e) : e || '';
}

Page(
  a(
    a({}, require('../../utils/inline-artwork')),
    {},
    {
      data: {
        inlineArt: {},
        statusBarHeight: 20,
        navigationHeight: 64,
        mascotThemeSkin: 'classic',
        mascotThemeClass: 'theme-classic',
        mascotThemeIsIce: !1,
        mascotThemeIsMoonTide: !1,
        performanceClass: u.className(),
        anchors: [],
        filteredAnchors: [],
        subscribedAnchorCount: 0,
        showSpecialFocus: !1,
        hiddenAnchorAccounts: [],
        filterToolsExpanded: !0,
        searchQuery: '',
        loading: !1,
        loadError: '',
        isAdmin: !1,
        showLoveCall: !1,
        cardPackFreeAvailable: !1,
        submittingLoveCall: !1,
        loveCallSuccess: !1,
        loveCallSuccessAccount: '',
        loveCallAccountInput: '',
        loveCallCampaign: null,
        hasFanBadgeAccess: !1,
        showFanBadge: !1,
        claimingFanBadge: !1,
        fanBadge: null,
        eligibleFanBadges: [],
        fanBadgePreview: {},
        isLocalDevelopment: !1,
        featuredViewerPreviewEnabled: !1,
        categories: [
          {
            key: 'key',
            label: '重点主播',
          },
          {
            key: 'star',
            label: '明星',
          },
          {
            key: 'voice',
            label: '虚拟',
          },
          {
            key: 'fun',
            label: '娱乐',
          },
          {
            key: 'game',
            label: '游戏',
          },
        ],
        activeCategory: 'key',
      },
      openCardPacks: function () {
        (wx.vibrateShort &&
          wx.vibrateShort({
            type: 'light',
            fail: function () {},
          }),
          wx.navigateTo({
            url: '/pages/card-pack/card-pack',
          }));
      },
      refreshCardPackAvailability: function () {
        var a = this;
        return t(
          e().mark(function t() {
            var n, i, o, c, s;
            return e().wrap(
              function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      if (a.cardPackVisible) {
                        e.next = 2;
                        break;
                      }
                      return e.abrupt('return');

                    case 2:
                      return (
                        (n = a.cardPackRevision = (a.cardPackRevision || 0) + 1),
                        a.cardPackRefreshTimer && clearTimeout(a.cardPackRefreshTimer),
                        (a.cardPackRefreshTimer = null),
                        a.setData({
                          cardPackFreeAvailable: !1,
                        }),
                        (e.prev = 6),
                        (e.next = 9),
                        r.fetchCardPacks()
                      );

                    case 9:
                      if (((i = e.sent), a.cardPackVisible && n === a.cardPackRevision)) {
                        e.next = 12;
                        break;
                      }
                      return e.abrupt('return');

                    case 12:
                      if ((o = i && i.data) && Number.isFinite(o.remaining)) {
                        e.next = 15;
                        break;
                      }
                      return e.abrupt('return');

                    case 15:
                      (a.setData({
                        cardPackFreeAvailable: o.remaining > 0,
                      }),
                        (c = Number.isFinite(o.server_time) ? 1e3 * o.server_time : Date.now()),
                        864e5,
                        288e5,
                        (s = 864e5 * (Math.floor((c + 288e5) / 864e5) + 1) - 288e5),
                        (a.cardPackRefreshTimer = setTimeout(
                          function () {
                            ((a.cardPackRefreshTimer = null), a.refreshCardPackAvailability());
                          },
                          Math.max(1e3, s - c + 250)
                        )),
                        (e.next = 24));
                      break;

                    case 22:
                      ((e.prev = 22), (e.t0 = e.catch(6)));

                    case 24:
                    case 'end':
                      return e.stop();
                  }
              },
              t,
              null,
              [[6, 22]]
            );
          })
        )();
      },
      stopCardPackAvailability: function () {
        ((this.cardPackVisible = !1),
          (this.cardPackRevision = (this.cardPackRevision || 0) + 1),
          this.cardPackRefreshTimer && clearTimeout(this.cardPackRefreshTimer),
          (this.cardPackRefreshTimer = null),
          this.setData({
            cardPackFreeAvailable: !1,
          }));
      },
      onLoad: function () {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        ((this.preferSpecialFocusOnEntry = !0),
          this.restoreFilterToolsPreference(),
          i.enableShareMenu(),
          this.setNavigationMetrics(),
          this.detectLocalDevelopment(),
          this.restoreCachedHiddenAnchors(),
          this.restoreCachedAnchors(),
          (this.openLoveCallOnShow = 'love-call' === e.open));
      },
      onShow: function () {
        var e = this;
        ((this.cardPackVisible = !0),
          this.refreshCardPackAvailability(),
          o.sync(this, 'media'),
          c.sync(this),
          (this.preferSpecialFocusOnEntry = !0),
          this.updateAnchors(this.data.anchors, {
            persist: !1,
          }),
          this.data.anchors.length
            ? Promise.all([
                this.loadAnchors(!0).then(function () {
                  return e.loadSubscriptions();
                }),
                this.loadAdminCapabilities(),
                this.loadFanBadges(),
              ])
            : this.loadAll(),
          this.startAutoRefresh(),
          this.openLoveCallOnShow && ((this.openLoveCallOnShow = !1), this.openLoveCall()));
      },
      onHide: function () {
        (this.stopCardPackAvailability(), this.stopAutoRefresh(), this.stopViewerCountAnimation());
      },
      onUnload: function () {
        (this.stopCardPackAvailability(),
          (this.inlineArtStopped = !0),
          this.stopAutoRefresh(),
          this.stopViewerCountAnimation(),
          this.mediaCacheTimer && clearTimeout(this.mediaCacheTimer),
          this.persistMediaCache());
      },
      openLoveCall: function (e) {
        var t = e && e.currentTarget && e.currentTarget.dataset.account;
        wx.navigateTo({
          url: '/pages/love-call/love-call' + (t ? '?account='.concat(encodeURIComponent(t)) : ''),
        });
      },
      closeLoveCall: function () {
        this.data.submittingLoveCall ||
          this.setData({
            showLoveCall: !1,
            loveCallSuccess: !1,
            loveCallSuccessAccount: '',
            loveCallAccountInput: '',
            loveCallCampaign: null,
          });
      },
      openFanBadge: function () {
        var e = this.data.fanBadge || this.data.eligibleFanBadges[0];
        e &&
          this.setData({
            showFanBadge: !0,
            fanBadgePreview: e,
          });
      },
      closeFanBadge: function () {
        this.data.claimingFanBadge ||
          this.setData({
            showFanBadge: !1,
          });
      },
      selectFanBadge: function (e) {
        if (!this.data.fanBadge && !this.data.claimingFanBadge) {
          var t = String(e.currentTarget.dataset.account || ''),
            a = this.data.eligibleFanBadges.find(function (e) {
              return e.anchor_account === t;
            });
          a &&
            this.setData({
              fanBadgePreview: a,
            });
        }
      },
      claimFanBadge: function () {
        var n = this;
        return t(
          e().mark(function t() {
            var i, o, c, s, u;
            return e().wrap(
              function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      if (!n.data.fanBadge && !n.data.claimingFanBadge) {
                        e.next = 2;
                        break;
                      }
                      return e.abrupt('return');

                    case 2:
                      if ((i = String(n.data.fanBadgePreview.anchor_account || ''))) {
                        e.next = 5;
                        break;
                      }
                      return e.abrupt('return');

                    case 5:
                      if (!n.data.isLocalDevelopment || !n.data.fanBadgePreview.preview) {
                        e.next = 12;
                        break;
                      }
                      return (
                        (o = a({}, n.data.fanBadgePreview)),
                        n.setData({
                          fanBadge: o,
                          fanBadgePreview: o,
                          eligibleFanBadges: [],
                          hasFanBadgeAccess: !0,
                        }),
                        n.markMyFanBadge(o.anchor_account),
                        wx.vibrateShort &&
                          wx.vibrateShort({
                            type: 'medium',
                          }),
                        wx.showToast({
                          title: '专属徽章已点亮',
                          icon: 'none',
                        }),
                        e.abrupt('return')
                      );

                    case 12:
                      return (
                        n.setData({
                          claimingFanBadge: !0,
                        }),
                        (e.prev = 13),
                        (e.next = 16),
                        r.claimFanBadge(i)
                      );

                    case 16:
                      if (((c = e.sent), (s = c && c.data ? c.data.award : null))) {
                        e.next = 20;
                        break;
                      }
                      throw new Error('服务未返回徽章信息');

                    case 20:
                      ((u = n.normalizeFanBadge(s)),
                        n.setData({
                          fanBadge: u,
                          fanBadgePreview: u,
                          eligibleFanBadges: [],
                          hasFanBadgeAccess: !0,
                        }),
                        n.markMyFanBadge(u.anchor_account),
                        wx.vibrateShort &&
                          wx.vibrateShort({
                            type: 'medium',
                          }),
                        wx.showToast({
                          title: '专属徽章已点亮',
                          icon: 'none',
                        }),
                        (e.next = 32));
                      break;

                    case 27:
                      return (
                        (e.prev = 27),
                        (e.t0 = e.catch(13)),
                        wx.showToast({
                          title: e.t0.message || '领取失败，请稍后再试',
                          icon: 'none',
                          duration: 2600,
                        }),
                        (e.next = 32),
                        n.loadFanBadges()
                      );

                    case 32:
                      return (
                        (e.prev = 32),
                        n.setData({
                          claimingFanBadge: !1,
                        }),
                        e.finish(32)
                      );

                    case 35:
                    case 'end':
                      return e.stop();
                  }
              },
              t,
              null,
              [[13, 27, 32, 35]]
            );
          })
        )();
      },
      noop: function () {},
      openViewerArchive: function (e) {
        var t = String(e.currentTarget.dataset.account || '').trim();
        t &&
          (wx.vibrateShort &&
            wx.vibrateShort({
              type: 'light',
              fail: function () {},
            }),
          wx.navigateTo({
            url: '/pages/viewer-archive/viewer-archive?account='.concat(encodeURIComponent(t)),
            fail: function () {
              wx.showToast({
                title: '在线趋势暂时无法打开',
                icon: 'none',
              });
            },
          }));
      },
      onLoveCallInput: function (e) {
        var t = String(e.detail.value || '');
        ((this.loveCallAccountDraft = t),
          this.setData({
            loveCallAccountInput: t,
          }));
      },
      chooseSiwuliuLoveCall: function () {
        this.data.submittingLoveCall ||
          ((this.loveCallAccountDraft = '82553285031'),
          this.setData({
            loveCallAccountInput: '82553285031',
          }));
      },
      normalizeLoveCallCampaign: function (e, t) {
        var n = t && 'siwuliu_ice' === t.theme_code && 'upcoming' !== t.status,
          r = n ? t : e,
          i = n ? 'theme' : 'skin';
        if (!r) return null;
        if ('skin' === i && 'siwuliu_ice' !== r.skin_code) return null;
        var o = 'theme' === i && 'total_calls' === r.progress_mode,
          c = 'theme' === i ? 16 : 7,
          s = Math.max(1, Number((o ? r.required_calls : r.required_days) || c)),
          u = r.owned ? s : Math.min(s, Math.max(0, Number(o ? r.call_count : r.streak_days) || 0)),
          l = 'theme' === i ? '冰蓝主题' : '𝑿.四五六🍉限定形象';
        return a(
          a({}, r),
          {},
          {
            kind: i,
            required_days: s,
            streak_days: u,
            owned: Boolean(r.owned),
            newly_unlocked: Boolean(r.newly_unlocked),
            progress_width: Math.round((u / s) * 100),
            progress_text: ''.concat(u, '/').concat(s),
            kicker: 'theme' === i ? '𝑿.四五六🍉 · 主题收藏' : '𝑿.四五六🍉 · 限定形象',
            title: r.owned
              ? r.newly_unlocked
                ? ''.concat(l, '已永久解锁')
                : ''.concat(l, '已拥有')
              : o
                ? '9 月已累计支持 '.concat(u, ' 次')
                : '已连续支持 '.concat(u, ' 天'),
            caption: r.owned
              ? '回到首页形象与主题收藏即可切换'
              : '还差 '
                  .concat(Math.max(0, s - u), ' ')
                  .concat(o ? '次' : '天', '解锁')
                  .concat(l),
          }
        );
      },
      submitLoveCall: function () {
        var a = this;
        return t(
          e().mark(function t() {
            var n, i, o, c;
            return e().wrap(
              function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      if (!a.data.submittingLoveCall) {
                        e.next = 2;
                        break;
                      }
                      return e.abrupt('return');

                    case 2:
                      if (
                        (n = String(a.loveCallAccountDraft || '')
                          .trim()
                          .replace(/^@+/, '')
                          .trim())
                      ) {
                        e.next = 6;
                        break;
                      }
                      return (
                        wx.showToast({
                          title: '请先填写dy号',
                          icon: 'none',
                        }),
                        e.abrupt('return')
                      );

                    case 6:
                      if (/^[A-Za-z0-9_.-]{3,64}$/.test(n)) {
                        e.next = 9;
                        break;
                      }
                      return (
                        wx.showToast({
                          title: '请填写正确的dy号',
                          icon: 'none',
                        }),
                        e.abrupt('return')
                      );

                    case 9:
                      return (
                        a.setData({
                          submittingLoveCall: !0,
                        }),
                        (e.prev = 10),
                        (e.next = 13),
                        r.submitLoveCall({
                          douyin_account: n,
                        })
                      );

                    case 13:
                      ((i = e.sent),
                        (o = i && i.data ? i.data : {}),
                        (c = a.normalizeLoveCallCampaign(
                          o.mascot_skin_campaign,
                          o.mascot_theme_campaign
                        )),
                        (a.loveCallAccountDraft = ''),
                        a.setData({
                          loveCallSuccess: !0,
                          loveCallSuccessAccount: n,
                          loveCallAccountInput: '',
                          loveCallCampaign: c,
                        }),
                        wx.vibrateShort &&
                          wx.vibrateShort({
                            type: c && c.newly_unlocked ? 'heavy' : 'light',
                          }),
                        (e.next = 27));
                      break;

                    case 21:
                      if (
                        ((e.prev = 21), (e.t0 = e.catch(10)), 'LOVE_CALL_DAILY_LIMIT' !== e.t0.code)
                      ) {
                        e.next = 26;
                        break;
                      }
                      return (
                        wx.showModal({
                          title: '今天已经打过call啦',
                          content: '同一微信用户每天可以提交一次，明天再来支持喜欢的主播吧。',
                          showCancel: !1,
                          confirmText: '知道了',
                          confirmColor: '#d93a2f',
                        }),
                        e.abrupt('return')
                      );

                    case 26:
                      wx.showToast({
                        title: e.t0.message || '提交失败，请稍后再试',
                        icon: 'none',
                        duration: 2600,
                      });

                    case 27:
                      return (
                        (e.prev = 27),
                        a.setData({
                          submittingLoveCall: !1,
                        }),
                        e.finish(27)
                      );

                    case 30:
                    case 'end':
                      return e.stop();
                  }
              },
              t,
              null,
              [[10, 21, 27, 30]]
            );
          })
        )();
      },
      onShareAppMessage: function (e) {
        return e && 'button' === e.from && e.target && 'love-call' === e.target.dataset.shareScene
          ? i.appMessage({
              title: '我为爱播打call｜一起支持喜欢的主播',
              path: '/pages/media/media',
            })
          : e && 'button' === e.from && e.target && 'fan-badge' === e.target.dataset.shareScene
            ? i.appMessage({
                title: '万人热爱已点亮｜来为你喜欢的主播打call',
                path: '/pages/media/media',
              })
            : i.appMessage();
      },
      onShareTimeline: function () {
        return i.timeline();
      },
      onPullDownRefresh: function () {
        this.loadAll().finally(function () {
          return wx.stopPullDownRefresh();
        });
      },
      setNavigationMetrics: function () {
        var e = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync(),
          t = wx.getMenuButtonBoundingClientRect(),
          a = e.statusBarHeight || 20,
          n = 2 * (t.top - a) + t.height + a;
        this.setData({
          statusBarHeight: a,
          navigationHeight: n,
        });
      },
      detectLocalDevelopment: function () {
        try {
          var e = wx.getAccountInfoSync ? wx.getAccountInfoSync() : {},
            t = e && e.miniProgram ? e.miniProgram : {},
            a = wx.getDeviceInfo
              ? wx.getDeviceInfo()
              : wx.getSystemInfoSync
                ? wx.getSystemInfoSync()
                : {},
            n = 'develop' === t.envVersion;
          this.setData({
            isLocalDevelopment: n && 'devtools' === a.platform,
            featuredViewerPreviewEnabled: n,
          });
        } catch (e) {
          this.setData({
            isLocalDevelopment: !1,
            featuredViewerPreviewEnabled: !1,
          });
        }
      },
      startAutoRefresh: function () {
        var a = this;
        if (((this.autoRefreshEnabled = !0), !this.refreshTimer)) {
          var n = this.data.anchors.some(function (e) {
            return 'live' === e.status;
          })
            ? l
            : h;
          this.refreshTimer = setTimeout(
            t(
              e().mark(function t() {
                return e().wrap(
                  function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return (
                            (a.refreshTimer = null),
                            (e.prev = 1),
                            (e.next = 4),
                            a.loadAnchors(!0)
                          );

                        case 4:
                          return (
                            (e.prev = 4),
                            a.autoRefreshEnabled && a.startAutoRefresh(),
                            e.finish(4)
                          );

                        case 7:
                        case 'end':
                          return e.stop();
                      }
                  },
                  t,
                  null,
                  [[1, , 4, 7]]
                );
              })
            ),
            n
          );
        }
      },
      stopAutoRefresh: function () {
        ((this.autoRefreshEnabled = !1),
          this.refreshTimer && (clearTimeout(this.refreshTimer), (this.refreshTimer = null)));
      },
      loadAll: function () {
        var a = this;
        return t(
          e().mark(function t() {
            var n;
            return e().wrap(
              function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      if (!a.loadingAll) {
                        e.next = 2;
                        break;
                      }
                      return e.abrupt('return');

                    case 2:
                      return (
                        (a.loadingAll = !0),
                        (n = !a.data.anchors.length),
                        a.setData({
                          loading: n,
                          loadError: '',
                        }),
                        (e.prev = 5),
                        (e.next = 8),
                        a.loadAnchors()
                      );

                    case 8:
                      return (
                        n &&
                          a.setData({
                            loading: !1,
                          }),
                        (e.next = 11),
                        Promise.all([
                          a.loadSubscriptions(),
                          a.loadAdminCapabilities(),
                          a.loadFanBadges(),
                        ])
                      );

                    case 11:
                      return (
                        (e.prev = 11),
                        (a.loadingAll = !1),
                        n &&
                          a.setData({
                            loading: !1,
                          }),
                        e.finish(11)
                      );

                    case 15:
                    case 'end':
                      return e.stop();
                  }
              },
              t,
              null,
              [[5, , 11, 15]]
            );
          })
        )();
      },
      loadAnchors: function () {
        var a = this,
          n = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
        return (
          this.loadingAnchorsPromise ||
            (this.loadingAnchorsPromise = t(
              e().mark(function t() {
                var i, o, c, s, u, l;
                return e().wrap(
                  function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return ((e.prev = 0), (e.next = 3), r.fetchAnchors());

                        case 3:
                          ((i = e.sent),
                            (o = (i && i.data && i.data.items) || []),
                            (c = a.data.anchors.length > 0),
                            (s = a.data.anchors.reduce(function (e, t) {
                              return ((e[t.account] = t), e);
                            }, {})),
                            (u = {
                              852703780: '/assets/images/lin-siqi-avatar.jpg',
                              '99999dbz': '/assets/images/dabin-avatar.jpg',
                            }),
                            (l = a.applyLocalViewerPreview(o).map(function (e) {
                              var t = Array.isArray(e.badges) ? e.badges : [],
                                n = s[e.account],
                                r = !0 === e.viewer_count_available,
                                i = r ? Math.max(0, Number(e.viewer_count || 0)) : null,
                                o =
                                  n && n.viewerCountAvailable
                                    ? Number(
                                        null == n.viewerCountDisplayValue
                                          ? n.viewerCount
                                          : n.viewerCountDisplayValue
                                      )
                                    : 0,
                                l = c ? o : i;
                              return {
                                account: e.account,
                                douyinId: e.douyin_id || e.account,
                                nickname: e.nickname || e.account,
                                callCount: 'number' == typeof e.call_count ? e.call_count : null,
                                callCountText:
                                  'number' == typeof e.call_count
                                    ? String(e.call_count).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                    : '--',
                                category: e.category || 'key',
                                initial: d(e.nickname || e.account),
                                status: ['live', 'offline', 'unknown'].includes(e.status)
                                  ? e.status
                                  : 'unknown',
                                roomTitle: e.room_title || '',
                                roomId: String(e.room_id || ''),
                                viewerCount: i,
                                viewerCountAvailable: r,
                                viewerCountDisplayValue: r ? Math.max(0, Number(l) || 0) : null,
                                viewerCountDisplay: r ? f(l) : '',
                                avatarUrl: u[e.account] || v(e.avatar_url),
                                featured: Boolean(e.featured),
                                badges: t,
                                primaryBadge: t[0] || null,
                                isMyFanBadge: Boolean(
                                  a.data.fanBadge && a.data.fanBadge.anchor_account === e.account
                                ),
                                enabled: Boolean(s[e.account] && s[e.account].enabled),
                                updating: !1,
                                sendingManual: Boolean(s[e.account] && s[e.account].sendingManual),
                              };
                            })),
                            a.updateAnchors(l),
                            c && a.animateViewerCounts(l),
                            (e.next = 17));
                          break;

                        case 13:
                          ((e.prev = 13),
                            (e.t0 = e.catch(0)),
                            a.setData({
                              loadError: e.t0.message || '传媒主播状态获取失败',
                            }),
                            n ||
                              wx.showToast({
                                title: '状态刷新失败',
                                icon: 'none',
                              }));

                        case 17:
                          return ((e.prev = 17), (a.loadingAnchorsPromise = null), e.finish(17));

                        case 20:
                        case 'end':
                          return e.stop();
                      }
                  },
                  t,
                  null,
                  [[0, 13, 17, 20]]
                );
              })
            )()),
          this.loadingAnchorsPromise
        );
      },
      applyLocalViewerPreview: function (e) {
        var t = this;
        if (!this.data.featuredViewerPreviewEnabled) return e;
        var n = e.find(function (e) {
          return Boolean(e.featured);
        });
        if (n)
          return (
            (this.localViewerPreviewTick = (this.localViewerPreviewTick || 0) + 1),
            e.map(function (e) {
              return e.account === n.account
                ? a(
                    a({}, e),
                    {},
                    {
                      status: 'live',
                      room_title: '置顶主播在线人数排版测试',
                      viewer_count_available: !0,
                      viewer_count: 58642 + 137 * (t.localViewerPreviewTick - 1),
                      local_viewer_preview: !0,
                    }
                  )
                : e;
            })
          );
        if (!this.data.isLocalDevelopment) return e;
        if (
          e.some(function (e) {
            return 'live' === e.status;
          })
        )
          return e;
        var r = ['73796455215', 'dakunkun1124'].filter(function (t) {
            return e.some(function (e) {
              return e.account === t;
            });
          }),
          i = r.length
            ? r
            : e
                .filter(function (e) {
                  return 'key' === (e.category || 'key');
                })
                .slice(0, 2)
                .map(function (e) {
                  return e.account;
                });
        return (
          (this.localViewerPreviewTick = (this.localViewerPreviewTick || 0) + 1),
          e.map(function (e) {
            var n = i.indexOf(e.account);
            if (n < 0) return e;
            var r = 0 === n ? 44292 : 8563,
              o = t.localViewerPreviewTick * (0 === n ? 137 : 43);
            return a(
              a({}, e),
              {},
              {
                status: 'live',
                room_title: '',
                viewer_count_available: !0,
                viewer_count: r + o,
                local_viewer_preview: !0,
              }
            );
          })
        );
      },
      loadSubscriptions: function () {
        var i = this;
        return t(
          e().mark(function t() {
            var o, c, s, u, l, h;
            return e().wrap(
              function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      if (n.API_BASE_URL && n.SUBSCRIBE_TEMPLATE_ID) {
                        e.next = 2;
                        break;
                      }
                      return e.abrupt('return');

                    case 2:
                      return ((e.prev = 2), (e.next = 5), r.ensureSession());

                    case 5:
                      return ((e.next = 7), r.fetchSubscriptions());

                    case 7:
                      ((o = e.sent),
                        (c = o && o.data ? o.data : {}),
                        (s = c.items || []),
                        (u = i.normalizeHiddenAnchorAccounts(c.hidden_anchor_accounts)),
                        (l = s.reduce(function (e, t) {
                          return ((e[String(t.anchor_account || '')] = t), e);
                        }, {})),
                        (h = i.data.anchors.map(function (e) {
                          var t = l[e.account] || {};
                          return a(
                            a({}, e),
                            {},
                            {
                              enabled: Boolean(t.enabled),
                            }
                          );
                        })),
                        i.persistHiddenAnchorAccounts(u),
                        i.updateAnchors(h, {
                          hiddenAnchorAccounts: u,
                        }),
                        (e.next = 19));
                      break;

                    case 17:
                      ((e.prev = 17), (e.t0 = e.catch(2)));

                    case 19:
                    case 'end':
                      return e.stop();
                  }
              },
              t,
              null,
              [[2, 17]]
            );
          })
        )();
      },
      normalizeFanBadge: function (e) {
        return a(
          a({}, e),
          {},
          {
            anchor_account: String(e.anchor_account || ''),
            nickname: String(e.nickname || e.anchor_account || ''),
            initial: d(e.nickname || e.anchor_account),
            badge_name: String(e.badge_name || '粉丝专属徽章'),
            theme: ['red_gold', 'sunset', 'crimson'].includes(e.theme) ? e.theme : 'red_gold',
            avatarUrl: v(e.avatar_url),
          }
        );
      },
      loadFanBadges: function () {
        var a = this;
        return t(
          e().mark(function t() {
            var i, o, c, s, u;
            return e().wrap(
              function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      if (n.API_BASE_URL) {
                        e.next = 2;
                        break;
                      }
                      return e.abrupt('return');

                    case 2:
                      return ((e.prev = 2), (e.next = 5), r.fetchFanBadgeState());

                    case 5:
                      ((i = e.sent),
                        (o = i && i.data ? i.data : {}),
                        (c = o.current ? a.normalizeFanBadge(o.current) : null),
                        (s = Array.isArray(o.eligible)
                          ? o.eligible.map(function (e) {
                              return a.normalizeFanBadge(e);
                            })
                          : []),
                        (u = c || s[0] || {}),
                        a.setData({
                          fanBadge: c,
                          eligibleFanBadges: s,
                          fanBadgePreview: u,
                          hasFanBadgeAccess: Boolean(c || s.length),
                        }),
                        a.markMyFanBadge(c ? c.anchor_account : ''),
                        c || s.length || a.showLocalFanBadgePreview(),
                        (e.next = 18));
                      break;

                    case 15:
                      ((e.prev = 15), (e.t0 = e.catch(2)), a.showLocalFanBadgePreview());

                    case 18:
                    case 'end':
                      return e.stop();
                  }
              },
              t,
              null,
              [[2, 15]]
            );
          })
        )();
      },
      showLocalFanBadgePreview: function () {
        if (this.data.isLocalDevelopment && this.data.anchors.length) {
          var e = ['red_gold', 'sunset', 'crimson'],
            t = ['万心同频', '炽热同行', '星芒守候'],
            a = this.data.anchors.slice(0, 3).map(function (a, n) {
              return {
                anchor_account: a.account,
                nickname: a.nickname,
                initial: a.initial,
                badge_name: t[n],
                theme: e[n],
                avatarUrl: a.avatarUrl,
                preview: !0,
              };
            });
          (this.setData({
            fanBadge: null,
            eligibleFanBadges: a,
            fanBadgePreview: a[0],
            hasFanBadgeAccess: !0,
          }),
            this.markMyFanBadge(''));
        }
      },
      markMyFanBadge: function (e) {
        var t = this.data.anchors.map(function (t) {
          return a(
            a({}, t),
            {},
            {
              isMyFanBadge: Boolean(e && t.account === e),
            }
          );
        });
        this.updateAnchors(t);
      },
      onToggleMonitor: function (n) {
        var i = this;
        return t(
          e().mark(function t() {
            var o, c, s, u, l, h, d;
            return e().wrap(
              function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      if (
                        ((o = String(n.currentTarget.dataset.account || '')),
                        (c = i.data.anchors.findIndex(function (e) {
                          return e.account === o;
                        })),
                        (s = Boolean(n.detail.value)),
                        (u = i.data.anchors[c]) && !u.updating)
                      ) {
                        e.next = 6;
                        break;
                      }
                      return e.abrupt('return');

                    case 6:
                      return (
                        (l = i.data.anchors.map(function (e) {
                          return e.account === o
                            ? a(
                                a({}, e),
                                {},
                                {
                                  enabled: s,
                                  updating: !0,
                                }
                              )
                            : e;
                        })),
                        i.updateAnchors(l),
                        (e.prev = 8),
                        (e.next = 11),
                        r.setSubscriptionEnabled(s, u.account)
                      );

                    case 11:
                      ((h = e.sent),
                        (d = h && h.data ? h.data : {}),
                        i.updateAnchor(o, {
                          enabled: Boolean(d.enabled),
                        }),
                        wx.showToast({
                          title: s ? '已开启开播提醒' : '已暂停提醒',
                          icon: 'none',
                        }),
                        (e.next = 21));
                      break;

                    case 17:
                      ((e.prev = 17),
                        (e.t0 = e.catch(8)),
                        i.updateAnchor(o, {
                          enabled: !s,
                        }),
                        wx.showToast({
                          title: e.t0.errMsg || e.t0.message || '设置失败',
                          icon: 'none',
                        }));

                    case 21:
                      return (
                        (e.prev = 21),
                        i.updateAnchor(o, {
                          updating: !1,
                        }),
                        e.finish(21)
                      );

                    case 24:
                    case 'end':
                      return e.stop();
                  }
              },
              t,
              null,
              [[8, 17, 21, 24]]
            );
          })
        )();
      },
      loadAdminCapabilities: function () {
        var a = this;
        return t(
          e().mark(function t() {
            var i, o;
            return e().wrap(
              function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      if (n.API_BASE_URL) {
                        e.next = 2;
                        break;
                      }
                      return e.abrupt('return');

                    case 2:
                      return ((e.prev = 2), (e.next = 5), r.ensureSession());

                    case 5:
                      if (
                        ((i = e.sent),
                        (o = i && i.adminCapabilities ? i.adminCapabilities : {}),
                        i.isAdmin && o.manual_notification)
                      ) {
                        e.next = 10;
                        break;
                      }
                      return (
                        a.setData({
                          isAdmin: !1,
                        }),
                        e.abrupt('return')
                      );

                    case 10:
                      (a.setData({
                        isAdmin: !0,
                      }),
                        (e.next = 16));
                      break;

                    case 13:
                      ((e.prev = 13),
                        (e.t0 = e.catch(2)),
                        a.setData({
                          isAdmin: !1,
                        }));

                    case 16:
                    case 'end':
                      return e.stop();
                  }
              },
              t,
              null,
              [[2, 13]]
            );
          })
        )();
      },
      onManualNotify: function (a) {
        var n = this;
        return t(
          e().mark(function t() {
            var i, o, c, s, u, l, h;
            return e().wrap(
              function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      if (!n.sendingManualAccount) {
                        e.next = 2;
                        break;
                      }
                      return e.abrupt('return');

                    case 2:
                      if (
                        ((i = String(a.currentTarget.dataset.account || '')),
                        (o = n.data.anchors.find(function (e) {
                          return e.account === i;
                        })))
                      ) {
                        e.next = 6;
                        break;
                      }
                      return e.abrupt('return');

                    case 6:
                      return ((e.prev = 6), (e.next = 9), r.fetchManualNotificationPreview(i));

                    case 9:
                      ((s = e.sent), (c = s && s.data ? s.data : null), (e.next = 17));
                      break;

                    case 13:
                      return (
                        (e.prev = 13),
                        (e.t0 = e.catch(6)),
                        wx.showToast({
                          title: e.t0.message || '获取通知信息失败',
                          icon: 'none',
                        }),
                        e.abrupt('return')
                      );

                    case 17:
                      if (c) {
                        e.next = 20;
                        break;
                      }
                      return (
                        wx.showToast({
                          title: '暂时无法获取通知人数',
                          icon: 'none',
                        }),
                        e.abrupt('return')
                      );

                    case 20:
                      if (!((u = Number(c.cooldown_remaining_seconds || 0)) > 0)) {
                        e.next = 24;
                        break;
                      }
                      return (
                        wx.showToast({
                          title: '请在 '.concat(u, ' 秒后重试'),
                          icon: 'none',
                        }),
                        e.abrupt('return')
                      );

                    case 24:
                      return (
                        (e.next = 26),
                        new Promise(function (e) {
                          wx.showModal({
                            title: '确认手动通知',
                            content: '将向 '
                              .concat(Number(c.eligible_count || 0), ' 位用户发送“')
                              .concat(o.nickname, '开播”提醒，并扣除各用户一次通知额度。'),
                            confirmText: '确认发送',
                            confirmColor: '#c52f2f',
                            cancelText: '取消',
                            success: e,
                            fail: function () {
                              return e({
                                confirm: !1,
                              });
                            },
                          });
                        })
                      );

                    case 26:
                      if (e.sent.confirm) {
                        e.next = 29;
                        break;
                      }
                      return e.abrupt('return');

                    case 29:
                      return (
                        (n.sendingManualAccount = i),
                        n.updateAnchor(i, {
                          sendingManual: !0,
                        }),
                        (e.prev = 31),
                        (e.next = 34),
                        r.sendManualNotification({
                          anchor_account: i,
                          idempotency_key:
                            ((t = void 0),
                            (t = Math.random().toString(36).slice(2, 12)),
                            'manual_'.concat(Date.now(), '_').concat(t)),
                          confirmation: 'SEND',
                        })
                      );

                    case 34:
                      ((l = e.sent),
                        (h = l && l.data ? l.data : {}),
                        wx.showModal({
                          title: '通知已进入队列',
                          content: '已排队 '.concat(Number(h.queued_count || 0), ' 条通知。'),
                          showCancel: !1,
                          confirmText: '知道了',
                        }),
                        (e.next = 42));
                      break;

                    case 39:
                      ((e.prev = 39),
                        (e.t1 = e.catch(31)),
                        wx.showToast({
                          title: e.t1.message || '手动通知失败',
                          icon: 'none',
                        }));

                    case 42:
                      return (
                        (e.prev = 42),
                        (n.sendingManualAccount = ''),
                        n.updateAnchor(i, {
                          sendingManual: !1,
                        }),
                        e.finish(42)
                      );

                    case 46:
                    case 'end':
                      return e.stop();
                  }
                var t;
              },
              t,
              null,
              [
                [6, 13],
                [31, 39, 42, 46],
              ]
            );
          })
        )();
      },
      onAvatarError: function (e) {
        var t = String(e.currentTarget.dataset.account || '');
        this.updateAnchor(t, {
          avatarUrl: '',
        });
      },
      onCopyDouyinId: function (e) {
        var t = String(e.currentTarget.dataset.value || '').trim();
        t
          ? wx.setClipboardData({
              data: t,
              success: function () {
                (wx.vibrateShort &&
                  wx.vibrateShort({
                    type: 'light',
                    fail: function () {},
                  }),
                  wx.showToast({
                    title: 'dy号已复制',
                    icon: 'none',
                  }));
              },
              fail: function () {
                wx.showToast({
                  title: '复制失败，请重试',
                  icon: 'none',
                });
              },
            })
          : wx.showToast({
              title: '暂无可复制的dy号',
              icon: 'none',
            });
      },
      onSearchInput: function (e) {
        var t = String(e.detail.value || '');
        this.setData({
          searchQuery: t,
          filteredAnchors: this.filterAnchors(
            this.data.anchors,
            t,
            this.data.activeCategory,
            this.data.showSpecialFocus
          ),
        });
      },
      clearSearch: function () {
        this.setData({
          searchQuery: '',
          filteredAnchors: this.filterAnchors(
            this.data.anchors,
            '',
            this.data.activeCategory,
            this.data.showSpecialFocus
          ),
        });
      },
      onSelectCategory: function (e) {
        var t = String(e.currentTarget.dataset.category || 'key');
        ((this.preferSpecialFocusOnEntry = !1),
          this.setData({
            activeCategory: t,
            showSpecialFocus: !1,
            filteredAnchors: this.filterAnchors(this.data.anchors, this.data.searchQuery, t, !1),
          }));
      },
      onToggleSpecialFocus: function () {
        if (this.data.subscribedAnchorCount) {
          this.preferSpecialFocusOnEntry = !1;
          var e = !this.data.showSpecialFocus;
          (this.setData({
            showSpecialFocus: e,
            filteredAnchors: this.filterAnchors(
              this.data.anchors,
              this.data.searchQuery,
              this.data.activeCategory,
              e
            ),
          }),
            wx.vibrateShort &&
              wx.vibrateShort({
                type: 'light',
                fail: function () {},
              }));
        }
      },
      restoreFilterToolsPreference: function () {
        var e = !0;
        try {
          var t = wx.getStorageSync('media-filter-tools-expanded-v1');
          'boolean' == typeof t && (e = t);
        } catch (e) {}
        this.data.filterToolsExpanded !== e &&
          this.setData({
            filterToolsExpanded: e,
          });
      },
      onToggleFilterTools: function () {
        var e = !this.data.filterToolsExpanded;
        e
          ? this.setData({
              filterToolsExpanded: !0,
            })
          : ((this.preferSpecialFocusOnEntry = !1),
            this.setData({
              filterToolsExpanded: !1,
              searchQuery: '',
              activeCategory: 'key',
              showSpecialFocus: !1,
              filteredAnchors: this.filterAnchors(this.data.anchors, '', 'key', !1),
            }));
        try {
          wx.setStorageSync('media-filter-tools-expanded-v1', e);
        } catch (e) {}
        wx.vibrateShort &&
          wx.vibrateShort({
            type: 'light',
            fail: function () {},
          });
      },
      updateAnchor: function (e, t) {
        var n = this.data.anchors.map(function (n) {
          return n.account === e ? a(a({}, n), t) : n;
        });
        this.updateAnchors(n);
      },
      updateAnchors: function (e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          a = this.normalizeHiddenAnchorAccounts(
            void 0 === t.hiddenAnchorAccounts
              ? this.data.hiddenAnchorAccounts
              : t.hiddenAnchorAccounts
          ),
          n = new Set(a),
          r = e.filter(function (e) {
            return e.enabled && !n.has(e.account);
          }).length,
          i = Boolean((this.preferSpecialFocusOnEntry || this.data.showSpecialFocus) && r),
          o = this.filterAnchors(e, this.data.searchQuery, this.data.activeCategory, i, a),
          c = this.data.anchors || [],
          s = this.data.filteredAnchors || [],
          u =
            c.length === e.length &&
            c.every(function (t, a) {
              return t.account === e[a].account;
            }),
          l =
            s.length === o.length &&
            s.every(function (e, t) {
              return e.account === o[t].account;
            }),
          h = {};
        (u && l
          ? (e.forEach(function (e, t) {
              JSON.stringify(c[t]) !== JSON.stringify(e) && (h['anchors['.concat(t, ']')] = e);
            }),
            o.forEach(function (e, t) {
              JSON.stringify(s[t]) !== JSON.stringify(e) &&
                (h['filteredAnchors['.concat(t, ']')] = e);
            }))
          : ((h.anchors = e), (h.filteredAnchors = o)),
          r !== this.data.subscribedAnchorCount && (h.subscribedAnchorCount = r),
          i !== this.data.showSpecialFocus && (h.showSpecialFocus = i),
          JSON.stringify(a) !== JSON.stringify(this.data.hiddenAnchorAccounts || []) &&
            (h.hiddenAnchorAccounts = a),
          Object.keys(h).length &&
            (this.setData(h), !1 !== t.persist && this.scheduleMediaCacheWrite()));
      },
      restoreCachedAnchors: function () {
        var e = s.read('media-anchors', 6e5),
          t = e && Array.isArray(e.data) ? e.data : [];
        return (
          !!t.length &&
          (this.updateAnchors(
            t.map(function (e) {
              return a(
                a({}, e),
                {},
                {
                  updating: !1,
                  sendingManual: !1,
                  viewerCountDisplayValue: e.viewerCountAvailable
                    ? Math.max(0, Number(e.viewerCount) || 0)
                    : null,
                  viewerCountDisplay: e.viewerCountAvailable ? f(e.viewerCount) : '',
                }
              );
            }),
            {
              persist: !1,
            }
          ),
          !0)
        );
      },
      normalizeHiddenAnchorAccounts: function (e) {
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
      },
      restoreCachedHiddenAnchors: function () {
        try {
          var e = this.normalizeHiddenAnchorAccounts(wx.getStorageSync('media-hidden-anchors'));
          e.length &&
            this.setData({
              hiddenAnchorAccounts: e,
            });
        } catch (e) {}
      },
      persistHiddenAnchorAccounts: function (e) {
        try {
          wx.setStorageSync('media-hidden-anchors', this.normalizeHiddenAnchorAccounts(e));
        } catch (e) {}
      },
      scheduleMediaCacheWrite: function () {
        var e = this;
        this.mediaCacheTimer && clearTimeout(this.mediaCacheTimer);
        var t = Date.now() - Number(this.lastMediaCacheWriteAt || 0),
          a = Math.max(300, 3e4 - t);
        this.mediaCacheTimer = setTimeout(function () {
          ((e.mediaCacheTimer = null), e.persistMediaCache());
        }, a);
      },
      persistMediaCache: function () {
        this.data.anchors.length &&
          (s.write(
            'media-anchors',
            this.data.anchors.map(function (e) {
              return a(
                a({}, e),
                {},
                {
                  updating: !1,
                  sendingManual: !1,
                  viewerCountDisplayValue: e.viewerCountAvailable
                    ? Math.max(0, Number(e.viewerCount) || 0)
                    : null,
                  viewerCountDisplay: e.viewerCountAvailable ? f(e.viewerCount) : '',
                }
              );
            })
          ),
          (this.lastMediaCacheWriteAt = Date.now()));
      },
      filterAnchors: function (e, t, a) {
        var n = arguments.length > 3 && void 0 !== arguments[3] && arguments[3],
          r =
            arguments.length > 4 && void 0 !== arguments[4]
              ? arguments[4]
              : this.data.hiddenAnchorAccounts,
          i = String(t || '')
            .trim()
            .toLocaleLowerCase(),
          o = new Set(this.normalizeHiddenAnchorAccounts(r)),
          c = e.filter(function (e) {
            return !o.has(e.account);
          }),
          s = n
            ? c.filter(function (e) {
                return e.enabled;
              })
            : c.filter(function (e) {
                return (e.category || 'key') === a;
              }),
          u = i
            ? s.filter(function (e) {
                return (
                  String(e.nickname || '')
                    .toLocaleLowerCase()
                    .includes(i) ||
                  String(e.douyinId || e.account || '')
                    .toLocaleLowerCase()
                    .includes(i)
                );
              })
            : s;
        return u
          .map(function (e, t) {
            return {
              anchor: e,
              index: t,
            };
          })
          .sort(function (e, t) {
            var a = Number('live' === t.anchor.status) - Number('live' === e.anchor.status),
              n = Number(t.anchor.featured) - Number(e.anchor.featured);
            return a || n || e.index - t.index;
          })
          .map(function (e) {
            return e.anchor;
          });
      },
      applyFilters: function (e, t, a) {
        var n = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
        this.setData({
          filteredAnchors: this.filterAnchors(e, t, a, n),
        });
      },
      animateViewerCounts: function (e) {
        var t = this;
        this.stopViewerCountAnimation();
        var a = e.reduce(function (e, t) {
          if (!t.viewerCountAvailable) return e;
          var a = Math.max(0, Number(t.viewerCountDisplayValue) || 0),
            n = Math.max(0, Number(t.viewerCount) || 0);
          return (
            a !== n &&
              (e[t.account] = {
                start: a,
                target: n,
              }),
            e
          );
        }, {});
        if (Object.keys(a).length) {
          var n = Date.now();
          !(function e() {
            var r = Math.min(1, (Date.now() - n) / 600),
              i = 1 - Math.pow(1 - r, 3),
              o = {},
              c = function (e, t) {
                e.forEach(function (e, n) {
                  var c = a[e.account];
                  if (c && e.viewerCountAvailable) {
                    var s = r >= 1 ? c.target : Math.round(c.start + (c.target - c.start) * i);
                    ((o[''.concat(t, '[').concat(n, '].viewerCountDisplayValue')] = s),
                      (o[''.concat(t, '[').concat(n, '].viewerCountDisplay')] = f(s)));
                  }
                });
              };
            (c(t.data.filteredAnchors, 'filteredAnchors'),
              r >= 1 && c(t.data.anchors, 'anchors'),
              Object.keys(o).length && t.setData(o),
              (t.viewerCountTimer = r < 1 ? setTimeout(e, 100) : null));
          })();
        }
      },
      stopViewerCountAnimation: function () {
        this.viewerCountTimer &&
          (clearTimeout(this.viewerCountTimer), (this.viewerCountTimer = null));
      },
    }
  )
);
