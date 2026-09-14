'use strict';

var e = require('../../@babel/runtime/helpers/defineProperty');

require('../../@babel/runtime/helpers/Arrayincludes');

var t = require('../../@babel/runtime/helpers/regeneratorRuntime'),
  a = require('../../@babel/runtime/helpers/slicedToArray'),
  n = require('../../@babel/runtime/helpers/asyncToGenerator'),
  r = require('../../@babel/runtime/helpers/objectSpread2'),
  i = require('../../@babel/runtime/helpers/toConsumableArray'),
  o = require('../../config/env'),
  c = require('../../services/api'),
  s = require('../../utils/share'),
  l = require('../../utils/mascot-theme'),
  u = require('../../utils/tab-bar'),
  h = require('../../utils/view-cache'),
  d = require('../../utils/performance-mode');

function m(e) {
  return String(e).padStart(2, '0');
}

function p() {
  var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : Date.now(),
    t = new Date(e + 288e5);
  return {
    year: t.getUTCFullYear(),
    month: t.getUTCMonth() + 1,
    day: t.getUTCDate(),
    hour: t.getUTCHours(),
    minute: t.getUTCMinutes(),
    second: t.getUTCSeconds(),
  };
}

function f() {
  var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : Date.now(),
    t = p(e);
  return ''.concat(t.year, '-').concat(m(t.month), '-').concat(m(t.day));
}

function g(e, t) {
  return 'starlight:'.concat(String(e || ''), ':').concat(String(t || ''));
}

function v(e) {
  var t = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(e || ''));
  return t ? Date.UTC(Number(t[1]), Number(t[2]) - 1, Number(t[3])) : Date.now();
}

function _(e, t) {
  if (e === t) return '今天';
  var a = new Date(v(e)),
    n = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][a.getUTCDay()];
  return ''
    .concat(a.getUTCMonth() + 1, '月')
    .concat(a.getUTCDate(), '日 · ')
    .concat(n);
}

function S(e, t, a) {
  var n = String(a || f()).slice(0, 7),
    r = /^(\d{4})-(\d{2})$/.exec(String(e || '')) || /^(\d{4})-(\d{2})$/.exec(n),
    i = Number(r[1]),
    o = Number(r[2]),
    c = Date.UTC(i, o - 1, 1),
    s = c - 864e5 * ((new Date(c).getUTCDay() + 6) % 7),
    l = Array.from(
      {
        length: 42,
      },
      function (e, n) {
        var r = new Date(s + 864e5 * n),
          i = ''
            .concat(r.getUTCFullYear(), '-')
            .concat(m(r.getUTCMonth() + 1), '-')
            .concat(m(r.getUTCDate()));
        return {
          key: i,
          day: r.getUTCDate(),
          outside: r.getUTCMonth() + 1 !== o,
          disabled: i > a,
          selected: i === t,
          today: i === a,
        };
      }
    ),
    u = ''.concat(i, '-').concat(m(o));
  return {
    calendarMonth: u,
    calendarTitle: ''.concat(i, '年').concat(o, '月'),
    calendarDays: l,
    calendarCanNext: u < n,
  };
}

function b(e) {
  var t = Number(e || 0);
  if (!t) return '--:--';
  var a = p(1e3 * t);
  return ''.concat(m(a.hour), ':').concat(m(a.minute));
}

function y(e) {
  var t = Number(e || 0);
  if (!t) return '--:--';
  var a = p(t);
  return ''.concat(m(a.hour), ':').concat(m(a.minute));
}

function T(e) {
  if (null == e || '' === e) return '--';
  var t = Math.max(0, Math.round(Number(e) || 0));
  return String(t).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function k(e) {
  if (null == e || '' === e) return null;
  var t = Number(e);
  return Number.isFinite(t) ? Math.max(0, Math.round(t)) : null;
}

function D(e, t, a, n) {
  var r = e && e.rank_neighbors;
  return r && 1 === r.version && Number(r.rank_position) === Number(e.rank_position)
    ? ['previous', 'next'].map(function (e, i) {
        var o = r[e] || {},
          c = k(o.rank_position),
          s = Boolean(o.anchor_id) && c === Number(r.rank_position) + ('previous' === e ? -1 : 1),
          l =
            'first' === o.status && 'previous' === e && 1 === Number(r.rank_position)
              ? '已是榜首'
              : 'last' === o.status && 'next' === e
                ? '已到榜尾'
                : '',
          u = s && 'exact' === o.status ? k(o.gap_value) : null,
          h = t && (t.rankNeighbors || [])[i],
          d = h && s && h.anchorId === o.anchor_id && h.rankValue === c,
          m = {
            side: e,
            label: 'previous' === e ? '上一名' : '下一名',
            anchorId: s ? o.anchor_id : '',
            rankValue: c,
            rankText: s ? '#'.concat(c) : '',
            nickname: s ? String(o.nickname || '昵称暂缺') : l || '暂无数据',
            gapLabel: '',
            gapText: '',
            gapValue: u,
            hasGap: !1,
            gapNote: '',
            gapKind: 'official',
          };
        if (null !== u)
          ((m.hasGap = !0),
            (m.gapLabel = 'previous' === e ? '还差' : '领先'),
            (m.gapText = w(
              a,
              'timeline['.concat(n, '].rankNeighbors[').concat(i, '].gapText'),
              d && 'official' === h.gapKind ? h.gapValue : null,
              u
            )));
        else if (s && 'fuzzy' === o.status && o.gap_display)
          ((m.hasGap = !0),
            (m.gapLabel = 'previous' === e ? '还差' : '领先'),
            (m.gapText = String(o.gap_display)));
        else if (
          s &&
          'missing' === o.status &&
          ['calculated', 'estimated', 'simulated', 'same_band'].includes(o.display_gap_kind)
        ) {
          var p = o.display_gap_kind,
            f = k(o.display_gap_value);
          ((m.gapKind = p),
            'same_band' === p
              ? (m.gapText = '同档位')
              : null !== f && ('simulated' !== p || (f >= 100 && f <= 900))
                ? ((m.hasGap = !0),
                  (m.gapValue = f),
                  (m.gapLabel = 'previous' === e ? '还差' : '领先'),
                  (m.gapNote = 'estimated' === p ? '约' : ''),
                  (m.gapText =
                    'simulated' === p
                      ? T(f)
                      : w(
                          a,
                          'timeline['.concat(n, '].rankNeighbors[').concat(i, '].gapText'),
                          d && h.gapKind === p ? h.gapValue : null,
                          f
                        )))
                : (m.gapText = '差距暂缺'));
        } else s && (m.gapText = 'rank_changed' === o.status ? '排名变动' : '差距暂缺');
        return m;
      })
    : [];
}

function w(e, t, a, n) {
  var r = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : T,
    i = k(n);
  if (null === i) return r(null);
  var o = k(a);
  return null !== o && o !== i
    ? (e.push({
        path: t,
        previous: o,
        target: i,
        formatter: r,
      }),
      r(o))
    : r(i);
}

function x(e, t) {
  var a = k(e),
    n = k(t);
  return null !== a && null !== n && a !== n;
}

function A(e) {
  return Array.from(e || '')[0] || '';
}

function C(e, t, a) {
  var n = Math.max.apply(
      Math,
      [1].concat(
        i(
          e.map(function (e) {
            return Array.from('string' == typeof e ? e : T(e)).reduce(function (e, t) {
              return e + (t.charCodeAt(0) > 255 ? 1 : 0.62);
            }, 0);
          })
        )
      )
    ),
    r = Math.max(12, Math.min(a, Math.floor(t / n)));
  return 'font-size: '.concat(r, 'px;');
}

function N(e) {
  return e && e.startsWith('/') ? ''.concat(o.API_BASE_URL).concat(e) : e || '';
}

function V(e, t, a) {
  if (e.is_ongoing || 'ongoing' === e.status)
    return {
      label: 'PK中',
      className: 'is-ongoing',
    };
  var n = {
    win: {
      label: '胜',
      className: 'is-win',
    },
    loss: {
      label: '负',
      className: 'is-loss',
    },
    draw: {
      label: '平',
      className: 'is-draw',
    },
  };
  if (n[e.result]) return n[e.result];
  var r = k(t),
    i = k(a);
  return null !== r && null !== i && (r > 0 || i > 0)
    ? r > i
      ? n.win
      : r < i
        ? n.loss
        : n.draw
    : {
        label: '已结束',
        className: 'is-finished',
      };
}

function M(e, t) {
  var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : [],
    n = String(e.battle_mode || '').toLowerCase();
  if (t <= 2)
    return {
      mode: 'duel',
      label: '经典 PK',
    };
  if ('team' === n) {
    var r = new Set(
        a
          .map(function (e) {
            return e.teamKey;
          })
          .filter(Boolean)
      ),
      i = a.filter(function (e) {
        return e.isAnchor;
      }),
      o =
        a.length > 2 &&
        a.every(function (e) {
          return Boolean(e.teamKey);
        }) &&
        2 === r.size &&
        1 === i.length;
    return o
      ? {
          mode: 'team',
          label: '团队 PK',
        }
      : {
          mode: 'multi',
          label: '多人 PK',
        };
  }
  return 'multi' === n || t > 2
    ? {
        mode: 'multi',
        label: '多人 PK',
      }
    : {
        mode: 'duel',
        label: '经典 PK',
      };
}

function B(e, t) {
  var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : '',
    n =
      Array.isArray(e.participants) && e.participants.length
        ? e.participants
        : [
            {
              participant_key: 'legacy-anchor',
              user_id: e.anchor_user_id || '',
              nickname: t,
              douyin_id: '',
              is_anchor: !0,
              position: 0,
              score: e.anchor_score,
            },
            {
              participant_key: 'legacy-opponent',
              user_id: e.opponent_user_id || '',
              nickname: e.opponent_nickname || '',
              douyin_id: e.opponent_douyin_id || '',
              is_anchor: !1,
              position: 1,
              score: e.opponent_score,
            },
          ];
  return n
    .map(function (e, n) {
      var i = String(e.douyin_id || '').trim(),
        o =
          !0 === e.is_anchor ||
          1 === e.is_anchor ||
          '1' === e.is_anchor ||
          (Boolean(a) && i === String(a)),
        c = String(e.nickname || e.douyin_id || (o ? t : '参战方 '.concat(n + 1))),
        s = k(e.team_rank) || 0,
        l = String(e.team_id || e.teamId || '').trim(),
        u = k(e.battle_rank) || 0,
        h = k(e.score),
        d = k(e.team_score);
      return r(
        r({}, e),
        {},
        {
          isAnchor: o,
          name: c,
          initial: A(c),
          avatarUrl: N(e.avatar_url || e.avatarUrl || e.head_url || e.headUrl || ''),
          accountText: e.douyin_id ? 'dy '.concat(e.douyin_id) : '',
          scoreValue: h,
          scoreText: T(h),
          teamScoreValue: d,
          teamScoreText: e.team_score_text || T(d),
          teamId: l,
          teamKey: l ? 'id:'.concat(l) : s ? 'rank:'.concat(s) : '',
          teamRank: s,
          rankLabel: '#'.concat(u || n + 1),
        }
      );
    })
    .sort(function (e, t) {
      return (
        Number(t.isAnchor) - Number(e.isAnchor) ||
        (e.battle_rank || Number.MAX_SAFE_INTEGER) - (t.battle_rank || Number.MAX_SAFE_INTEGER) ||
        e.position - t.position
      );
    });
}

function L(e, t) {
  if (!Array.isArray(e) || e.length < 2) return null;
  var a = e.slice().sort(function (e, t) {
      return Number(e.position || 0) - Number(t.position || 0);
    }),
    n = new Map();
  if (
    (a.forEach(function (e) {
      var t = e.teamKey;
      t && (n.has(t) || n.set(t, []), n.get(t).push(e));
    }),
    2 !== n.size ||
      a.some(function (e) {
        return !e.teamKey;
      }))
  )
    return null;
  var r = Array.from(n.keys()),
    o = a.find(function (e) {
      return e.isAnchor;
    }),
    c = o && o.teamKey ? o.teamKey : r[0],
    s = r.find(function (e) {
      return e !== c;
    }),
    l = n.get(c) || [],
    u = n.get(s) || [];
  if (!l.length || !u.length) return null;
  var h = function (e, t) {
      var a = e
        .map(function (e) {
          return k(e.teamScoreValue);
        })
        .filter(function (e) {
          return null !== e && e > 0;
        });
      if (a.length) return Math.max.apply(Math, i(a));
      var n = e
          .map(function (e) {
            return k(e.scoreValue);
          })
          .filter(function (e) {
            return null !== e;
          }),
        r = n.reduce(function (e, t) {
          return e + t;
        }, 0);
      if (n.length === e.length && r > 0) return r;
      var o = k(t);
      return null !== o && o > 0 ? o : n.length === e.length ? r : o;
    },
    d = h(l, t.anchor_score),
    m = h(u, t.opponent_score),
    p = null !== d && null !== m ? d + m : 0,
    f = p > 0 ? Math.round((d / p) * 1e3) / 10 : 50,
    g = Math.round(10 * (100 - f)) / 10;
  return {
    redTeam: {
      members: l.slice(0, 4),
      totalValue: d,
      totalText: T(d),
      percent: f,
      widthStyle: 'width: '.concat(f, '%;'),
    },
    blueTeam: {
      members: u.slice(0, 4),
      totalValue: m,
      totalText: T(m),
      percent: g,
      widthStyle: 'width: '.concat(g, '%;'),
    },
  };
}

function P(e, t) {
  if (!Array.isArray(e) || e.length < 2) return null;
  var a =
      e.find(function (e) {
        return e.isAnchor;
      }) || e[0],
    n =
      e.find(function (e) {
        return e !== a && !e.isAnchor;
      }) ||
      e.find(function (e) {
        return e !== a;
      });
  if (!a || !n) return null;
  var i = k(a.scoreValue),
    o = k(n.scoreValue),
    c = null !== i ? i : k(t.anchor_score),
    s = null !== o ? o : k(t.opponent_score),
    l = null !== c && null !== s ? c + s : 0,
    u = l > 0 ? Math.round((c / l) * 1e3) / 10 : 50,
    h = Math.round(10 * (100 - u)) / 10;
  return {
    left: r(
      r({}, a),
      {},
      {
        scoreValue: c,
        scoreText: T(c),
        percent: u,
        widthStyle: 'width: '.concat(u, '%;'),
      }
    ),
    right: r(
      r({}, n),
      {},
      {
        scoreValue: s,
        scoreText: T(s),
        percent: h,
        widthStyle: 'width: '.concat(h, '%;'),
      }
    ),
  };
}

function I(e, t) {
  if (
    !(function () {
      try {
        return 'develop' === wx.getAccountInfoSync().miniProgram.envVersion;
      } catch (e) {
        return !1;
      }
    })() ||
    e !== t
  )
    return null;
  var a = p(Date.now()),
    n = Math.floor((3600 * a.hour + 60 * a.minute + a.second) / 5) % 900,
    r = 8441 + Math.floor(n / 4),
    i = 1286400 + 37 * n,
    o = 38340 + 19 * n,
    c = 36128 + 13 * n,
    s = Date.UTC(a.year, a.month - 1, a.day, a.hour) - 288e5,
    l = function (e, t, a) {
      var n = s - 36e5 * e;
      return {
        period_start: Math.floor(n / 1e3),
        period_end: Math.floor((n + 36e5) / 1e3),
        popularity: t,
        pk_battles: a,
      };
    },
    u = function (e, t, a, n, r, i) {
      var o = arguments.length > 6 && void 0 !== arguments[6] && arguments[6],
        c = s - 36e5 * t + 6e4 * a;
      return {
        record_id: 'local-preview-'.concat(e),
        battle_id: 'preview-battle-'.concat(e),
        opponent_nickname: n,
        opponent_douyin_id: 'preview_'.concat(e),
        started_at_ms: c,
        ended_at_ms: o ? null : c + 3e5,
        anchor_score: r[0],
        opponent_score: r[1],
        result: i,
        status: o ? 'ongoing' : 'finished',
        is_ongoing: o,
      };
    },
    h = Math.max(0, Math.min(a.minute - 3, 56)),
    d = s + 6e4 * h,
    m = d - 6e5;
  return {
    items: [
      l(
        0,
        {
          rank_position: 3,
          best_rank_position: 2,
          supporter_count: r,
          peak_supporter_count: r,
          popularity_score: i,
          gap_text: '距上一名 124,600',
          is_final: !1,
        },
        [
          {
            record_id: 'local-preview-multi-ongoing',
            battle_id: 'preview-battle-multi-ongoing',
            battle_mode: 'multi',
            participant_count: 4,
            opponent_nickname: '梦幻老王',
            opponent_douyin_id: 'menghuanlaowang',
            started_at_ms: d,
            ended_at_ms: null,
            anchor_score: o + 96300,
            opponent_score: c + 82192,
            status: 'ongoing',
            is_ongoing: !0,
            participants: [
              {
                participant_key: 'preview-multi-anchor',
                nickname: '',
                douyin_id: '',
                is_anchor: !0,
                position: 0,
                battle_rank: 1,
                score: o + 96300,
              },
              {
                participant_key: 'preview-multi-laowang',
                nickname: '梦幻老王',
                douyin_id: 'menghuanlaowang',
                is_anchor: !1,
                position: 1,
                battle_rank: 2,
                score: c + 82192,
              },
              {
                participant_key: 'preview-multi-huahua',
                nickname: '花花果果',
                douyin_id: 'huahuaguoguo',
                is_anchor: !1,
                position: 2,
                battle_rank: 3,
                score: 96540,
              },
              {
                participant_key: 'preview-multi-456',
                nickname: '四五六',
                douyin_id: 'siwuliu456',
                is_anchor: !1,
                position: 3,
                battle_rank: 4,
                score: 88760,
              },
            ],
            high_value_gifts: [
              {
                gift_record_id: 'preview-gift-1',
                sender_nickname: '小熊软糖',
                gift_name: '嘉年华',
                quantity: 1,
                total_diamonds: 3e4,
              },
              {
                gift_record_id: 'preview-gift-2',
                sender_nickname: '守护星河',
                gift_name: '浪漫马车',
                quantity: 2,
                total_diamonds: 57600,
              },
              {
                gift_record_id: 'preview-gift-3',
                sender_nickname: '今晚必胜',
                gift_name: '为你打Call',
                quantity: 6,
                total_diamonds: 3120,
              },
            ],
          },
          {
            record_id: 'local-preview-team-finished',
            battle_id: 'preview-battle-team-finished',
            battle_mode: 'team',
            participant_count: 8,
            opponent_nickname: '蓝方战队',
            started_at_ms: m,
            ended_at_ms: m + 3e5,
            anchor_score: 286430,
            opponent_score: 271890,
            result: 'win',
            status: 'finished',
            is_ongoing: !1,
            participants: [
              {
                participant_key: 'preview-team-red-anchor',
                nickname: '',
                is_anchor: !0,
                position: 0,
                team_rank: 1,
                team_score: 286430,
                score: 98620,
              },
              {
                participant_key: 'preview-team-red-456',
                nickname: '四五六',
                douyin_id: 'siwuliu456',
                position: 1,
                team_rank: 1,
                team_score: 286430,
                score: 84210,
              },
              {
                participant_key: 'preview-team-red-huahua',
                nickname: '花花果果',
                douyin_id: 'huahuaguoguo',
                position: 2,
                team_rank: 1,
                team_score: 286430,
                score: 61740,
              },
              {
                participant_key: 'preview-team-red-xiaoyu',
                nickname: '小鱼小鱼',
                douyin_id: 'xiaoyuxiaoyu',
                position: 3,
                team_rank: 1,
                team_score: 286430,
                score: 41860,
              },
              {
                participant_key: 'preview-team-blue-laowang',
                nickname: '梦幻老王',
                douyin_id: 'menghuanlaowang',
                position: 4,
                team_rank: 2,
                team_score: 271890,
                score: 91320,
              },
              {
                participant_key: 'preview-team-blue-longmao',
                nickname: '大龙猫',
                douyin_id: 'dalongmao',
                position: 5,
                team_rank: 2,
                team_score: 271890,
                score: 74680,
              },
              {
                participant_key: 'preview-team-blue-linsiqi',
                nickname: '林思琪',
                douyin_id: 'linsiqi',
                position: 6,
                team_rank: 2,
                team_score: 271890,
                score: 58750,
              },
              {
                participant_key: 'preview-team-blue-niangao',
                nickname: '烤年糕',
                douyin_id: 'kaoniangao',
                position: 7,
                team_rank: 2,
                team_score: 271890,
                score: 47140,
              },
            ],
          },
        ]
      ),
      l(
        1,
        {
          rank_position: 5,
          best_rank_position: 3,
          supporter_count: 7296,
          peak_supporter_count: 7810,
          popularity_score: 1084520,
          gap_text: '距上一名 82,300',
          is_final: !0,
        },
        [
          u('win', 1, 42, '四五六', [52680, 48120], 'win'),
          u('loss', 1, 18, '大龙猫', [29740, 31560], 'loss'),
        ]
      ),
      l(
        2,
        {
          rank_position: 8,
          best_rank_position: 6,
          supporter_count: 6038,
          peak_supporter_count: 6472,
          popularity_score: 862900,
          gap_text: '距上一名 46,800',
          is_final: !0,
        },
        [u('draw', 2, 31, '花花果果', [24680, 24680], 'draw')]
      ),
    ],
    summary: {
      hour_count: 3,
      pk_count: 5,
      wins: 1,
      best_rank: 2,
      peak_supporters: r,
    },
  };
}

Page({
  data: {
    statusBarHeight: 20,
    navigationHeight: 64,
    mascotThemeSkin: 'classic',
    mascotThemeClass: 'theme-classic',
    mascotThemeIsIce: !1,
    performanceClass: d.className(),
    anchors: [],
    anchorScope: 'favorite',
    archivePageVisible: !0,
    trendEntryVisible: !0,
    trendEntryAttention: !0,
    favoriteAnchorAccount: '',
    selectedAnchorIndex: 0,
    selectedAnchor: {},
    anchorSwitchMotion: '',
    selectorDiscoveryActive: !1,
    anchorSelectorOpen: !1,
    anchorSelectorClosing: !1,
    dateSelectorOpen: !1,
    dateSelectorClosing: !1,
    calendarWeekdays: ['一', '二', '三', '四', '五', '六', '日'],
    calendarMonth: '',
    calendarTitle: '',
    calendarDays: [],
    calendarDraftDate: '',
    calendarCanNext: !1,
    pkDetailOpen: !1,
    pkDetailClosing: !1,
    selectedBattle: null,
    todayDate: '',
    selectedDate: '',
    selectedDateLabel: '',
    loading: !1,
    refreshing: !1,
    numbersAnimating: !1,
    loadError: '',
    localPreview: !1,
    timelineSortOrder: 'desc',
    timeline: [],
    summary: {
      hourCount: 0,
      pkCount: 0,
      wins: 0,
      bestRank: '--',
      peakSupporters: '--',
      bestRankValue: null,
      peakSupportersValue: null,
      pkCountValue: 0,
      winsValue: 0,
    },
    lastUpdatedText: '',
  },
  onLoad: function () {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
    (s.enableShareMenu(),
      (this.pendingPreferredAccount =
        decodeURIComponent(String(e.account || '')).trim() || this.takePreferredAccount()),
      (this.initialArchiveScope = this.pendingPreferredAccount ? 'all' : 'favorite'),
      this.setData({
        anchorScope: this.initialArchiveScope,
      }),
      this.setNavigationMetrics());
    var t = f();
    (this.setData({
      todayDate: t,
      selectedDate: t,
      selectedDateLabel: '今天',
    }),
      this.loadPage());
  },
  onShow: function () {
    (this.setData({
      archivePageVisible: !0,
    }),
      l.sync(this),
      u.sync(this, 'archive'),
      this.setTabBarHidden(
        this.data.anchorSelectorOpen || this.data.dateSelectorOpen || this.data.pkDetailOpen
      ),
      this.archivePageLoaded && this.syncFavoriteAnchor(),
      this.data.anchors.length && this.startLiveRefresh());
  },
  onHide: function () {
    (this.setData({
      archivePageVisible: !1,
    }),
      this.stopLiveRefresh(),
      this.clearNumberAnimation(!0),
      this.timelineCacheTimer && clearTimeout(this.timelineCacheTimer),
      (this.timelineCacheTimer = null),
      this.setTabBarHidden(!1));
  },
  onUnload: function () {
    (this.stopLiveRefresh(),
      this.clearNumberAnimation(),
      this.setTabBarHidden(!1),
      this.anchorSelectorTimer && clearTimeout(this.anchorSelectorTimer),
      this.dateSelectorTimer && clearTimeout(this.dateSelectorTimer),
      this.anchorSwitchTimer && clearTimeout(this.anchorSwitchTimer),
      this.selectorDiscoveryStartTimer && clearTimeout(this.selectorDiscoveryStartTimer),
      this.selectorDiscoveryTimer && clearTimeout(this.selectorDiscoveryTimer),
      this.pkDetailTimer && clearTimeout(this.pkDetailTimer),
      this.timelineCacheTimer && clearTimeout(this.timelineCacheTimer));
  },
  onPullDownRefresh: function () {
    this.loadTimeline({
      fresh: !0,
    }).finally(function () {
      return wx.stopPullDownRefresh();
    });
  },
  setNavigationMetrics: function () {
    try {
      var e = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync(),
        t = wx.getMenuButtonBoundingClientRect(),
        a = e.statusBarHeight || 20,
        n = 2 * (t.top - a) + t.height + a;
      this.setData({
        statusBarHeight: a,
        navigationHeight: n,
      });
    } catch (e) {}
  },
  goBack: function () {
    (wx.vibrateShort &&
      wx.vibrateShort({
        type: 'light',
        fail: function () {},
      }),
      wx.navigateBack({
        delta: 1,
        fail: function () {
          wx.switchTab({
            url: '/pages/media/media',
          });
        },
      }));
  },
  openViewerArchive: function () {
    var e = String(this.data.selectedAnchor.account || ''),
      t = String(this.data.selectedDate || this.data.todayDate || '');
    e &&
      (this.setData({
        trendEntryAttention: !1,
      }),
      wx.vibrateShort &&
        wx.vibrateShort({
          type: 'light',
          fail: function () {},
        }),
      wx.navigateTo({
        url: '/pages/viewer-archive/viewer-archive?account='
          .concat(encodeURIComponent(e), '&date=')
          .concat(encodeURIComponent(t)),
        fail: function () {
          wx.showToast({
            title: '在线趋势暂时无法打开',
            icon: 'none',
          });
        },
      }));
  },
  onArchiveScroll: function (e) {
    var t = Number(e.detail.scrollTop || 0) < 64;
    t !== this.data.trendEntryVisible &&
      this.setData({
        trendEntryVisible: t,
      });
  },
  takePreferredAccount: function () {
    try {
      var e = String(wx.getStorageSync('liveArchivePreferredAccountV1') || '').trim();
      return (e && wx.removeStorageSync('liveArchivePreferredAccountV1'), e);
    } catch (e) {
      return '';
    }
  },
  loadPage: function () {
    var e = this;
    return n(
      t().mark(function n() {
        var r, i, o, s, l, u, d, m, p, f, g, v, _, S, b, y, T, k, D, w, x, C, V, M, B, L, P, I;
        return t().wrap(
          function (t) {
            for (;;)
              switch ((t.prev = t.next)) {
                case 0:
                  return (
                    e.setData({
                      loading: !0,
                      loadError: '',
                    }),
                    (r = String(e.pendingPreferredAccount || '').toLowerCase()),
                    (i = h.read('starlight-anchors', 36e5)),
                    (o = i && Array.isArray(i.data) ? i.data : []),
                    (s = null),
                    (l = ''),
                    o.length &&
                      r &&
                      ((u = r
                        ? o.findIndex(function (e) {
                            return String(e.account || '').toLowerCase() === r;
                          })
                        : -1),
                      (m = o[(d = u >= 0 ? u : 0)]),
                      (e.allAnchors = o),
                      e.setData({
                        anchorScope: 'all',
                        anchors: o,
                        selectedAnchorIndex: d,
                        selectedAnchor: m,
                      }),
                      e.scheduleSelectorDiscovery(),
                      (l = String(m.account || '')),
                      (s = e.loadTimeline({
                        fresh: !0,
                      }))),
                    (t.prev = 7),
                    (t.next = 10),
                    Promise.all([
                      c.fetchAnchors(),
                      c.fetchSubscriptions().catch(function () {
                        return null;
                      }),
                      c.fetchFavoriteAnchor().catch(function () {
                        return null;
                      }),
                    ])
                  );

                case 10:
                  if (
                    ((p = t.sent),
                    (f = a(p, 3)),
                    (g = f[0]),
                    (v = f[1]),
                    (_ = f[2]),
                    (S = (g && g.data && g.data.items) || []),
                    (b = (v && v.data && v.data.items) || []),
                    (y = new Set(
                      b
                        .filter(function (e) {
                          return Boolean(e.enabled);
                        })
                        .map(function (e) {
                          return String(e.anchor_account || '');
                        })
                    )),
                    (T = S.map(function (e, t) {
                      return {
                        account: e.account,
                        nickname: e.nickname || e.account,
                        avatarUrl: N(e.avatar_url),
                        initial: A(e.nickname || e.account),
                        status: e.status,
                        isPrimary: Boolean(e.is_primary),
                        isSubscribed: y.has(String(e.account || '')),
                        originalIndex: t,
                      };
                    }).sort(function (e, t) {
                      return (
                        Number(t.isSubscribed) - Number(e.isSubscribed) ||
                        e.originalIndex - t.originalIndex
                      );
                    })).length)
                  ) {
                    t.next = 21;
                    break;
                  }
                  throw new Error('暂无可查看的主播');

                case 21:
                  if (
                    ((k = _ && _.data ? _.data : null),
                    (D =
                      k && k.selected
                        ? String(k.anchor_account || '')
                        : _
                          ? ''
                          : String(e.data.favoriteAnchorAccount || '')),
                    (w = D
                      ? T.find(function (e) {
                          return String(e.account || '').toLowerCase() === D.toLowerCase();
                        })
                      : null),
                    (C = 'favorite' === (x = r ? 'all' : w ? 'favorite' : 'all') ? [w] : T),
                    (V = r
                      ? C.findIndex(function (e) {
                          return String(e.account || '').toLowerCase() === r;
                        })
                      : -1),
                    (M = C.findIndex(function (e) {
                      return e.isSubscribed;
                    })),
                    (B = C.findIndex(function (e) {
                      return e.isPrimary;
                    })),
                    (L = String(e.data.selectedAnchor.account || '')),
                    (P = L
                      ? C.findIndex(function (e) {
                          return e.account === L;
                        })
                      : -1),
                    (I = V >= 0 ? V : P >= 0 ? P : M >= 0 ? M : Math.max(0, B)),
                    (e.pendingPreferredAccount = ''),
                    (e.initialArchiveScope = x),
                    (e.allAnchors = T),
                    e.setData({
                      anchorScope: x,
                      favoriteAnchorAccount: D,
                      anchors: C,
                      selectedAnchorIndex: I,
                      selectedAnchor: C[I],
                    }),
                    e.scheduleSelectorDiscovery(),
                    h.write('starlight-anchors', T),
                    (e.archivePageLoaded = !0),
                    !s || l !== C[I].account)
                  ) {
                    t.next = 44;
                    break;
                  }
                  return ((t.next = 42), s);

                case 42:
                  t.next = 46;
                  break;

                case 44:
                  return (
                    (t.next = 46),
                    e.loadTimeline({
                      fresh: !0,
                    })
                  );

                case 46:
                  (e.startLiveRefresh(), (t.next = 52));
                  break;

                case 49:
                  ((t.prev = 49),
                    (t.t0 = t.catch(7)),
                    e.setData({
                      loadError: t.t0.message || '星光档案加载失败',
                    }));

                case 52:
                  return (
                    (t.prev = 52),
                    e.setData({
                      loading: !1,
                    }),
                    t.finish(52)
                  );

                case 55:
                case 'end':
                  return t.stop();
              }
          },
          n,
          null,
          [[7, 49, 52, 55]]
        );
      })
    )();
  },
  applyArchiveScope: function (e) {
    var t = this,
      a = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : '',
      n = Array.isArray(this.allAnchors) ? this.allAnchors : [];
    if (!n.length) return !1;
    var r = n;
    if ('favorite' === e) {
      var i = String(this.data.favoriteAnchorAccount || '').toLowerCase(),
        o = i
          ? n.find(function (e) {
              return String(e.account || '').toLowerCase() === i;
            })
          : null;
      if (!o) return !1;
      r = [o];
    }
    var c = String(this.data.selectedAnchor.account || ''),
      s = String(a || c || '').toLowerCase(),
      l = s
        ? r.findIndex(function (e) {
            return String(e.account || '').toLowerCase() === s;
          })
        : -1,
      u = l >= 0 ? l : 0,
      h = r[u],
      d = String(h.account || '') !== c;
    return (
      this.clearNumberAnimation(),
      this.setData(
        {
          anchorScope: e,
          anchors: r,
          selectedAnchorIndex: u,
          selectedAnchor: h,
          anchorSwitchMotion: d ? 'is-next' : '',
          timeline: d ? [] : this.data.timeline,
          numbersAnimating: !1,
          loadError: '',
        },
        function () {
          d &&
            (t.anchorSwitchTimer && clearTimeout(t.anchorSwitchTimer),
            (t.anchorSwitchTimer = setTimeout(function () {
              t.setData({
                anchorSwitchMotion: '',
              });
            }, 360)),
            t.loadTimeline({
              fresh: !0,
            }),
            t.startLiveRefresh());
        }
      ),
      !0
    );
  },
  switchAnchorScope: function (e) {
    var t = String(e.currentTarget.dataset.scope || '');
    ['favorite', 'all'].includes(t) &&
      t !== this.data.anchorScope &&
      (wx.vibrateShort &&
        wx.vibrateShort({
          type: 'light',
          fail: function () {},
        }),
      this.applyArchiveScope(t) ||
        wx.showToast({
          title: '请先在首页选择你的爱播',
          icon: 'none',
        }));
  },
  syncFavoriteAnchor: function () {
    var e = this;
    if (this.favoriteAnchorSyncPromise) return this.favoriteAnchorSyncPromise;
    var t = c
      .fetchFavoriteAnchor()
      .then(function (t) {
        var a = t && t.data ? t.data : {},
          n = a.selected ? String(a.anchor_account || '') : '';
        n !== e.data.favoriteAnchorAccount &&
          (e.setData({
            favoriteAnchorAccount: n,
          }),
          'favorite' === e.data.anchorScope &&
            (e.applyArchiveScope('favorite', n) || e.applyArchiveScope('all')));
      })
      .catch(function () {
        return null;
      })
      .finally(function () {
        e.favoriteAnchorSyncPromise = null;
      });
    return ((this.favoriteAnchorSyncPromise = t), t);
  },
  loadTimeline: function () {
    var e = arguments,
      a = this;
    return n(
      t().mark(function n() {
        var r, i, o, s, l, u, d, f, v, _, S, b, y, T, k;
        return t().wrap(
          function (t) {
            for (;;)
              switch ((t.prev = t.next)) {
                case 0:
                  if (
                    ((r = e.length > 0 && void 0 !== e[0] ? e[0] : {}),
                    (i = a.data.selectedAnchor) && i.account)
                  ) {
                    t.next = 4;
                    break;
                  }
                  return t.abrupt('return');

                case 4:
                  if (
                    ((o = Boolean(r.silent)),
                    (s = (a.timelineLoadToken || 0) + 1),
                    (a.timelineLoadToken = s),
                    (l = I(a.data.selectedDate, a.data.todayDate)),
                    (u = g(i.account, a.data.selectedDate)),
                    (d = !1),
                    o ||
                      l ||
                      a.data.timeline.length ||
                      ((f = h.read(u, 432e5)) &&
                        ((v = JSON.stringify(f.data)),
                        (a.timelineSnapshotKey = u),
                        (a.timelineSnapshotSignature = v),
                        (a.timelineSnapshotHour = Math.floor(Date.now() / 36e5)),
                        a.applyTimeline(f.data, {
                          animate: !1,
                        }),
                        a.setData({
                          loading: !1,
                          refreshing: !0,
                        }),
                        (d = !0))),
                    o || d
                      ? a.data.refreshing ||
                        a.setData({
                          refreshing: !0,
                        })
                      : a.setData({
                          loading: !0,
                          loadError: '',
                        }),
                    (t.prev = 12),
                    !l)
                  ) {
                    t.next = 17;
                    break;
                  }
                  ((t.t0 = {
                    data: l,
                  }),
                    (t.next = 20));
                  break;

                case 17:
                  return (
                    (t.next = 19),
                    c.fetchStarlightTimeline(i.account, a.data.selectedDate, {
                      fresh: Boolean(r.fresh),
                    })
                  );

                case 19:
                  t.t0 = t.sent;

                case 20:
                  if (((_ = t.t0), s === a.timelineLoadToken)) {
                    t.next = 23;
                    break;
                  }
                  return t.abrupt('return');

                case 23:
                  ((S = _ && _.data ? _.data : {}),
                    (b = JSON.stringify(S)),
                    (y = Math.floor(Date.now() / 36e5)),
                    (T =
                      !l &&
                      a.timelineSnapshotKey === u &&
                      a.timelineSnapshotSignature === b &&
                      a.timelineSnapshotHour === y)
                      ? ((k = p()),
                        a.setData({
                          localPreview: !1,
                          lastUpdatedText: ''
                            .concat(m(k.hour), ':')
                            .concat(m(k.minute), ':')
                            .concat(m(k.second), ' 更新'),
                          loadError: '',
                        }))
                      : (a.setData({
                          localPreview: Boolean(l),
                        }),
                        a.applyTimeline(S)),
                    (a.timelineSnapshotKey = u),
                    (a.timelineSnapshotSignature = b),
                    (a.timelineSnapshotHour = y),
                    l || T || a.scheduleTimelineCacheWrite(u, S),
                    (t.next = 39));
                  break;

                case 34:
                  if (((t.prev = 34), (t.t1 = t.catch(12)), s === a.timelineLoadToken)) {
                    t.next = 38;
                    break;
                  }
                  return t.abrupt('return');

                case 38:
                  ((o || d) && a.data.timeline.length) ||
                    a.setData({
                      timeline: [],
                      loadError: t.t1.message || '星光档案加载失败',
                    });

                case 39:
                  if (((t.prev = 39), s === a.timelineLoadToken)) {
                    t.next = 42;
                    break;
                  }
                  return t.abrupt('return');

                case 42:
                  return (
                    a.setData({
                      loading: !1,
                      refreshing: !1,
                    }),
                    t.finish(39)
                  );

                case 44:
                case 'end':
                  return t.stop();
              }
          },
          n,
          null,
          [[12, 34, 39, 44]]
        );
      })
    )();
  },
  applyTimeline: function (e) {
    var t = this,
      a = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
      n = !1 !== a.animate,
      i = this.data.selectedAnchor.nickname || '本方主播',
      o = new Map(
        (this.data.timeline || []).map(function (e) {
          return [String(e.periodStart), e];
        })
      ),
      c = [],
      s = Math.floor(Date.now() / 1e3),
      l = 'asc' === this.data.timelineSortOrder ? 1 : -1,
      u = (e.items || [])
        .slice()
        .sort(function (e, t) {
          return l * (Number(e.period_start || 0) - Number(t.period_start || 0));
        })
        .map(function (e, a) {
          var l = Number(e.period_start || 0),
            u = o.get(String(l)) || null,
            h = new Map(
              ((u && u.battles) || []).map(function (e) {
                return [String(e.motionKey || ''), e];
              })
            ),
            d = e.popularity || null,
            m = (e.pk_battles || [])
              .slice()
              .sort(function (e, t) {
                return Number(t.started_at_ms || 0) - Number(e.started_at_ms || 0);
              })
              .map(function (e, n) {
                var o = e.is_ongoing || 'ongoing' === e.status,
                  s = B(e, i, t.data.selectedAnchor.account),
                  l = Array.isArray(e.participants) && e.participants.length > 0,
                  u = Math.max(Number(e.participant_count || 0), s.length, 2),
                  d = M(e, l ? s.length : u, s),
                  m = s.find(function (e) {
                    return e.isAnchor;
                  }),
                  p = s.filter(function (e) {
                    return !e.isAnchor;
                  }),
                  f = s.slice().sort(function (e, t) {
                    return (k(t.scoreValue) || 0) - (k(e.scoreValue) || 0);
                  }),
                  g = m || f[0],
                  v = m
                    ? p.slice().sort(function (e, t) {
                        return (k(t.scoreValue) || 0) - (k(e.scoreValue) || 0);
                      })[0]
                    : f[1] || f[0],
                  _ = 'team' === d.mode ? L(s, e) : null,
                  S = 'duel' === d.mode ? P(s, e) : null,
                  b = _
                    ? _.redTeam.totalValue
                    : S
                      ? S.left.scoreValue
                      : null !== k(m && m.scoreValue)
                        ? k(m.scoreValue)
                        : null !== k(g && g.scoreValue)
                          ? k(g.scoreValue)
                          : k(e.anchor_score),
                  D = _
                    ? _.blueTeam.totalValue
                    : S
                      ? S.right.scoreValue
                      : null !== k(v && v.scoreValue)
                        ? k(v.scoreValue)
                        : k(e.opponent_score),
                  N = String(e.record_id || e.battle_id || e.started_at_ms || n),
                  I = h.get(N) || null,
                  R = b,
                  U = D,
                  E = V(e, R, U),
                  O = x(I && I.anchorScoreValue, R),
                  K = x(I && I.opponentScoreValue, U),
                  q = _ ? _.redTeam.members : S ? [S.left] : [g].filter(Boolean),
                  H = _ ? _.blueTeam.members : S ? [S.right] : [v].filter(Boolean),
                  F = null !== R && null !== U,
                  W = F ? R + U : 0,
                  G = W > 0 ? Math.round((R / W) * 1e3) / 10 : 50,
                  z = F ? R - U : null,
                  $ =
                    null === z
                      ? '比分待更新'
                      : 0 === z
                        ? '比分持平'
                        : ''.concat(z > 0 ? '领先' : '落后', ' ').concat(T(Math.abs(z)));
                return r(
                  r({}, e),
                  {},
                  {
                    motionKey: N,
                    anchorName: i,
                    participants: s,
                    teamMatchup: _,
                    duelMatchup: S,
                    previewLeftMembers: q.map(function (e) {
                      return r(
                        r({}, e),
                        {},
                        {
                          avatarUrl:
                            e.avatarUrl || (e.isAnchor && t.data.selectedAnchor.avatarUrl) || '',
                        }
                      );
                    }),
                    previewRightMembers: H,
                    previewLeftLabel: _ ? '红方' : (q[0] || {}).name || i,
                    previewRightLabel: _ ? '蓝方' : (H[0] || {}).name || '未知对手',
                    hasComparableScores: F,
                    previewRedPercent: G,
                    previewBluePercent: Math.round(10 * (100 - G)) / 10,
                    previewRedScale: G / 100,
                    previewScoreFontStyle: C([R, U], 90, 25),
                    listScoreFontStyle: C([R, U], 90, 21),
                    scoreComparisonText: $,
                    participantCount: u,
                    battleMode: d.mode,
                    modeLabel: d.label,
                    isMulti: 'duel' !== d.mode,
                    modeSummary: ''.concat(d.label, ' · ').concat(u, '人'),
                    detailHint: 'duel' === d.mode ? '查看详情' : '查看全部参战方',
                    summaryLeftLabel: m ? i : '最高分',
                    summaryRightLabel: m ? '最高对手' : '次高分',
                    opponentInitial: A(
                      (v && v.name) || e.opponent_nickname || e.opponent_douyin_id || '对'
                    ),
                    opponentName:
                      (v && v.name) || e.opponent_nickname || e.opponent_douyin_id || '神秘对手',
                    startClock: y(e.started_at_ms),
                    timeRange: '结束于 '.concat(y(e.ended_at_ms)),
                    durationText: o
                      ? '进行中'
                      : ''.concat(
                          Math.max(
                            0,
                            Math.round(
                              (Number(e.ended_at_ms || 0) - Number(e.started_at_ms || 0)) / 1e3
                            )
                          ) || Number(e.duration_seconds || 0),
                          ' 秒'
                        ),
                    gifts: (e.high_value_gifts || []).map(function (e) {
                      return r(
                        r({}, e),
                        {},
                        {
                          senderName: e.sender_nickname || e.sender_douyin_id || '匿名水友',
                          giftName: e.gift_name || '礼物',
                          quantityText: '×'.concat(T(e.quantity)),
                          diamondsText: ''.concat(T(e.total_diamonds), ' 钻'),
                        }
                      );
                    }),
                    anchorScoreValue: R,
                    opponentScoreValue: U,
                    anchorScoreChanging: O,
                    opponentScoreChanging: K,
                    anchorScoreText: w(
                      c,
                      'timeline['.concat(a, '].battles[').concat(n, '].anchorScoreText'),
                      I && I.anchorScoreValue,
                      R
                    ),
                    opponentScoreText: w(
                      c,
                      'timeline['.concat(a, '].battles[').concat(n, '].opponentScoreText'),
                      I && I.opponentScoreValue,
                      U
                    ),
                    resultLabel: E.label,
                    resultClass: E.className,
                    isFinished: 'is-finished' === E.className,
                    isOngoing: o,
                  }
                );
              }),
            p = k(d && d.rank_position),
            f = d && d.best_rank_position,
            g = k(d && (null !== d.supporter_count ? d.supporter_count : d.peak_supporter_count)),
            v = k(
              d &&
                (null !== d.popularity_display_value && void 0 !== d.popularity_display_value
                  ? d.popularity_display_value
                  : d.popularity_score)
            ),
            _ = x(u && u.supporterValue, g),
            S = x(u && u.popularityScoreValue, v),
            N = x(u && u.rankValue, p),
            I =
              null !== v
                ? w(c, 'timeline['.concat(a, '].scoreText'), u && u.popularityScoreValue, v)
                : String((d && d.popularity_score_text) || '--'),
            R =
              d &&
              (d.gap_text || (null !== k(d.gap_value) ? '距上一名 '.concat(T(d.gap_value)) : '')),
            U = D(d, n ? u : null, c, a),
            E = Number(e.period_start || 0) <= s && Number(e.period_end || 0) > s,
            O = m.some(function (e) {
              return e.isOngoing;
            }),
            K = m.filter(function (e) {
              return !e.isOngoing;
            }),
            q = Boolean(u && u.pkExpanded);
          return {
            periodStart: l,
            hourLabel: b(e.period_start),
            hourEndLabel: b(e.period_end),
            isCurrent: E,
            hasPopularity: Boolean(d),
            rankValue: p,
            rankChanging: N,
            rankText:
              null === p
                ? '--'
                : w(c, 'timeline['.concat(a, '].rankText'), u && u.rankValue, p, function (e) {
                    return '#'.concat(Math.max(0, Math.round(Number(e) || 0)));
                  }),
            bestRankText: f ? '最好 #'.concat(f) : '',
            supporterValue: g,
            popularityScoreValue: v,
            supporterChanging: _,
            scoreChanging: S,
            supporterText: w(c, 'timeline['.concat(a, '].supporterText'), u && u.supporterValue, g),
            scoreText: I || '--',
            scoreFontStyle: C([null === v ? I : v], 82, 21),
            supporterFontStyle: C([g], 82, 21),
            gapText: R || '暂无差距数据',
            rankNeighbors: U,
            isFinal: Boolean(d && d.is_final),
            battles: m,
            pkCount: m.length,
            ongoingCount: m.length - K.length,
            completedCount: K.length,
            completedWins: K.filter(function (e) {
              return 'is-win' === e.resultClass;
            }).length,
            completedLosses: K.filter(function (e) {
              return 'is-loss' === e.resultClass;
            }).length,
            completedDraws: K.filter(function (e) {
              return 'is-draw' === e.resultClass;
            }).length,
            hasOngoingBattle: O,
            pkExpanded: q,
          };
        }),
      h = e.summary || {},
      d = this.data.summary || {},
      f = Boolean((this.data.timeline || []).length),
      g = k(h.best_rank),
      v = k(h.peak_supporters),
      _ = k(h.pk_count) || 0,
      S = k(h.wins) || 0,
      N = function (e) {
        return Math.max(0, Math.round(Number(e) || 0));
      },
      I = {
        hourCount: Number(h.hour_count || u.length),
        pkCount: w(c, 'summary.pkCount', f ? d.pkCountValue : null, _, N),
        wins: w(c, 'summary.wins', f ? d.winsValue : null, S, N),
        bestRank:
          null === g
            ? '--'
            : w(c, 'summary.bestRank', f ? d.bestRankValue : null, g, function (e) {
                return '#'.concat(N(e));
              }),
        peakSupporters: w(c, 'summary.peakSupporters', f ? d.peakSupportersValue : null, v),
        bestRankValue: g,
        peakSupportersValue: v,
        peakSupportersFontStyle: C([v], 84, 22),
        pkCountValue: _,
        winsValue: S,
        bestRankChanging: f && x(d.bestRankValue, g),
        peakSupportersChanging: f && x(d.peakSupportersValue, v),
        pkCountChanging: f && x(d.pkCountValue, _),
        winsChanging: f && x(d.winsValue, S),
      },
      R = p(),
      U = null;
    if (this.data.pkDetailOpen && this.data.selectedBattle) {
      var E = String(this.data.selectedBattle.motionKey || ''),
        O = u.reduce(function (e, t) {
          return (
            e ||
            (t.battles || []).find(function (e) {
              return String(e.motionKey || '') === E;
            })
          );
        }, null);
      O &&
        (U = r(
          r({}, O),
          {},
          {
            anchorScoreText: w(
              c,
              'selectedBattle.anchorScoreText',
              this.data.selectedBattle.anchorScoreValue,
              O.anchorScoreValue
            ),
            opponentScoreText: w(
              c,
              'selectedBattle.opponentScoreText',
              this.data.selectedBattle.opponentScoreValue,
              O.opponentScoreValue
            ),
          }
        ));
    }
    this.clearNumberAnimation();
    var K = {
      timeline: u,
      summary: I,
      numbersAnimating: n && c.length > 0,
      lastUpdatedText: ''
        .concat(m(R.hour), ':')
        .concat(m(R.minute), ':')
        .concat(m(R.second), ' 更新'),
      loadError: '',
    };
    (U && (K.selectedBattle = U),
      this.setData(K, function () {
        n && t.animateNumberChanges(c);
      }));
  },
  scheduleTimelineCacheWrite: function (e, t) {
    var a = this;
    this.timelineCacheTimer && clearTimeout(this.timelineCacheTimer);
    var n = this.timelineCacheWriteTimes || {};
    this.timelineCacheWriteTimes = n;
    var r = Date.now() - Number(n[e] || 0),
      i = function () {
        ((a.timelineCacheTimer = null), h.write(e, t), (n[e] = Date.now()));
      };
    r >= 3e4 ? i() : (this.timelineCacheTimer = setTimeout(i, 3e4 - r));
  },
  animateNumberChanges: function (e) {
    var t = this;
    if (e.length) {
      var a = Date.now();
      this.numberAnimationTimer = setTimeout(function n() {
        var r = Math.min(1, (Date.now() - a) / 620),
          i = 1 - Math.pow(1 - r, 3),
          o = {};
        (e.forEach(function (e) {
          if (!e.path.startsWith('selectedBattle.') || t.data.pkDetailOpen) {
            var a = Math.round(e.previous + (e.target - e.previous) * i);
            o[e.path] = e.formatter(a);
          }
        }),
          t.setData(o),
          r < 1
            ? (t.numberAnimationTimer = setTimeout(n, 50))
            : ((t.numberAnimationTimer = null),
              t.setData({
                numbersAnimating: !1,
              })));
      }, 40);
    }
  },
  clearNumberAnimation: function () {
    var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
    (this.numberAnimationTimer && clearTimeout(this.numberAnimationTimer),
      (this.numberAnimationTimer = null),
      e &&
        this.data.numbersAnimating &&
        this.setData({
          numbersAnimating: !1,
        }));
  },
  startLiveRefresh: function () {
    var e = this;
    (this.stopLiveRefresh(),
      this.data.selectedDate === this.data.todayDate &&
        (this.refreshTimer = setInterval(function () {
          e.data.loading ||
            e.data.refreshing ||
            e.loadTimeline({
              silent: !0,
              fresh: !0,
            });
        }, 5e3)));
  },
  stopLiveRefresh: function () {
    (this.refreshTimer && clearInterval(this.refreshTimer), (this.refreshTimer = null));
  },
  openAnchorSelector: function () {
    this.data.anchors.length &&
      (this.dismissSelectorDiscovery(),
      wx.vibrateShort &&
        wx.vibrateShort({
          type: 'light',
          fail: function () {},
        }),
      this.anchorSelectorTimer && clearTimeout(this.anchorSelectorTimer),
      this.setTabBarHidden(!0),
      this.setData({
        anchorSelectorOpen: !0,
        anchorSelectorClosing: !1,
      }));
  },
  closeAnchorSelector: function () {
    var e = this;
    this.data.anchorSelectorOpen &&
      !this.data.anchorSelectorClosing &&
      (this.setData({
        anchorSelectorClosing: !0,
      }),
      this.anchorSelectorTimer && clearTimeout(this.anchorSelectorTimer),
      (this.anchorSelectorTimer = setTimeout(function () {
        (e.setData({
          anchorSelectorOpen: !1,
          anchorSelectorClosing: !1,
        }),
          e.setTabBarHidden(!1));
      }, 180)));
  },
  openPkDetail: function (e) {
    var t = String(e.currentTarget.dataset.recordId || ''),
      a = (this.data.timeline || []).reduce(function (e, a) {
        return (
          e ||
          (a.battles || []).find(function (e) {
            return e.motionKey === t;
          })
        );
      }, null);
    a &&
      (wx.vibrateShort &&
        wx.vibrateShort({
          type: 'light',
          fail: function () {},
        }),
      this.pkDetailTimer && clearTimeout(this.pkDetailTimer),
      this.setTabBarHidden(!0),
      this.setData({
        selectedBattle: a,
        pkDetailOpen: !0,
        pkDetailClosing: !1,
      }));
  },
  togglePkRecords: function (t) {
    var a = Number(t.currentTarget.dataset.periodStart || 0),
      n = (this.data.timeline || []).findIndex(function (e) {
        return Number(e.periodStart) === a;
      });
    if (!(n < 0)) {
      var r = !this.data.timeline[n].pkExpanded;
      (wx.vibrateShort &&
        wx.vibrateShort({
          type: 'light',
          fail: function () {},
        }),
        this.setData(e({}, 'timeline['.concat(n, '].pkExpanded'), r)));
    }
  },
  toggleTimelineSort: function () {
    var e = 'asc' === this.data.timelineSortOrder ? 'desc' : 'asc',
      t = 'asc' === e ? 1 : -1,
      a = (this.data.timeline || []).slice().sort(function (e, a) {
        return t * (Number(e.periodStart || 0) - Number(a.periodStart || 0));
      });
    (wx.vibrateShort &&
      wx.vibrateShort({
        type: 'light',
        fail: function () {},
      }),
      this.clearNumberAnimation(),
      this.setData({
        timelineSortOrder: e,
        timeline: a,
        numbersAnimating: !1,
      }));
  },
  closePkDetail: function () {
    var e = this;
    this.data.pkDetailOpen &&
      !this.data.pkDetailClosing &&
      (this.setData({
        pkDetailClosing: !0,
      }),
      this.pkDetailTimer && clearTimeout(this.pkDetailTimer),
      (this.pkDetailTimer = setTimeout(function () {
        (e.setData({
          pkDetailOpen: !1,
          pkDetailClosing: !1,
          selectedBattle: null,
        }),
          e.setTabBarHidden(!1));
      }, 200)));
  },
  setTabBarHidden: function (e) {
    var t = 'function' == typeof this.getTabBar ? this.getTabBar() : null;
    if (t && 'function' == typeof t.setData) {
      var a = Boolean(e);
      Boolean(t.data.hidden) !== a &&
        t.setData({
          hidden: a,
        });
    }
  },
  preventBubble: function () {},
  selectAnchor: function (e) {
    var t = Number(e.currentTarget.dataset.index),
      a = this.data.selectedAnchorIndex;
    (this.closeAnchorSelector(),
      t !== a && this.switchAnchor(t, t > a ? 'is-next' : 'is-previous'));
  },
  changeAnchorBy: function (e) {
    var t = this.data.anchors;
    if (!(t.length < 2)) {
      var a = Number(e.currentTarget.dataset.offset || 0);
      if (a) {
        this.dismissSelectorDiscovery();
        var n = (this.data.selectedAnchorIndex + a + t.length) % t.length;
        this.switchAnchor(n, a > 0 ? 'is-next' : 'is-previous');
      }
    }
  },
  switchAnchor: function (e, t) {
    var a = this,
      n = this.data.anchors[e];
    n &&
      (wx.vibrateShort &&
        wx.vibrateShort({
          type: 'light',
          fail: function () {},
        }),
      this.anchorSwitchTimer && clearTimeout(this.anchorSwitchTimer),
      this.clearNumberAnimation(),
      this.setData(
        {
          selectedAnchorIndex: e,
          selectedAnchor: n,
          anchorSwitchMotion: t,
          timeline: [],
          numbersAnimating: !1,
          loadError: '',
        },
        function () {
          ((a.anchorSwitchTimer = setTimeout(function () {
            a.setData({
              anchorSwitchMotion: '',
            });
          }, 360)),
            a.loadTimeline({
              fresh: !0,
            }),
            a.startLiveRefresh());
        }
      ));
  },
  applySelectedDate: function (e) {
    var t = String(e || this.data.todayDate);
    /^\d{4}-\d{2}-\d{2}$/.test(t) &&
      (t > this.data.todayDate && (t = this.data.todayDate),
      this.clearNumberAnimation(),
      this.setData({
        selectedDate: t,
        selectedDateLabel: _(t, this.data.todayDate),
        timeline: [],
        numbersAnimating: !1,
      }),
      this.loadTimeline({
        fresh: !0,
      }),
      this.startLiveRefresh());
  },
  openDateSelector: function () {
    (this.dismissSelectorDiscovery(),
      wx.vibrateShort &&
        wx.vibrateShort({
          type: 'light',
          fail: function () {},
        }),
      this.dateSelectorTimer && clearTimeout(this.dateSelectorTimer));
    var e = this.data.selectedDate || this.data.todayDate,
      t = S(e.slice(0, 7), e, this.data.todayDate);
    (this.setTabBarHidden(!0),
      this.setData(
        r(
          r({}, t),
          {},
          {
            calendarDraftDate: e,
            dateSelectorOpen: !0,
            dateSelectorClosing: !1,
          }
        )
      ));
  },
  closeDateSelector: function () {
    var e = this;
    this.data.dateSelectorOpen &&
      !this.data.dateSelectorClosing &&
      (this.setData({
        dateSelectorClosing: !0,
      }),
      this.dateSelectorTimer && clearTimeout(this.dateSelectorTimer),
      (this.dateSelectorTimer = setTimeout(function () {
        (e.setData({
          dateSelectorOpen: !1,
          dateSelectorClosing: !1,
        }),
          e.setTabBarHidden(!1),
          (e.dateSelectorTimer = null));
      }, 180)));
  },
  changeCalendarMonth: function (e) {
    var t = Number(e.currentTarget.dataset.offset || 0);
    if (!(!t || (t > 0 && !this.data.calendarCanNext))) {
      var a = /^(\d{4})-(\d{2})$/.exec(this.data.calendarMonth);
      if (a) {
        var n,
          r = Date.UTC(Number(a[1]), Number(a[2]) - 1 + t, 1),
          i = S(
            ((n = new Date(r)), ''.concat(n.getUTCFullYear(), '-').concat(m(n.getUTCMonth() + 1))),
            this.data.calendarDraftDate,
            this.data.todayDate
          );
        (wx.vibrateShort &&
          wx.vibrateShort({
            type: 'light',
            fail: function () {},
          }),
          this.setData(i));
      }
    }
  },
  selectCalendarDate: function (e) {
    var t = String(e.currentTarget.dataset.date || '');
    if (t && !(t > this.data.todayDate)) {
      var a = S(t.slice(0, 7), t, this.data.todayDate);
      (wx.vibrateShort &&
        wx.vibrateShort({
          type: 'light',
          fail: function () {},
        }),
        this.setData(
          r(
            r({}, a),
            {},
            {
              calendarDraftDate: t,
            }
          )
        ));
    }
  },
  locateToday: function () {
    var e = this.data.todayDate,
      t = S(e.slice(0, 7), e, e);
    (wx.vibrateShort &&
      wx.vibrateShort({
        type: 'light',
        fail: function () {},
      }),
      this.setData(
        r(
          r({}, t),
          {},
          {
            calendarDraftDate: e,
          }
        )
      ));
  },
  confirmDateSelection: function () {
    var e = this.data.calendarDraftDate || this.data.selectedDate;
    (this.applySelectedDate(e), this.closeDateSelector());
  },
  changeDateBy: function (e) {
    var t = Number(e.currentTarget.dataset.offset || 0);
    if (t && !(t > 0 && this.data.selectedDate === this.data.todayDate)) {
      var a = f(v(this.data.selectedDate) + 864e5 * t - 288e5);
      (a > this.data.todayDate && (a = this.data.todayDate),
        this.dismissSelectorDiscovery(),
        wx.vibrateShort &&
          wx.vibrateShort({
            type: 'light',
            fail: function () {},
          }),
        this.applySelectedDate(a));
    }
  },
  scheduleSelectorDiscovery: function () {
    var e = this;
    if (!this.selectorDiscoveryScheduled) {
      try {
        if (wx.getStorageSync('starlightSelectorDiscoveryV1')) return;
      } catch (e) {}
      ((this.selectorDiscoveryScheduled = !0),
        (this.selectorDiscoveryStartTimer = setTimeout(function () {
          ((e.selectorDiscoveryStartTimer = null),
            e.setData({
              selectorDiscoveryActive: !0,
            }));
          try {
            wx.setStorageSync('starlightSelectorDiscoveryV1', Date.now());
          } catch (e) {}
          e.selectorDiscoveryTimer = setTimeout(function () {
            ((e.selectorDiscoveryTimer = null),
              e.setData({
                selectorDiscoveryActive: !1,
              }));
          }, 1750);
        }, 520)));
    }
  },
  dismissSelectorDiscovery: function () {
    (this.selectorDiscoveryStartTimer && clearTimeout(this.selectorDiscoveryStartTimer),
      this.selectorDiscoveryTimer && clearTimeout(this.selectorDiscoveryTimer),
      (this.selectorDiscoveryStartTimer = null),
      (this.selectorDiscoveryTimer = null),
      this.data.selectorDiscoveryActive &&
        this.setData({
          selectorDiscoveryActive: !1,
        }));
  },
  retryLoad: function () {
    this.data.anchors.length
      ? this.loadTimeline({
          fresh: !0,
        })
      : this.loadPage();
  },
});
