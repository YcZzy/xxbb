'use strict';

var e = require('../../@babel/runtime/helpers/defineProperty');

require('../../@babel/runtime/helpers/Arrayincludes');

var t = require('../../@babel/runtime/helpers/slicedToArray'),
  a = require('../../@babel/runtime/helpers/regeneratorRuntime'),
  i = require('../../@babel/runtime/helpers/asyncToGenerator'),
  o = require('../../@babel/runtime/helpers/objectSpread2'),
  n = require('../../@babel/runtime/helpers/typeof'),
  r = require('../../@babel/runtime/helpers/toConsumableArray'),
  s = require('../../config/env'),
  c = require('../../services/api'),
  u = require('../../utils/favorite-anchor-purchase'),
  l = require('../../utils/share'),
  d = require('../../utils/tab-bar'),
  m = require('../../utils/global-urge'),
  h = require('../../utils/performance-mode'),
  p = require('../../utils/session-scope'),
  f = require('../../utils/mascot-art'),
  v = 'pushEnabled',
  b = 'notifyCount',
  g = 'liveHistory',
  w = 'homePopupSeenVersion',
  y = 'homePopupSeenDate',
  S = 'xuxuZapActivityV1',
  T = 'xuxuZapHapticsEnabledV1',
  _ = 'mascotSkinV1',
  x = 'mascotThemeV1',
  k = 'mascotThemeSeenReleasesV1',
  A = 'xuxuHomeStatusV1',
  M = 'favoriteAnchorV1',
  P = Math.max(1e3, 1e3 * s.STATUS_REFRESH_SECONDS),
  C = Math.max(1e4, P),
  D = /^[A-Za-z0-9_.-]{3,64}$/,
  B = [
    '/assets/images/remote-fallback/monkeyIdle.png',
    '/assets/images/remote-fallback/monkeyWaveUp.png',
    '/assets/images/remote-fallback/monkeyWaveIn.png',
    '/assets/images/remote-fallback/monkeyWaveOut.png',
    '/assets/images/remote-fallback/monkeyRestA.png',
    '/assets/images/remote-fallback/monkeyRestB.png',
    '/assets/images/remote-fallback/monkeyLiveA.png',
    '/assets/images/remote-fallback/monkeyLiveB.png',
  ],
  N = [
    '/assets/images/remote-fallback/iceWaitA.png',
    '/assets/images/remote-fallback/iceWaitB.png',
    '/assets/images/remote-fallback/iceWaitA.png',
    '/assets/images/remote-fallback/iceWaitB.png',
    '/assets/images/remote-fallback/iceWaitA.png',
    '/assets/images/remote-fallback/iceWaitB.png',
    '/assets/images/remote-fallback/iceLiveA.png',
    '/assets/images/remote-fallback/iceLiveB.png',
  ],
  E = [].concat(
    r(Array(6).fill('/assets/images/remote-fallback/moonWait.png')),
    r(Array(2).fill('/assets/images/remote-fallback/moonLive.png'))
  ),
  R = [].concat(
    r(Array(6).fill('/assets/images/remote-fallback/starlightWait.png')),
    r(Array(2).fill('/assets/images/remote-fallback/starlightLive.png'))
  ),
  q = {
    classic: {
      code: 'classic',
      name: '大马猴',
      subtitle: '默认角色',
      className: 'classic',
      preview: B[0],
      frames: B,
    },
    ibo_starlight: {
      code: 'ibo_starlight',
      name: '播播·星光信使',
      subtitle: 'i播播了么原创形象',
      className: 'ibo-starlight',
      preview: R[0],
      frames: R,
    },
    siwuliu_ice: {
      code: 'siwuliu_ice',
      name: '𝑿.四五六🍉限定形象',
      subtitle: '常驻 · 连续打 Call 7 天',
      className: 'siwuliu-ice',
      preview: N[0],
      frames: N,
    },
    xiaoyu_moon_tide: {
      code: 'xiaoyu_moon_tide',
      name: '小鱼小鱼·月汐星使',
      subtitle: '赞助商专属赠礼',
      hiddenFromCollection: !0,
      className: 'xiaoyu-moon-tide',
      preview: E[0],
      frames: E,
      boundAnchorAccount: 'tongxinovo',
      boundAnchorName: '小鱼小鱼🐟',
    },
  },
  F = require('../../utils/mascot-theme'),
  V = {
    ibo_soft_gold: {
      code: 'ibo_soft_gold',
      name: '柔金幻境',
      subtitle: '购买吉祥物赠送',
      published: !0,
      requiresOwnership: !0,
      className: 'ibo-soft-gold',
    },
    classic: {
      code: 'classic',
      name: '暖红经典',
      subtitle: '默认主题',
      className: 'classic',
    },
    siwuliu_ice: {
      code: 'siwuliu_ice',
      name: '冰蓝守候',
      subtitle: '9 月累计打 Call 16 次',
      className: 'siwuliu-ice',
    },
    xiaoyu_moon_tide: {
      code: 'xiaoyu_moon_tide',
      name: '月汐星海',
      subtitle: '赞助商专属赠礼',
      className: 'xiaoyu-moon-tide',
    },
  },
  I = {
    campaign_code: 'xiaoyu_moon_tide_sponsor_202609',
    skin_code: 'xiaoyu_moon_tide',
    theme_code: 'xiaoyu_moon_tide',
    acquisition_type: 'sponsor_grant',
    acquisition_label: '赞助商获取',
    owned: !1,
    admin_unlock: !1,
    award_id: 0,
    awarded_at: 0,
  },
  L = {
    campaign_code: 'siwuliu_ice_202608',
    skin_code: 'siwuliu_ice',
    skin_name: '𝑿.四五六🍉限定形象',
    anchor_account: '82553285031',
    anchor_name: '𝑿.四五六🍉',
    start_date: '2026-08-22',
    end_date: '',
    required_days: 7,
    status: 'active',
    owned: !1,
    newly_unlocked: !1,
    streak_days: 0,
    best_streak_days: 0,
    remaining_days: 7,
    called_today: !1,
    daily_call_used: !1,
    admin_unlock: !1,
  },
  z = {
    campaign_code: 'siwuliu_ice_theme_202609',
    theme_code: 'siwuliu_ice',
    theme_name: '冰蓝主题',
    anchor_account: '82553285031',
    anchor_name: '𝑿.四五六🍉',
    start_date: '2026-09-01',
    end_date: '2026-09-30',
    progress_mode: 'total_calls',
    required_calls: 16,
    call_count: 0,
    remaining_calls: 16,
    required_days: 16,
    status: 'upcoming',
    owned: !1,
    newly_unlocked: !1,
    streak_days: 0,
    best_streak_days: 0,
    remaining_days: 16,
    called_today: !1,
    daily_call_used: !1,
    admin_unlock: !1,
  },
  H = '/assets/images/remote-fallback/monkeyZap.png',
  O = {
    version: 'local-preview-v1',
    title: '给你的爱播打call吧',
    content: '为喜欢的主播送出今天的支持，让每一份热爱都被看见。',
    button_text: '去打call',
    button_enabled: !0,
    action_type: 'love_call',
    theme: 'red_gold',
    icon: 'heart',
    display_frequency: 'always',
    enabled: !0,
    preview: !0,
  },
  U = {
    love_call: '/pages/media/media?open=love-call',
    history: '/pages/daily-digest/daily-digest',
    replay: '/pages/live-archive/live-archive',
    help: '/pages/help/help',
  },
  W = ['red_gold', 'orange_notice', 'blue_message', 'festival'],
  G = {
    heart: '♥',
    bell: '🔔',
    announcement: '📣',
    sparkle: '✦',
  },
  Z = {
    red_gold: 'LOVE & SUPPORT',
    orange_notice: 'LATEST NOTICE',
    blue_message: 'NEW MESSAGE',
    festival: 'SPECIAL MOMENT',
  },
  K = ['version_once', 'daily', 'always'];

function j() {
  var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : Date.now(),
    t = new Date(e),
    a = String(t.getMonth() + 1).padStart(2, '0'),
    i = String(t.getDate()).padStart(2, '0');
  return ''.concat(t.getFullYear(), '-').concat(a, '-').concat(i);
}

var X = [1, 2, 3, 2, 3, 2, 1, 0],
  Q = {
    normal: [0],
    leave: [4, 5],
    live: [6, 7],
  },
  Y = {
    normal: '守候中',
    leave: '请假中',
    live: '开播中',
  },
  $ = {
    normal: [
      '广饶今天九点了吗？',
      '宝哥今天迟到了吗？',
      '宝哥什么时候开播呀？',
      '今天也在认真守候！',
      '开播了我马上叫你！',
      '别急，我一直盯着呢！',
    ],
    leave: [
      '请假一天么么哒！',
      '今天太阳真好呀！',
      '宝哥今天请假啦！',
      '今天先好好休息吧！',
      '躺一会儿，明天继续盯！',
      '小躺一下，舒服舒服！',
      '今天也是惬意的一天！',
    ],
    live: [
      '宝哥已经开播啦！',
      '正在努力敲键盘！',
      '开播了，快去围观！',
      '开播进行中，立即集合！',
      '键盘都快敲冒烟啦！',
      '今天也在认真开播！',
      '宝哥开播，我先干活啦！',
    ],
  },
  J = {
    normal: ['今晚也在认真守候呀！', '星潮雷达正在扫描中！', '小鱼开播，我马上叫你！'],
    live: ['小鱼已经开播啦！', '星潮启动，快去集合！', '手柄就位，正在直播中！'],
  },
  ee = {
    normal: ['星光亮着，我也在。', '爱播开播，我马上叫你！', '再等一会儿，一起赴约。'],
    leave: ['今天陪你慢慢等。', '爱播休息啦，我们也歇一会儿。'],
    live: ['信号收到，爱播开播啦！', '手柄就位，一起集合！', '星光已点亮，出发！'],
  },
  te = {
    live: '你小子，我在直播呢，还想催我。',
    leave: '你小子，我在休息呢，还想催我。',
  },
  ae = ['请假', '休息', '么么哒'];

function ie(e, t) {
  var a = String(e || '')
    .replace(/\r\n?/g, '\n')
    .trim();
  if (!a) return '宝哥请假中';
  var i = [];
  a.split(/\n+/).forEach(function (e) {
    e.split(/[。！？!?]+/).forEach(function (e) {
      var t = e.trim();
      t && i.push(t);
    });
  });
  for (
    var o = [t]
        .concat(ae)
        .map(function (e) {
          return String(e || '').trim();
        })
        .filter(function (e, t, a) {
          return e && a.indexOf(e) === t;
        }),
      r = function () {
        var e = o[s],
          t = i.find(function (t) {
            return (
              !!t.includes(e) && !(('休息' === e || '么么哒' === e) && t.includes('每晚9点开播'))
            );
          });
        if (t)
          return {
            v: t,
          };
      },
      s = 0;
    s < o.length;
    s += 1
  ) {
    var c = r();
    if ('object' === n(c)) return c.v;
  }
  return '宝哥请假中';
}

function oe(e) {
  return ''.concat(Math.max(0, Math.floor(Number(e) || 0))).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function ne(e) {
  return Array.from(String(e || ''))[0] || '播';
}

function re(e) {
  var t = String(e || '');
  return t && t.startsWith('/') ? ''.concat(s.API_BASE_URL).concat(t) : t;
}

function se(e) {
  var t = e ? new Date(1e3 * e) : new Date(),
    a = function (e) {
      return ''.concat(e).padStart(2, '0');
    };
  return ''.concat(a(t.getHours()), ':').concat(a(t.getMinutes()), ':').concat(a(t.getSeconds()));
}

function ce(e) {
  return new Promise(function (t) {
    return setTimeout(t, e);
  });
}

function ue() {
  var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : Date.now(),
    t = new Date(Number(e) + 288e5);
  return 7 === t.getUTCMonth() && 18 === t.getUTCDate();
}

Page(
  o(
    o(
      o({}, require('../../utils/inline-artwork')),
      {},
      {
        data: o(
          o(
            {
              inlineArt: {},
              statusBarHeight: 20,
              navigationHeight: 64,
              performanceClass: h.className(),
              loading: !1,
              loadError: '',
              addingNotify: !1,
              addingLeaveNotify: !1,
              addingWorkNotify: !1,
              addingAllNotify: !1,
              isAdmin: !1,
              sendingManualNotification: !1,
              manualPreview: null,
              leavePending: !1,
              leavePendingNote: '',
              sendingLeave: !1,
              reminderMode: 'live',
              pushEnabled: !0,
              notifyCount: 0,
              sharedNotifyCount: 0,
              sharedNotifyPreviousCount: 0,
              notifyPreviousCount: 0,
              leavePushEnabled: !1,
              leaveNotifyCount: 0,
              leaveNotifyPreviousCount: 0,
              leaveTemplateReady: !1,
              workPushEnabled: !1,
              workNotifyCount: 0,
              workNotifyPreviousCount: 0,
              workTemplateReady: Boolean(s.WORK_SUBSCRIBE_TEMPLATE_ID),
              notificationSuccessMode: '',
              notificationRollingMode: '',
              lastUpdatedText: '--:--:--',
              mascotFrames: B,
              mascotPreloadFrames: [],
              mascotFrame: B[0],
              mascotState: 'normal',
              mascotStatusText: Y.normal,
              selectedMascotSkin: 'classic',
              favoriteMascotOwned: !1,
              mascotMotionEnabled: !1,
              selectedMascotSkinName: q.classic.name,
              mascotSkinClass: q.classic.className,
              mascotSkinSheetVisible: !1,
              mascotLaunchGuideVisible: !1,
              mascotLaunchGuideEnabled: !1,
              mascotLaunchGuideText: '吉祥物上新啦',
              mascotCollectionTab: 'skin',
              mascotCollectionScrollTop: 0,
              virtualPaymentConfigured: !1,
              virtualProducts: [],
              paymentProcessingCode: '',
              mascotSkinCampaign: L,
              xiaoyuSponsorReward: I,
              mascotSkinItems: [],
              mascotSkinProgressText: '0/7',
              mascotSkinProgressWidth: 0,
              selectedMascotTheme: 'classic',
              selectedMascotThemeName: V.classic.name,
              mascotThemeClass: V.classic.className,
              mascotThemeCampaign: z,
              mascotThemeItems: [],
              mascotThemeHasNew: !1,
              mascotThemeProgressText: '0/15',
              mascotThemeProgressWidth: 0,
              themeCollectionVisible: V.ibo_soft_gold.published,
              softGoldPreviewAllowed: !1,
              softGoldOwned: !1,
              themeTransitionVisible: !1,
              themeTransitionActive: !1,
              themeTransitionTarget: 'classic',
              themeTransitionOriginStyle: 'left: 38px; top: 52px;',
              mascotWaving: !1,
              mascotTransitioning: !1,
              mascotBubbleVisible: !1,
              mascotBubbleText: $.normal[0],
              zapActive: !1,
              zapPanelVisible: !1,
              zapPanelMounted: !1,
              zapHapticsEnabled: !0,
              zapEasterEggClass: '',
              zapPanelTitle: '催播能量站',
              zapComboCount: 0,
              zapPulseItems: [],
              zapXrayFrame: H,
              zapTapCount: 0,
              zapTapCountText: '0',
              globalUrgeCount: 0,
              globalUrgeCountText: '0',
              isBirthdayCelebration: !1,
              isLocalDevelopment: !1,
              isPreviewVersion: !1,
              mascotPreviewMode: 'auto',
              isPreview: !s.API_BASE_URL,
              homePopup: null,
              homePopupVisible: !1,
              customServiceDialogVisible: !1,
              customServiceDouyinId: '61939952210',
              favoriteAnchorReady: !1,
              favoriteAnchorAccount: '',
              favoriteAnchorOptions: [],
              favoriteAnchorCandidate: '',
              favoritePickerVisible: !1,
              favoritePickerRequired: !1,
              favoritePickerLoading: !1,
              favoritePickerSaving: !1,
              favoriteAnchorRequested: !1,
              favoriteAnchorRequestedAccount: '',
              favoriteAnchorRequestDialogVisible: !1,
              favoriteAnchorRequestAccount: '',
              favoriteAnchorRequestSaving: !1,
            },
            u.data
          ),
          {},
          {
            anchorDisplayAccount: '--',
            anchor: {
              account: '',
              nickname: '选择你的爱播',
              initial: '播',
              status: 'unknown',
              displayStatus: 'unknown',
              leaveStatus: 'unknown',
              leaveProfileText: '',
              leaveCopy: '宝哥请假中',
              roomTitle: '',
              avatarUrl: '',
              startTime: null,
              viewerCount: null,
              viewerCountAvailable: !1,
              viewerCountDisplayValue: null,
              viewerCountDisplay: '',
            },
          }
        ),
        onLoad: function () {
          (l.enableShareMenu(),
            this.syncBirthdayCelebration(),
            this.setNavigationMetrics(),
            this.detectLocalDevelopment(),
            this.restorePreferences(),
            this.restoreMascotSkin(),
            this.restoreMascotTheme(),
            this.restoreZapActivity(),
            this.restoreFavoriteAnchor(),
            this.restoreHomeStatus(),
            this.initializeFavoriteAnchor(),
            this.loadAdminCapabilities());
        },
        onShow: function () {
          ((this.pageVisible = !0),
            this.syncMascotThemeNotice({
              viewed: !0,
            }),
            this.loadRemoteMascot(),
            this.data.favoriteAnchorRequestDialogVisible && this.loadFavoritePurchaseOffer(),
            d.sync(this, 'home'));
          var e = Boolean(this.hasShownOnce);
          ((this.hasShownOnce = !0),
            this.syncBirthdayCelebration(),
            this.data.favoriteAnchorAccount && this.startAutoRefresh(),
            this.startMascotMotion(),
            this.startGlobalUrgeTicker(),
            this.scheduleMascotFramePreload(),
            this.loadHomePopup(),
            this.loadFeatureVisibility(),
            e && this.data.favoriteAnchorAccount && this.syncHomeBootstrap(),
            this.loadedOnce &&
              Date.now() - this.lastLoadAt > 15e3 &&
              this.loadStatus({
                silent: !0,
              }));
        },
        onHide: function () {
          ((this.pageVisible = !1),
            this.setData({
              mascotLaunchGuideEnabled: !1,
            }),
            this.cancelFavoriteLookup(),
            this.stopAutoRefresh(),
            this.stopHomeViewerCountAnimation(),
            this.stopMascotMotion(),
            this.stopZapActivity(),
            clearTimeout(this.mascotPreloadTimer),
            (this.mascotPreloadTimer = null));
        },
        onUnload: function () {
          ((this.pageVisible = !1),
            (this.featureVisibilityDisposed = !0),
            (this.mascotArtworkDisposed = !0),
            (this.favoritePurchaseDisposed = !0),
            this.cancelFavoriteLookup(),
            this.stopAutoRefresh(),
            this.stopHomeViewerCountAnimation(),
            this.stopMascotMotion(),
            this.stopZapActivity(),
            clearTimeout(this.mascotPreloadTimer),
            clearTimeout(this.notificationSuccessTimer),
            clearTimeout(this.themeTransitionTimer));
        },
        onShareAppMessage: function (e) {
          var t = e && e.target && e.target.dataset ? e.target.dataset.shareType : '';
          if (e && 'button' === e.from && 'zap' === t) {
            var a = Math.max(0, Number(this.data.zapTapCount || 0));
            return l.appMessage({
              title: '我已经催播 '.concat(a, ' 次，来一起催宝哥开播！'),
              path: '/pages/index/index?from=zap_share&count='.concat(a),
            });
          }
          return l.appMessage();
        },
        onShareTimeline: function () {
          return l.timeline();
        },
        onPullDownRefresh: function () {
          this.data.favoriteAnchorAccount
            ? Promise.all([
                this.loadStatus({
                  silent: !0,
                }),
                this.loadHomePopup(),
                this.loadFeatureVisibility(),
                this.syncHomeBootstrap(),
              ]).finally(function () {
                return wx.stopPullDownRefresh();
              })
            : this.initializeFavoriteAnchor().finally(function () {
                return wx.stopPullDownRefresh();
              });
        },
        setNavigationMetrics: function () {
          var e = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync(),
            t = wx.getMenuButtonBoundingClientRect(),
            a = e.statusBarHeight || 20,
            i = 2 * (t.top - a) + t.height + a;
          this.setData({
            statusBarHeight: a,
            navigationHeight: i,
          });
        },
        loadFeatureVisibility: function () {
          var e = this;
          return i(
            a().mark(function t() {
              var i, o, n, r, s, u, l, d;
              return a().wrap(
                function (t) {
                  for (;;)
                    switch ((t.prev = t.next)) {
                      case 0:
                        return (
                          (i = e.featureVisibilityRequestId =
                            (e.featureVisibilityRequestId || 0) + 1),
                          (o = e.data.isLocalDevelopment),
                          (n = !1),
                          (r = '吉祥物上新啦'),
                          (t.prev = 4),
                          (t.next = 7),
                          c.fetchFeatureVisibility()
                        );

                      case 7:
                        ((s = t.sent),
                          (u = s && s.data ? s.data : {}),
                          (o = !0 === u.mascot_theme_collection || e.data.isLocalDevelopment),
                          (l = u.mascot_launch_guide),
                          (n = void 0 === l || Boolean(l && !0 === l.enabled)),
                          l && 'string' == typeof l.text && (r = l.text),
                          (t.next = 17));
                        break;

                      case 15:
                        ((t.prev = 15), (t.t0 = t.catch(4)));

                      case 17:
                        if (!e.featureVisibilityDisposed && i === e.featureVisibilityRequestId) {
                          t.next = 19;
                          break;
                        }
                        return t.abrupt('return');

                      case 19:
                        ((e.themeCollectionPublished = Boolean(o)),
                          (o = Boolean(
                            V.ibo_soft_gold.published ||
                            o ||
                            e.data.softGoldPreviewAllowed ||
                            e.data.softGoldOwned
                          )),
                          (d = {
                            themeCollectionVisible: o,
                            mascotLaunchGuideEnabled: n && !0 === e.pageVisible,
                            mascotLaunchGuideText: r,
                          }),
                          o ||
                            'theme' !== e.data.mascotCollectionTab ||
                            Object.assign(d, {
                              mascotCollectionTab: 'skin',
                              mascotCollectionScrollTop:
                                (e.mascotCollectionScrollPositions || {}).skin || 0,
                            }),
                          e.setData(d, function () {
                            return e.syncMascotThemeNotice({
                              viewed: !0,
                            });
                          }));

                      case 24:
                      case 'end':
                        return t.stop();
                    }
                },
                t,
                null,
                [[4, 15]]
              );
            })
          )();
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
              i = 'develop' === t.envVersion && 'devtools' === a.platform,
              o = ['develop', 'trial'].includes(t.envVersion);
            this.setData({
              isLocalDevelopment: i,
              isPreviewVersion: o,
            });
          } catch (e) {
            this.setData({
              isLocalDevelopment: !1,
              isPreviewVersion: !1,
            });
          }
        },
        restorePreferences: function () {
          var e = wx.getStorageSync(v),
            t = wx.getStorageSync(b);
          this.setData({
            pushEnabled: '' === e || Boolean(e),
            notifyCount: Number(t || 0),
          });
        },
        normalizeFavoriteAnchorOption: function () {
          var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
            t = String(e.account || e.anchor_account || '').trim(),
            a = String(e.nickname || e.name || t || '我的爱播').trim(),
            i = ['live', 'offline', 'unknown'].includes(e.status) ? e.status : 'unknown',
            o = ['live', 'leave', 'offline', 'unknown'].includes(
              e.displayStatus || e.display_status
            )
              ? e.displayStatus || e.display_status
              : i,
            n = !0 === e.viewerCountAvailable || !0 === e.viewer_count_available,
            r = n
              ? Math.max(0, Number(void 0 === e.viewerCount ? e.viewer_count : e.viewerCount) || 0)
              : null;
          return {
            account: t,
            nickname: a,
            initial: ne(a),
            displayAccount: String(
              t === s.ANCHOR.account
                ? s.ANCHOR.displayAccount || t
                : e.displayAccount || e.douyinId || e.douyin_id || t
            ),
            avatarUrl: re(e.avatarUrl || e.avatar_url),
            status: i,
            displayStatus: o,
            leaveStatus: String(e.leaveStatus || e.leave_status || 'unknown'),
            leaveProfileText: String(e.leaveProfileText || e.leave_profile_text || ''),
            leaveCopy: ie(
              e.leaveProfileText || e.leave_profile_text || '',
              e.leave_matched_keyword
            ),
            roomTitle: String(e.roomTitle || e.room_title || ''),
            roomId: String(e.roomId || e.room_id || ''),
            startTime: e.startTime || e.start_time || null,
            viewerCount: r,
            viewerCountAvailable: n,
            viewerCountDisplayValue: r,
            viewerCountDisplay: n ? oe(r) : '',
            isPrimary: !0 === e.isPrimary || !0 === e.is_primary,
            featured: !0 === e.featured,
          };
        },
        restoreFavoriteAnchor: function () {
          try {
            var e = wx.getStorageSync(M),
              t = p.current();
            if (!t || !e || e.scope !== t) return !1;
            var a = this.normalizeFavoriteAnchorOption(e || {});
            return (
              !!a.account &&
              (this.setData({
                favoriteAnchorReady: !0,
                favoriteAnchorAccount: a.account,
                favoriteAnchorCandidate: a.account,
                anchorDisplayAccount: a.displayAccount,
                anchor: a,
                isBirthdayCelebration: a.account === s.ANCHOR.account && ue(),
              }),
              !0)
            );
          } catch (e) {
            return !1;
          }
        },
        persistFavoriteAnchor: function (e) {
          try {
            var t = p.current();
            if (!t) return;
            wx.setStorageSync(M, {
              scope: t,
              account: e.account,
              nickname: e.nickname,
              displayAccount: e.displayAccount,
              avatarUrl: e.avatarUrl,
              initial: e.initial,
            });
          } catch (e) {}
        },
        applyFavoriteAnchor: function (e) {
          var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
            a = this.normalizeFavoriteAnchorOption(e);
          if (!a.account) return !1;
          var i = a.account !== this.data.favoriteAnchorAccount;
          return (
            this.setData({
              favoriteAnchorReady: !0,
              favoriteAnchorAccount: a.account,
              favoriteAnchorCandidate: a.account,
              anchorDisplayAccount: a.displayAccount,
              anchor: a,
              lastUpdatedText: i ? '--:--:--' : this.data.lastUpdatedText,
              isBirthdayCelebration: a.account === s.ANCHOR.account && ue(),
            }),
            !1 !== t.persist && this.persistFavoriteAnchor(a),
            i &&
              (this.stopHomeViewerCountAnimation(),
              (this.loadedOnce = !1),
              (this.lastLoadAt = 0),
              this.syncMascotState(a, !0)),
            !0
          );
        },
        loadFavoriteAnchorOptions: function () {
          var e = this;
          if (this.favoriteAnchorOptionsPromise) return this.favoriteAnchorOptionsPromise;
          this.setData({
            favoritePickerLoading: !0,
          });
          var t = i(
            a().mark(function t() {
              var i, o, n;
              return a().wrap(function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      return ((t.next = 2), c.fetchAnchors());

                    case 2:
                      return (
                        (i = t.sent),
                        (o = (i && i.data && i.data.items) || []),
                        (n = o
                          .map(function (t) {
                            return e.normalizeFavoriteAnchorOption(t);
                          })
                          .filter(function (e) {
                            return e.account;
                          })
                          .sort(function (e, t) {
                            var a = Number('live' === t.status) - Number('live' === e.status);
                            if (a) return a;
                            var i = Number(t.featured) - Number(e.featured);
                            return i || Number(t.isPrimary) - Number(e.isPrimary);
                          })),
                        e.setData({
                          favoriteAnchorOptions: n,
                        }),
                        t.abrupt('return', n)
                      );

                    case 7:
                    case 'end':
                      return t.stop();
                  }
              }, t);
            })
          )();
          return (
            (this.favoriteAnchorOptionsPromise = t),
            t.finally(function () {
              (e.favoriteAnchorOptionsPromise === t && (e.favoriteAnchorOptionsPromise = null),
                e.setData({
                  favoritePickerLoading: !1,
                }));
            })
          );
        },
        initializeFavoriteAnchor: function () {
          var e = this;
          if (this.initializingFavoriteAnchorPromise) return this.initializingFavoriteAnchorPromise;
          var o = i(
            a().mark(function i() {
              var o, n, r, s, u, l, d, m, h, p, f;
              return a().wrap(
                function (a) {
                  for (;;)
                    switch ((a.prev = a.next)) {
                      case 0:
                        return (
                          (o = String(e.data.favoriteAnchorAccount || '')),
                          (a.prev = 1),
                          (a.next = 4),
                          Promise.all([c.fetchFavoriteAnchor(), e.loadFavoriteAnchorOptions()])
                        );

                      case 4:
                        if (
                          ((n = a.sent),
                          (r = t(n, 2)),
                          (s = r[0]),
                          (u = r[1]),
                          (l = s && s.data ? s.data : {}),
                          (d = String(l.requested_account || '')),
                          (m = !0 === l.requested && Boolean(d)),
                          e.setData({
                            favoriteAnchorRequested: m,
                            favoriteAnchorRequestedAccount: d,
                          }),
                          !l.selected || !l.anchor_account)
                        ) {
                          a.next = 21;
                          break;
                        }
                        if (
                          !(h = u.find(function (e) {
                            return e.account === String(l.anchor_account);
                          }))
                        ) {
                          a.next = 21;
                          break;
                        }
                        return (
                          e.applyFavoriteAnchor(h),
                          e.setData({
                            favoritePickerVisible: !1,
                            favoritePickerRequired: !1,
                          }),
                          (a.next = 19),
                          Promise.all([e.loadStatus(), e.syncHomeBootstrap()])
                        );

                      case 19:
                        return (e.pageVisible && e.startAutoRefresh(), a.abrupt('return'));

                      case 21:
                        if (!m) {
                          a.next = 24;
                          break;
                        }
                        return (
                          e.setData({
                            favoriteAnchorReady: !1,
                            favoriteAnchorAccount: '',
                            favoriteAnchorCandidate: '',
                            favoritePickerRequired: !1,
                            favoritePickerVisible: !1,
                          }),
                          a.abrupt('return')
                        );

                      case 24:
                        if (!l.preview || !o) {
                          a.next = 29;
                          break;
                        }
                        return (
                          (a.next = 27),
                          Promise.all([e.loadStatus(), e.syncHomeBootstrap()])
                        );

                      case 27:
                        return (e.pageVisible && e.startAutoRefresh(), a.abrupt('return'));

                      case 29:
                        ((p = u[0] || null),
                          e.setData({
                            favoriteAnchorReady: !1,
                            favoriteAnchorAccount: '',
                            favoriteAnchorCandidate: p ? p.account : '',
                            favoritePickerRequired: !0,
                            favoritePickerVisible: !0,
                          }),
                          (a.next = 51));
                        break;

                      case 33:
                        if (((a.prev = 33), (a.t0 = a.catch(1)), !o)) {
                          a.next = 40;
                          break;
                        }
                        return (
                          (a.next = 38),
                          Promise.all([e.loadStatus(), e.syncHomeBootstrap()])
                        );

                      case 38:
                        return (e.pageVisible && e.startAutoRefresh(), a.abrupt('return'));

                      case 40:
                        if ((f = e.data.favoriteAnchorOptions || []).length) {
                          a.next = 50;
                          break;
                        }
                        return ((a.prev = 42), (a.next = 45), e.loadFavoriteAnchorOptions());

                      case 45:
                        ((f = a.sent), (a.next = 50));
                        break;

                      case 48:
                        ((a.prev = 48), (a.t1 = a.catch(42)));

                      case 50:
                        e.setData({
                          favoriteAnchorCandidate: f[0] ? f[0].account : '',
                          favoritePickerRequired: !0,
                          favoritePickerVisible: !0,
                        });

                      case 51:
                      case 'end':
                        return a.stop();
                    }
                },
                i,
                null,
                [
                  [1, 33],
                  [42, 48],
                ]
              );
            })
          )();
          return (
            (this.initializingFavoriteAnchorPromise = o),
            o.finally(function () {
              e.initializingFavoriteAnchorPromise === o &&
                (e.initializingFavoriteAnchorPromise = null);
            })
          );
        },
        openFavoriteAnchorPicker: function () {
          var e = this;
          return i(
            a().mark(function t() {
              var i;
              return a().wrap(
                function (t) {
                  for (;;)
                    switch ((t.prev = t.next)) {
                      case 0:
                        if (
                          (e.setData({
                            favoritePickerVisible: !0,
                            favoritePickerRequired:
                              !e.data.favoriteAnchorAccount && !e.data.favoriteAnchorRequested,
                            favoriteAnchorCandidate:
                              e.data.favoriteAnchorAccount || e.data.favoriteAnchorCandidate,
                            favoriteAnchorRequestDialogVisible: !1,
                            favoriteAnchorRequestAccount: '',
                          }),
                          e.data.favoriteAnchorOptions.length)
                        ) {
                          t.next = 12;
                          break;
                        }
                        return ((t.prev = 2), (t.next = 5), e.loadFavoriteAnchorOptions());

                      case 5:
                        ((i = t.sent),
                          !e.data.favoriteAnchorCandidate &&
                            i[0] &&
                            e.setData({
                              favoriteAnchorCandidate: i[0].account,
                            }),
                          (t.next = 12));
                        break;

                      case 9:
                        ((t.prev = 9),
                          (t.t0 = t.catch(2)),
                          wx.showToast({
                            title: '主播列表加载失败',
                            icon: 'none',
                          }));

                      case 12:
                      case 'end':
                        return t.stop();
                    }
                },
                t,
                null,
                [[2, 9]]
              );
            })
          )();
        },
        closeFavoriteAnchorPicker: function () {
          this.data.favoritePickerRequired ||
            this.data.favoritePickerSaving ||
            this.setData({
              favoritePickerVisible: !1,
            });
        },
        onFavoritePickerContentTap: function () {},
        onFavoritePickerTouchMove: function () {},
        onSelectFavoriteAnchor: function (e) {
          var t = String(e.currentTarget.dataset.account || '');
          t &&
            t !== this.data.favoriteAnchorCandidate &&
            (this.setData({
              favoriteAnchorCandidate: t,
              favoriteAnchorRequestDialogVisible: !1,
              favoriteAnchorRequestAccount: '',
            }),
            wx.vibrateShort &&
              wx.vibrateShort({
                type: 'light',
                fail: function () {},
              }));
        },
      },
      u.methods
    ),
    {},
    {
      openFavoriteAnchorRequestDialog: function () {
        this.data.favoriteAnchorRequestSaving ||
          this.data.favoritePurchaseBusy ||
          (!this.data.favoritePurchaseStandalone ||
            (this.data.favoritePurchaseOrder &&
              !['failed', 'delivered'].includes(this.data.favoritePurchaseOrder.status)) ||
            this.setData({
              favoritePurchaseStandalone: !1,
              favoritePurchaseOrder: null,
              favoritePurchaseProfile: null,
              favoritePurchaseStage: 'input',
            }),
          this.setData({
            favoriteAnchorRequestDialogVisible: !0,
            favoriteAnchorRequestAccount: this.data.favoritePurchaseOrder
              ? this.data.favoritePurchaseOrder.account
              : this.data.favoritePurchaseProfile
                ? this.data.favoritePurchaseProfile.account
                : '',
          }),
          this.loadFavoritePurchaseOffer(),
          wx.vibrateShort &&
            wx.vibrateShort({
              type: 'light',
              fail: function () {},
            }));
      },
      closeFavoriteAnchorRequestDialog: function () {
        this.data.favoriteAnchorRequestSaving ||
          (this.data.favoritePurchaseBusy && 'lookup' !== this.data.favoritePurchaseStage) ||
          (this.cancelFavoriteLookup(),
          this.setData({
            favoriteAnchorRequestDialogVisible: !1,
            favoriteAnchorRequestAccount: '',
          }));
      },
      onFavoriteAnchorRequestInput: function (e) {
        'input' !== this.data.favoritePurchaseStage ||
          this.data.favoritePurchaseBusy ||
          this.setData({
            favoriteAnchorRequestAccount: String(e.detail.value || '').slice(0, 64),
          });
      },
      submitFavoriteAnchorRequest: function () {
        var e = this;
        return i(
          a().mark(function t() {
            var i, o, n, r;
            return a().wrap(
              function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      if (!e.data.favoriteAnchorRequestSaving && !e.data.favoritePurchaseBusy) {
                        t.next = 2;
                        break;
                      }
                      return t.abrupt('return');

                    case 2:
                      if (
                        ((i = String(e.data.favoriteAnchorRequestAccount || '')
                          .trim()
                          .replace(/^@+/, '')
                          .trim()),
                        D.test(i))
                      ) {
                        t.next = 6;
                        break;
                      }
                      return (
                        wx.showToast({
                          title: '请输入正确的dy号',
                          icon: 'none',
                        }),
                        t.abrupt('return')
                      );

                    case 6:
                      return (
                        e.setData({
                          favoriteAnchorRequestSaving: !0,
                        }),
                        (t.prev = 7),
                        (t.next = 10),
                        c.submitFavoriteAnchorRequest(i)
                      );

                    case 10:
                      ((o = t.sent),
                        (n = o && o.data ? o.data : {}),
                        (r = String(n.douyin_account || i)),
                        e.setData({
                          favoriteAnchorRequested: !0,
                          favoriteAnchorRequestedAccount: r,
                          favoriteAnchorRequestDialogVisible: !1,
                          favoriteAnchorRequestAccount: '',
                          favoritePickerRequired: !1,
                          favoritePickerVisible: !1,
                        }),
                        wx.showToast({
                          title: '已提交，感谢推荐',
                          icon: 'success',
                        }),
                        (t.next = 20));
                      break;

                    case 17:
                      ((t.prev = 17),
                        (t.t0 = t.catch(7)),
                        wx.showToast({
                          title: t.t0.message || '提交失败，请重试',
                          icon: 'none',
                        }));

                    case 20:
                      return (
                        (t.prev = 20),
                        e.setData({
                          favoriteAnchorRequestSaving: !1,
                        }),
                        t.finish(20)
                      );

                    case 23:
                    case 'end':
                      return t.stop();
                  }
              },
              t,
              null,
              [[7, 17, 20, 23]]
            );
          })
        )();
      },
      onFavoriteAnchorAvatarError: function (e) {
        var t = String(e.currentTarget.dataset.account || '');
        t &&
          this.setData({
            favoriteAnchorOptions: this.data.favoriteAnchorOptions.map(function (e) {
              return e.account === t
                ? o(
                    o({}, e),
                    {},
                    {
                      avatarUrl: '',
                    }
                  )
                : e;
            }),
          });
      },
      confirmFavoriteAnchor: function () {
        var e = this;
        return i(
          a().mark(function t() {
            var i, o, n, r, s;
            return a().wrap(
              function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      if (
                        (i = String(e.data.favoriteAnchorCandidate || '')) &&
                        !e.data.favoritePickerSaving
                      ) {
                        t.next = 3;
                        break;
                      }
                      return t.abrupt('return');

                    case 3:
                      return (
                        e.setData({
                          favoritePickerSaving: !0,
                        }),
                        (t.prev = 4),
                        (t.next = 7),
                        c.setFavoriteAnchor(i)
                      );

                    case 7:
                      if (
                        ((o = t.sent),
                        (n = o && o.data ? o.data : {}),
                        (r = String(n.anchor_account || i)),
                        (s = e.data.favoriteAnchorOptions.find(function (e) {
                          return e.account === r;
                        }) || {
                          account: r,
                        }),
                        e.stopAutoRefresh(),
                        !e.loadingStatusPromise)
                      ) {
                        t.next = 20;
                        break;
                      }
                      return ((t.prev = 13), (t.next = 16), e.loadingStatusPromise);

                    case 16:
                      t.next = 20;
                      break;

                    case 18:
                      ((t.prev = 18), (t.t0 = t.catch(13)));

                    case 20:
                      if (!e.loadingHomeBootstrapPromise) {
                        t.next = 28;
                        break;
                      }
                      return ((t.prev = 21), (t.next = 24), e.loadingHomeBootstrapPromise);

                    case 24:
                      t.next = 28;
                      break;

                    case 26:
                      ((t.prev = 26), (t.t1 = t.catch(21)));

                    case 28:
                      return (
                        e.applyFavoriteAnchor(s),
                        e.setData({
                          favoritePickerVisible: !1,
                          favoritePickerRequired: !1,
                          pushEnabled: !0,
                        }),
                        (t.next = 32),
                        Promise.all([e.loadStatus(), e.syncHomeBootstrap()])
                      );

                    case 32:
                      (e.pageVisible && e.startAutoRefresh(),
                        wx.showToast({
                          title: '已切换爱播',
                          icon: 'success',
                        }),
                        (t.next = 39));
                      break;

                    case 36:
                      ((t.prev = 36),
                        (t.t2 = t.catch(4)),
                        wx.showToast({
                          title: t.t2.message || '爱播保存失败，请重试',
                          icon: 'none',
                        }));

                    case 39:
                      return (
                        (t.prev = 39),
                        e.setData({
                          favoritePickerSaving: !1,
                        }),
                        t.finish(39)
                      );

                    case 42:
                    case 'end':
                      return t.stop();
                  }
              },
              t,
              null,
              [
                [4, 36, 39, 42],
                [13, 18],
                [21, 26],
              ]
            );
          })
        )();
      },
      restoreHomeStatus: function () {
        try {
          var e = wx.getStorageSync(A),
            t = p.current();
          if (!t || !e || e.scope !== t) return;
          var a = Number(e && e.cachedAt),
            i = e && e.anchor,
            o = Date.now() - a,
            n = String(this.data.favoriteAnchorAccount || '');
          if (
            !i ||
            !n ||
            String(i.account || '') !== n ||
            !Number.isFinite(a) ||
            o < 0 ||
            o > 3e5 ||
            e.isPreview
          )
            return;
          (this.setData({
            anchor: i,
            lastUpdatedText: e.lastUpdatedText || '--:--:--',
            isPreview: !1,
          }),
            this.syncMascotState(i, !0),
            (this.loadedOnce = !0),
            (this.lastLoadAt = a));
        } catch (e) {}
      },
      persistHomeStatus: function (e, t, a) {
        var i = p.current();
        if (
          i &&
          !a &&
          e &&
          String(e.account || '') === String(this.data.favoriteAnchorAccount || '')
        ) {
          var n = e.viewerCountAvailable
            ? o(
                o({}, e),
                {},
                {
                  viewerCountDisplayValue: e.viewerCount,
                  viewerCountDisplay: oe(e.viewerCount),
                }
              )
            : e;
          wx.setStorage({
            key: A,
            data: {
              scope: i,
              anchor: n,
              lastUpdatedText: t,
              isPreview: !1,
              cachedAt: Date.now(),
            },
            fail: function () {},
          });
        }
      },
      restoreMascotSkin: function () {
        var e = 'classic';
        try {
          var t = String(wx.getStorageSync(_) || '');
          q[t] && (e = t);
        } catch (e) {}
        ((this.preferredMascotSkin = e), this.updateMascotSkinCampaign(L));
      },
      canUseStarlightMascot: function () {
        return Boolean(this.data.favoriteMascotOwned);
      },
      restoreMascotTheme: function () {
        var e = 'classic';
        try {
          var t = String(wx.getStorageSync(x) || '');
          V[t] && (e = t);
        } catch (e) {}
        ((this.preferredMascotTheme = e), this.updateMascotThemeCampaign(z));
      },
      activeMascotSkin: function () {
        return q[this.data.selectedMascotSkin] || q.classic;
      },
      activeMascotFrames: function () {
        return this.remoteMascotFrames && this.remoteMascotFrames[this.data.selectedMascotSkin]
          ? this.remoteMascotFrames[this.data.selectedMascotSkin]
          : this.activeMascotSkin().frames;
      },
      loadRemoteMascot: function () {
        var e = this,
          t = this.data.selectedMascotSkin;
        if (!this.mascotArtworkDisposed) {
          if (((this.mascotArtRequests = this.mascotArtRequests || {}), this.mascotArtRequests[t]))
            return this.mascotArtRequests[t];
          var a = f
            .load(t)
            .then(function (a) {
              var i = a.frames,
                o = a.zap;
              if (!e.mascotArtworkDisposed) {
                e.remoteMascotFrames = e.remoteMascotFrames || {};
                var n = e.remoteMascotFrames[t];
                ((e.remoteMascotFrames[t] = i),
                  o &&
                    e.setData({
                      zapXrayFrame: o,
                    }),
                  e.data.selectedMascotSkin !== t ||
                    (n &&
                      n.every(function (e, t) {
                        return e === i[t];
                      })) ||
                    (e.stopMascotMotion(),
                    e.setData({
                      mascotFrames: i,
                      mascotFrame: i[(Q[e.data.mascotState] || Q.normal)[0]],
                    }),
                    e.pageVisible && e.startMascotMotion()));
              }
            })
            .catch(function () {})
            .finally(function () {
              e.mascotArtRequests[t] === a && delete e.mascotArtRequests[t];
            });
          return ((this.mascotArtRequests[t] = a), a);
        }
      },
      onMascotArtworkError: function () {
        var e = this.data.selectedMascotSkin;
        if (this.remoteMascotFrames && this.remoteMascotFrames[e]) {
          (this.stopMascotMotion(), delete this.remoteMascotFrames[e], f.invalidate(e));
          var t = this.activeMascotSkin().frames;
          (this.setData({
            mascotFrame: t[(Q[this.data.mascotState] || Q.normal)[0]],
            mascotFrames: t,
            zapXrayFrame: H,
          }),
            this.pageVisible && this.startMascotMotion());
        }
      },
      activeMascotBinding: function () {
        var e = this.activeMascotSkin();
        return e.boundAnchorAccount
          ? {
              account: e.boundAnchorAccount,
              nickname: e.boundAnchorName || e.name,
            }
          : null;
      },
      refreshBoundMascotStatus: function () {
        var e = this,
          t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          o = this.activeMascotBinding();
        if (!o) return ((this.boundMascotAnchorStatus = null), Promise.resolve(null));
        if (this.loadingBoundMascotStatusPromise) return this.loadingBoundMascotStatusPromise;
        var n = o.account,
          r = i(
            a().mark(function i() {
              var s, u, l, d;
              return a().wrap(
                function (a) {
                  for (;;)
                    switch ((a.prev = a.next)) {
                      case 0:
                        return ((a.prev = 0), (a.next = 3), c.fetchAnchorStatus(n));

                      case 3:
                        if (
                          ((s = a.sent),
                          (u = s && s.data ? s.data : {}),
                          (l = e.activeMascotBinding()) && l.account === n)
                        ) {
                          a.next = 8;
                          break;
                        }
                        return a.abrupt('return', null);

                      case 8:
                        return (
                          (d = ['live', 'offline', 'unknown'].includes(u.status)
                            ? u.status
                            : 'unknown'),
                          (e.boundMascotAnchorStatus = {
                            account: u.account || n,
                            nickname: u.nickname || o.nickname,
                            status: d,
                            displayStatus: ['live', 'leave', 'offline', 'unknown'].includes(
                              u.display_status
                            )
                              ? u.display_status
                              : d,
                          }),
                          e.syncMascotState(e.data.anchor, Boolean(t.force)),
                          a.abrupt('return', e.boundMascotAnchorStatus)
                        );

                      case 14:
                        return ((a.prev = 14), (a.t0 = a.catch(0)), a.abrupt('return', null));

                      case 17:
                        return (
                          (a.prev = 17),
                          e.loadingBoundMascotStatusPromise === r &&
                            (e.loadingBoundMascotStatusPromise = null),
                          a.finish(17)
                        );

                      case 20:
                      case 'end':
                        return a.stop();
                    }
                },
                i,
                null,
                [[0, 14, 17, 20]]
              );
            })
          )();
        return ((this.loadingBoundMascotStatusPromise = r), r);
      },
      scheduleMascotFramePreload: function () {
        var e = this,
          t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 900;
        (clearTimeout(this.mascotPreloadTimer),
          (this.mascotPreloadTimer = setTimeout(function () {
            e.mascotPreloadTimer = null;
            var t = new Set(e.data.mascotPreloadFrames || []),
              a = Array.from(new Set(e.activeMascotFrames())).filter(function (a) {
                return a !== e.data.mascotFrame && !t.has(a);
              });
            !(function t() {
              if (e.pageVisible && a.length) {
                var i = a.shift();
                (e.setData({
                  mascotPreloadFrames: e.data.mascotPreloadFrames.concat(i),
                }),
                  a.length
                    ? (e.mascotPreloadTimer = setTimeout(t, 160))
                    : (e.mascotPreloadTimer = null));
              }
            })();
          }, t)));
      },
      mascotSkinItems: function (e) {
        var t =
            arguments.length > 1 && void 0 !== arguments[1]
              ? arguments[1]
              : this.data.selectedMascotSkin,
          a =
            arguments.length > 2 && void 0 !== arguments[2]
              ? arguments[2]
              : this.data.xiaoyuSponsorReward,
          i = this.virtualProductFor('skin', 'siwuliu_ice'),
          n = this.virtualProductFor('skin', 'xiaoyu_moon_tide'),
          r = Boolean(e.owned) || Boolean(i && i.owned),
          s = Boolean(a && a.owned) || Boolean(n && n.owned);
        return [
          o(
            o({}, q.classic),
            {},
            {
              owned: !0,
              selected: 'classic' === t,
              badgeText: '默认拥有',
            }
          ),
          o(
            o({}, q.ibo_starlight),
            {},
            {
              owned: Boolean(this.data.favoriteMascotOwned),
              selected: 'ibo_starlight' === t,
              badgeText: this.data.favoriteMascotOwned ? '永久拥有' : '998 i币',
              benefitText: this.data.favoriteMascotOwned
                ? this.data.favoritePurchaseBenefit && this.data.favoritePurchaseBenefit.used
                  ? '赋能已使用 · 形象永久保留'
                  : this.data.favoritePurchaseBenefit && this.data.favoritePurchaseBenefit.available
                    ? '1 次免费添加赋能可用'
                    : '查看我的赋能'
                : this.data.favoriteMascotThemeGift
                  ? '赠鎏金主题 · 1 次免费添加'
                  : '赋能 · 免费添加 1 位爱播',
            }
          ),
          o(
            o({}, q.siwuliu_ice),
            {},
            {
              owned: r,
              selected: 'siwuliu_ice' === t,
              purchasable: Boolean(i && !r),
              productCode: i ? i.code : '',
              priceText: i ? i.price_text : '',
              badgeText: r
                ? '永久拥有'
                : i
                  ? i.price_text
                  : ''.concat(Number(e.streak_days || 0), '/').concat(Number(e.required_days || 7)),
            }
          ),
          o(
            o({}, q.xiaoyu_moon_tide),
            {},
            {
              owned: s,
              selected: 'xiaoyu_moon_tide' === t,
              purchasable: Boolean(n && !s),
              productCode: n ? n.code : '',
              priceText: n ? n.price_text : '',
              badgeText: s ? '永久拥有' : n ? n.price_text : '赞助商获取',
            }
          ),
        ].filter(function (e) {
          return !e.hiddenFromCollection;
        });
      },
      virtualProductFor: function (e, t) {
        return (
          (Array.isArray(this.virtualProducts) ? this.virtualProducts : []).find(function (a) {
            return a.entitlement_type === e && a.entitlement_code === t;
          }) || null
        );
      },
      updateVirtualPayment: function () {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          t = Array.isArray(e.items)
            ? e.items.map(function (e) {
                return o(
                  o({}, e),
                  {},
                  {
                    owned: Boolean(e.owned),
                    price: Math.max(0, Number(e.price || 0)),
                  }
                );
              })
            : [];
        ((this.virtualProducts = t),
          this.setData({
            virtualPaymentConfigured: Boolean(e.configured),
            virtualProducts: t,
          }));
      },
      updateMascotSkinCampaign: function () {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        if (Array.isArray(e.entitlements)) {
          var t = e.entitlements.some(function (e) {
            return (
              e &&
              'theme' === e.entitlement_type &&
              'ibo_soft_gold' === e.entitlement_code &&
              'active' === e.status
            );
          });
          (F.setGoldOwnership(t),
            this.setData({
              softGoldOwned: t,
              themeCollectionVisible: Boolean(
                V.ibo_soft_gold.published ||
                t ||
                this.data.softGoldPreviewAllowed ||
                this.themeCollectionPublished ||
                this.data.isLocalDevelopment
              ),
              favoriteMascotOwned: e.entitlements.some(function (e) {
                return (
                  e &&
                  'skin' === e.entitlement_type &&
                  'ibo_starlight' === e.entitlement_code &&
                  'active' === e.status
                );
              }),
            }));
        }
        var a =
            e.sponsor_rewards && e.sponsor_rewards.xiaoyu_moon_tide
              ? e.sponsor_rewards.xiaoyu_moon_tide
              : {},
          i = o(
            o(o({}, I), a),
            {},
            {
              owned: Boolean(a.owned),
              admin_unlock: Boolean(a.admin_unlock),
              award_id: Math.max(0, Number(a.award_id || 0)),
              awarded_at: Math.max(0, Number(a.awarded_at || 0)),
            }
          ),
          n = o(
            o(o({}, L), e),
            {},
            {
              required_days: Math.max(1, Number(e.required_days || 7)),
              streak_days: Math.max(0, Number(e.streak_days || 0)),
              best_streak_days: Math.max(0, Number(e.best_streak_days || 0)),
              remaining_days: Math.max(0, Number(e.remaining_days || 0)),
              owned: Boolean(e.owned),
              newly_unlocked: Boolean(e.newly_unlocked),
              called_today: Boolean(e.called_today),
              daily_call_used: Boolean(e.daily_call_used),
              admin_unlock: Boolean(e.admin_unlock),
            }
          ),
          r = n.owned ? n.required_days : Math.min(n.streak_days, n.required_days),
          s = '连续打 Call '.concat(r, '/').concat(n.required_days, ' 天 · 今日待支持');
        (n.owned && n.admin_unlock
          ? (s = '管理员体验资格已永久解锁')
          : n.owned
            ? (s = '限定形象已永久点亮')
            : 'upcoming' === n.status
              ? (s = '常驻任务即将开启')
              : 'ended' === n.status
                ? (s = '常驻任务暂时关闭')
                : n.called_today
                  ? (s = '今日已完成 · 连续打 Call '.concat(r, '/').concat(n.required_days, ' 天'))
                  : n.daily_call_used && (s = '今日已支持其他主播，连续进度重新开始'),
          this.setData({
            mascotSkinCampaign: n,
            xiaoyuSponsorReward: i,
            mascotSkinItems: this.mascotSkinItems(n, this.data.selectedMascotSkin, i),
            mascotSkinProgressText: ''.concat(r, '/').concat(n.required_days),
            mascotSkinProgressWidth: Math.round((r / n.required_days) * 100),
            mascotSkinCampaignCaption: s,
          }));
      },
      mascotThemeItems: function (e) {
        var t =
            arguments.length > 1 && void 0 !== arguments[1]
              ? arguments[1]
              : this.data.selectedMascotTheme,
          a =
            arguments.length > 2 && void 0 !== arguments[2]
              ? arguments[2]
              : this.data.xiaoyuSponsorReward,
          i = this.virtualProductFor('theme', 'siwuliu_ice'),
          n = this.virtualProductFor('theme', 'xiaoyu_moon_tide'),
          r = Boolean(e.owned) || Boolean(i && i.owned),
          s = Boolean(a && a.owned) || Boolean(n && n.owned);
        return [
          o(
            o({}, V.ibo_soft_gold),
            {},
            {
              subtitle: this.data.softGoldOwned ? '永久拥有 · 自由切换' : V.ibo_soft_gold.subtitle,
              owned: this.data.softGoldOwned,
              previewable: this.data.softGoldPreviewAllowed,
              purchasable: !1,
              acquirable: !this.data.softGoldOwned && !this.data.softGoldPreviewAllowed,
              selected: 'ibo_soft_gold' === t,
              badgeText: this.data.softGoldOwned
                ? '永久拥有'
                : this.data.softGoldPreviewAllowed
                  ? '管理员预览'
                  : '去获取',
            }
          ),
          o(
            o({}, V.classic),
            {},
            {
              owned: !0,
              selected: 'classic' === t,
              badgeText: '默认拥有',
            }
          ),
          o(
            o({}, V.siwuliu_ice),
            {},
            {
              owned: r,
              selected: 'siwuliu_ice' === t,
              purchasable: Boolean(i && !r),
              productCode: i ? i.code : '',
              priceText: i ? i.price_text : '',
              badgeText: r
                ? '永久拥有'
                : i
                  ? i.price_text
                  : ''
                      .concat(Number(e.call_count || e.streak_days || 0), '/')
                      .concat(Number(e.required_calls || e.required_days || 16)),
            }
          ),
          o(
            o({}, V.xiaoyu_moon_tide),
            {},
            {
              owned: s,
              selected: 'xiaoyu_moon_tide' === t,
              purchasable: Boolean(n && !s),
              productCode: n ? n.code : '',
              priceText: n ? n.price_text : '',
              badgeText: s ? '永久拥有' : n ? n.price_text : '赞助商获取',
            }
          ),
        ];
      },
      mascotThemeReleaseKeys: function () {
        return this.data.mascotThemeItems
          .filter(function (e) {
            return (
              e.code &&
              'classic' !== e.code &&
              !e.previewable &&
              !e.hiddenFromCollection &&
              !1 !== e.published
            );
          })
          .map(function (e) {
            return ''.concat(e.code, ':').concat(e.releaseRevision || 1);
          });
      },
      syncMascotThemeNotice: function () {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          t = e.viewed,
          a = void 0 !== t && t;
        if (!this.mascotThemeSeenReleases) {
          var i = [];
          try {
            i = wx.getStorageSync(k);
          } catch (e) {}
          this.mascotThemeSeenReleases = new Set(
            Array.isArray(i)
              ? i.filter(function (e) {
                  return 'string' == typeof e;
                })
              : []
          );
        }
        var o = this.data.themeCollectionVisible ? this.mascotThemeReleaseKeys() : [],
          n = this.mascotThemeSeenReleases,
          r = o.filter(function (e) {
            return !n.has(e);
          }),
          s =
            a &&
            !1 !== this.pageVisible &&
            this.data.mascotSkinSheetVisible &&
            'theme' === this.data.mascotCollectionTab;
        if (s && r.length) {
          r.forEach(function (e) {
            return n.add(e);
          });
          try {
            wx.setStorageSync(k, Array.from(n));
          } catch (e) {}
        }
        var c = !s && r.length > 0;
        c !== this.data.mascotThemeHasNew &&
          this.setData({
            mascotThemeHasNew: c,
          });
      },
      updateMascotThemeCampaign: function () {
        var e = this,
          t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          a = Math.max(1, Number(t.required_calls || t.required_days || 16)),
          i = void 0 !== t.call_count ? t.call_count : t.streak_days,
          n = Math.max(0, Number(i || 0)),
          r = o(
            o(o({}, z), t),
            {},
            {
              required_calls: a,
              required_days: a,
              call_count: n,
              streak_days: n,
              best_streak_days: Math.max(0, Number(t.best_streak_days || 0)),
              remaining_days: Math.max(0, Number(t.remaining_days || 0)),
              owned: Boolean(t.owned),
              newly_unlocked: Boolean(t.newly_unlocked),
              called_today: Boolean(t.called_today),
              daily_call_used: Boolean(t.daily_call_used),
              admin_unlock: Boolean(t.admin_unlock),
            }
          ),
          s = r.owned ? r.required_calls : Math.min(r.call_count, r.required_calls),
          c = '9 月累计 '.concat(s, ' 次 · 目标 ').concat(r.required_calls, ' 次');
        (r.owned && r.admin_unlock
          ? (c = '管理员体验资格已永久解锁')
          : r.owned
            ? (c = '冰蓝主题已永久点亮')
            : 'upcoming' === r.status
              ? (c = '9 月 1 日开启 · 累计 16 次永久拥有')
              : r.called_today
                ? (c = '本月已累计 '.concat(s, ' 次'))
                : 'ended' === r.status && (c = '活动已结束 · 本月累计 '.concat(s, ' 次')),
          this.setData(
            {
              mascotThemeCampaign: r,
              mascotThemeItems: this.mascotThemeItems(r),
              mascotThemeProgressText: ''.concat(s, '/').concat(r.required_calls),
              mascotThemeProgressWidth: Math.round((s / r.required_calls) * 100),
              mascotThemeCampaignCaption: c,
            },
            function () {
              return e.syncMascotThemeNotice({
                viewed: !0,
              });
            }
          ));
      },
      applyMascotSkin: function (e) {
        var t = this,
          a = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        if ('ibo_starlight' !== e || this.canUseStarlightMascot()) {
          var i = q[e] || q.classic,
            o = this.activeMascotBinding(),
            n = i.boundAnchorAccount || '';
          (o && o.account === n) || (this.boundMascotAnchorStatus = null);
          var r = Q[this.data.mascotState] || Q.normal,
            s = (this.remoteMascotFrames && this.remoteMascotFrames[i.code]) || i.frames,
            c = s[r[0]];
          if (
            (a.preservePreference || (this.preferredMascotSkin = i.code),
            this.setData(
              {
                selectedMascotSkin: i.code,
                selectedMascotSkinName: i.name,
                mascotSkinClass: i.className,
                mascotFrames: s,
                mascotFrame: c,
                mascotPreloadFrames: [],
                mascotSkinItems: this.mascotSkinItems(this.data.mascotSkinCampaign, i.code),
                zapPanelVisible: 'classic' === i.code && this.data.zapPanelVisible,
                mascotWaving: !1,
                mascotBubbleVisible: !1,
              },
              function () {
                (t.loadRemoteMascot(),
                  t.scheduleMascotFramePreload(40),
                  t.syncMascotState(t.data.anchor, !0),
                  t.refreshBoundMascotStatus({
                    force: !0,
                  }));
              }
            ),
            !1 !== a.persist && !a.preservePreference)
          )
            try {
              wx.setStorageSync(_, i.code);
            } catch (e) {}
        }
      },
      setSoftGoldPreviewAccess: function (e) {
        var t = this,
          a = !0 === e;
        if (
          (this.setData({
            softGoldPreviewAllowed: a,
            themeCollectionVisible: Boolean(
              V.ibo_soft_gold.published ||
              a ||
              this.data.softGoldOwned ||
              this.themeCollectionPublished ||
              this.data.isLocalDevelopment
            ),
          }),
          a ||
            F.ownsGold() ||
            ('ibo_soft_gold' !== this.data.selectedMascotTheme &&
              'ibo_soft_gold' !== this.preferredMascotTheme))
        )
          this.setData(
            {
              mascotThemeItems: this.mascotThemeItems(this.data.mascotThemeCampaign),
            },
            function () {
              return t.syncMascotThemeNotice({
                viewed: !0,
              });
            }
          );
        else {
          var i = this.preferredMascotTheme;
          (this.applyMascotTheme('classic', {
            persist: !1,
          }),
            (this.preferredMascotTheme = i));
        }
        this.data.themeCollectionVisible ||
          'theme' !== this.data.mascotCollectionTab ||
          this.setData({
            mascotCollectionTab: 'skin',
            mascotCollectionScrollTop: 0,
          });
      },
      applyMascotTheme: function (e) {
        var t = this,
          a = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        if ('ibo_soft_gold' !== e || this.data.softGoldPreviewAllowed || F.ownsGold()) {
          var i = V[e] || V.classic;
          if (
            ((this.preferredMascotTheme = i.code),
            this.setData(
              {
                selectedMascotTheme: i.code,
                selectedMascotThemeName: i.name,
                mascotThemeClass: i.className,
                mascotThemeItems: this.mascotThemeItems(this.data.mascotThemeCampaign, i.code),
              },
              function () {
                return t.syncMascotThemeNotice({
                  viewed: !0,
                });
              }
            ),
            !1 !== a.persist)
          )
            try {
              wx.setStorageSync(x, i.code);
            } catch (e) {}
          var o = 'function' == typeof this.getTabBar ? this.getTabBar() : null;
          !1 !== this.pageVisible &&
            o &&
            'function' == typeof o.setData &&
            o.setData({
              skin: i.code,
            });
        }
      },
      loadMascotSkinState: function (e) {
        var t = arguments,
          n = this;
        return i(
          a().mark(function i() {
            var r, s, u, l, d, m, h, f, v, b, g, w, y, S, T, _, x, k, A, M, P, C;
            return a().wrap(
              function (a) {
                for (;;)
                  switch ((a.prev = a.next)) {
                    case 0:
                      if (
                        ((r = t.length > 1 && void 0 !== t[1] ? t[1] : {}), !n.loadingMascotSkin)
                      ) {
                        a.next = 4;
                        break;
                      }
                      return (r.fresh && (n.refreshMascotSkinAfterLoad = !0), a.abrupt('return'));

                    case 4:
                      return (
                        (n.loadingMascotSkin = !0),
                        (s = Boolean(n.data.isAdmin)),
                        (u = ''),
                        (l = function () {
                          return (
                            !n.mascotArtworkDisposed &&
                            (!u ||
                              p.current() === u ||
                              (n.updateMascotSkinCampaign({
                                entitlements: [],
                              }),
                              'ibo_starlight' === n.data.selectedMascotSkin &&
                                n.applyMascotSkin('classic', {
                                  persist: !1,
                                  preservePreference: !0,
                                }),
                              !1))
                          );
                        }),
                        (a.prev = 8),
                        (a.next = 11),
                        c.ensureSession()
                      );

                    case 11:
                      if (((d = a.sent), !n.mascotArtworkDisposed)) {
                        a.next = 15;
                        break;
                      }
                      return ((n.loadingMascotSkin = !1), a.abrupt('return'));

                    case 15:
                      ((u = String((d && d.token) || '')),
                        void 0 !== n.mascotOwnershipSession &&
                          n.mascotOwnershipSession !== u &&
                          (n.updateMascotSkinCampaign({
                            entitlements: [],
                          }),
                          'ibo_starlight' === n.data.selectedMascotSkin &&
                            n.applyMascotSkin('classic', {
                              persist: !1,
                              preservePreference: !0,
                            })),
                        (n.mascotOwnershipSession = u),
                        (s = Boolean(d && d.isAdmin)),
                        n.setSoftGoldPreviewAccess(s),
                        s !== n.data.isAdmin &&
                          n.setData({
                            isAdmin: s,
                          }),
                        (a.next = 26));
                      break;

                    case 23:
                      ((a.prev = 23), (a.t0 = a.catch(8)), n.setSoftGoldPreviewAccess(!1));

                    case 26:
                      if (((a.prev = 26), void 0 !== e)) {
                        a.next = 33;
                        break;
                      }
                      return (
                        (a.next = 30),
                        c.fetchMascotSkinState({
                          fresh: Boolean(r.fresh),
                        })
                      );

                    case 30:
                      ((a.t1 = a.sent), (a.next = 34));
                      break;

                    case 33:
                      a.t1 = {
                        data: e,
                      };

                    case 34:
                      if (
                        ((m = a.t1),
                        (h = m && m.data ? m.data : {}),
                        void 0 === e || Array.isArray(h.entitlements))
                      ) {
                        a.next = 46;
                        break;
                      }
                      return (
                        (a.prev = 37),
                        (a.next = 40),
                        c.fetchMascotSkinState({
                          fresh: !0,
                        })
                      );

                    case 40:
                      ((f = a.sent) &&
                        f.data &&
                        Array.isArray(f.data.entitlements) &&
                        (h = o(o({}, h), f.data)),
                        (a.next = 46));
                      break;

                    case 44:
                      ((a.prev = 44), (a.t2 = a.catch(37)));

                    case 46:
                      if ((v = h.virtual_payment) || void 0 === e) {
                        a.next = 57;
                        break;
                      }
                      return (
                        (a.prev = 48),
                        (a.next = 51),
                        c.fetchVirtualProducts({
                          fresh: Boolean(r.fresh),
                        })
                      );

                    case 51:
                      ((b = a.sent), (v = b && b.data ? b.data : null), (a.next = 57));
                      break;

                    case 55:
                      ((a.prev = 55), (a.t3 = a.catch(48)));

                    case 57:
                      if (l()) {
                        a.next = 59;
                        break;
                      }
                      return a.abrupt('return');

                    case 59:
                      (n.updateVirtualPayment(v || {}),
                        (g = h.theme_campaign || {}),
                        (w =
                          h.sponsor_rewards && h.sponsor_rewards.xiaoyu_moon_tide
                            ? h.sponsor_rewards.xiaoyu_moon_tide
                            : {}),
                        (y =
                          s && !h.owned
                            ? o(
                                o({}, h),
                                {},
                                {
                                  owned: !0,
                                  admin_unlock: !0,
                                  remaining_days: 0,
                                }
                              )
                            : h),
                        (S =
                          s && !g.owned
                            ? o(
                                o({}, g),
                                {},
                                {
                                  owned: !0,
                                  admin_unlock: !0,
                                  remaining_days: 0,
                                }
                              )
                            : g),
                        n.updateMascotSkinCampaign(y),
                        n.updateMascotThemeCampaign(S),
                        (T = Boolean(y.owned) || s || n.data.isLocalDevelopment),
                        (_ =
                          Boolean(w.owned) ||
                          Boolean(
                            n.virtualProductFor('skin', 'xiaoyu_moon_tide') &&
                            n.virtualProductFor('skin', 'xiaoyu_moon_tide').owned
                          ) ||
                          s ||
                          n.data.isLocalDevelopment),
                        (x = n.preferredMascotSkin || 'classic'),
                        'classic' === x ||
                        ('ibo_starlight' === x && n.canUseStarlightMascot()) ||
                        ('xiaoyu_moon_tide' === x && _) ||
                        ('siwuliu_ice' === x && T)
                          ? n.data.selectedMascotSkin !== x &&
                            n.applyMascotSkin(x, {
                              persist: !1,
                            })
                          : 'classic' !== n.data.selectedMascotSkin &&
                            n.applyMascotSkin('classic', {
                              persist: !1,
                              preservePreference: !0,
                            }),
                        (k =
                          Boolean(S.owned) ||
                          Boolean(
                            n.virtualProductFor('theme', 'siwuliu_ice') &&
                            n.virtualProductFor('theme', 'siwuliu_ice').owned
                          ) ||
                          s ||
                          n.data.isLocalDevelopment),
                        (A =
                          Boolean(w.owned) ||
                          Boolean(
                            n.virtualProductFor('theme', 'xiaoyu_moon_tide') &&
                            n.virtualProductFor('theme', 'xiaoyu_moon_tide').owned
                          ) ||
                          s ||
                          n.data.isLocalDevelopment),
                        (M = n.preferredMascotTheme || 'classic'),
                        'classic' === M ||
                        ('ibo_soft_gold' === M &&
                          (n.data.softGoldPreviewAllowed || F.ownsGold())) ||
                        ('xiaoyu_moon_tide' === M && A) ||
                        ('siwuliu_ice' === M && k)
                          ? n.data.selectedMascotTheme !== M &&
                            n.applyMascotTheme(M, {
                              persist: !1,
                            })
                          : ('classic' === n.data.selectedMascotTheme && 'ibo_soft_gold' !== M) ||
                            ('ibo_soft_gold' === M && !Array.isArray(h.entitlements)) ||
                            n.applyMascotTheme('classic', {
                              persist: 'ibo_soft_gold' === M || !n.data.isLocalDevelopment,
                            }),
                        y.newly_unlocked
                          ? wx.showToast({
                              title: '𝑿.四五六🍉限定形象已永久解锁',
                              icon: 'none',
                              duration: 2600,
                            })
                          : S.newly_unlocked &&
                            wx.showToast({
                              title: '冰蓝主题已永久解锁',
                              icon: 'none',
                              duration: 2600,
                            }),
                        (a.next = 84));
                      break;

                    case 79:
                      if (((a.prev = 79), (a.t4 = a.catch(26)), l())) {
                        a.next = 83;
                        break;
                      }
                      return a.abrupt('return');

                    case 83:
                      s
                        ? ((P = o(
                            o({}, n.data.mascotSkinCampaign),
                            {},
                            {
                              owned: !0,
                              admin_unlock: !0,
                              remaining_days: 0,
                            }
                          )),
                          n.updateMascotSkinCampaign(P),
                          'siwuliu_ice' === n.preferredMascotSkin
                            ? n.applyMascotSkin('siwuliu_ice', {
                                persist: !1,
                              })
                            : 'xiaoyu_moon_tide' === n.preferredMascotSkin &&
                              n.applyMascotSkin('xiaoyu_moon_tide', {
                                persist: !1,
                              }),
                          (C = o(
                            o({}, n.data.mascotThemeCampaign),
                            {},
                            {
                              owned: !0,
                              admin_unlock: !0,
                              remaining_days: 0,
                            }
                          )),
                          n.updateMascotThemeCampaign(C),
                          'siwuliu_ice' === n.preferredMascotTheme
                            ? n.applyMascotTheme('siwuliu_ice', {
                                persist: !1,
                              })
                            : 'ibo_soft_gold' === n.preferredMascotTheme
                              ? n.applyMascotTheme('ibo_soft_gold', {
                                  persist: !1,
                                })
                              : 'xiaoyu_moon_tide' === n.preferredMascotTheme &&
                                n.applyMascotTheme('xiaoyu_moon_tide', {
                                  persist: !1,
                                }))
                        : (n.updateMascotSkinCampaign(n.data.mascotSkinCampaign),
                          n.updateMascotThemeCampaign(n.data.mascotThemeCampaign),
                          'xiaoyu_moon_tide' === n.data.selectedMascotSkin &&
                            n.applyMascotSkin('classic', {
                              persist: !1,
                              preservePreference: !0,
                            }),
                          'xiaoyu_moon_tide' === n.data.selectedMascotTheme &&
                            n.applyMascotTheme('classic'));

                    case 84:
                      if (
                        ((a.prev = 84),
                        (n.loadingMascotSkin = !1),
                        !n.refreshMascotSkinAfterLoad || n.mascotArtworkDisposed)
                      ) {
                        a.next = 90;
                        break;
                      }
                      return (
                        (n.refreshMascotSkinAfterLoad = !1),
                        (a.next = 90),
                        n.loadMascotSkinState(void 0, {
                          fresh: !0,
                        })
                      );

                    case 90:
                      return a.finish(84);

                    case 91:
                    case 'end':
                      return a.stop();
                  }
              },
              i,
              null,
              [
                [8, 23],
                [26, 79, 84, 91],
                [37, 44],
                [48, 55],
              ]
            );
          })
        )();
      },
      onMascotLaunchGuideVisibility: function (e) {
        this.setData({
          mascotLaunchGuideVisible: Boolean(e.detail && e.detail.visible),
        });
      },
      openMascotSkinSheet: function () {
        var e = this;
        (clearTimeout(this.mascotBubbleTimer),
          this.setData(
            {
              mascotSkinSheetVisible: !0,
              mascotCollectionTab: 'skin',
              mascotCollectionScrollTop: (this.mascotCollectionScrollPositions || {}).skin || 0,
              mascotSkinItems: this.mascotSkinItems(this.data.mascotSkinCampaign),
              mascotThemeItems: this.mascotThemeItems(this.data.mascotThemeCampaign),
              mascotBubbleVisible: !1,
            },
            function () {
              return e.syncMascotThemeNotice();
            }
          ),
          this.refreshMascotCollectionOffer());
      },
      refreshMascotCollectionOffer: function () {
        var e = this;
        return i(
          a().mark(function t() {
            var i;
            return a().wrap(
              function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      if (!e.refreshingMascotCollection) {
                        t.next = 2;
                        break;
                      }
                      return t.abrupt('return');

                    case 2:
                      return (
                        (e.refreshingMascotCollection = !0),
                        (t.prev = 3),
                        (t.next = 6),
                        c.fetchFavoriteAnchorPurchaseOffer()
                      );

                    case 6:
                      ((i = t.sent), e.setFavoritePurchaseOffer(i.data || {}), (t.next = 12));
                      break;

                    case 10:
                      ((t.prev = 10), (t.t0 = t.catch(3)));

                    case 12:
                      return ((t.prev = 12), (e.refreshingMascotCollection = !1), t.finish(12));

                    case 15:
                    case 'end':
                      return t.stop();
                  }
              },
              t,
              null,
              [[3, 10, 12, 15]]
            );
          })
        )();
      },
      closeMascotSkinSheet: function () {
        this.setData({
          mascotSkinSheetVisible: !1,
        });
      },
      switchMascotCollectionTab: function (e) {
        var t = this,
          a = e.currentTarget.dataset.tab;
        this.data.mascotSkinSheetVisible &&
          ['skin', 'theme'].includes(a) &&
          a !== this.data.mascotCollectionTab &&
          ('theme' !== a || this.data.themeCollectionVisible) &&
          (this.setData(
            {
              mascotCollectionTab: a,
              mascotCollectionScrollTop: (this.mascotCollectionScrollPositions || {})[a] || 0,
            },
            function () {
              return t.syncMascotThemeNotice({
                viewed: !0,
              });
            }
          ),
          !this.data.performanceClass &&
            wx.vibrateShort &&
            wx.vibrateShort({
              type: 'light',
              fail: function () {},
            }));
      },
      onMascotCollectionScroll: function (e) {
        var t = e.currentTarget.dataset.tab,
          a = Number(e.detail.scrollTop);
        this.data.mascotSkinSheetVisible &&
          t === this.data.mascotCollectionTab &&
          ['skin', 'theme'].includes(t) &&
          Number.isFinite(a) &&
          ((this.mascotCollectionScrollPositions = this.mascotCollectionScrollPositions || {}),
          (this.mascotCollectionScrollPositions[t] = Math.max(0, a)));
      },
      onMascotSkinSheetTap: function () {},
      canRequestVirtualPayment: function () {
        if ('function' != typeof wx.requestVirtualPayment)
          return (
            wx.showModal({
              title: '暂时无法购买',
              content: '当前微信版本不支持虚拟支付，请升级微信后重试。',
              showCancel: !1,
            }),
            !1
          );
        var e = wx.getSystemInfoSync ? wx.getSystemInfoSync() : {};
        return (
          !(
            'ios' === String(e.platform || '').toLowerCase() &&
            (function (e, t) {
              for (
                var a = String(e || '')
                    .split('.')
                    .map(function (e) {
                      return Number(e) || 0;
                    }),
                  i = String(t || '')
                    .split('.')
                    .map(function (e) {
                      return Number(e) || 0;
                    }),
                  o = Math.max(a.length, i.length),
                  n = 0;
                n < o;
                n += 1
              ) {
                var r = (a[n] || 0) - (i[n] || 0);
                if (r) return r > 0 ? 1 : -1;
              }
              return 0;
            })(e.version, '8.0.68') < 0
          ) ||
          (wx.showModal({
            title: '请先升级微信',
            content: 'iPhone 需要微信 8.0.68 或更高版本才能购买虚拟商品。',
            showCancel: !1,
          }),
          !1)
        );
      },
      requestVirtualPayment: function (e) {
        return new Promise(function (t, a) {
          wx.requestVirtualPayment({
            signData: e.signData,
            mode: e.mode,
            paySig: e.paySig,
            signature: e.signature,
            success: t,
            fail: a,
          });
        });
      },
      waitForVirtualPayment: function (e) {
        return i(
          a().mark(function t() {
            var i, o, n;
            return a().wrap(
              function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      i = 0;

                    case 1:
                      if (!(i < 10)) {
                        t.next = 33;
                        break;
                      }
                      return ((t.next = 4), ce(0 === i ? 500 : 900));

                    case 4:
                      if (((o = null), (t.prev = 5), 2 !== i && 6 !== i)) {
                        t.next = 12;
                        break;
                      }
                      return ((t.next = 9), c.reconcileVirtualPaymentOrder(e));

                    case 9:
                      ((t.t0 = t.sent), (t.next = 15));
                      break;

                    case 12:
                      return ((t.next = 14), c.fetchVirtualPaymentOrder(e));

                    case 14:
                      t.t0 = t.sent;

                    case 15:
                      ((o = t.t0), (t.next = 23));
                      break;

                    case 18:
                      if (((t.prev = 18), (t.t1 = t.catch(5)), 9 !== i)) {
                        t.next = 22;
                        break;
                      }
                      throw t.t1;

                    case 22:
                      return t.abrupt('continue', 30);

                    case 23:
                      if ('delivered' !== (n = o && o.data ? o.data : {}).status) {
                        t.next = 26;
                        break;
                      }
                      return t.abrupt('return', !0);

                    case 26:
                      if ('refunded' !== n.status) {
                        t.next = 28;
                        break;
                      }
                      throw new Error('订单已经退款，未发放使用权');

                    case 28:
                      if ('closed' !== n.status) {
                        t.next = 30;
                        break;
                      }
                      throw new Error('订单已经关闭，请重新购买');

                    case 30:
                      ((i += 1), (t.next = 1));
                      break;

                    case 33:
                      return t.abrupt('return', !1);

                    case 34:
                    case 'end':
                      return t.stop();
                  }
              },
              t,
              null,
              [[5, 18]]
            );
          })
        )();
      },
      purchaseVirtualProduct: function (e) {
        var t,
          o = this;
        e &&
          e.productCode &&
          !this.data.paymentProcessingCode &&
          this.canRequestVirtualPayment() &&
          wx.showModal({
            title: '购买'.concat(e.name),
            content: ''.concat(
              e.priceText || '以支付页为准',
              '永久解锁。支付完成后由服务器确认并发放使用权。'
            ),
            confirmText: '确认购买',
            success:
              ((t = i(
                a().mark(function t(i) {
                  var n, r, s, u, l, d;
                  return a().wrap(
                    function (t) {
                      for (;;)
                        switch ((t.prev = t.next)) {
                          case 0:
                            if (i.confirm) {
                              t.next = 2;
                              break;
                            }
                            return t.abrupt('return');

                          case 2:
                            return (
                              o.setData({
                                paymentProcessingCode: e.code,
                              }),
                              wx.showLoading({
                                title: '正在创建订单',
                                mask: !0,
                              }),
                              (t.prev = 4),
                              (t.next = 7),
                              c.createVirtualPaymentOrder(e.productCode)
                            );

                          case 7:
                            if (
                              ((n = t.sent),
                              (r = n && n.data ? n.data : {}),
                              (s = r.order || {}),
                              (u = r.pay_data || {}),
                              s.out_trade_no && u.signData)
                            ) {
                              t.next = 13;
                              break;
                            }
                            throw new Error('服务器未返回完整支付参数');

                          case 13:
                            return (wx.hideLoading(), (t.next = 16), o.requestVirtualPayment(u));

                          case 16:
                            return (
                              wx.showLoading({
                                title: '权益确认中',
                                mask: !0,
                              }),
                              (t.next = 19),
                              o.waitForVirtualPayment(s.out_trade_no)
                            );

                          case 19:
                            if (((l = t.sent), wx.hideLoading(), !l)) {
                              t.next = 27;
                              break;
                            }
                            return (
                              (t.next = 24),
                              o.loadMascotSkinState(void 0, {
                                fresh: !0,
                              })
                            );

                          case 24:
                            (wx.showToast({
                              title: '已永久解锁',
                              icon: 'success',
                              duration: 2200,
                            }),
                              (t.next = 28));
                            break;

                          case 27:
                            wx.showModal({
                              title: '支付已受理',
                              content: '微信正在确认发货，稍后重新打开形象收藏即可看到使用权。',
                              showCancel: !1,
                            });

                          case 28:
                            t.next = 35;
                            break;

                          case 30:
                            ((t.prev = 30),
                              (t.t0 = t.catch(4)),
                              wx.hideLoading(),
                              (d = String((t.t0 && (t.t0.errMsg || t.t0.message)) || ''))
                                .toLowerCase()
                                .includes('cancel') ||
                                wx.showModal({
                                  title: '暂未完成购买',
                                  content: d || '支付未完成，请稍后重试。',
                                  showCancel: !1,
                                }));

                          case 35:
                            return (
                              (t.prev = 35),
                              o.setData({
                                paymentProcessingCode: '',
                              }),
                              t.finish(35)
                            );

                          case 38:
                          case 'end':
                            return t.stop();
                        }
                    },
                    t,
                    null,
                    [[4, 30, 35, 38]]
                  );
                })
              )),
              function (e) {
                return t.apply(this, arguments);
              }),
          });
      },
      selectMascotSkin: function (e) {
        var t = String(e.currentTarget.dataset.code || ''),
          a = this.data.mascotSkinItems.find(function (e) {
            return e.code === t;
          });
        if (a) {
          if ('ibo_starlight' === t && !a.owned) return this.openStandaloneMascotPurchase();
          if (a.owned || this.data.isLocalDevelopment)
            (this.applyMascotSkin(t),
              this.setData({
                mascotSkinSheetVisible: !1,
              }),
              wx.vibrateShort &&
                wx.vibrateShort({
                  type: 'light',
                  fail: function () {},
                }));
          else {
            if (a.purchasable) return void this.purchaseVirtualProduct(a);
            var i =
              'xiaoyu_moon_tide' === t
                ? '该形象由赞助商指定赠送'
                : '连续为四五六打 Call '.concat(
                    this.data.mascotSkinCampaign.required_days,
                    ' 天即可解锁'
                  );
            wx.showToast({
              title: i,
              icon: 'none',
              duration: 2600,
            });
          }
        }
      },
      selectMascotTheme: function (e) {
        var t = String(e.currentTarget.dataset.code || ''),
          a = this.data.mascotThemeItems.find(function (e) {
            return e.code === t;
          });
        if (a) {
          if ('ibo_soft_gold' === t && !this.data.softGoldPreviewAllowed && !F.ownsGold())
            return this.openStandaloneMascotPurchase();
          if (a.owned || a.previewable || this.data.isLocalDevelopment)
            t !== this.data.selectedMascotTheme
              ? (this.playMascotThemeTransition(t),
                wx.vibrateShort &&
                  wx.vibrateShort({
                    type: 'light',
                    fail: function () {},
                  }))
              : this.setData({
                  mascotSkinSheetVisible: !1,
                });
          else {
            if (a.purchasable) return void this.purchaseVirtualProduct(a);
            var i = this.data.mascotThemeCampaign,
              o =
                'xiaoyu_moon_tide' === t
                  ? '该主题由赞助商指定赠送'
                  : 'upcoming' === i.status
                    ? '9 月给四五六打 Call 累计 16 次解锁'
                    : '本月累计支持四五六 '.concat(i.required_calls, ' 次解锁');
            wx.showToast({
              title: o,
              icon: 'none',
              duration: 2600,
            });
          }
        }
      },
      playMascotThemeTransition: function (e) {
        var t = this;
        if ('ibo_soft_gold' !== e || this.data.softGoldPreviewAllowed || F.ownsGold()) {
          var a = V[e] || V.classic;
          clearTimeout(this.themeTransitionTimer);
          var i = function (e) {
            var i = Math.max(38, Number(t.data.navigationHeight || 64) - 34),
              o = e ? e.left + e.width / 2 : 38,
              n = e ? e.top + e.height / 2 : i;
            (t.setData({
              mascotSkinSheetVisible: !1,
              themeTransitionVisible: !0,
              themeTransitionActive: !1,
              themeTransitionTarget: a.code,
              themeTransitionOriginStyle: 'left: '.concat(o, 'px; top: ').concat(n, 'px;'),
            }),
              wx.nextTick(function () {
                (t.setData({
                  themeTransitionActive: !0,
                }),
                  (t.themeTransitionTimer = setTimeout(function () {
                    (t.applyMascotTheme(a.code),
                      (t.themeTransitionTimer = setTimeout(function () {
                        (t.setData({
                          themeTransitionVisible: !1,
                          themeTransitionActive: !1,
                        }),
                          (t.themeTransitionTimer = null));
                      }, 500)));
                  }, 320)));
              }));
          };
          wx.createSelectorQuery
            ? wx
                .createSelectorQuery()
                .in(this)
                .select('.mascot-collection-trigger')
                .boundingClientRect(function (e) {
                  return i(e || null);
                })
                .exec()
            : i(null);
        }
      },
      restoreZapActivity: function () {
        var e = 0,
          t = !0;
        try {
          var a = wx.getStorageSync(S),
            i = wx.getStorageSync(T);
          ((e = Math.max(0, Number(a && a.tapCount) || Number(a) || 0)),
            (t = '' === i || Boolean(i)));
        } catch (a) {
          ((e = 0), (t = !0));
        }
        var o = m.countAt();
        this.setData({
          zapTapCount: e,
          zapTapCountText: oe(e),
          globalUrgeCount: o,
          globalUrgeCountText: oe(o),
          zapHapticsEnabled: t,
        });
      },
      updateGlobalUrgeCount: function () {
        var e = m.countAt();
        e !== Number(this.data.globalUrgeCount || 0) &&
          this.setData({
            globalUrgeCount: e,
            globalUrgeCountText: oe(e),
          });
      },
      startGlobalUrgeTicker: function () {
        var e = this;
        if (!this.globalUrgeTimer) {
          this.updateGlobalUrgeCount();
          !(function t() {
            var a = m.millisecondsUntilNextTick() + 20;
            e.globalUrgeTimer = setTimeout(function () {
              ((e.globalUrgeTimer = null), e.updateGlobalUrgeCount(), t());
            }, a);
          })();
        }
      },
      toggleZapPanel: function () {
        if (!this.showBlockedZapSpeech()) {
          (clearTimeout(this.mascotBubbleTimer), (this.mascotBubbleTimer = null));
          var e = !this.data.zapPanelVisible;
          this.setData({
            zapPanelVisible: e,
            zapPanelMounted: this.data.zapPanelMounted || e,
            mascotBubbleVisible: !1,
          });
        }
      },
      onZapPanelTap: function () {},
      showBlockedZapSpeech: function () {
        var e = te[this.data.mascotState];
        return (
          !!e &&
          (this.setData({
            zapPanelVisible: !1,
          }),
          this.showMascotBubble(e),
          !0)
        );
      },
      triggerZapHaptic: function () {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 'medium';
        if (this.data.zapHapticsEnabled && 'function' == typeof wx.vibrateShort)
          try {
            wx.vibrateShort({
              type: e,
              fail: function () {
                try {
                  wx.vibrateShort({
                    fail: function () {},
                  });
                } catch (e) {}
              },
            });
          } catch (e) {}
      },
      toggleZapHaptics: function () {
        var e = this,
          t = !this.data.zapHapticsEnabled;
        (wx.setStorage({
          key: T,
          data: t,
          fail: function () {},
        }),
          this.setData(
            {
              zapHapticsEnabled: t,
            },
            function () {
              t && e.triggerZapHaptic('light');
            }
          ));
      },
      scheduleZapActivityPersist: function (e) {
        var t = this;
        ((this.pendingZapTapCount = e),
          clearTimeout(this.zapStorageTimer),
          (this.zapStorageTimer = setTimeout(function () {
            return t.flushZapActivityPersist();
          }, 260)));
      },
      flushZapActivityPersist: function () {
        if (
          (clearTimeout(this.zapStorageTimer),
          (this.zapStorageTimer = null),
          null !== this.pendingZapTapCount && void 0 !== this.pendingZapTapCount)
        ) {
          var e = this.pendingZapTapCount;
          this.pendingZapTapCount = null;
          try {
            wx.setStorageSync(S, {
              tapCount: e,
            });
          } catch (t) {
            wx.setStorage({
              key: S,
              data: {
                tapCount: e,
              },
              fail: function () {},
            });
          }
        }
      },
      stopZapActivity: function () {
        (clearTimeout(this.globalUrgeTimer),
          clearTimeout(this.zapAnimationTimer),
          clearTimeout(this.zapEasterHapticTimer),
          clearTimeout(this.zapEasterEggTimer),
          clearTimeout(this.zapComboTimer),
          clearTimeout(this.zapPulseTimer),
          this.flushZapActivityPersist(),
          (this.globalUrgeTimer = null),
          (this.zapAnimationTimer = null),
          (this.zapEasterHapticTimer = null),
          (this.zapEasterEggTimer = null),
          (this.zapComboTimer = null),
          (this.zapPulseTimer = null),
          (this.lastZapTapAt = 0),
          (this.data.zapActive ||
            this.data.zapEasterEggClass ||
            this.data.zapComboCount ||
            this.data.zapPulseItems.length) &&
            this.setData({
              zapActive: !1,
              zapEasterEggClass: '',
              zapPanelTitle: '催播能量站',
              zapComboCount: 0,
              zapPulseItems: [],
            }));
      },
      pauseMascotMotionForZap: function () {
        (clearTimeout(this.mascotIntroTimer),
          clearInterval(this.mascotWaveTimer),
          clearInterval(this.mascotStateTimer),
          clearTimeout(this.mascotMomentTimer),
          (this.mascotFrameTimers || []).forEach(function (e) {
            return clearTimeout(e);
          }),
          (this.mascotIntroTimer = null),
          (this.mascotWaveTimer = null),
          (this.mascotStateTimer = null),
          (this.mascotMomentTimer = null),
          (this.mascotFrameTimers = []),
          (this.mascotAnimating = !1));
      },
      resumeMascotMotionAfterZap: function () {
        this.mascotMotionActive &&
          (this.startMascotStateAnimation(this.data.mascotState),
          this.scheduleMascotMoment(8e3, 14e3));
      },
      onZapTap: function () {
        var e = this;
        if (!this.showBlockedZapSpeech()) {
          var t = Date.now(),
            a =
              t - Number(this.lastZapTapAt || 0) <= 850
                ? Number(this.data.zapComboCount || 0) + 1
                : 1;
          this.lastZapTapAt = t;
          var i = Number(this.data.zapTapCount || 0) + 1,
            o = m.countAt(t),
            n = (function (e) {
              return e > 0 && e % 100 == 0
                ? {
                    className: 'is-easter-egg egg-legend',
                    title: '百次觉醒',
                  }
                : e > 0 && e % 50 == 0
                  ? {
                      className: 'is-easter-egg egg-rare',
                      title: '稀有闪电',
                    }
                  : e > 0 && e % 10 == 0
                    ? {
                        className: 'is-easter-egg egg-spark',
                        title: '能量暴击',
                      }
                    : Math.random() < 0.03
                      ? {
                          className: 'is-easter-egg egg-surprise',
                          title: '隐藏彩蛋',
                        }
                      : null;
            })(i);
          this.zapPulseSequence = Number(this.zapPulseSequence || 0) + 1;
          var r = (this.data.zapPulseItems || [])
            .concat({
              id: this.zapPulseSequence,
              variant: this.zapPulseSequence % 2 == 0 ? 'pulse-right' : 'pulse-left',
            })
            .slice(-5);
          this.scheduleZapActivityPersist(i);
          var s = this.activeMascotFrames()[Q[this.data.mascotState][0]];
          (this.data.zapActive || this.pauseMascotMotionForZap(),
            clearTimeout(this.mascotBubbleTimer),
            this.setData({
              zapActive: !0,
              zapTapCount: i,
              zapTapCountText: oe(i),
              globalUrgeCount: o,
              globalUrgeCountText: oe(o),
              zapEasterEggClass: n ? n.className : this.data.zapEasterEggClass,
              zapPanelTitle: n ? n.title : this.data.zapPanelTitle,
              zapComboCount: a,
              zapPulseItems: r,
              mascotFrame: s,
              mascotWaving: !1,
              mascotBubbleVisible: !1,
            }),
            this.triggerZapHaptic(a > 1 && a % 5 == 0 ? 'heavy' : 'medium'),
            n &&
              (clearTimeout(this.zapEasterHapticTimer),
              (this.zapEasterHapticTimer = setTimeout(function () {
                (e.triggerZapHaptic(n.className.includes('egg-legend') ? 'heavy' : 'light'),
                  (e.zapEasterHapticTimer = null));
              }, 150)),
              clearTimeout(this.zapEasterEggTimer),
              (this.zapEasterEggTimer = setTimeout(function () {
                (e.setData({
                  zapEasterEggClass: '',
                  zapPanelTitle: '催播能量站',
                }),
                  (e.zapEasterEggTimer = null));
              }, 1100))),
            clearTimeout(this.zapComboTimer),
            (this.zapComboTimer = setTimeout(function () {
              (e.setData({
                zapComboCount: 0,
              }),
                (e.zapComboTimer = null),
                (e.lastZapTapAt = 0));
            }, 900)),
            clearTimeout(this.zapPulseTimer),
            (this.zapPulseTimer = setTimeout(function () {
              (e.setData({
                zapPulseItems: [],
              }),
                (e.zapPulseTimer = null));
            }, 620)),
            clearTimeout(this.zapAnimationTimer),
            (this.zapAnimationTimer = setTimeout(function () {
              (e.setData(
                {
                  zapActive: !1,
                },
                function () {
                  e.resumeMascotMotionAfterZap();
                }
              ),
                (e.zapAnimationTimer = null));
            }, 1050)));
        }
      },
      syncBirthdayCelebration: function () {
        var e = this.data.favoriteAnchorAccount === s.ANCHOR.account && ue();
        e !== this.data.isBirthdayCelebration &&
          this.setData({
            isBirthdayCelebration: e,
          });
      },
      setHomePopup: function (e) {
        var t = String((e && e.title) || '').trim(),
          a = String((e && e.content) || '').trim(),
          i = String((e && e.button_text) || '').trim(),
          o = e && e.version,
          n = Boolean(e && e.enabled),
          r = e && !1 !== e.button_enabled,
          s = String((e && e.action_type) || 'love_call'),
          c = String((e && e.theme) || 'red_gold'),
          u = String((e && e.icon) || 'heart'),
          l = String((e && e.display_frequency) || 'version_once');
        if (
          n &&
          o &&
          t &&
          a &&
          (!r || i) &&
          ('close' === s || U[s]) &&
          W.includes(c) &&
          G[u] &&
          K.includes(l)
        ) {
          var d = {
            version: String(o),
            title: t,
            content: a,
            buttonText: i,
            buttonEnabled: r,
            actionType: s,
            themeClass: c.replace(/_/g, '-'),
            iconText: G[u],
            kicker: Z[c],
            displayFrequency: l,
            preview: Boolean(e.preview),
          };
          this.setData({
            homePopup: d,
            homePopupVisible: !this.hasSeenHomePopup(d),
          });
        } else
          this.setData({
            homePopup: null,
            homePopupVisible: !1,
          });
      },
      hasSeenHomePopup: function (e) {
        if (!e || 'always' === e.displayFrequency) return !1;
        try {
          return 'daily' === e.displayFrequency
            ? String(wx.getStorageSync(y) || '') === ''.concat(e.version, ':').concat(j())
            : String(wx.getStorageSync(w) || '') === e.version;
        } catch (e) {
          return !1;
        }
      },
      loadHomePopup: function () {
        var e = this;
        return i(
          a().mark(function t() {
            var i, o;
            return a().wrap(
              function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      if (!e.loadingHomePopup) {
                        t.next = 2;
                        break;
                      }
                      return t.abrupt('return');

                    case 2:
                      return (
                        (e.loadingHomePopup = !0),
                        (t.prev = 3),
                        (t.next = 6),
                        c.fetchHomePopup()
                      );

                    case 6:
                      ((i = t.sent),
                        !(o = i && i.data ? i.data : {}).enabled && e.data.isLocalDevelopment
                          ? e.setHomePopup(O)
                          : e.setHomePopup(o),
                        (t.next = 14));
                      break;

                    case 11:
                      ((t.prev = 11),
                        (t.t0 = t.catch(3)),
                        e.data.isLocalDevelopment && e.setHomePopup(O));

                    case 14:
                      return ((t.prev = 14), (e.loadingHomePopup = !1), t.finish(14));

                    case 17:
                    case 'end':
                      return t.stop();
                  }
              },
              t,
              null,
              [[3, 11, 14, 17]]
            );
          })
        )();
      },
      rememberHomePopup: function () {
        var e = this.data.homePopup;
        if (e && e.version && 'always' !== e.displayFrequency)
          try {
            'daily' === e.displayFrequency
              ? wx.setStorageSync(y, ''.concat(e.version, ':').concat(j()))
              : wx.setStorageSync(w, e.version);
          } catch (e) {}
      },
      closeHomePopup: function () {
        (this.rememberHomePopup(),
          this.setData({
            homePopupVisible: !1,
          }));
      },
      openViewerArchive: function (e) {
        var t = String(
          e.currentTarget.dataset.account || this.data.favoriteAnchorAccount || ''
        ).trim();
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
      handleHomePopupAction: function () {
        var e = this.data.homePopup;
        if (e) {
          (this.rememberHomePopup(),
            this.setData({
              homePopupVisible: !1,
            }));
          var t = U[e.actionType];
          t &&
            ('/pages/live-archive/live-archive' !== t && '/pages/daily-digest/daily-digest' !== t
              ? wx.navigateTo({
                  url: t,
                })
              : wx.switchTab({
                  url: t,
                }));
        }
      },
      onHomePopupContentTap: function () {},
      onHomePopupTouchMove: function () {},
      openCustomServiceDialog: function () {
        (this.setData({
          customServiceDialogVisible: !0,
        }),
          wx.vibrateShort &&
            wx.vibrateShort({
              type: 'light',
              fail: function () {},
            }));
      },
      closeCustomServiceDialog: function () {
        this.setData({
          customServiceDialogVisible: !1,
        });
      },
      onCustomServiceContentTap: function () {},
      onCustomServiceTouchMove: function () {},
      copyCustomServiceDouyinId: function () {
        wx.setClipboardData({
          data: '61939952210',
          success: function () {
            (wx.vibrateShort &&
              wx.vibrateShort({
                type: 'light',
                fail: function () {},
              }),
              wx.showToast({
                title: '抖音号已复制',
                icon: 'none',
              }));
          },
          fail: function () {
            wx.showToast({
              title: '复制失败，请重试',
              icon: 'none',
            });
          },
        });
      },
      syncHomeBootstrap: function () {
        var e = this;
        return i(
          a().mark(function t() {
            var o, n;
            return a().wrap(
              function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      if ((o = String(e.data.favoriteAnchorAccount || ''))) {
                        t.next = 3;
                        break;
                      }
                      return t.abrupt('return');

                    case 3:
                      if (!e.loadingHomeBootstrapPromise) {
                        t.next = 5;
                        break;
                      }
                      return t.abrupt('return', e.loadingHomeBootstrapPromise);

                    case 5:
                      return (
                        (n = i(
                          a().mark(function t() {
                            var i, n, r, u, l, d, m, h, p;
                            return a().wrap(
                              function (t) {
                                for (;;)
                                  switch ((t.prev = t.next)) {
                                    case 0:
                                      return ((t.prev = 0), (t.next = 3), c.fetchHomeBootstrap(o));

                                    case 3:
                                      if (((i = t.sent), o === e.data.favoriteAnchorAccount)) {
                                        t.next = 6;
                                        break;
                                      }
                                      return t.abrupt('return');

                                    case 6:
                                      return (
                                        (n = i && i.data ? i.data : {}),
                                        (r = n.notifications || {}),
                                        (u = r.live || {}),
                                        (l = r.leave || {}),
                                        (d = r.work || {}),
                                        (m = Number(u.quota || 0)),
                                        (h = Number(
                                          void 0 === u.shared_quota ? m : u.shared_quota
                                        )),
                                        (p = Boolean(u.enabled)),
                                        e.setData({
                                          notifyCount: m,
                                          sharedNotifyCount: h,
                                          pushEnabled: p,
                                          leaveNotifyCount: Number(l.quota || 0),
                                          leavePushEnabled: Boolean(l.enabled),
                                          leaveTemplateReady: Boolean(
                                            l.template_ready && s.LEAVE_SUBSCRIBE_TEMPLATE_ID
                                          ),
                                          workNotifyCount: Number(d.quota || 0),
                                          workPushEnabled: Boolean(d.enabled),
                                          workTemplateReady: Boolean(
                                            d.template_ready && s.WORK_SUBSCRIBE_TEMPLATE_ID
                                          ),
                                        }),
                                        wx.setStorageSync(b, m),
                                        wx.setStorageSync(v, p),
                                        (t.next = 19),
                                        e.loadMascotSkinState(n.mascot_skin || {})
                                      );

                                    case 19:
                                      t.next = 25;
                                      break;

                                    case 21:
                                      return (
                                        (t.prev = 21),
                                        (t.t0 = t.catch(0)),
                                        (t.next = 25),
                                        Promise.all([
                                          e.syncSubscription(),
                                          e.syncLeaveSubscription(),
                                          e.syncWorkSubscription(),
                                          e.loadMascotSkinState(),
                                        ])
                                      );

                                    case 25:
                                    case 'end':
                                      return t.stop();
                                  }
                              },
                              t,
                              null,
                              [[0, 21]]
                            );
                          })
                        )()),
                        (e.loadingHomeBootstrapPromise = n),
                        (t.prev = 7),
                        (t.next = 10),
                        n
                      );

                    case 10:
                      return t.abrupt('return', t.sent);

                    case 11:
                      return (
                        (t.prev = 11),
                        e.loadingHomeBootstrapPromise === n &&
                          (e.loadingHomeBootstrapPromise = null),
                        t.finish(11)
                      );

                    case 14:
                    case 'end':
                      return t.stop();
                  }
              },
              t,
              null,
              [[7, , 11, 14]]
            );
          })
        )();
      },
      syncSubscription: function () {
        var e = this;
        return i(
          a().mark(function t() {
            var i, o, n, r, u, l;
            return a().wrap(
              function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      if (s.API_BASE_URL && s.SUBSCRIBE_TEMPLATE_ID) {
                        t.next = 2;
                        break;
                      }
                      return t.abrupt('return');

                    case 2:
                      if ((i = String(e.data.favoriteAnchorAccount || ''))) {
                        t.next = 5;
                        break;
                      }
                      return t.abrupt('return');

                    case 5:
                      return ((t.prev = 5), (t.next = 8), c.fetchSubscription(i));

                    case 8:
                      ((o = t.sent),
                        (n = o && o.data ? o.data : {}),
                        (r = Number(n.quota || 0)),
                        (u = Number(void 0 === n.shared_quota ? r : n.shared_quota)),
                        (l = Boolean(n.enabled)),
                        e.setData({
                          notifyCount: r,
                          sharedNotifyCount: u,
                          pushEnabled: l,
                        }),
                        wx.setStorageSync(b, r),
                        wx.setStorageSync(v, l),
                        (t.next = 20));
                      break;

                    case 18:
                      ((t.prev = 18), (t.t0 = t.catch(5)));

                    case 20:
                    case 'end':
                      return t.stop();
                  }
              },
              t,
              null,
              [[5, 18]]
            );
          })
        )();
      },
      syncLeaveSubscription: function () {
        var e = this;
        return i(
          a().mark(function t() {
            var i, o;
            return a().wrap(
              function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      if (s.API_BASE_URL) {
                        t.next = 2;
                        break;
                      }
                      return t.abrupt('return');

                    case 2:
                      return ((t.prev = 2), (t.next = 5), c.fetchLeaveSubscription());

                    case 5:
                      ((i = t.sent),
                        (o = i && i.data ? i.data : {}),
                        e.setData({
                          leaveNotifyCount: Number(o.quota || 0),
                          leavePushEnabled: Boolean(o.enabled),
                          leaveTemplateReady: Boolean(
                            o.template_ready && s.LEAVE_SUBSCRIBE_TEMPLATE_ID
                          ),
                        }),
                        (t.next = 12));
                      break;

                    case 10:
                      ((t.prev = 10), (t.t0 = t.catch(2)));

                    case 12:
                    case 'end':
                      return t.stop();
                  }
              },
              t,
              null,
              [[2, 10]]
            );
          })
        )();
      },
      syncWorkSubscription: function () {
        var e = this;
        return i(
          a().mark(function t() {
            var i, o, n;
            return a().wrap(
              function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      if (s.API_BASE_URL && s.WORK_SUBSCRIBE_TEMPLATE_ID) {
                        t.next = 2;
                        break;
                      }
                      return t.abrupt('return');

                    case 2:
                      if ((i = String(e.data.favoriteAnchorAccount || ''))) {
                        t.next = 5;
                        break;
                      }
                      return t.abrupt('return');

                    case 5:
                      return ((t.prev = 5), (t.next = 8), c.fetchWorkSubscription(i));

                    case 8:
                      ((o = t.sent),
                        (n = o && o.data ? o.data : {}),
                        e.setData({
                          workNotifyCount: Number(n.quota || 0),
                          workPushEnabled: Boolean(n.enabled),
                          workTemplateReady: Boolean(
                            n.template_ready && s.WORK_SUBSCRIBE_TEMPLATE_ID
                          ),
                        }),
                        (t.next = 15));
                      break;

                    case 13:
                      ((t.prev = 13), (t.t0 = t.catch(5)));

                    case 15:
                    case 'end':
                      return t.stop();
                  }
              },
              t,
              null,
              [[5, 13]]
            );
          })
        )();
      },
      loadAdminCapabilities: function () {
        var e = this;
        return i(
          a().mark(function t() {
            var i, o;
            return a().wrap(
              function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      if (s.API_BASE_URL) {
                        t.next = 2;
                        break;
                      }
                      return t.abrupt('return');

                    case 2:
                      return ((t.prev = 2), (t.next = 5), c.ensureSession());

                    case 5:
                      if (
                        ((i = t.sent),
                        e.setSoftGoldPreviewAccess(Boolean(i && i.isAdmin)),
                        (o = i && i.adminCapabilities ? i.adminCapabilities : {}),
                        i.isAdmin && o.manual_notification)
                      ) {
                        t.next = 11;
                        break;
                      }
                      return (
                        e.setData({
                          isAdmin: !1,
                          manualPreview: null,
                        }),
                        t.abrupt('return')
                      );

                    case 11:
                      return (
                        e.setData({
                          isAdmin: !0,
                        }),
                        (t.next = 14),
                        e.loadManualPreview()
                      );

                    case 14:
                      return ((t.next = 16), e.loadLeavePending());

                    case 16:
                      t.next = 21;
                      break;

                    case 18:
                      ((t.prev = 18),
                        (t.t0 = t.catch(2)),
                        e.setData({
                          isAdmin: !1,
                          manualPreview: null,
                        }));

                    case 21:
                    case 'end':
                      return t.stop();
                  }
              },
              t,
              null,
              [[2, 18]]
            );
          })
        )();
      },
      loadLeavePending: function () {
        var e = this;
        return i(
          a().mark(function t() {
            var i, o;
            return a().wrap(
              function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      if (e.data.isAdmin) {
                        t.next = 2;
                        break;
                      }
                      return t.abrupt('return');

                    case 2:
                      return ((t.prev = 2), (t.next = 5), c.fetchLeavePending());

                    case 5:
                      ((i = t.sent),
                        (o = i && i.data ? i.data : {}),
                        e.setData({
                          leavePending: Boolean(o.pending),
                          leavePendingNote: o.leave && o.leave.note ? o.leave.note : '',
                        }),
                        (t.next = 13));
                      break;

                    case 10:
                      ((t.prev = 10),
                        (t.t0 = t.catch(2)),
                        e.setData({
                          leavePending: !1,
                        }));

                    case 13:
                    case 'end':
                      return t.stop();
                  }
              },
              t,
              null,
              [[2, 10]]
            );
          })
        )();
      },
      onLeaveNoteInput: function (e) {
        this.setData({
          leavePendingNote: String(e.detail.value || ''),
        });
      },
      onLeaveSend: function () {
        var e = this;
        return i(
          a().mark(function t() {
            var i, o;
            return a().wrap(
              function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      if (!e.data.sendingLeave) {
                        t.next = 2;
                        break;
                      }
                      return t.abrupt('return');

                    case 2:
                      if ((i = String(e.data.leavePendingNote || '').trim())) {
                        t.next = 6;
                        break;
                      }
                      return (
                        wx.showToast({
                          title: '请先填写请假备注',
                          icon: 'none',
                        }),
                        t.abrupt('return')
                      );

                    case 6:
                      return (
                        (t.next = 8),
                        new Promise(function (e) {
                          wx.showModal({
                            title: '发送请假通知',
                            content: '将向订阅用户发送请假通知，备注：'.concat(i),
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

                    case 8:
                      if (t.sent.confirm) {
                        t.next = 11;
                        break;
                      }
                      return t.abrupt('return');

                    case 11:
                      return (
                        e.setData({
                          sendingLeave: !0,
                        }),
                        (t.prev = 12),
                        (t.next = 15),
                        c.sendLeave(i)
                      );

                    case 15:
                      ((o = t.sent),
                        o && o.data ? o.data : {},
                        e.setData({
                          leavePending: !1,
                          leavePendingNote: '',
                        }),
                        wx.showToast({
                          title: '请假通知已发送',
                          icon: 'success',
                        }),
                        (t.next = 24));
                      break;

                    case 21:
                      ((t.prev = 21),
                        (t.t0 = t.catch(12)),
                        wx.showToast({
                          title: t.t0.message || '发送失败',
                          icon: 'none',
                        }));

                    case 24:
                      return (
                        (t.prev = 24),
                        e.setData({
                          sendingLeave: !1,
                        }),
                        t.finish(24)
                      );

                    case 27:
                    case 'end':
                      return t.stop();
                  }
              },
              t,
              null,
              [[12, 21, 24, 27]]
            );
          })
        )();
      },
      loadManualPreview: function () {
        var e = this;
        return i(
          a().mark(function t() {
            var i;
            return a().wrap(
              function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      if (e.data.isAdmin && !e.sendingManualNotification) {
                        t.next = 2;
                        break;
                      }
                      return t.abrupt('return');

                    case 2:
                      return (
                        (t.prev = 2),
                        (t.next = 5),
                        c.fetchManualNotificationPreview(e.data.anchor.account)
                      );

                    case 5:
                      ((i = t.sent),
                        e.setData({
                          manualPreview: i && i.data ? i.data : null,
                        }),
                        (t.next = 12));
                      break;

                    case 9:
                      ((t.prev = 9),
                        (t.t0 = t.catch(2)),
                        e.setData({
                          manualPreview: null,
                        }));

                    case 12:
                    case 'end':
                      return t.stop();
                  }
              },
              t,
              null,
              [[2, 9]]
            );
          })
        )();
      },
      startAutoRefresh: function () {
        var e = this;
        if (
          this.data.favoriteAnchorAccount &&
          ((this.autoRefreshEnabled = !0), !this.refreshTimer)
        ) {
          var t = 'live' === this.data.anchor.status ? P : C;
          this.refreshTimer = setTimeout(
            i(
              a().mark(function t() {
                return a().wrap(
                  function (t) {
                    for (;;)
                      switch ((t.prev = t.next)) {
                        case 0:
                          return (
                            (e.refreshTimer = null),
                            (t.prev = 1),
                            (t.next = 4),
                            e.loadStatus({
                              silent: !0,
                            })
                          );

                        case 4:
                          return (
                            (t.prev = 4),
                            e.autoRefreshEnabled && e.startAutoRefresh(),
                            t.finish(4)
                          );

                        case 7:
                        case 'end':
                          return t.stop();
                      }
                  },
                  t,
                  null,
                  [[1, , 4, 7]]
                );
              })
            ),
            t
          );
        }
      },
      stopAutoRefresh: function () {
        ((this.autoRefreshEnabled = !1),
          this.refreshTimer && (clearTimeout(this.refreshTimer), (this.refreshTimer = null)));
      },
      startMascotMotion: function () {
        this.mascotMotionActive ||
          ((this.mascotMotionActive = !0),
          this.setData({
            mascotMotionEnabled: !0,
          }),
          this.syncMascotState(this.data.anchor, !0),
          this.scheduleMascotMoment(8e3, 14e3));
      },
      stopMascotMotion: function () {
        (clearTimeout(this.mascotIntroTimer),
          clearTimeout(this.mascotStateSpeechTimer),
          clearTimeout(this.mascotTransitionTimer),
          clearInterval(this.mascotWaveTimer),
          clearInterval(this.mascotStateTimer),
          clearTimeout(this.mascotMomentTimer),
          clearTimeout(this.mascotBubbleTimer),
          (this.mascotIntroTimer = null),
          (this.mascotStateSpeechTimer = null),
          (this.mascotTransitionTimer = null),
          (this.mascotWaveTimer = null),
          (this.mascotStateTimer = null),
          (this.mascotMomentTimer = null),
          (this.mascotBubbleTimer = null),
          (this.mascotMotionActive = !1),
          this.data.mascotMotionEnabled &&
            this.setData({
              mascotMotionEnabled: !1,
            }),
          (this.mascotFrameTimers || []).forEach(function (e) {
            return clearTimeout(e);
          }),
          (this.mascotFrameTimers = []),
          (this.mascotAnimating = !1),
          (this.data.mascotWaving ||
            this.data.mascotTransitioning ||
            this.data.mascotBubbleVisible ||
            this.data.mascotFrame !== this.activeMascotFrames()[Q[this.data.mascotState][0]]) &&
            this.setData({
              mascotFrame: this.activeMascotFrames()[Q[this.data.mascotState][0]],
              mascotWaving: !1,
              mascotTransitioning: !1,
              mascotBubbleVisible: !1,
            }));
      },
      resolveMascotState: function (e) {
        if (
          this.data.isLocalDevelopment &&
          ['normal', 'leave', 'live'].includes(this.data.mascotPreviewMode)
        )
          return this.data.mascotPreviewMode;
        var t = this.activeMascotBinding();
        if (t) {
          var a = this.boundMascotAnchorStatus;
          return a && a.account === t.account && ('live' === a.status || 'live' === a.displayStatus)
            ? 'live'
            : 'normal';
        }
        return 'live' === e.status || 'live' === e.displayStatus
          ? 'live'
          : 'leave' === e.displayStatus || 'on_leave' === e.leaveStatus
            ? 'leave'
            : 'normal';
      },
      syncMascotState: function (e) {
        var t = this,
          a = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
          i = this.resolveMascotState(e),
          o = this.activeMascotFrames(),
          n = i !== this.data.mascotState;
        (a || n) &&
          (clearTimeout(this.mascotTransitionTimer),
          (this.mascotTransitionTimer = null),
          this.setData({
            mascotState: i,
            mascotStatusText: Y[i],
            mascotFrame: o[Q[i][0]],
            mascotWaving: !1,
            mascotTransitioning: n,
            zapPanelVisible: 'normal' === i && this.data.zapPanelVisible,
          }),
          n &&
            (this.mascotTransitionTimer = setTimeout(function () {
              (t.setData({
                mascotTransitioning: !1,
              }),
                (t.mascotTransitionTimer = null));
            }, 760)),
          this.mascotMotionActive && !this.data.zapActive && this.startMascotStateAnimation(i),
          clearTimeout(this.mascotStateSpeechTimer),
          n &&
            ['leave', 'live'].includes(i) &&
            (this.mascotStateSpeechTimer = setTimeout(function () {
              (t.showMascotBubble(), (t.mascotStateSpeechTimer = null));
            }, 420)));
      },
      onMascotPreviewChange: function (e) {
        var t = this;
        if (this.data.isLocalDevelopment) {
          var a = e.currentTarget.dataset.mode;
          ['auto', 'normal', 'leave', 'live'].includes(a) &&
            (clearTimeout(this.mascotBubbleTimer),
            this.setData(
              {
                mascotPreviewMode: a,
                mascotBubbleVisible: !1,
              },
              function () {
                return t.syncMascotState(t.data.anchor, !0);
              }
            ));
        }
      },
      startMascotStateAnimation: function (e) {
        var t = this;
        if (
          (clearTimeout(this.mascotIntroTimer),
          clearInterval(this.mascotWaveTimer),
          clearInterval(this.mascotStateTimer),
          (this.mascotFrameTimers || []).forEach(function (e) {
            return clearTimeout(e);
          }),
          (this.mascotFrameTimers = []),
          (this.mascotAnimating = !1),
          !['xiaoyu_moon_tide', 'ibo_starlight'].includes(this.data.selectedMascotSkin))
        ) {
          if ('normal' === e) {
            var a = 'siwuliu_ice' === this.data.selectedMascotSkin,
              i = a ? 7e3 : 900,
              o = a ? 2e4 : 7200;
            return (
              (this.mascotIntroTimer = setTimeout(function () {
                return t.playMascotIdleGesture();
              }, i)),
              void (this.mascotWaveTimer = setInterval(function () {
                return t.playMascotIdleGesture();
              }, o))
            );
          }
          var n = Q[e],
            r = this.activeMascotFrames(),
            s = 0,
            c =
              'live' === e && 'siwuliu_ice' === this.data.selectedMascotSkin
                ? 600
                : 'live' === e
                  ? 260
                  : 1050;
          this.mascotStateTimer = setInterval(function () {
            ((s = (s + 1) % n.length),
              t.setData({
                mascotFrame: r[n[s]],
              }));
          }, c);
        }
      },
      playMascotIdleGesture: function () {
        var e = this;
        if (!['xiaoyu_moon_tide', 'ibo_starlight'].includes(this.data.selectedMascotSkin))
          if ('siwuliu_ice' === this.data.selectedMascotSkin) {
            if (!this.mascotAnimating) {
              this.mascotAnimating = !0;
              var t = this.activeMascotFrames();
              this.setData({
                mascotFrame: t[1],
                mascotWaving: !1,
              });
              var a = setTimeout(function () {
                (e.setData({
                  mascotFrame: t[0],
                  mascotWaving: !1,
                }),
                  (e.mascotAnimating = !1),
                  (e.mascotFrameTimers = []));
              }, 4e3);
              this.mascotFrameTimers = [a];
            }
          } else this.playMascotWave();
      },
      playMascotWave: function () {
        var e = this;
        this.mascotAnimating ||
          ((this.mascotAnimating = !0),
          this.setData({
            mascotWaving: !0,
          }),
          this.playMascotSequence(X, 130, function () {
            e.setData({
              mascotWaving: !1,
            });
          }));
      },
      playMascotSequence: function (e, t, a) {
        var i = this,
          o = this.activeMascotFrames();
        this.mascotFrameTimers = e.map(function (n, r) {
          return setTimeout(function () {
            var t = r === e.length - 1;
            (i.setData({
              mascotFrame: o[n],
            }),
              t && ((i.mascotAnimating = !1), (i.mascotFrameTimers = []), a && a()));
          }, r * t);
        });
      },
      scheduleMascotMoment: function (e, t) {
        var a = this;
        clearTimeout(this.mascotMomentTimer);
        var i = e + Math.random() * (t - e);
        this.mascotMomentTimer = setTimeout(function () {
          (a.mascotAnimating || a.playMascotMoment(), a.scheduleMascotMoment(18e3, 32e3));
        }, i);
      },
      pickMascotSpeech: function () {
        var e =
            'xiaoyu_moon_tide' === this.data.selectedMascotSkin
              ? J
              : 'ibo_starlight' === this.data.selectedMascotSkin
                ? ee
                : $,
          t = e[this.data.mascotState] || e.normal,
          a = Math.floor(Math.random() * t.length),
          i = ''.concat(this.data.mascotState, ':').concat(a);
        return (
          t.length > 1 && i === this.lastMascotSpeechKey && (a = (a + 1) % t.length),
          (this.lastMascotSpeechKey = ''.concat(this.data.mascotState, ':').concat(a)),
          t[a]
        );
      },
      showMascotBubble: function (e) {
        var t = this;
        (clearTimeout(this.mascotBubbleTimer),
          this.setData({
            mascotBubbleText: e || this.pickMascotSpeech(),
            mascotBubbleVisible: !0,
          }),
          (this.mascotBubbleTimer = setTimeout(function () {
            (t.setData({
              mascotBubbleVisible: !1,
            }),
              (t.mascotBubbleTimer = null));
          }, 3200)));
      },
      playMascotMoment: function () {
        (this.showMascotBubble(),
          'normal' === this.data.mascotState && this.playMascotIdleGesture());
      },
      onMascotTap: function () {
        this.mascotAnimating ? this.showMascotBubble() : this.playMascotMoment();
      },
      loadStatus: function () {
        var e = this,
          t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          o = String(this.data.favoriteAnchorAccount || '');
        return o
          ? (this.loadingStatusPromise ||
              (t.silent ||
                this.setData({
                  loading: !0,
                }),
              this.setData({
                loadError: '',
              }),
              (this.loadingStatusPromise = i(
                a().mark(function t() {
                  var i, n, r, u, l, d, m, h, p, f, v, b;
                  return a().wrap(
                    function (t) {
                      for (;;)
                        switch ((t.prev = t.next)) {
                          case 0:
                            return ((t.prev = 0), (t.next = 3), c.fetchAnchorStatus(o));

                          case 3:
                            if (((i = t.sent), o === e.data.favoriteAnchorAccount)) {
                              t.next = 6;
                              break;
                            }
                            return t.abrupt('return');

                          case 6:
                            ((n = e.applyLocalHomeViewerPreview(i && i.data ? i.data : {})),
                              (r = n.leave_profile_text || ''),
                              (u = !0 === n.viewer_count_available),
                              (l = u ? Math.max(0, Number(n.viewer_count || 0)) : null),
                              (d = Boolean(e.loadedOnce)),
                              (m = e.data.anchor.viewerCountAvailable
                                ? Number(
                                    null == e.data.anchor.viewerCountDisplayValue
                                      ? e.data.anchor.viewerCount
                                      : e.data.anchor.viewerCountDisplayValue
                                  )
                                : 0),
                              (h = d ? m : l),
                              (p = {
                                account: n.account || o,
                                nickname: n.nickname || e.data.anchor.nickname || o,
                                initial: ne(n.nickname || e.data.anchor.nickname || o),
                                status: ['live', 'offline', 'unknown'].includes(n.status)
                                  ? n.status
                                  : 'unknown',
                                displayStatus: ['live', 'leave', 'offline', 'unknown'].includes(
                                  n.display_status
                                )
                                  ? n.display_status
                                  : ['live', 'offline', 'unknown'].includes(n.status)
                                    ? n.status
                                    : 'unknown',
                                leaveStatus: ['normal', 'on_leave', 'unknown'].includes(
                                  n.leave_status
                                )
                                  ? n.leave_status
                                  : 'unknown',
                                leaveProfileText: r,
                                leaveCopy: ie(r, n.leave_matched_keyword),
                                roomTitle: n.room_title || '',
                                roomId: String(n.room_id || ''),
                                avatarUrl: n.avatar_url || '',
                                startTime: n.start_time || null,
                                viewerCount: l,
                                viewerCountAvailable: u,
                                viewerCountDisplayValue: u ? Math.max(0, Number(h) || 0) : null,
                                viewerCountDisplay: u ? oe(h) : '',
                              }),
                              (f = e.data.favoriteAnchorOptions.find(function (e) {
                                return e.account === o;
                              })),
                              (p.avatarUrl = re(p.avatarUrl || (f && f.avatarUrl))),
                              (p.displayAccount = String((f && f.displayAccount) || o)),
                              n.local_viewer_preview || e.rememberLiveEvent(e.data.anchor, p),
                              (v = se(n.updated_at)),
                              (b = 'preview' === n.source || !s.API_BASE_URL),
                              e.setData({
                                anchor: p,
                                anchorDisplayAccount: p.displayAccount,
                                lastUpdatedText: v,
                                isPreview: b,
                              }),
                              d && e.animateHomeViewerCount(m, l),
                              e.syncMascotState(p),
                              e.refreshBoundMascotStatus(),
                              (e.loadedOnce = !0),
                              (e.lastLoadAt = Date.now()),
                              n.local_viewer_preview || e.persistHomeStatus(p, v, b),
                              (t.next = 32));
                            break;

                          case 29:
                            ((t.prev = 29),
                              (t.t0 = t.catch(0)),
                              e.setData({
                                loadError: t.t0.message || '状态获取失败',
                                lastUpdatedText: se(),
                              }));

                          case 32:
                            return (
                              (t.prev = 32),
                              (e.loadingStatusPromise = null),
                              e.setData({
                                loading: !1,
                              }),
                              t.finish(32)
                            );

                          case 36:
                          case 'end':
                            return t.stop();
                        }
                    },
                    t,
                    null,
                    [[0, 29, 32, 36]]
                  );
                })
              )())),
            this.loadingStatusPromise)
          : Promise.resolve(null);
      },
      applyLocalHomeViewerPreview: function (e) {
        return this.data.isLocalDevelopment && 'live' !== e.status
          ? ((this.localHomeViewerPreviewTick = (this.localHomeViewerPreviewTick || 0) + 1),
            o(
              o({}, e),
              {},
              {
                status: 'live',
                display_status: 'live',
                leave_status: 'normal',
                room_title: '',
                viewer_count_available: !0,
                viewer_count: 128642 + 211 * this.localHomeViewerPreviewTick,
                local_viewer_preview: !0,
              }
            ))
          : e;
      },
      animateHomeViewerCount: function (e, t) {
        var a = this;
        if ((this.stopHomeViewerCountAnimation(), null != t)) {
          var i = Math.max(0, Number(e) || 0),
            o = Math.max(0, Number(t) || 0);
          if (i !== o) {
            var n = Date.now();
            !(function e() {
              var t = Math.min(1, (Date.now() - n) / 600),
                r = 1 - Math.pow(1 - t, 3),
                s = t >= 1 ? o : Math.round(i + (o - i) * r);
              (a.setData({
                'anchor.viewerCountDisplayValue': s,
                'anchor.viewerCountDisplay': oe(s),
              }),
                (a.homeViewerCountTimer = t < 1 ? setTimeout(e, 100) : null));
            })();
          }
        }
      },
      stopHomeViewerCountAnimation: function () {
        this.homeViewerCountTimer &&
          (clearTimeout(this.homeViewerCountTimer), (this.homeViewerCountTimer = null));
      },
      rememberLiveEvent: function (e, t) {
        if (this.loadedOnce && 'live' !== e.status && 'live' === t.status) {
          var a = wx.getStorageSync(g) || [];
          (a.unshift({
            id: ''.concat(t.account, '-').concat(Date.now()),
            nickname: t.nickname,
            roomTitle: t.roomTitle || '开始开播',
            time: new Date().toLocaleString(),
          }),
            wx.setStorageSync(g, a.slice(0, 30)));
        }
      },
      onRefresh: function () {
        (this.loadStatus(), this.data.isAdmin && this.loadManualPreview());
      },
      onReminderModeChange: function (e) {
        var t = e.currentTarget.dataset.mode;
        ['live', 'leave', 'work'].includes(t) &&
          t !== this.data.reminderMode &&
          (this.setData({
            reminderMode: t,
          }),
          wx.vibrateShort &&
            wx.vibrateShort({
              type: 'light',
              fail: function () {},
            }));
      },
      onManualNotify: function () {
        var e = this;
        return i(
          a().mark(function t() {
            var i, o, n, r;
            return a().wrap(
              function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      if (!e.sendingManualNotification && e.data.manualPreview) {
                        t.next = 2;
                        break;
                      }
                      return t.abrupt('return');

                    case 2:
                      if (
                        ((i = e.data.manualPreview),
                        !((o = Number(i.cooldown_remaining_seconds || 0)) > 0))
                      ) {
                        t.next = 7;
                        break;
                      }
                      return (
                        wx.showToast({
                          title: '请在 '.concat(o, ' 秒后重试'),
                          icon: 'none',
                        }),
                        t.abrupt('return')
                      );

                    case 7:
                      return (
                        (t.next = 9),
                        new Promise(function (t) {
                          wx.showModal({
                            title: '确认手动通知',
                            content: '将向 '
                              .concat(Number(i.eligible_count || 0), ' 位用户发送“')
                              .concat(
                                e.data.anchor.nickname,
                                '开播”提醒，并扣除各用户一次通知额度。'
                              ),
                            confirmText: '确认发送',
                            confirmColor: '#c52f2f',
                            cancelText: '取消',
                            success: t,
                            fail: function () {
                              return t({
                                confirm: !1,
                              });
                            },
                          });
                        })
                      );

                    case 9:
                      if (t.sent.confirm) {
                        t.next = 12;
                        break;
                      }
                      return t.abrupt('return');

                    case 12:
                      return (
                        (e.sendingManualNotification = !0),
                        e.setData({
                          sendingManualNotification: !0,
                        }),
                        (t.prev = 14),
                        (t.next = 17),
                        c.sendManualNotification({
                          anchor_account: e.data.anchor.account,
                          idempotency_key:
                            ((a = void 0),
                            (a = Math.random().toString(36).slice(2, 12)),
                            'manual_'.concat(Date.now(), '_').concat(a)),
                          confirmation: 'SEND',
                        })
                      );

                    case 17:
                      return (
                        (n = t.sent),
                        (r = n && n.data ? n.data : {}),
                        wx.showModal({
                          title: '通知已进入队列',
                          content: '已排队 '.concat(Number(r.queued_count || 0), ' 条通知。'),
                          showCancel: !1,
                          confirmText: '知道了',
                        }),
                        (e.sendingManualNotification = !1),
                        e.setData({
                          sendingManualNotification: !1,
                        }),
                        (t.next = 24),
                        e.loadManualPreview()
                      );

                    case 24:
                      t.next = 29;
                      break;

                    case 26:
                      ((t.prev = 26),
                        (t.t0 = t.catch(14)),
                        wx.showToast({
                          title: t.t0.message || '手动通知失败',
                          icon: 'none',
                        }));

                    case 29:
                      return (
                        (t.prev = 29),
                        (e.sendingManualNotification = !1),
                        e.setData({
                          sendingManualNotification: !1,
                        }),
                        t.finish(29)
                      );

                    case 33:
                    case 'end':
                      return t.stop();
                  }
                var a;
              },
              t,
              null,
              [[14, 26, 29, 33]]
            );
          })
        )();
      },
      onTogglePush: function (e) {
        var t = this;
        return i(
          a().mark(function i() {
            var o, n, r;
            return a().wrap(
              function (a) {
                for (;;)
                  switch ((a.prev = a.next)) {
                    case 0:
                      if (
                        ((o = e.detail.value),
                        t.setData({
                          pushEnabled: o,
                        }),
                        wx.setStorageSync(v, o),
                        s.API_BASE_URL && s.SUBSCRIBE_TEMPLATE_ID)
                      ) {
                        a.next = 5;
                        break;
                      }
                      return a.abrupt('return');

                    case 5:
                      return (
                        (a.prev = 5),
                        (a.next = 8),
                        c.setSubscriptionEnabled(o, t.data.favoriteAnchorAccount)
                      );

                    case 8:
                      ((n = a.sent),
                        (r = n && n.data ? n.data : {}),
                        t.setData({
                          pushEnabled: Boolean(r.enabled),
                          notifyCount: Number(r.quota || 0),
                          sharedNotifyCount: Number(
                            void 0 === r.shared_quota ? r.quota || 0 : r.shared_quota
                          ),
                        }),
                        (a.next = 18));
                      break;

                    case 13:
                      ((a.prev = 13),
                        (a.t0 = a.catch(5)),
                        t.setData({
                          pushEnabled: !o,
                        }),
                        wx.setStorageSync(v, !o),
                        wx.showToast({
                          title: a.t0.message || '设置保存失败',
                          icon: 'none',
                        }));

                    case 18:
                    case 'end':
                      return a.stop();
                  }
              },
              i,
              null,
              [[5, 13]]
            );
          })
        )();
      },
      onToggleLeavePush: function (e) {
        var t = this;
        return i(
          a().mark(function i() {
            var o, n, r;
            return a().wrap(
              function (a) {
                for (;;)
                  switch ((a.prev = a.next)) {
                    case 0:
                      if (((o = e.detail.value), t.data.leaveTemplateReady)) {
                        a.next = 3;
                        break;
                      }
                      return a.abrupt('return');

                    case 3:
                      return (
                        t.setData({
                          leavePushEnabled: o,
                        }),
                        (a.prev = 4),
                        (a.next = 7),
                        c.setLeaveSubscriptionEnabled(o)
                      );

                    case 7:
                      ((n = a.sent),
                        (r = n && n.data ? n.data : {}),
                        t.setData({
                          leavePushEnabled: Boolean(r.enabled),
                          leaveNotifyCount: Number(r.quota || 0),
                        }),
                        (a.next = 16));
                      break;

                    case 12:
                      ((a.prev = 12),
                        (a.t0 = a.catch(4)),
                        t.setData({
                          leavePushEnabled: !o,
                        }),
                        wx.showToast({
                          title: a.t0.message || '设置保存失败',
                          icon: 'none',
                        }));

                    case 16:
                    case 'end':
                      return a.stop();
                  }
              },
              i,
              null,
              [[4, 12]]
            );
          })
        )();
      },
      onToggleWorkPush: function (e) {
        var t = this;
        return i(
          a().mark(function i() {
            var o, n, r;
            return a().wrap(
              function (a) {
                for (;;)
                  switch ((a.prev = a.next)) {
                    case 0:
                      if (((o = e.detail.value), t.data.workTemplateReady)) {
                        a.next = 3;
                        break;
                      }
                      return a.abrupt('return');

                    case 3:
                      return (
                        t.setData({
                          workPushEnabled: o,
                        }),
                        (a.prev = 4),
                        (a.next = 7),
                        c.setWorkSubscriptionEnabled(o, t.data.favoriteAnchorAccount)
                      );

                    case 7:
                      ((n = a.sent),
                        (r = n && n.data ? n.data : {}),
                        t.setData({
                          workPushEnabled: Boolean(r.enabled),
                          workNotifyCount: Number(r.quota || 0),
                        }),
                        (a.next = 16));
                      break;

                    case 12:
                      ((a.prev = 12),
                        (a.t0 = a.catch(4)),
                        t.setData({
                          workPushEnabled: !o,
                        }),
                        wx.showToast({
                          title: a.t0.message || '设置保存失败',
                          icon: 'none',
                        }));

                    case 16:
                    case 'end':
                      return a.stop();
                  }
              },
              i,
              null,
              [[4, 12]]
            );
          })
        )();
      },
      playNotificationSuccess: function (t, a, i) {
        var o,
          n = this;
        clearTimeout(this.notificationSuccessTimer);
        var r = {
            shared: 'sharedNotifyPreviousCount',
            live: 'notifyPreviousCount',
            leave: 'leaveNotifyPreviousCount',
            work: 'workNotifyPreviousCount',
          },
          s = r[t] || r.live;
        (this.setData(
          (e((o = {}), s, Math.max(0, Number(a) || 0)),
          e(o, 'notificationSuccessMode', ''),
          e(o, 'notificationRollingMode', ''),
          o)
        ),
          wx.nextTick(function () {
            (n.setData({
              notificationSuccessMode: t,
              notificationRollingMode: Number(i) !== Number(a) ? t : '',
            }),
              (n.notificationSuccessTimer = setTimeout(function () {
                (n.setData({
                  notificationSuccessMode: '',
                  notificationRollingMode: '',
                }),
                  (n.notificationSuccessTimer = null));
              }, 820)));
          }));
      },
      onAddLeaveNotify: function () {
        var e = this;
        return i(
          a().mark(function t() {
            var i, o, n, r, u;
            return a().wrap(
              function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      if (!e.data.addingLeaveNotify && e.data.leaveTemplateReady) {
                        t.next = 2;
                        break;
                      }
                      return t.abrupt('return');

                    case 2:
                      if (!(e.data.leaveNotifyCount >= 200)) {
                        t.next = 5;
                        break;
                      }
                      return (
                        wx.showToast({
                          title: '请假提醒次数已达上限',
                          icon: 'none',
                        }),
                        t.abrupt('return')
                      );

                    case 5:
                      return (
                        e.setData({
                          addingLeaveNotify: !0,
                        }),
                        (t.prev = 6),
                        (t.next = 9),
                        c.ensureSession()
                      );

                    case 9:
                      return (
                        (i = s.LEAVE_SUBSCRIBE_TEMPLATE_ID),
                        (t.next = 12),
                        new Promise(function (e, t) {
                          wx.requestSubscribeMessage({
                            tmplIds: [i],
                            success: e,
                            fail: t,
                          });
                        })
                      );

                    case 12:
                      if ('accept' === t.sent[i]) {
                        t.next = 16;
                        break;
                      }
                      return (
                        wx.showToast({
                          title: '未获得请假提醒授权',
                          icon: 'none',
                        }),
                        t.abrupt('return')
                      );

                    case 16:
                      return (
                        (t.next = 18),
                        c.registerLeaveSubscription({
                          anchor_account: s.ANCHOR.account,
                          template_id: i,
                        })
                      );

                    case 18:
                      ((o = t.sent),
                        (n = o && o.data ? o.data : {}),
                        (r = e.data.leaveNotifyCount),
                        (u = Number(n.quota || r + 1)),
                        e.setData(
                          {
                            leaveNotifyCount: u,
                            leavePushEnabled: !0,
                          },
                          function () {
                            e.playNotificationSuccess('leave', r, u);
                          }
                        ),
                        wx.showToast({
                          title: '已增加一次请假提醒',
                          icon: 'success',
                        }),
                        (t.next = 29));
                      break;

                    case 26:
                      ((t.prev = 26),
                        (t.t0 = t.catch(6)),
                        wx.showToast({
                          title: t.t0.errMsg || t.t0.message || '订阅失败',
                          icon: 'none',
                        }));

                    case 29:
                      return (
                        (t.prev = 29),
                        e.setData({
                          addingLeaveNotify: !1,
                        }),
                        t.finish(29)
                      );

                    case 32:
                    case 'end':
                      return t.stop();
                  }
              },
              t,
              null,
              [[6, 26, 29, 32]]
            );
          })
        )();
      },
      onAddAllNotifications: function () {
        var e = this;
        return i(
          a().mark(function t() {
            var i, o, n, r, u, l, d, m, h, p, f, g;
            return a().wrap(
              function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      if (!e.data.addingAllNotify) {
                        t.next = 2;
                        break;
                      }
                      return t.abrupt('return');

                    case 2:
                      if (!(Number(e.data.sharedNotifyCount || 0) >= 200)) {
                        t.next = 5;
                        break;
                      }
                      return (
                        wx.showToast({
                          title: '提醒次数已达上限',
                          icon: 'none',
                        }),
                        t.abrupt('return')
                      );

                    case 5:
                      if (
                        (i = [
                          {
                            type: 'live',
                            templateId: s.SUBSCRIBE_TEMPLATE_ID,
                            ready: Boolean(s.SUBSCRIBE_TEMPLATE_ID),
                            count: Number(e.data.notifyCount || 0),
                            countField: 'notifyCount',
                            enabledField: 'pushEnabled',
                          },
                          {
                            type: 'leave',
                            templateId: s.LEAVE_SUBSCRIBE_TEMPLATE_ID,
                            ready: Boolean(e.data.leaveTemplateReady),
                            count: Number(e.data.leaveNotifyCount || 0),
                            countField: 'leaveNotifyCount',
                            enabledField: 'leavePushEnabled',
                          },
                          {
                            type: 'work',
                            templateId: s.WORK_SUBSCRIBE_TEMPLATE_ID,
                            ready: Boolean(e.data.workTemplateReady),
                            count: Number(e.data.workNotifyCount || 0),
                            countField: 'workNotifyCount',
                            enabledField: 'workPushEnabled',
                          },
                        ].filter(function (e) {
                          return e.ready && e.templateId;
                        })).length
                      ) {
                        t.next = 9;
                        break;
                      }
                      return (
                        wx.showToast({
                          title: '提醒次数已达上限',
                          icon: 'none',
                        }),
                        t.abrupt('return')
                      );

                    case 9:
                      return (
                        e.setData({
                          addingAllNotify: !0,
                        }),
                        (t.prev = 10),
                        (t.next = 13),
                        c.ensureSession()
                      );

                    case 13:
                      return (
                        (t.next = 15),
                        new Promise(function (e, t) {
                          wx.requestSubscribeMessage({
                            tmplIds: i.map(function (e) {
                              return e.templateId;
                            }),
                            success: e,
                            fail: t,
                          });
                        })
                      );

                    case 15:
                      if (
                        ((o = t.sent),
                        (n = i.filter(function (e) {
                          return 'accept' === o[e.templateId];
                        })).length)
                      ) {
                        t.next = 20;
                        break;
                      }
                      return (
                        wx.showToast({
                          title: '未获得提醒授权',
                          icon: 'none',
                        }),
                        t.abrupt('return')
                      );

                    case 20:
                      return (
                        (r = {}),
                        n.forEach(function (e) {
                          r[e.type] = e.templateId;
                        }),
                        (t.next = 24),
                        c.registerNotificationBundle({
                          anchor_account: e.data.favoriteAnchorAccount,
                          leave_anchor_account: s.ANCHOR.account,
                          templates: r,
                        })
                      );

                    case 24:
                      ((u = t.sent),
                        (l = u && u.data ? u.data : {}),
                        (d = l.subscriptions || {}),
                        (m = {}),
                        (h = {}),
                        n.forEach(function (t) {
                          var a = d[t.type] || {},
                            i = Number(a.quota),
                            o = Number.isFinite(i) ? i : Math.min(200, t.count + 1);
                          ((m[t.countField] = o),
                            (m[t.enabledField] =
                              void 0 === a.enabled
                                ? Boolean(e.data[t.enabledField])
                                : Boolean(a.enabled)),
                            (h[t.type] = {
                              previousCount: t.count,
                              nextCount: o,
                            }));
                        }),
                        (p = Number(e.data.sharedNotifyCount || 0)),
                        (f = Number(l.shared_quota)),
                        (g = Number.isFinite(f) ? f : Math.min(200, p + 1)),
                        (m.sharedNotifyCount = g),
                        e.setData(m, function () {
                          e.playNotificationSuccess('shared', p, g);
                        }),
                        h.live &&
                          (wx.setStorageSync(b, h.live.nextCount),
                          wx.setStorageSync(v, m.pushEnabled)),
                        n.length < i.length &&
                          wx.showToast({
                            title: '已新增，部分提醒未授权',
                            icon: 'none',
                          }),
                        (t.next = 42));
                      break;

                    case 39:
                      ((t.prev = 39),
                        (t.t0 = t.catch(10)),
                        wx.showToast({
                          title: t.t0.errMsg || t.t0.message || '订阅失败',
                          icon: 'none',
                        }));

                    case 42:
                      return (
                        (t.prev = 42),
                        e.setData({
                          addingAllNotify: !1,
                        }),
                        t.finish(42)
                      );

                    case 45:
                    case 'end':
                      return t.stop();
                  }
              },
              t,
              null,
              [[10, 39, 42, 45]]
            );
          })
        )();
      },
      onAddWorkNotify: function () {
        var e = this;
        return i(
          a().mark(function t() {
            var i, o, n, r, u;
            return a().wrap(
              function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      if (!e.data.addingWorkNotify && e.data.workTemplateReady) {
                        t.next = 2;
                        break;
                      }
                      return t.abrupt('return');

                    case 2:
                      if (!(e.data.workNotifyCount >= 200)) {
                        t.next = 5;
                        break;
                      }
                      return (
                        wx.showToast({
                          title: '作品提醒次数已达上限',
                          icon: 'none',
                        }),
                        t.abrupt('return')
                      );

                    case 5:
                      return (
                        e.setData({
                          addingWorkNotify: !0,
                        }),
                        (t.prev = 6),
                        (t.next = 9),
                        c.ensureSession()
                      );

                    case 9:
                      return (
                        (i = s.WORK_SUBSCRIBE_TEMPLATE_ID),
                        (t.next = 12),
                        new Promise(function (e, t) {
                          wx.requestSubscribeMessage({
                            tmplIds: [i],
                            success: e,
                            fail: t,
                          });
                        })
                      );

                    case 12:
                      if ('accept' === t.sent[i]) {
                        t.next = 16;
                        break;
                      }
                      return (
                        wx.showToast({
                          title: '未获得作品提醒授权',
                          icon: 'none',
                        }),
                        t.abrupt('return')
                      );

                    case 16:
                      return (
                        (t.next = 18),
                        c.registerWorkSubscription({
                          anchor_account: e.data.favoriteAnchorAccount,
                          template_id: i,
                        })
                      );

                    case 18:
                      ((o = t.sent),
                        (n = o && o.data ? o.data : {}),
                        (r = e.data.workNotifyCount),
                        (u = Number(n.quota || r + 1)),
                        e.setData(
                          {
                            workNotifyCount: u,
                            workPushEnabled: !0,
                          },
                          function () {
                            e.playNotificationSuccess('work', r, u);
                          }
                        ),
                        wx.showToast({
                          title: '已增加一次作品提醒',
                          icon: 'success',
                        }),
                        (t.next = 29));
                      break;

                    case 26:
                      ((t.prev = 26),
                        (t.t0 = t.catch(6)),
                        wx.showToast({
                          title: t.t0.errMsg || t.t0.message || '订阅失败',
                          icon: 'none',
                        }));

                    case 29:
                      return (
                        (t.prev = 29),
                        e.setData({
                          addingWorkNotify: !1,
                        }),
                        t.finish(29)
                      );

                    case 32:
                    case 'end':
                      return t.stop();
                  }
              },
              t,
              null,
              [[6, 26, 29, 32]]
            );
          })
        )();
      },
      onAddNotify: function () {
        var e = this;
        return i(
          a().mark(function t() {
            var i, o, n, r;
            return a().wrap(
              function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      if (!e.addingNotify) {
                        t.next = 2;
                        break;
                      }
                      return t.abrupt('return');

                    case 2:
                      if (!(e.data.notifyCount >= 200)) {
                        t.next = 5;
                        break;
                      }
                      return (
                        wx.showToast({
                          title: '推送次数已达上限',
                          icon: 'none',
                        }),
                        t.abrupt('return')
                      );

                    case 5:
                      if (s.SUBSCRIBE_TEMPLATE_ID) {
                        t.next = 8;
                        break;
                      }
                      return (
                        wx.showModal({
                          title: '还差一步配置',
                          content:
                            '请先在微信公众平台申请“开播提醒”订阅消息模板，并把模板 ID 填入 config/env.js。',
                          showCancel: !1,
                          confirmText: '知道了',
                        }),
                        t.abrupt('return')
                      );

                    case 8:
                      return (
                        (e.addingNotify = !0),
                        e.setData({
                          addingNotify: !0,
                        }),
                        (t.prev = 10),
                        (t.next = 13),
                        c.ensureSession()
                      );

                    case 13:
                      return (
                        (t.next = 15),
                        new Promise(function (e, t) {
                          wx.requestSubscribeMessage({
                            tmplIds: [s.SUBSCRIBE_TEMPLATE_ID],
                            success: e,
                            fail: t,
                          });
                        })
                      );

                    case 15:
                      if ('accept' === t.sent[s.SUBSCRIBE_TEMPLATE_ID]) {
                        t.next = 19;
                        break;
                      }
                      return (
                        wx.showToast({
                          title: '未获得提醒授权',
                          icon: 'none',
                        }),
                        t.abrupt('return')
                      );

                    case 19:
                      return (
                        (t.next = 21),
                        c.registerSubscription({
                          anchor_account: e.data.favoriteAnchorAccount,
                          template_id: s.SUBSCRIBE_TEMPLATE_ID,
                        })
                      );

                    case 21:
                      ((i = t.sent),
                        (o = i && i.data ? i.data : {}),
                        (n = e.data.notifyCount),
                        (r = Number(o.quota || e.data.notifyCount + 1)),
                        e.setData(
                          {
                            notifyCount: r,
                            pushEnabled: !0,
                          },
                          function () {
                            e.playNotificationSuccess('live', n, r);
                          }
                        ),
                        wx.setStorageSync(b, r),
                        wx.setStorageSync(v, !0),
                        wx.showToast({
                          title: '已增加一次推送',
                          icon: 'success',
                        }),
                        (t.next = 34));
                      break;

                    case 31:
                      ((t.prev = 31),
                        (t.t0 = t.catch(10)),
                        wx.showToast({
                          title: t.t0.errMsg || t.t0.message || '订阅失败',
                          icon: 'none',
                        }));

                    case 34:
                      return (
                        (t.prev = 34),
                        (e.addingNotify = !1),
                        e.setData({
                          addingNotify: !1,
                        }),
                        t.finish(34)
                      );

                    case 38:
                    case 'end':
                      return t.stop();
                  }
              },
              t,
              null,
              [[10, 31, 34, 38]]
            );
          })
        )();
      },
      onAvatarError: function () {
        this.setData({
          'anchor.avatarUrl': '',
        });
      },
    }
  )
);
