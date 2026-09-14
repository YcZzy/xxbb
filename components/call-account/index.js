'use strict';

var e = require('../../@babel/runtime/helpers/toConsumableArray');

require('../../@babel/runtime/helpers/Arrayincludes');

var a = require('../../@babel/runtime/helpers/regeneratorRuntime'),
  t = require('../../@babel/runtime/helpers/asyncToGenerator'),
  r = require('../../@babel/runtime/helpers/objectSpread2'),
  n = require('../../services/api'),
  i = require('../../services/call-broadcast'),
  s = require('../../utils/performance-mode'),
  l = require('../../utils/session-scope'),
  o = require('../../utils/remote-art'),
  c = function (e) {
    return String(Math.max(0, Math.floor(Number(e) || 0))).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },
  u = [
    '初见',
    '微光',
    '闪耀',
    '星辉',
    '星耀',
    '星河',
    '紫晶',
    '冰晶',
    '红宝石',
    '蓝金棱镜',
    '月光石',
    '黑曜双轨',
    '钻石星冕',
  ],
  d = function (e) {
    return u.map(function (a, t) {
      var r = (Array.isArray(e.levels) ? e.levels : []).find(function (e) {
          return e && e.level === t;
        }),
        n = Boolean(r && Number.isFinite(r.experience) && r.experience >= 0);
      return {
        level: t,
        title: (r && r.title) || a,
        available: n,
        experienceText: n ? c(r.experience) + ' 经验' : '',
        earned: n && t <= e.level,
        current: n && t === e.level,
        status: n ? (t === e.level ? '当前等级' : t < e.level ? '已点亮' : '未点亮') : '待开放',
      };
    });
  },
  p = function (e, a) {
    return (e && Array.isArray(e.levels) ? e.levels : []).reduce(function (e, t) {
      return Number.isInteger(t.level) && t.level > a && (null === e || t.level < e) ? t.level : e;
    }, null);
  };

Component({
  properties: {
    theme: {
      type: String,
      value: 'classic',
    },
  },
  data: {
    inlineArt: {},
    performanceClass: s.className(),
    foreground: !0,
    headerVisible: !0,
    profile: null,
    profileLoading: !0,
    profileError: '',
    coinEnabled: !1,
    balance: null,
    balanceText: '--',
    balanceLoading: !1,
    balanceError: '',
    balanceCredited: !1,
    coinVisible: !0,
    balanceDigits: [
      {
        index: 'initial-0',
        from: '-',
        to: '-',
      },
      {
        index: 'initial-1',
        from: '-',
        to: '-',
      },
    ],
    balanceAnimating: !1,
    balanceFontSize: 32,
    experienceText: '--',
    nextExperienceText: '--',
    remainingText: '--',
    progress: 0,
    entranceReady: !1,
    displayProgress: 0,
    displayLevel: 0,
    displayTitle: '',
    displayNextLevel: null,
    rankItems: [],
    rankCompleteText: '已点亮全部等级',
    previewRankLevel: -1,
    previewRankVariant: 'a',
    rankSources: Array.from(
      {
        length: 13,
      },
      function (e, a) {
        return '/assets/images/remote-fallback/rank' + a + '.png';
      }
    ),
    panel: '',
    preferencesVisible: !1,
    nicknameDraft: '',
    saving: !1,
    saveError: '',
    upgraded: !1,
    rechargeVisible: !1,
  },
  lifetimes: {
    attached: function () {
      this.load();
    },
    ready: function () {
      this.observeHeader();
    },
    detached: function () {
      ((this.disposed = !0),
        this.clearMotionTimers(),
        this.headerObserver && this.headerObserver.disconnect(),
        this.coinObserver && this.coinObserver.disconnect());
    },
  },
  pageLifetimes: {
    show: function () {
      (this.setData({
        foreground: !0,
      }),
        this.load());
    },
    hide: function () {
      (this.clearMotionTimers(),
        this.setData({
          foreground: !1,
          upgraded: !1,
          previewRankLevel: -1,
          displayLevel: this.data.profile ? this.data.profile.level : 0,
          displayNextLevel: p(this.data.profile, this.data.profile ? this.data.profile.level : 0),
          displayTitle: this.data.profile ? this.data.profile.title : '',
          displayProgress: this.data.progress,
        }),
        this.presentBalance(this.data.balance, !1));
    },
  },
  methods: r(
    r({}, require('../../utils/inline-artwork')),
    {},
    {
      observeHeader: function () {
        var e = this;
        this.createIntersectionObserver &&
          !this.disposed &&
          ((this.headerObserver = this.createIntersectionObserver({
            thresholds: [0],
          })),
          this.headerObserver.relativeToViewport().observe('.account', function (a) {
            if (!e.disposed) {
              var t = a.intersectionRatio > 0;
              t !== e.data.headerVisible &&
                e.setData({
                  headerVisible: t,
                });
            }
          }),
          (this.coinObserver = this.createIntersectionObserver({
            thresholds: [0],
          })),
          this.coinObserver.relativeToViewport().observe('.wallet-coin-stage', function (a) {
            if (!e.disposed) {
              var t = a.intersectionRatio > 0;
              t !== e.data.coinVisible &&
                e.setData({
                  coinVisible: t,
                  balanceCredited: !1,
                });
            }
          }));
      },
      clearMotionTimers: function () {
        (clearTimeout(this.balanceTimer),
          clearTimeout(this.levelTimer),
          clearTimeout(this.levelFillTimer),
          clearTimeout(this.entranceTimer));
      },
      syncAccountScope: function (e) {
        (void 0 !== this.accountScope &&
          this.accountScope !== e &&
          (this.clearMotionTimers(),
          (this.walletFresh = null),
          (this.walletRequest = null),
          this.setData({
            profile: null,
            coinEnabled: !1,
            balance: null,
            balanceLoading: !1,
            balanceError: '',
            profileError: '',
            panel: '',
            preferencesVisible: !1,
            rechargeVisible: !1,
            upgraded: !1,
            displayProgress: 0,
            displayLevel: 0,
            displayNextLevel: null,
            displayTitle: '',
            rankItems: [],
            previewRankLevel: -1,
          }),
          this.presentBalance(null, !1)),
          (this.accountScope = e));
      },
      load: function () {
        var e = this;
        return t(
          a().mark(function t() {
            var r, i, s, o, c;
            return a().wrap(
              function (a) {
                for (;;)
                  switch ((a.prev = a.next)) {
                    case 0:
                      if (
                        ((r = l.current()),
                        !(e.disposed || (e.profileRequest && e.profileRequest.scope === r)))
                      ) {
                        a.next = 3;
                        break;
                      }
                      return a.abrupt('return');

                    case 3:
                      return (
                        e.syncAccountScope(r),
                        (i = e.profileRequest =
                          {
                            scope: r,
                          }),
                        (s = function () {
                          return !e.disposed && e.profileRequest === i && i.scope === l.current();
                        }),
                        e.setData({
                          profileLoading: !e.data.profile,
                          profileError: '',
                        }),
                        (a.prev = 7),
                        (a.next = 10),
                        n.ensureSession()
                      );

                    case 10:
                      if (!e.disposed && e.profileRequest === i) {
                        a.next = 12;
                        break;
                      }
                      return a.abrupt('return');

                    case 12:
                      return (
                        (i.scope = l.current()),
                        e.syncAccountScope(i.scope),
                        (a.next = 16),
                        n.fetchMyCallProfile()
                      );

                    case 16:
                      if (((o = a.sent), s())) {
                        a.next = 19;
                        break;
                      }
                      return a.abrupt('return');

                    case 19:
                      if (
                        (e.applyProfile(o.data),
                        e.setData({
                          coinEnabled: !0 === o.data.coin_enabled,
                        }),
                        !o.data.coin_enabled)
                      ) {
                        a.next = 24;
                        break;
                      }
                      return (
                        (a.next = 24),
                        e.refreshBalance({
                          force: !1,
                        })
                      );

                    case 24:
                      a.next = 45;
                      break;

                    case 26:
                      if (((a.prev = 26), (a.t0 = a.catch(7)), s())) {
                        a.next = 30;
                        break;
                      }
                      return a.abrupt('return');

                    case 30:
                      return (
                        e.setData({
                          profileError: ['NOT_FOUND', 'API_NOT_FOUND'].includes(a.t0.code)
                            ? '个人资料接口待上线'
                            : a.t0.message || '个人信息暂不可用',
                        }),
                        (a.prev = 31),
                        (a.next = 34),
                        n.fetchLoveCallCenter()
                      );

                    case 34:
                      if (((c = a.sent), s())) {
                        a.next = 37;
                        break;
                      }
                      return a.abrupt('return');

                    case 37:
                      if (
                        (e.setData({
                          coinEnabled: !0 === c.data.coin_enabled,
                        }),
                        !c.data.coin_enabled)
                      ) {
                        a.next = 41;
                        break;
                      }
                      return (
                        (a.next = 41),
                        e.refreshBalance({
                          force: !1,
                        })
                      );

                    case 41:
                      a.next = 45;
                      break;

                    case 43:
                      ((a.prev = 43), (a.t1 = a.catch(31)));

                    case 45:
                      return (
                        (a.prev = 45),
                        e.profileRequest === i &&
                          ((e.profileRequest = null),
                          e.disposed ||
                            e.setData({
                              profileLoading: !1,
                            })),
                        a.finish(45)
                      );

                    case 48:
                    case 'end':
                      return a.stop();
                  }
              },
              t,
              null,
              [
                [7, 26, 45, 48],
                [31, 43],
              ]
            );
          })
        )();
      },
      applyProfile: function (e) {
        var a = this,
          t = this.data.profile,
          r = Boolean(t && t.public_id === e.public_id),
          n = Boolean(
            r && e.level > t.level && this.data.foreground && !this.data.performanceClass
          ),
          s = Math.max(0, Math.min(100, Number(e.progress) || 0));
        (clearTimeout(this.levelTimer),
          clearTimeout(this.levelFillTimer),
          clearTimeout(this.entranceTimer),
          t &&
            !r &&
            ((this.walletFresh = null),
            (this.walletRequest = null),
            this.setData({
              balance: null,
              balanceLoading: !1,
              balanceError: '',
            }),
            this.presentBalance(null, !1)),
          this.setData({
            profile: e,
            experienceText: c(e.experience),
            nextExperienceText: c(e.next_experience),
            remainingText: c(e.remaining),
            rankItems: d(e),
            rankCompleteText: e.level < u.length - 1 ? '已达当前开放最高等级' : '已点亮全部等级',
            progress: s,
            upgraded: !1,
            entranceReady: !0,
            displayLevel: n ? t.level : e.level,
            displayNextLevel: p(e, n ? t.level : e.level),
            displayTitle: n ? t.title : e.title,
            displayProgress: n ? 100 : s,
          }),
          n &&
            (this.levelFillTimer = setTimeout(function () {
              !a.disposed &&
                a.data.foreground &&
                (a.setData({
                  displayLevel: e.level,
                  displayTitle: e.title,
                  displayNextLevel: p(e, e.level),
                  displayProgress: s,
                  upgraded: !0,
                }),
                (a.levelTimer = setTimeout(function () {
                  a.disposed ||
                    a.setData({
                      upgraded: !1,
                    });
                }, 1400)));
            }, 760)),
          i.setEnabled(e.show_broadcasts),
          this.loadRankArtwork([e.level, p(e, e.level)]));
      },
      loadRankArtwork: function (a) {
        var t = this;
        if (!this.disposed && this.data.foreground) {
          var r = e(
            new Set(
              a.filter(function (e) {
                return Number.isInteger(e) && e >= 0 && e < u.length;
              })
            )
          );
          if (r.length) {
            var n = r.map(function (e) {
              return 'rank' + e;
            });
            return o
              .loadGroup(n)
              .then(function (a) {
                if (!t.disposed && t.data.foreground) {
                  var n = e(t.data.rankSources);
                  (r.forEach(function (e, t) {
                    n[e] = a[t];
                  }),
                    t.setData({
                      rankSources: n,
                    }));
                }
              })
              .catch(function () {});
          }
        }
      },
      onRankArtworkError: function (a) {
        var t = Number(a.currentTarget.dataset.level);
        if (!(!Number.isInteger(t) || t < 0 || t >= u.length)) {
          var r = o.fallback('rank' + t);
          if (this.data.rankSources[t] !== r) {
            o.invalidate('rank' + t);
            var n = e(this.data.rankSources);
            ((n[t] = r),
              this.setData({
                rankSources: n,
              }));
          }
        }
      },
      presentBalance: function (e, a) {
        var t = this,
          r = null === e ? '--' : c(e);
        if (r !== this.data.balanceText || this.data.balanceAnimating) {
          clearTimeout(this.balanceTimer);
          var n = Number(this.data.balanceText.replace(/,/g, '')),
            i = Boolean(
              a &&
              this.data.foreground &&
              this.data.coinVisible &&
              !this.data.performanceClass &&
              Number.isFinite(n) &&
              e > n
            ),
            s = this.data.balanceText.padStart(r.length, '0'),
            l = (this.balanceRevision = (this.balanceRevision || 0) + 1),
            o = Array.from(r).map(function (e, t) {
              return {
                index: l + '-' + t,
                to: e,
                from: a && ',' !== e ? s[t] || '0' : e,
              };
            });
          (this.setData({
            balanceText: r,
            balanceDigits: o,
            balanceAnimating: a,
            balanceCredited: i,
            balanceFontSize:
              r.length > 16 ? 10 : r.length > 12 ? 13 : r.length > 8 ? 18 : r.length > 6 ? 28 : 32,
          }),
            a &&
              (this.balanceTimer = setTimeout(function () {
                t.disposed ||
                  t.setData({
                    balanceAnimating: !1,
                    balanceCredited: !1,
                  });
              }, 660)));
        }
      },
      refreshBalance: function () {
        var e = arguments,
          r = this;
        return t(
          a().mark(function t() {
            var i, s, o, c, u, d, p, h, f;
            return a().wrap(
              function (a) {
                for (;;)
                  switch ((a.prev = a.next)) {
                    case 0:
                      if (((i = e.length > 0 && void 0 !== e[0] ? e[0] : {}), !r.disposed)) {
                        a.next = 3;
                        break;
                      }
                      return a.abrupt('return');

                    case 3:
                      if (((s = l.current()), void 0 === r.accountScope || r.accountScope === s)) {
                        a.next = 6;
                        break;
                      }
                      return a.abrupt('return', r.load());

                    case 6:
                      if (((r.accountScope = s), r.data.coinEnabled)) {
                        a.next = 9;
                        break;
                      }
                      return a.abrupt('return');

                    case 9:
                      if (
                        ((o = n.getCoinWalletRevision()),
                        (c = r.walletFresh),
                        !(
                          !1 === i.force &&
                          null !== r.data.balance &&
                          c &&
                          c.scope === s &&
                          c.revision === o &&
                          Date.now() - c.at < 3e4
                        ))
                      ) {
                        a.next = 13;
                        break;
                      }
                      return a.abrupt('return');

                    case 13:
                      if (
                        !r.walletRequest ||
                        r.walletRequest.scope !== s ||
                        r.walletRequest.revision !== o
                      ) {
                        a.next = 15;
                        break;
                      }
                      return a.abrupt('return');

                    case 15:
                      return (
                        (u = r.walletRequest =
                          {
                            scope: s,
                            revision: o,
                          }),
                        (d = function () {
                          return !r.disposed && r.walletRequest === u && s === l.current();
                        }),
                        r.setData({
                          balanceLoading: !0,
                          balanceError: '',
                        }),
                        (a.prev = 18),
                        (a.next = 21),
                        n.fetchMyCoinWallet()
                      );

                    case 21:
                      if (((p = a.sent), d())) {
                        a.next = 24;
                        break;
                      }
                      return a.abrupt('return');

                    case 24:
                      if (o === n.getCoinWalletRevision()) {
                        a.next = 26;
                        break;
                      }
                      throw new Error('余额状态已变化');

                    case 26:
                      if (((h = p.data.balance), Number.isSafeInteger(h) && !(h < 0))) {
                        a.next = 29;
                        break;
                      }
                      throw new Error('余额暂不可用');

                    case 29:
                      ((f = r.data.balance),
                        (r.walletFresh = {
                          scope: s,
                          revision: o,
                          at: Date.now(),
                        }),
                        r.setData({
                          balance: h,
                        }),
                        r.presentBalance(
                          h,
                          Boolean(
                            null !== f && r.data.foreground && !r.data.performanceClass && f !== h
                          )
                        ),
                        (a.next = 38));
                      break;

                    case 35:
                      ((a.prev = 35),
                        (a.t0 = a.catch(18)),
                        d() &&
                          ((r.walletFresh = null),
                          r.setData({
                            balanceError:
                              null === r.data.balance
                                ? a.t0.message || '余额暂不可用'
                                : '余额未同步，当前显示上次结果',
                          })));

                    case 38:
                      return (
                        (a.prev = 38),
                        r.walletRequest === u &&
                          ((r.walletRequest = null),
                          r.disposed ||
                            r.setData({
                              balanceLoading: !1,
                            })),
                        a.finish(38)
                      );

                    case 41:
                    case 'end':
                      return a.stop();
                  }
              },
              t,
              null,
              [[18, 35, 38, 41]]
            );
          })
        )();
      },
      openNickname: function () {
        this.data.profile &&
          (this.touchFeedback(),
          this.setData({
            panel: 'nickname',
            nicknameDraft: this.data.profile.nickname,
            saveError: '',
          }));
      },
      editNickname: function (e) {
        this.setData({
          nicknameDraft: e.detail.value,
          saveError: '',
        });
      },
      saveNickname: function () {
        var e = this;
        return t(
          a().mark(function t() {
            var r, i;
            return a().wrap(
              function (a) {
                for (;;)
                  switch ((a.prev = a.next)) {
                    case 0:
                      if (!e.data.saving && e.data.profile && e.data.profile.can_rename) {
                        a.next = 2;
                        break;
                      }
                      return a.abrupt('return');

                    case 2:
                      if (
                        ((r = e.data.nicknameDraft.trim()),
                        !(Array.from(r).length < 2 || Array.from(r).length > 12))
                      ) {
                        a.next = 6;
                        break;
                      }
                      return (
                        e.setData({
                          saveError: '昵称需为2至12个字符',
                        }),
                        a.abrupt('return')
                      );

                    case 6:
                      return (
                        e.setData({
                          saving: !0,
                          saveError: '',
                        }),
                        (a.prev = 7),
                        (a.next = 10),
                        n.updateMyCallProfile({
                          nickname: r,
                        })
                      );

                    case 10:
                      if (((i = a.sent), !e.disposed)) {
                        a.next = 13;
                        break;
                      }
                      return a.abrupt('return');

                    case 13:
                      (e.applyProfile(i.data),
                        e.setData({
                          panel: '',
                        }),
                        wx.vibrateShort &&
                          wx.vibrateShort({
                            type: 'light',
                            fail: function () {},
                          }),
                        (a.next = 21));
                      break;

                    case 18:
                      ((a.prev = 18),
                        (a.t0 = a.catch(7)),
                        e.disposed ||
                          e.setData({
                            saveError: a.t0.message || '昵称未保存，请重试',
                          }));

                    case 21:
                      return (
                        (a.prev = 21),
                        e.disposed ||
                          e.setData({
                            saving: !1,
                          }),
                        a.finish(21)
                      );

                    case 24:
                    case 'end':
                      return a.stop();
                  }
              },
              t,
              null,
              [[7, 18, 21, 24]]
            );
          })
        )();
      },
      openLevels: function () {
        this.data.profile &&
          (this.touchFeedback(),
          this.setData({
            panel: 'levels',
            saveError: '',
            previewRankLevel: -1,
          }),
          this.loadRankArtwork(
            u.map(function (e, a) {
              return a;
            })
          ));
      },
      previewRank: function (e) {
        var a = Number(e.currentTarget.dataset.level);
        this.disposed ||
          !this.data.foreground ||
          'levels' !== this.data.panel ||
          !Number.isInteger(a) ||
          a < 0 ||
          a >= u.length ||
          (this.touchFeedback(),
          this.data.performanceClass ||
            this.setData({
              previewRankLevel: a,
              previewRankVariant: 'a' === this.data.previewRankVariant ? 'b' : 'a',
            }));
      },
      openSettings: function () {
        (this.touchFeedback(),
          this.setData({
            preferencesVisible: !0,
          }));
      },
      closePreferences: function () {
        this.setData({
          preferencesVisible: !1,
        });
      },
      preferencesProfile: function (e) {
        ((this.profileRequest = null),
          this.applyProfile(e.detail.profile),
          this.setData({
            profileLoading: !1,
            profileError: '',
          }));
      },
      touchFeedback: function () {
        wx.vibrateShort &&
          wx.vibrateShort({
            type: 'light',
            fail: function () {},
          });
      },
      close: function () {
        this.data.saving ||
          this.setData({
            panel: '',
            saveError: '',
            previewRankLevel: -1,
          });
      },
      noop: function () {},
      recharge: function () {
        this.data.coinEnabled &&
          this.setData({
            rechargeVisible: !0,
          });
      },
      closeRecharge: function () {
        this.setData({
          rechargeVisible: !1,
        });
      },
      rechargeDelivered: function () {
        return (
          (this.walletFresh = null),
          this.setData({
            rechargeVisible: !1,
          }),
          this.refreshBalance()
        );
      },
      records: function () {
        ((this.walletFresh = null),
          wx.navigateTo({
            url: '/pages/wallet-records/wallet-records',
          }));
      },
    }
  ),
});
