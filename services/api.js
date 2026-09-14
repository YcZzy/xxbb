'use strict';

require('../@babel/runtime/helpers/Arrayincludes');

var e = require('../@babel/runtime/helpers/typeof'),
  t = require('../@babel/runtime/helpers/objectSpread2'),
  n = require('../config/env'),
  o = null,
  r = null,
  a = 0,
  c = 0,
  i = Object.create(null);

function u(e, t, n) {
  var o = Date.now(),
    r = e.startsWith('user:'),
    a = r ? h() : null,
    c = a ? a.token : '',
    u = i[e],
    d = !r || (c && u && u.scope === c) ? u : null;
  if (d && void 0 !== d.data && o - d.cachedAt < t) return Promise.resolve(d.data);
  if (d && d.promise) return d.promise;
  var s = n()
    .then(function (t) {
      if (i[e] && i[e].promise === s) {
        var n = r ? h() : null;
        i[e] = {
          data: t,
          scope: n ? n.token : '',
          cachedAt: Date.now(),
          promise: null,
        };
      }
      return t;
    })
    .catch(function (t) {
      throw (i[e] && i[e].promise === s && delete i[e], t);
    });
  return (
    (i[e] = {
      scope: c,
      data: d ? d.data : void 0,
      cachedAt: d ? d.cachedAt : 0,
      promise: s,
    }),
    s
  );
}

function d() {
  var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : '';
  Object.keys(i).forEach(function (t) {
    (e && !t.startsWith(e)) || delete i[t];
  });
}

function s(e) {
  return (d('user:home-bootstrap:'), d('user:subscriptions'), e);
}

function l(e) {
  return new Promise(function (n, o) {
    wx.request(
      t(
        t(
          {
            timeout: 1e4,
          },
          e
        ),
        {},
        {
          success: function (e) {
            if (e.statusCode >= 200 && e.statusCode < 300) n(e.data);
            else {
              var t = e.data || {},
                r = new Error(t.message || '服务返回 '.concat(e.statusCode));
              ((r.statusCode = e.statusCode), (r.code = t.code || 'REQUEST_FAILED'), o(r));
            }
          },
          fail: function (e) {
            var t = new Error(e.errMsg || '网络连接失败');
            ((t.code = 'NETWORK_ERROR'), o(t));
          },
        }
      )
    );
  });
}

function _() {
  var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : n.ANCHOR;
  return {
    code: 0,
    data: {
      account: e.account,
      nickname: e.nickname,
      status: 'offline',
      display_status: 'offline',
      leave_status: 'normal',
      leave_profile_text: '',
      room_id: '',
      room_title: '',
      room_cover_url: '',
      avatar_url: '',
      start_time: null,
      updated_at: Math.floor(Date.now() / 1e3),
      source: 'preview',
    },
  };
}

function h() {
  var e = wx.getStorageSync('miniappApiSession');
  return !e ||
    !e.token ||
    'boolean' != typeof e.isAdmin ||
    Number(e.expiresAt || 0) <= Date.now() / 1e3 + 60
    ? null
    : e;
}

function f() {
  (R(), wx.removeStorageSync('miniappApiSession'), d('user:'));
}

function p(e) {
  var t = e;
  if (!t)
    try {
      var n =
          'function' == typeof wx.getEnterOptionsSync
            ? wx.getEnterOptionsSync()
            : 'function' == typeof wx.getLaunchOptionsSync
              ? wx.getLaunchOptionsSync()
              : {},
        o = n.query || {};
      'pages/card-pack/card-pack' !== n.path ||
        o.card ||
        o.preview ||
        'collection' === o.view ||
        (t = o.invite);
    } catch (e) {}
  return 'string' == typeof t && /^[a-f0-9]{32}$/.test(t)
    ? {
        card_pack_invite: t,
      }
    : {};
}

function v(r) {
  return Promise.resolve(
    h() ||
      (function (r) {
        return (
          o ||
          (n.API_BASE_URL
            ? (o = new Promise(function (e, t) {
                wx.login({
                  success: function (n) {
                    n.code ? e(n.code) : t(new Error('微信登录未返回有效凭证'));
                  },
                  fail: function (e) {
                    t(new Error(e.errMsg || '微信登录失败'));
                  },
                });
              })
                .then(function (e) {
                  return l({
                    url: ''.concat(n.API_BASE_URL, '/api/v1/wechat/login'),
                    method: 'POST',
                    data: t(
                      {
                        code: e,
                      },
                      p(r)
                    ),
                  });
                })
                .then(function (t) {
                  var n = t && t.data ? t.data : {};
                  if (!n.token) throw new Error('服务器未返回登录令牌');
                  var o = {
                    token: n.token,
                    expiresAt: Number(n.expires_at || 0),
                    isAdmin: Boolean(n.is_admin),
                    adminCapabilities:
                      n.admin_capabilities && 'object' === e(n.admin_capabilities)
                        ? n.admin_capabilities
                        : {},
                  };
                  return (wx.setStorageSync('miniappApiSession', o), o);
                })
                .finally(function () {
                  o = null;
                }))
            : Promise.reject(new Error('后端 API 尚未配置')))
        );
      })(r)
  );
}

function m(e) {
  var n = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
  return v()
    .then(function (n) {
      return l(
        t(
          t({}, e),
          {},
          {
            header: t(
              t({}, e.header || {}),
              {},
              {
                Authorization: 'Bearer '.concat(n.token),
              }
            ),
          }
        )
      ).then(function (e) {
        var t = h();
        if (!t || t.token !== n.token) {
          var o = new Error('登录状态已变化，请重新加载');
          throw ((o.code = 'SESSION_CHANGED'), o);
        }
        return e;
      });
    })
    .catch(function (t) {
      if (n && 401 === t.statusCode) return (f(), m(e, !1));
      throw t;
    });
}

function A(e, t, n) {
  return v().then(function (o) {
    return u('user:'.concat(e, ':').concat(o.token), t, function () {
      return m(n);
    });
  });
}

function P() {
  return n.API_BASE_URL
    ? A('anchors', 1500, {
        url: ''.concat(n.API_BASE_URL, '/api/v1/anchors'),
        method: 'GET',
      })
    : Promise.resolve({
        code: 0,
        data: {
          items: [_(n.ANCHOR).data],
        },
      });
}

function E() {
  var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : '',
    t = arguments.length > 1 ? arguments[1] : void 0,
    o = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 'POST',
    r = 'GET' !== o && /\/(confirm|cancel)$/.test(e);
  return (
    r && (c++, R()),
    m({
      url: ''.concat(n.API_BASE_URL, '/api/v1/love-call-center').concat(e),
      method: o,
      data: t,
    })
      .then(function (e) {
        return (
          e.data &&
            'delivered' === e.data.status &&
            'digest_tip' !== e.data.kind &&
            (d('user:anchors:'), d('user:call-anchors:')),
          e
        );
      })
      .finally(function () {
        r && (c--, R());
      })
  );
}

var S = function (e) {
  return E('/wallet', {
    login_code: e,
  });
};

function R() {
  (a++, (r = null));
}

function I() {
  if (c)
    return Promise.reject(
      Object.assign(new Error('支付结果正在更新，请稍后刷新余额'), {
        code: 'WALLET_STALE',
      })
    );
  var e = h();
  if (!e)
    return v().then(function () {
      return I();
    });
  var t = e.token,
    n = a;
  if (r && r.scope === t && r.generation === n) return r.promise;
  var o = function () {
      var e = h();
      if (!e || e.token !== t || n !== a) {
        var o = new Error('余额状态已变化，请刷新后查看');
        throw ((o.code = 'WALLET_STALE'), o);
      }
    },
    i = {
      scope: t,
      generation: n,
    };
  return (
    (i.promise = B()
      .then(function (e) {
        return (o(), S(e));
      })
      .then(function (e) {
        return (o(), e);
      })
      .finally(function () {
        r === i && (r = null);
      })),
    (r = i),
    i.promise
  );
}

function U() {
  var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : '',
    t = arguments.length > 1 ? arguments[1] : void 0,
    o = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 'POST',
    r = 'GET' !== o && /\/confirm$/.test(e);
  return (
    r && (c++, R()),
    m({
      url: ''.concat(n.API_BASE_URL, '/api/v1/favorite-anchor-purchases').concat(e),
      method: o,
      data: t,
      timeout: 6e4,
    })
      .then(function (e) {
        return (
          e.data &&
            ['delivered', 'already_exists'].includes(e.data.status) &&
            (d('user:anchors:'), d('user:call-anchors:'), s(e), d('user:daily-digest:')),
          e
        );
      })
      .finally(function () {
        r && (c--, R());
      })
  );
}

var L = function (e, t, o) {
  return m({
    url: ''.concat(n.API_BASE_URL, '/api/v1/favorite-anchor-purchases/lookup').concat(e),
    method: o,
    data: t,
    timeout: 1e4,
  });
};

function g() {
  var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
  if (!n.API_BASE_URL)
    return Promise.resolve({
      code: 0,
      data: {
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
        preview: !0,
        sponsor_rewards: {
          xiaoyu_moon_tide: {
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
        },
        theme_campaign: {
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
          preview: !0,
        },
      },
    });
  var t = function () {
    return m({
      url: ''.concat(n.API_BASE_URL, '/api/v1/mascot-skins/me'),
      method: 'GET',
    });
  };
  return e.fresh ? t() : u('user:mascot-skin', 1e4, t);
}

function B() {
  return new Promise(function (e, t) {
    wx.login({
      success: function (n) {
        n.code ? e(n.code) : t(new Error('微信登录未返回支付凭证'));
      },
      fail: function (e) {
        t(new Error(e.errMsg || '微信登录失败'));
      },
    });
  });
}

module.exports = {
  recycleCards: function (e) {
    return m({
      url: ''.concat(n.API_BASE_URL, '/api/v1/card-packs/fragments/recycle'),
      method: 'POST',
      data: e,
    });
  },
  drawFragmentCards: function (e) {
    return m({
      url: ''.concat(n.API_BASE_URL, '/api/v1/card-packs/fragments/draw'),
      method: 'POST',
      data: e,
    });
  },
  revealFragmentDraw: function (e) {
    return m({
      url: ''.concat(n.API_BASE_URL, '/api/v1/card-packs/fragments/reveal'),
      method: 'POST',
      data: {
        operation_id: e,
      },
    });
  },
  fetchCardPacks: function () {
    return m({
      url: ''.concat(n.API_BASE_URL, '/api/v1/card-packs/me'),
      method: 'GET',
    });
  },
  prepareCardInvitation: function () {
    return m({
      url: ''.concat(n.API_BASE_URL, '/api/v1/card-packs/invitation'),
      method: 'POST',
    });
  },
  acceptCardInvitation: function (e) {
    return m({
      url: ''.concat(n.API_BASE_URL, '/api/v1/card-packs/invitation/accept'),
      method: 'POST',
      data: {
        code: e,
      },
    });
  },
  claimCardInvitation: function (e) {
    return m({
      url: ''.concat(n.API_BASE_URL, '/api/v1/card-packs/invitation/claim'),
      method: 'POST',
      data: {
        code: e,
      },
    });
  },
  openCardPack: function (e, t) {
    return m({
      url: ''.concat(n.API_BASE_URL, '/api/v1/card-packs/open'),
      method: 'POST',
      data: {
        request_key: e,
        pack_id: t,
      },
    });
  },
  revealCardPack: function (e) {
    return m({
      url: ''.concat(n.API_BASE_URL, '/api/v1/card-packs/reveal'),
      method: 'POST',
      data: {
        draw_id: e,
      },
    });
  },
  revealCardPurchase: function (e) {
    return m({
      url: ''.concat(n.API_BASE_URL, '/api/v1/card-packs/purchase/reveal'),
      method: 'POST',
      data: {
        order_id: e,
      },
    });
  },
  fetchLotteries: function () {
    return m({
      url: ''.concat(n.API_BASE_URL, '/api/v1/lotteries'),
      method: 'GET',
    });
  },
  ensureSession: v,
  fetchAnchorStatus: function () {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : n.ANCHOR.account,
      t =
        e === n.ANCHOR.account
          ? n.ANCHOR
          : {
              account: e,
              nickname: e,
            };
    return n.API_BASE_URL
      ? m({
          url: ''
            .concat(n.API_BASE_URL, '/api/v1/anchors/')
            .concat(encodeURIComponent(e), '/status'),
          method: 'GET',
        })
      : Promise.resolve(_(t));
  },
  fetchAnchors: P,
  fetchCallAnchors: function () {
    return n.API_BASE_URL
      ? A('call-anchors', 1500, {
          url: ''.concat(n.API_BASE_URL, '/api/v1/love-call-center/anchors'),
          method: 'GET',
        })
      : P();
  },
  fetchLiveArchives: function (e, t) {
    var o = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 60;
    if (!n.API_BASE_URL) return Promise.reject(new Error('后端 API 尚未配置'));
    var r = Math.max(12, Math.min(Number(o) || 60, 120)),
      a = [
        'account='.concat(encodeURIComponent(e || '')),
        'date='.concat(encodeURIComponent(t || '')),
        'max_points='.concat(r),
      ].join('&');
    return A('live-archives:'.concat(a), 5e3, {
      url: ''.concat(n.API_BASE_URL, '/api/v1/live-archives?').concat(a),
      method: 'GET',
    });
  },
  fetchStarlightTimeline: function (e, t) {
    var o = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
    if (!n.API_BASE_URL) return Promise.reject(new Error('后端 API 尚未配置'));
    var r = [
        'account='.concat(encodeURIComponent(e || '')),
        'date='.concat(encodeURIComponent(t || '')),
      ].join('&'),
      a = {
        url: ''.concat(n.API_BASE_URL, '/api/v1/starlight-timeline?').concat(r),
        method: 'GET',
      };
    return A('starlight-timeline:'.concat(r), o.fresh ? 0 : 5e3, a);
  },
  fetchDailyDigest: function () {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : '',
      t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
    if (!n.API_BASE_URL) return Promise.reject(new Error('后端 API 尚未配置'));
    var o = [];
    (e && o.push('date='.concat(encodeURIComponent(e))), t.compact && o.push('compact=1'));
    var r = o.length ? '?'.concat(o.join('&')) : '',
      a = 'user:daily-digest:'.concat(e || 'latest', ':').concat(t.compact ? 'compact' : 'full');
    return u(a, t.fresh ? 0 : 1e4, function () {
      return m({
        url: ''.concat(n.API_BASE_URL, '/api/v1/daily-digest').concat(r),
        method: 'GET',
      });
    });
  },
  markDailyDigestRead: function (e) {
    return m({
      url: ''.concat(n.API_BASE_URL, '/api/v1/daily-digest/read'),
      method: 'POST',
      data: {
        date: e || '',
      },
    }).then(function (e) {
      return (d('user:daily-digest:'), e);
    });
  },
  fetchHomePopup: function () {
    return n.API_BASE_URL
      ? u('public:home-popup', 15e3, function () {
          return l({
            url: ''.concat(n.API_BASE_URL, '/api/v1/home-popup'),
            method: 'GET',
          });
        })
      : Promise.resolve({
          code: 0,
          data: {
            version: 0,
            title: '',
            content: '',
            button_text: '',
            enabled: !1,
            updated_at: 0,
          },
        });
  },
  fetchFeatureVisibility: function () {
    return n.API_BASE_URL
      ? u('public:features', 15e3, function () {
          return l({
            url: ''.concat(n.API_BASE_URL, '/api/v1/features'),
            method: 'GET',
          });
        })
      : Promise.resolve({
          code: 0,
          data: {
            mascot_theme_collection: !1,
          },
        });
  },
  fetchReplayAccounts: function () {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : '';
    if (!n.API_BASE_URL)
      return Promise.resolve({
        code: 0,
        data: {
          items: [],
          total: 0,
        },
      });
    var t = e ? '?platform='.concat(encodeURIComponent(e)) : '';
    return u('public:replay-accounts:'.concat(e), 3e4, function () {
      return l({
        url: ''.concat(n.API_BASE_URL, '/api/v1/replay-accounts').concat(t),
        method: 'GET',
      });
    });
  },
  submitLoveCall: function (e) {
    return m({
      url: ''.concat(n.API_BASE_URL, '/api/v1/love-calls'),
      method: 'POST',
      data: e,
    }).then(function (e) {
      return (d('user:mascot-skin'), d('user:anchors:'), d('user:call-anchors:'), e);
    });
  },
  fetchLoveCallCenter: function () {
    return E('', void 0, 'GET');
  },
  fetchLoveCallHistory: function () {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : '';
    return E('/paid-history?limit=20&cursor='.concat(encodeURIComponent(e)), void 0, 'GET');
  },
  fetchMyCallProfile: function () {
    return m({
      url: ''.concat(n.API_BASE_URL, '/api/v1/call-community/me'),
      method: 'GET',
    });
  },
  updateMyCallProfile: function (e) {
    return m({
      url: ''.concat(n.API_BASE_URL, '/api/v1/call-community/me'),
      method: 'POST',
      data: e,
    });
  },
  fetchCallChannel: function () {
    return m({
      url: ''.concat(n.API_BASE_URL, '/api/v1/call-community/channel'),
      method: 'POST',
      data: {},
    });
  },
  fetchMyCoinWallet: I,
  getCoinWalletRevision: function () {
    return a;
  },
  fetchDigestTip: function (e) {
    return E('/digest-tip/'.concat(encodeURIComponent(e)), void 0, 'GET');
  },
  fetchLoveCallOrder: function (e) {
    return E('/orders/'.concat(encodeURIComponent(e)), void 0, 'GET');
  },
  loveCallWallet: S,
  createLoveCallOrder: function (e) {
    return E('/orders', e);
  },
  loveCallPayData: function (e, t) {
    return E('/orders/'.concat(encodeURIComponent(e), '/pay-data'), {
      login_code: t,
    });
  },
  confirmLoveCallOrder: function (e, t) {
    return E('/orders/'.concat(encodeURIComponent(e), '/confirm'), {
      login_code: t,
    });
  },
  cancelLoveCallOrder: function (e) {
    return E('/orders/'.concat(encodeURIComponent(e), '/cancel'), {});
  },
  retryLoveCallOrder: function (e) {
    return E('/orders/'.concat(encodeURIComponent(e), '/retry'), {});
  },
  fetchMascotSkinState: g,
  fetchVirtualProducts: function () {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
    if (!n.API_BASE_URL)
      return Promise.resolve({
        code: 0,
        data: {
          configured: !1,
          items: [],
        },
      });
    var t = function () {
      return m({
        url: ''.concat(n.API_BASE_URL, '/api/v1/virtual-pay/products'),
        method: 'GET',
      });
    };
    return e.fresh ? t() : u('user:virtual-products', 1e4, t);
  },
  createVirtualPaymentOrder: function (e) {
    return n.API_BASE_URL
      ? B().then(function (t) {
          return m({
            url: ''.concat(n.API_BASE_URL, '/api/v1/virtual-pay/orders'),
            method: 'POST',
            data: {
              product_code: String(e || ''),
              login_code: t,
            },
          });
        })
      : Promise.reject(new Error('后端 API 尚未配置'));
  },
  fetchVirtualPaymentOrder: function (e) {
    return m({
      url: ''.concat(n.API_BASE_URL, '/api/v1/virtual-pay/orders/').concat(encodeURIComponent(e)),
      method: 'GET',
    });
  },
  reconcileVirtualPaymentOrder: function (e) {
    return m({
      url: ''
        .concat(n.API_BASE_URL, '/api/v1/virtual-pay/orders/')
        .concat(encodeURIComponent(e), '/reconcile'),
      method: 'POST',
      data: {},
    });
  },
  fetchHomeBootstrap: function () {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : n.ANCHOR.account;
    return n.API_BASE_URL
      ? u('user:home-bootstrap:'.concat(e), 1e4, function () {
          return m({
            url: ''
              .concat(n.API_BASE_URL, '/api/v1/home-bootstrap?anchor_account=')
              .concat(encodeURIComponent(e)),
            method: 'GET',
          });
        })
      : g().then(function (t) {
          return {
            code: 0,
            data: {
              anchor_account: e,
              notifications: {
                live: {
                  quota: 0,
                  enabled: !1,
                },
                leave: {
                  quota: 0,
                  enabled: !1,
                  template_ready: !1,
                },
                work: {
                  quota: 0,
                  enabled: !1,
                  template_ready: !1,
                },
              },
              mascot_skin: t && t.data ? t.data : {},
              generated_at: Math.floor(Date.now() / 1e3),
            },
          };
        });
  },
  fetchFanBadgeState: function () {
    return n.API_BASE_URL
      ? u('user:fan-badges', 1e4, function () {
          return m({
            url: ''.concat(n.API_BASE_URL, '/api/v1/fan-badges/me'),
            method: 'GET',
          });
        })
      : Promise.resolve({
          code: 0,
          data: {
            current: null,
            eligible: [],
            threshold: 1e4,
          },
        });
  },
  claimFanBadge: function (e) {
    return m({
      url: ''.concat(n.API_BASE_URL, '/api/v1/fan-badges/claim'),
      method: 'POST',
      data: {
        anchor_account: e,
      },
    }).then(function (e) {
      return (d('user:fan-badges'), e);
    });
  },
  fetchAnchorEvents: function () {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : n.ANCHOR.account,
      t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1e3;
    if (!n.API_BASE_URL)
      return Promise.resolve({
        code: 0,
        data: {
          items: [],
        },
      });
    var o = Math.max(1, Math.min(Number(t) || 1e3, 1e3));
    return m({
      url: ''
        .concat(n.API_BASE_URL, '/api/v1/anchors/')
        .concat(encodeURIComponent(e), '/events?limit=')
        .concat(o),
      method: 'GET',
    });
  },
  fetchSubscription: function () {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : n.ANCHOR.account;
    return m({
      url: ''
        .concat(n.API_BASE_URL, '/api/v1/subscriptions?anchor_account=')
        .concat(encodeURIComponent(e)),
      method: 'GET',
    });
  },
  fetchSubscriptions: function () {
    return u('user:subscriptions', 5e3, function () {
      return m({
        url: ''.concat(n.API_BASE_URL, '/api/v1/subscriptions/batch'),
        method: 'GET',
      });
    });
  },
  setAnchorHidden: function (e, t) {
    var o = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
    return m({
      url: ''.concat(n.API_BASE_URL, '/api/v1/hidden-anchors'),
      method: 'PATCH',
      data: {
        anchor_account: e,
        hidden: Boolean(t),
        disable_notifications: Boolean(o),
      },
    }).then(function (e) {
      return (d('user:subscriptions'), e);
    });
  },
  registerSubscription: function (e) {
    return n.API_BASE_URL
      ? m({
          url: ''.concat(n.API_BASE_URL, '/api/v1/subscriptions'),
          method: 'POST',
          data: e,
        }).then(s)
      : Promise.resolve({
          code: 0,
          data: t(
            {
              preview: !0,
              quota: 1,
              enabled: !0,
            },
            e
          ),
        });
  },
  registerNotificationBundle: function (e) {
    if (!n.API_BASE_URL) {
      var t = e && e.templates ? e.templates : {},
        o = {};
      return (
        Object.keys(t).forEach(function (e) {
          o[e] = {
            quota: 1,
            shared_quota: 1,
            enabled: !0,
          };
        }),
        Promise.resolve({
          code: 0,
          data: {
            preview: !0,
            shared_quota: 1,
            subscriptions: o,
          },
        })
      );
    }
    return m({
      url: ''.concat(n.API_BASE_URL, '/api/v1/notification-subscriptions/bundle'),
      method: 'POST',
      data: e,
    }).then(s);
  },
  setSubscriptionEnabled: function (e) {
    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : n.ANCHOR.account;
    return m({
      url: ''.concat(n.API_BASE_URL, '/api/v1/subscriptions'),
      method: 'PATCH',
      data: {
        anchor_account: t,
        enabled: Boolean(e),
      },
    }).then(s);
  },
  fetchFavoriteAnchor: function () {
    return n.API_BASE_URL
      ? m({
          url: ''.concat(n.API_BASE_URL, '/api/v1/favorite-anchor'),
          method: 'GET',
        })
      : Promise.resolve({
          code: 0,
          data: {
            selected: !1,
            anchor_account: '',
            requested: !1,
            requested_account: '',
            preview: !0,
          },
        });
  },
  setFavoriteAnchor: function (e) {
    return n.API_BASE_URL
      ? m({
          url: ''.concat(n.API_BASE_URL, '/api/v1/favorite-anchor'),
          method: 'PATCH',
          data: {
            anchor_account: e,
          },
        }).then(s)
      : Promise.resolve({
          code: 0,
          data: {
            selected: !0,
            anchor_account: e,
            preview: !0,
            subscription: {
              enabled: !0,
              quota: 0,
            },
          },
        });
  },
  enterOfficialArticle: function (e, t) {
    return m({
      url: ''.concat(n.API_BASE_URL, '/api/v1/official-entries'),
      method: 'POST',
      data: {
        campaign: e,
        request_id: t,
      },
    }).then(s);
  },
  submitFavoriteAnchorRequest: function (e) {
    return n.API_BASE_URL
      ? m({
          url: ''.concat(n.API_BASE_URL, '/api/v1/favorite-anchor-requests'),
          method: 'POST',
          data: {
            douyin_account: e,
          },
        })
      : Promise.resolve({
          code: 0,
          data: {
            requested: !0,
            created: !0,
            douyin_account: e,
            preview: !0,
          },
        });
  },
  fetchFavoriteAnchorPurchaseOffer: function () {
    return U('', void 0, 'GET');
  },
  startFavoriteAnchorLookup: function (e) {
    return L(
      '',
      {
        douyin_account: e,
      },
      'POST'
    );
  },
  fetchFavoriteAnchorLookup: function (e) {
    return L('/'.concat(encodeURIComponent(e)), void 0, 'GET');
  },
  createFavoriteAnchorPurchase: function (e) {
    return U('', e);
  },
  confirmFavoriteAnchorPurchase: function (e) {
    return B().then(function (t) {
      return U('/'.concat(encodeURIComponent(e), '/confirm'), {
        login_code: t,
      });
    });
  },
  cancelFavoriteAnchorPurchase: function (e) {
    return U('/'.concat(encodeURIComponent(e), '/cancel'), {});
  },
  redeemFavoriteAnchorBenefit: function (e) {
    return U('/'.concat(encodeURIComponent(e), '/confirm'), {});
  },
  fetchFavoriteAnchorWallet: function () {
    return I();
  },
  fetchFavoriteAnchorPurchase: function (e) {
    return U('/'.concat(encodeURIComponent(e)), void 0, 'GET');
  },
  fetchLeaveSubscription: function () {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : n.ANCHOR.account;
    return m({
      url: ''
        .concat(n.API_BASE_URL, '/api/v1/leave-subscriptions?anchor_account=')
        .concat(encodeURIComponent(e)),
      method: 'GET',
    });
  },
  registerLeaveSubscription: function (e) {
    return m({
      url: ''.concat(n.API_BASE_URL, '/api/v1/leave-subscriptions'),
      method: 'POST',
      data: e,
    }).then(s);
  },
  setLeaveSubscriptionEnabled: function (e) {
    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : n.ANCHOR.account;
    return m({
      url: ''.concat(n.API_BASE_URL, '/api/v1/leave-subscriptions'),
      method: 'PATCH',
      data: {
        anchor_account: t,
        enabled: Boolean(e),
      },
    }).then(s);
  },
  fetchWorkSubscription: function () {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : n.ANCHOR.account;
    return m({
      url: ''
        .concat(n.API_BASE_URL, '/api/v1/work-subscriptions?anchor_account=')
        .concat(encodeURIComponent(e)),
      method: 'GET',
    });
  },
  registerWorkSubscription: function (e) {
    return m({
      url: ''.concat(n.API_BASE_URL, '/api/v1/work-subscriptions'),
      method: 'POST',
      data: e,
    }).then(s);
  },
  setWorkSubscriptionEnabled: function (e) {
    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : n.ANCHOR.account;
    return m({
      url: ''.concat(n.API_BASE_URL, '/api/v1/work-subscriptions'),
      method: 'PATCH',
      data: {
        anchor_account: t,
        enabled: Boolean(e),
      },
    }).then(s);
  },
  sendTestNotification: function (e) {
    return m({
      url: ''.concat(n.API_BASE_URL, '/api/v1/test-notifications'),
      method: 'POST',
      data: e,
    }).then(s);
  },
  repairNotification: function (e) {
    return m({
      url: ''.concat(n.API_BASE_URL, '/api/v1/notification-repair'),
      method: 'POST',
      data: e,
    }).then(s);
  },
  fetchPreferences: function () {
    return m({
      url: ''.concat(n.API_BASE_URL, '/api/v1/preferences'),
      method: 'GET',
    });
  },
  updatePreferences: function (e) {
    return m({
      url: ''.concat(n.API_BASE_URL, '/api/v1/preferences'),
      method: 'PATCH',
      data: e,
    });
  },
  fetchManualNotificationPreview: function () {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : n.ANCHOR.account;
    return m({
      url: ''
        .concat(n.API_BASE_URL, '/api/v1/admin/manual-notifications/preview?anchor_account=')
        .concat(encodeURIComponent(e)),
      method: 'GET',
    });
  },
  sendManualNotification: function (e) {
    return m({
      url: ''.concat(n.API_BASE_URL, '/api/v1/admin/manual-notifications'),
      method: 'POST',
      data: e,
    });
  },
  fetchLeavePending: function () {
    return m({
      url: ''.concat(n.API_BASE_URL, '/api/v1/admin/leave/pending'),
      method: 'GET',
    });
  },
  sendLeave: function (e) {
    return m({
      url: ''.concat(n.API_BASE_URL, '/api/v1/admin/leave/send'),
      method: 'POST',
      data: {
        note: e,
      },
    });
  },
};
