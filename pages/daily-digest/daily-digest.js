'use strict';

var e = require('../../@babel/runtime/helpers/regeneratorRuntime'),
  t = require('../../@babel/runtime/helpers/asyncToGenerator');

require('../../@babel/runtime/helpers/Arrayincludes');

var a = require('../../@babel/runtime/helpers/defineProperty'),
  r = require('../../@babel/runtime/helpers/slicedToArray'),
  n = require('../../@babel/runtime/helpers/typeof'),
  i = require('../../@babel/runtime/helpers/objectSpread2'),
  o = require('../../config/env'),
  s = require('../../services/api'),
  l = require('../../utils/share'),
  c = require('../../utils/tab-bar'),
  u = require('../../utils/mascot-theme'),
  d = require('../../utils/view-cache'),
  h = require('../../utils/performance-mode'),
  f = require('../../utils/remote-art'),
  m = '/assets/images/daily-digest/memorial-herald-fallback.png',
  g = '/assets/images/daily-digest/read-seal-fallback.png';

function p(e) {
  return 'daily-digest:'.concat(e || 'latest');
}

function b(e) {
  return ''.concat(e).padStart(2, '0');
}

function v() {
  var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : Date.now(),
    t = new Date(e + 288e5);
  return ''
    .concat(t.getUTCFullYear(), '-')
    .concat(b(t.getUTCMonth() + 1), '-')
    .concat(b(t.getUTCDate()));
}

function y() {
  var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : Date.now(),
    t = new Date(e + 288e5),
    a = t.getUTCHours() >= 6 ? 1 : 2;
  return v(e - 24 * a * 60 * 60 * 1e3);
}

function T(e) {
  var t = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(e || ''));
  return t
    ? {
        year: Number(t[1]),
        month: Number(t[2]),
        day: Number(t[3]),
      }
    : null;
}

function _(e) {
  var t = T(e);
  if (!t) return '--';
  var a = Date.UTC(t.year, t.month - 1, t.day),
    r = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][
      new Date(a).getUTCDay()
    ];
  return ''.concat(t.year, '年').concat(t.month, '月').concat(t.day, '日 · ').concat(r);
}

function k(e, t) {
  var a = T(e);
  if (!a) return [];
  var r = Date.UTC(a.year, a.month - 1, a.day);
  return Array.from(
    {
      length: 30,
    },
    function (e, a) {
      var n = r - 24 * a * 60 * 60 * 1e3,
        i = v(n - 288e5),
        o = new Date(n);
      return {
        date: i,
        dayLabel: ''.concat(o.getUTCMonth() + 1, '月').concat(o.getUTCDate(), '日'),
        weekdayLabel: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][o.getUTCDay()],
        issueLabel: '第 '.concat(i.replace(/-/g, ''), ' 期'),
        isLatest: 0 === a,
        isSelected: i === t,
      };
    }
  );
}

function x(e) {
  var t = Number(e || 0);
  if (!t) return '--:--';
  var a = new Date(1e3 * t + 288e5);
  return ''.concat(b(a.getUTCHours()), ':').concat(b(a.getUTCMinutes()));
}

function w(e) {
  var t = Math.max(0, Math.round(Number(e || 0) / 60)),
    a = Math.floor(t / 60),
    r = t % 60;
  return a && r
    ? ''.concat(a, '时').concat(r, '分')
    : a
      ? ''.concat(a, '小时')
      : ''.concat(r, '分钟');
}

function S(e) {
  var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : '--',
    a = Math.max(0, Math.round(Number(e || 0)));
  if (!a) return t;
  if (a >= 1e8) return ''.concat((a / 1e8).toFixed(1), '亿');
  if (a >= 1e4) {
    var r = a >= 1e5 ? 1 : 2;
    return ''.concat((a / 1e4).toFixed(r).replace(/\.0$/, ''), '万');
  }
  return ''.concat(a).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function D(e) {
  var t = String(e || '');
  return t && t.startsWith('/') ? ''.concat(o.API_BASE_URL).concat(t) : t;
}

function C(e) {
  var t = Math.max(0, Math.round(Number(e || 0)));
  if (!t) return '--';
  var a = Math.floor(t / 60),
    r = t % 60;
  return a && r
    ? ''.concat(a, '分').concat(r, '秒')
    : a
      ? ''.concat(a, '分钟')
      : ''.concat(r, '秒');
}

function A(e) {
  if (null == e || '' === e) return '--';
  var t = Math.round(Number(e || 0));
  return t ? ''.concat(t > 0 ? '+' : '-').concat(S(Math.abs(t), '0')) : '0';
}

function N(e) {
  return Array.from(String(e || ''))[0] || '播';
}

function R(e) {
  var t = Number(e.pk_wins || 0),
    a = Number(e.pk_losses || 0),
    r = Number(e.pk_draws || 0);
  return t || a || r
    ? ''
        .concat(t, '胜 ')
        .concat(a, '负')
        .concat(r ? ' '.concat(r, '平') : '')
    : '暂无PK';
}

function M(e, t) {
  var a = e || {},
    r = Number(a.pk_wins || 0),
    n = Number(a.pk_losses || 0),
    o = Number(a.pk_draws || 0),
    s = Math.max(0, Number(a.session_count || 0)),
    l = [
      {
        key: 'session',
        label: '开播场次',
        value: ''.concat(s, '场'),
        visible: s > 0,
      },
      {
        key: 'duration',
        label: '直播时长',
        value: w(a.total_duration_seconds),
        visible: !0,
      },
      {
        key: 'peak',
        label: '峰值在线',
        value: S(a.peak_viewer_count),
        visible: Number(a.peak_viewer_count || 0) > 0,
      },
      {
        key: 'average',
        label: '平均在线',
        value: S(a.average_viewer_count),
        visible: Number(a.average_viewer_count || 0) > 0,
      },
      {
        key: 'viewers',
        label: '累计场观',
        value: S(a.total_viewer_count),
        visible: Number(a.total_viewer_count || 0) > 0,
      },
      {
        key: 'likes',
        label: '收获点赞',
        value: S(a.like_count),
        visible: Number(a.like_count || 0) > 0,
      },
      {
        key: 'stay',
        label: '人均停留',
        value: C(a.average_stay_seconds),
        visible: Number(a.average_stay_seconds || 0) > 0,
      },
      {
        key: 'followers',
        label: '估算涨粉',
        value: A(a.follower_gain),
        visible: null !== a.follower_gain && void 0 !== a.follower_gain,
      },
      {
        key: 'pk',
        label: 'PK战绩',
        value: R(a),
        visible: r + n + o > 0,
      },
      {
        key: 'rank',
        label: '小时榜',
        value: Number(a.best_rank || 0) > 0 ? '第'.concat(a.best_rank, '名') : '--',
        visible: Number(a.best_rank || 0) > 0,
      },
      {
        key: 'supporters',
        label: '峰值助力',
        value: S(a.peak_supporters),
        visible: Number(a.peak_supporters || 0) > 0,
      },
      {
        key: 'popularity',
        label: '人气值',
        value: String(a.popularity_score_text || ''),
        visible: Boolean(a.popularity_score_text),
      },
      {
        key: 'call',
        label: '水友打Call',
        value: S(a.call_count, '0'),
        visible: !0,
      },
    ].filter(function (e) {
      return e.visible;
    });
  return i(
    i({}, a),
    {},
    {
      storyIndex: t + 1,
      initial: N(a.nickname),
      avatar_url: D(a.avatar_url),
      durationText: w(a.total_duration_seconds),
      peakText: S(a.peak_viewer_count),
      averageText: S(a.average_viewer_count),
      totalViewerText: S(a.total_viewer_count),
      likesText: S(a.like_count),
      callText: S(a.call_count, '0'),
      pkText: R(a),
      rankText: Number(a.best_rank || 0) > 0 ? '第 '.concat(a.best_rank, ' 名') : '未上榜',
      startText: x(a.first_started_at),
      endText: x(a.last_ended_at),
      headline: a.headline || '昨夜的星光已经整理完毕',
      detailStats: l,
    }
  );
}

function P(e) {
  if (!e.length) return [];
  var t = e.slice().sort(function (e, t) {
      return Number(t.total_duration_seconds || 0) - Number(e.total_duration_seconds || 0);
    })[0],
    a = [
      {
        key: 'longest',
        label: '陪伴最久',
        value: t.nickname,
        detail: t.durationText,
      },
    ],
    r = e.slice().sort(function (e, t) {
      return Number(t.peak_viewer_count || 0) - Number(e.peak_viewer_count || 0);
    })[0];
  Number(r.peak_viewer_count || 0) > 0 &&
    a.push({
      key: 'popularity',
      label: '人气高光',
      value: r.nickname,
      detail: '峰值'.concat(r.peakText, '人在线'),
    });
  var n = e
    .filter(function (e) {
      return Number(e.best_rank || 0) > 0;
    })
    .sort(function (e, t) {
      return Number(e.best_rank) - Number(t.best_rank);
    })[0];
  return (
    n &&
      a.push({
        key: 'rank',
        label: '榜单高光',
        value: n.nickname,
        detail: '小时榜第'.concat(n.best_rank, '名'),
      }),
    a
  );
}

function q(e, t) {
  if (!e.length)
    return '昨夜'.concat(t.length, '位爱播集体休刊，星光安静了一晚。养足精神，下一次开播见。');
  var a = e.slice().sort(function (e, t) {
    return Number(t.total_duration_seconds || 0) - Number(e.total_duration_seconds || 0);
  })[0];
  return ''
    .concat(a.nickname, '昨夜陪伴最久，一共播了')
    .concat(a.durationText, '。大人的每一份守候，都被认真记进了今天的早报。');
}

function I(e) {
  return String(e || '')
    .replace(/[#＃@＠][^#＃@＠\s，。！？、；：,!?;:（）()\[\]【】《》<>“”"‘’]*/g, ' ')
    .replace(/\r\n?/g, '\n')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/ +([，。！？、；：,!?;:])/g, '$1')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .replace(/^[，。！？、；：,!?;:\s]+/, '');
}

function V(e) {
  var t,
    a,
    r = e || {},
    o = Array.isArray(r.active_anchors) ? r.active_anchors.map(M) : [],
    s = Array.isArray(r.resting_anchors) ? r.resting_anchors.map(M) : [],
    l = r.summary || {},
    c = o.concat(s),
    u = Math.max(0, Number(r.read_streak || 0)),
    d = Math.max(u, Number(r.next_read_streak || 0)),
    h = c.slice(0, 3).map(function (e) {
      return e.nickname;
    }),
    f =
      Number(l.session_count || 0) ||
      o.reduce(function (e, t) {
        return e + Number(t.session_count || 0);
      }, 0),
    m =
      Number(l.total_viewer_count || 0) ||
      o.reduce(function (e, t) {
        return e + Number(t.total_viewer_count || 0);
      }, 0),
    g =
      Number(l.like_count || 0) ||
      o.reduce(function (e, t) {
        return e + Number(t.like_count || 0);
      }, 0),
    p =
      ((t = r.nightly_clips),
      Array.isArray(t)
        ? t
            .filter(function (e) {
              return e && 'object' === n(e);
            })
            .map(function (e) {
              var t = Array.isArray(e.topics) ? e.topics : [],
                a = (
                  Array.isArray(e.works)
                    ? e.works
                    : t.reduce(function (e, t) {
                        return t && Array.isArray(t.works) ? e.concat(t.works) : e;
                      }, [])
                )
                  .filter(function (e) {
                    return e && 'object' === n(e);
                  })
                  .map(function (e) {
                    var t = I(e.description),
                      a = I(e.title) || t,
                      r = null == e.digg_count || '' === e.digg_count ? NaN : Number(e.digg_count),
                      n = Number(e.published_at);
                    return {
                      aweme_id: String(e.aweme_id || ''),
                      title: a,
                      body: t && t !== a ? t : '',
                      digg_count: Number.isFinite(r) && r >= 0 ? Math.floor(r) : null,
                      published_at: Number.isFinite(n) && n > 0 ? n : 0,
                      sourceText: String(e.author_name || '').trim(),
                      timeText: Number.isFinite(n) && n > 0 ? x(n) : '',
                    };
                  })
                  .filter(function (e) {
                    return e.title;
                  })
                  .sort(function (e, t) {
                    return (
                      (null == t.digg_count ? -1 : t.digg_count) -
                        (null == e.digg_count ? -1 : e.digg_count) ||
                      t.published_at - e.published_at ||
                      t.aweme_id.localeCompare(e.aweme_id)
                    );
                  }),
                r = new Set(),
                o = new Set(),
                s = a
                  .filter(function (e) {
                    var t = [e.title, e.body]
                        .map(function (e) {
                          return (
                            e
                              .replace(/#[^#\s]+/g, '')
                              .replace(/\s+/g, '')
                              .toLowerCase() || e.trim()
                          );
                        })
                        .join('\n'),
                      a = e.aweme_id && r.has(e.aweme_id);
                    return (e.aweme_id && r.add(e.aweme_id), !a && !o.has(t) && (o.add(t), !0));
                  })
                  .slice(0, 4)
                  .map(function (t, a) {
                    return i(
                      i({}, t),
                      {},
                      {
                        key: ''.concat(e.account || 'anchor', ':').concat(t.aweme_id || a),
                        isHot: 0 === a && null !== t.digg_count,
                        likesText:
                          null === t.digg_count
                            ? '赞数暂无'
                            : ''.concat(
                                String(t.digg_count).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                                '赞'
                              ),
                      }
                    );
                  });
              return {
                account: e.account,
                nickname: e.nickname,
                avatar_url: D(e.avatar_url),
                initial: N(e.nickname),
                work_count: s.length,
                clips: s,
              };
            })
            .filter(function (e) {
              return e.clips.length;
            })
        : []);
  return i(
    i({}, r),
    {},
    {
      lead:
        ((a = r.lead),
        String(a || '')
          .replace('昨夜，你特别关注的', '昨夜，大人特别关注的')
          .replace('明早为你送上', '明早为大人奉上')),
      dateLabel: _(r.date),
      issueLabel: '第 '.concat(r.issue || '--', ' 期'),
      activeAnchors: o,
      restingAnchors: s,
      followedAnchors: c.slice(0, 8).map(function (e) {
        return {
          account: e.account,
          nickname: e.nickname,
          avatar_url: e.avatar_url,
          initial: e.initial,
        };
      }),
      followedNamesText:
        c.length > 3 ? ''.concat(h.join('、'), '等').concat(c.length, '位爱播') : h.join('、'),
      editorNote: r.editor_note || q(o, s),
      funFacts: Array.isArray(r.fun_facts) && r.fun_facts.length ? r.fun_facts : P(o),
      nightlyClips: p,
      readStreak: u,
      nextReadStreak: d,
      readStreakText: r.is_read
        ? '连续批阅 '.concat(u || 1, ' 天')
        : '落印后连续批阅 '.concat(d || 1, ' 天'),
      readTimeText: x(r.read_at),
      summaryCells: [
        {
          key: 'session',
          label: '开播场次',
          value: ''.concat(Math.max(0, f), '场'),
        },
        {
          key: 'duration',
          label: '直播总时长',
          value: w(l.total_duration_seconds),
        },
        {
          key: 'peak',
          label: '最高在线',
          value: S(l.peak_viewer_count),
        },
        {
          key: 'viewers',
          label: '累计场观',
          value: S(m),
        },
        {
          key: 'likes',
          label: '收获点赞',
          value: S(g),
        },
        {
          key: 'call',
          label: '水友打Call',
          value: S(l.call_count, '0'),
        },
      ],
    }
  );
}

function L(e) {
  var t = e || {};
  return JSON.stringify({
    date: t.date,
    names: t.followedNamesText,
    summary: t.summaryCells,
    active: (t.renderedActiveAnchors || []).slice(0, 3).map(function (e) {
      return {
        account: e.account,
        headline: e.headline,
        duration: e.durationText,
        peak: e.peakText,
      };
    }),
    read: t.is_read,
  });
}

function U(e, t, a, r, n, i) {
  var o = Math.min(i, r / 2, n / 2);
  (e.beginPath(),
    e.moveTo(t + o, a),
    e.lineTo(t + r - o, a),
    e.quadraticCurveTo(t + r, a, t + r, a + o),
    e.lineTo(t + r, a + n - o),
    e.quadraticCurveTo(t + r, a + n, t + r - o, a + n),
    e.lineTo(t + o, a + n),
    e.quadraticCurveTo(t, a + n, t, a + n - o),
    e.lineTo(t, a + o),
    e.quadraticCurveTo(t, a, t + o, a),
    e.closePath());
}

function O(e, t, a) {
  var r = String(t || '');
  if (e.measureText(r).width <= a) return r;
  for (var n = r; n.length && e.measureText(''.concat(n, '...')).width > a; ) n = n.slice(0, -1);
  return ''.concat(n, '...');
}

function H(e, t) {
  var a = e.getContext('2d');
  ((e.width = 750),
    (e.height = 1e3),
    (a.fillStyle = '#e9e4da'),
    a.fillRect(0, 0, 750, 1e3),
    a.save(),
    (a.shadowColor = 'rgba(35, 31, 27, 0.16)'),
    (a.shadowBlur = 28),
    (a.shadowOffsetY = 12),
    U(a, 28, 24, 694, 952, 8),
    (a.fillStyle = '#fffdf6'),
    a.fill(),
    a.restore(),
    (a.fillStyle = '#a3262b'),
    a.fillRect(58, 52, 634, 5),
    (a.fillStyle = '#1e2528'),
    (a.textAlign = 'center'),
    (a.font = 'bold 54px serif'),
    a.fillText('星光早报', 375, 122),
    (a.fillStyle = '#8a8178'),
    (a.font = '16px sans-serif'),
    a.fillText('STARDUST MORNING POST', 375, 154),
    (a.strokeStyle = 'rgba(30, 37, 40, 0.46)'),
    (a.lineWidth = 2),
    a.beginPath(),
    a.moveTo(58, 176),
    a.lineTo(692, 176),
    a.stroke(),
    (a.lineWidth = 1),
    a.beginPath(),
    a.moveTo(58, 181),
    a.lineTo(692, 181),
    a.stroke(),
    (a.fillStyle = '#655f59'),
    (a.font = '18px sans-serif'),
    (a.textAlign = 'left'),
    a.fillText(String(t.dateLabel || ''), 58, 212),
    (a.textAlign = 'right'),
    a.fillText(String(t.issueLabel || ''), 692, 212),
    (a.textAlign = 'left'),
    (a.fillStyle = '#a3262b'),
    (a.font = 'bold 18px serif'),
    a.fillText('呈大人阅', 58, 252),
    (a.fillStyle = '#252a2c'),
    (a.font = 'bold 28px serif'),
    (function (e, t, a, r, n, i) {
      var o = arguments.length > 6 && void 0 !== arguments[6] ? arguments[6] : 2,
        s = Array.from(String(t || '')),
        l = [],
        c = '';
      (s.forEach(function (t) {
        var a = ''.concat(c).concat(t);
        c && e.measureText(a).width > n ? (l.push(c), (c = t)) : (c = a);
      }),
        c && l.push(c));
      var u = l.slice(0, o);
      (l.length > o && u.length && (u[u.length - 1] = O(e, u[u.length - 1], n)),
        u.forEach(function (t, n) {
          return e.fillText(t, a, r + n * i);
        }),
        u.length);
    })(a, t.followedNamesText || t.lead || '昨夜星光已整理完毕', 58, 288, 634, 38, 2));
  var r = (t.summaryCells || []).slice(0, 6);
  (r.forEach(function (e, t) {
    var r = 58 + 216 * (t % 3),
      n = 358 + 104 * Math.floor(t / 3);
    (U(a, r, n, 202, 92, 8),
      (a.fillStyle = 0 === t ? '#f5e9e5' : '#f3f0e9'),
      a.fill(),
      (a.fillStyle = 0 === t ? '#95242a' : '#252a2c'),
      (a.textAlign = 'center'),
      (a.font = 'bold 27px sans-serif'),
      a.fillText(String(e.value || '--'), r + 101, n + 39),
      (a.fillStyle = '#7a746d'),
      (a.font = '16px sans-serif'),
      a.fillText(String(e.label || ''), r + 101, n + 69));
  }),
    (a.textAlign = 'left'),
    (a.fillStyle = '#252a2c'),
    (a.font = 'bold 22px serif'),
    a.fillText('昨夜高光', 58, 598),
    (a.fillStyle = '#a3262b'),
    a.fillRect(58, 610, 82, 3));
  var n = (t.renderedActiveAnchors || []).slice(0, 3);
  (n.length
    ? n.forEach(function (e, t) {
        var r = 646 + 78 * t;
        (a.beginPath(),
          a.arc(79, r + 18, 21, 0, 2 * Math.PI),
          (a.fillStyle = 0 === t ? '#a3262b' : '#38675f'),
          a.fill(),
          (a.fillStyle = '#fffdf6'),
          (a.textAlign = 'center'),
          (a.font = 'bold 18px sans-serif'),
          a.fillText(String(e.initial || '播'), 79, r + 24),
          (a.textAlign = 'left'),
          (a.fillStyle = '#252a2c'),
          (a.font = 'bold 21px sans-serif'),
          a.fillText(O(a, e.nickname, 220), 116, r + 12),
          (a.fillStyle = '#77716b'),
          (a.font = '16px sans-serif'),
          a.fillText(O(a, e.headline || '昨夜留下了一段星光', 390), 116, r + 39),
          (a.textAlign = 'right'),
          (a.fillStyle = '#95242a'),
          (a.font = 'bold 18px sans-serif'),
          a.fillText(String(e.durationText || ''), 692, r + 13),
          (a.strokeStyle = 'rgba(30, 37, 40, 0.1)'),
          a.beginPath(),
          a.moveTo(116, r + 57),
          a.lineTo(692, r + 57),
          a.stroke());
      })
    : ((a.fillStyle = '#77716b'),
      (a.font = '20px serif'),
      a.fillText('昨夜星光静候，下一次开播见。', 58, 665)),
    (a.textAlign = 'left'),
    (a.fillStyle = '#655f59'),
    (a.font = '17px sans-serif'),
    a.fillText(String(t.readStreakText || '每日六点更新'), 58, 895),
    (a.fillStyle = '#8f2026'),
    (a.font = 'bold 20px serif'),
    a.fillText('i播播了么 · 为大人的爱播守候', 58, 927),
    a.save(),
    a.translate(627, 888),
    a.rotate(-0.12),
    (a.strokeStyle = '#a3262b'),
    (a.lineWidth = 4),
    a.strokeRect(-43, -43, 86, 86),
    (a.lineWidth = 1),
    a.strokeRect(-36, -36, 72, 72),
    (a.fillStyle = '#a3262b'),
    (a.textAlign = 'center'),
    (a.font = 'bold 28px serif'),
    a.fillText(t.is_read ? '已阅' : '待阅', 0, 10),
    a.restore(),
    (a.textAlign = 'center'),
    (a.fillStyle = '#918a81'),
    (a.font = '14px sans-serif'),
    a.fillText('数据不保证100%准确，仅供参考，不构成任何承诺和依据。', 375, 958));
}

Page({
  data: {
    statusBarHeight: 20,
    navigationHeight: 64,
    mascotThemeClass: 'theme-classic',
    performanceClass: h.className(),
    loading: !0,
    loadError: '',
    report: null,
    isRead: !1,
    sealAnimating: !1,
    ceremonyVisible: !1,
    ceremonyOpening: !1,
    ceremonyDateLabel: '',
    reportRevealAnimating: !1,
    digestForeground: !0,
    historyVisible: !1,
    historyDates: [],
    latestDate: '',
    shareCardGenerating: !1,
    shareCardVisible: !1,
    shareCardPath: '',
    heraldSrc: m,
    sealSrc: g,
  },
  onLoad: function () {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
    ((this.artworkDisposed = !1),
      this.loadDigestArtwork(),
      l.enableShareMenu(),
      this.setNavigationMetrics(),
      u.sync(this));
    var t = decodeURIComponent(String(e.date || '')).trim(),
      a = y();
    ((this.requestedDate = /^\d{4}-\d{2}-\d{2}$/.test(t) ? t : a),
      this.setData({
        latestDate: a,
        historyDates: k(a, this.requestedDate),
      }),
      this.loadDigest());
  },
  onShow: function () {
    (this.loadDigestArtwork(),
      this.setData({
        digestForeground: !0,
      }),
      c.sync(this, 'history'),
      u.sync(this));
  },
  onHide: function () {
    this.setData({
      digestForeground: !1,
    });
  },
  onDigestBottom: function () {
    if (
      !(
        this.data.loading ||
        !this.data.digestForeground ||
        this.data.ceremonyVisible ||
        this.data.historyVisible ||
        this.data.shareCardVisible
      ) &&
      this.data.report &&
      Number(this.data.report.followed_count)
    ) {
      var e = this.selectComponent('#digest-gratuity');
      e && e.reveal();
    }
  },
  onUnload: function () {
    ((this.artworkDisposed = !0),
      (this.digestLoadToken = Number(this.digestLoadToken || 0) + 1),
      clearTimeout(this.sealTimer),
      clearTimeout(this.sealImpactTimer),
      clearTimeout(this.stagedRenderTimer),
      clearTimeout(this.ceremonyImpactTimer),
      clearTimeout(this.ceremonyCloseTimer),
      clearTimeout(this.reportRevealTimer),
      (this.shareCardGeneratingPromise = null));
  },
  onPullDownRefresh: function () {
    (this.loadDigestArtwork(),
      this.loadDigest({
        fresh: !0,
      }).finally(function () {
        return wx.stopPullDownRefresh();
      }));
  },
  loadDigestArtwork: function () {
    var e = this;
    if (!this.artworkDisposed)
      for (
        var t = function () {
            var t = r(i[n], 2),
              o = t[0],
              s = t[1];
            f.load(o)
              .then(function (t) {
                s && !e.artworkDisposed && e.setData(a({}, s, t));
              })
              .catch(function () {});
          },
          n = 0,
          i = [
            ['tip', ''],
            ['herald', 'heraldSrc'],
            ['seal', 'sealSrc'],
          ];
        n < i.length;
        n++
      )
        t();
  },
  onDigestArtworkError: function (e) {
    var t = e.currentTarget.dataset.art;
    if (['herald', 'seal'].includes(t)) {
      var r = 'herald' === t ? 'heraldSrc' : 'sealSrc',
        n = 'herald' === t ? m : g;
      this.data[r] !== n && (f.invalidate(t), this.setData(a({}, r, n)));
    }
  },
  onShareAppMessage: function () {
    var e = this.data.report || {},
      t = Number(e.active_count || 0);
    return l.appMessage({
      title: t ? '昨夜我关注的'.concat(t, '位爱播开播了｜星光早报') : '我的专属星光早报',
      path: '/pages/daily-digest/daily-digest?date='.concat(
        encodeURIComponent(e.date || this.requestedDate)
      ),
    });
  },
  onShareTimeline: function () {
    var e = this.data.report || {};
    return l.timeline({
      title: '我的专属星光早报',
      query: 'date='.concat(encodeURIComponent(e.date || this.requestedDate)),
    });
  },
  setNavigationMetrics: function () {
    try {
      var e = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync(),
        t = wx.getMenuButtonBoundingClientRect(),
        a = e.statusBarHeight || 20,
        r = 2 * (t.top - a) + t.height + a;
      this.setData({
        statusBarHeight: a,
        navigationHeight: r,
      });
    } catch (e) {}
  },
  shouldShowCeremony: function (e) {
    if (!e || !e.date || e.date !== this.data.latestDate || !Number(e.followed_count || 0))
      return !1;
    try {
      var t = wx.getAccountInfoSync ? wx.getAccountInfoSync() : null;
      return (
        !(!t || 'develop' !== t.miniProgram.envVersion) ||
        wx.getStorageSync('dailyDigestCeremonyV1:lastOpenedDate') !== e.date
      );
    } catch (e) {
      return !0;
    }
  },
  rememberCeremony: function (e) {
    try {
      wx.setStorageSync('dailyDigestCeremonyV1:lastOpenedDate', String(e || ''));
    } catch (e) {}
  },
  openCeremony: function () {
    var e = this;
    if (this.data.ceremonyVisible && !this.data.ceremonyOpening) {
      var t = this.data.report || {};
      (this.rememberCeremony(t.date),
        wx.vibrateShort &&
          wx.vibrateShort({
            type: 'light',
            fail: function () {},
          }),
        clearTimeout(this.reportRevealTimer),
        this.setData({
          ceremonyOpening: !0,
          reportRevealAnimating: !0,
        }),
        clearTimeout(this.ceremonyImpactTimer),
        (this.ceremonyImpactTimer = setTimeout(
          function () {
            wx.vibrateShort &&
              wx.vibrateShort({
                type: 'medium',
                fail: function () {},
              });
          },
          this.data.performanceClass ? 80 : 430
        )));
      var a = this.data.performanceClass ? 320 : 1960;
      (clearTimeout(this.ceremonyCloseTimer),
        (this.ceremonyCloseTimer = setTimeout(function () {
          (e.setData({
            ceremonyVisible: !1,
            ceremonyOpening: !1,
          }),
            clearTimeout(e.reportRevealTimer),
            (e.reportRevealTimer = setTimeout(
              function () {
                e.setData({
                  reportRevealAnimating: !1,
                });
              },
              e.data.performanceClass ? 80 : 120
            )));
        }, a)));
    }
  },
  skipCeremony: function () {
    var e = this.data.report || {};
    (this.rememberCeremony(e.date),
      clearTimeout(this.ceremonyImpactTimer),
      clearTimeout(this.ceremonyCloseTimer),
      this.setData({
        ceremonyVisible: !1,
        ceremonyOpening: !1,
        reportRevealAnimating: !1,
      }));
  },
  keepCeremonyStill: function () {},
  applyDigest: function (e) {
    var t = this,
      a = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
    clearTimeout(this.stagedRenderTimer);
    var r = V(e),
      n = r.activeAnchors,
      o = r.restingAnchors;
    (delete r.activeAnchors, delete r.restingAnchors);
    var s = !1 !== a.stage && (n.length > 3 || o.length > 4),
      l = i(
        i({}, r),
        {},
        {
          renderedActiveAnchors: s ? n.slice(0, 3) : n,
          renderedRestingAnchors: s ? o.slice(0, 4) : o,
        }
      ),
      c = this.data.ceremonyVisible || this.shouldShowCeremony(l),
      u = L(l),
      d = u === this.currentShareCardKey;
    if (
      ((this.currentShareCardKey = u),
      (this.digestSource = e),
      this.setData({
        report: l,
        isRead: Boolean(e && e.is_read),
        loading: !1,
        loadError: '',
        ceremonyVisible: c,
        ceremonyDateLabel: c ? l.dateLabel : '',
        shareCardPath: d ? this.data.shareCardPath : '',
        shareCardVisible: !!d && this.data.shareCardVisible,
      }),
      s)
    ) {
      var h = (this.stagedRenderToken || 0) + 1;
      ((this.stagedRenderToken = h),
        (this.stagedRenderTimer = setTimeout(function () {
          h === t.stagedRenderToken &&
            t.setData({
              'report.renderedActiveAnchors': n,
              'report.renderedRestingAnchors': o,
            });
        }, 120)));
    }
  },
  loadDigest: function () {
    var a = arguments,
      r = this;
    return t(
      e().mark(function t() {
        var n, i, o, l, c, u, h, f, m;
        return e().wrap(
          function (e) {
            for (;;)
              switch ((e.prev = e.next)) {
                case 0:
                  return (
                    a.length > 0 && void 0 !== a[0] ? a[0] : {},
                    (n = r.requestedDate),
                    (i = (r.digestLoadToken || 0) + 1),
                    (r.digestLoadToken = i),
                    (r.stagedRenderToken = Number(r.stagedRenderToken || 0) + 1),
                    clearTimeout(r.stagedRenderTimer),
                    (o = p(n)),
                    (l = d.read(o, 432e5)),
                    (c = !1),
                    (u = ''),
                    l && l.data
                      ? ((u = JSON.stringify(l.data)), r.applyDigest(l.data), (c = !0))
                      : r.setData({
                          loading: !0,
                          loadError: '',
                        }),
                    (e.prev = 11),
                    (e.next = 14),
                    s.fetchDailyDigest(n, {
                      fresh: !0,
                    })
                  );

                case 14:
                  if (((h = e.sent), i === r.digestLoadToken && n === r.requestedDate)) {
                    e.next = 17;
                    break;
                  }
                  return e.abrupt('return');

                case 17:
                  ((f = h && h.data ? h.data : {}),
                    (m = JSON.stringify(f)),
                    d.write(o, f),
                    c && m === u
                      ? ((r.digestSource = f),
                        r.setData({
                          loading: !1,
                          loadError: '',
                        }))
                      : r.applyDigest(f),
                    (e.next = 28));
                  break;

                case 23:
                  if (
                    ((e.prev = 23),
                    (e.t0 = e.catch(11)),
                    i === r.digestLoadToken && n === r.requestedDate)
                  ) {
                    e.next = 27;
                    break;
                  }
                  return e.abrupt('return');

                case 27:
                  c
                    ? r.setData({
                        loading: !1,
                        loadError: '',
                      })
                    : r.setData({
                        loading: !1,
                        loadError:
                          404 === e.t0.statusCode
                            ? '星光早报接口尚未发布，请稍后再试'
                            : e.t0.message || '星光早报暂时没有送达',
                      });

                case 28:
                case 'end':
                  return e.stop();
              }
          },
          t,
          null,
          [[11, 23]]
        );
      })
    )();
  },
  openHistory: function () {
    (wx.vibrateShort &&
      wx.vibrateShort({
        type: 'light',
        fail: function () {},
      }),
      this.setData({
        historyVisible: !0,
      }));
  },
  closeHistory: function () {
    this.setData({
      historyVisible: !1,
    });
  },
  keepHistoryOpen: function () {},
  selectHistoryDate: function (e) {
    var t = String(e.currentTarget.dataset.date || '');
    if (T(t)) {
      var a = t !== this.requestedDate;
      ((this.requestedDate = t),
        clearTimeout(this.sealTimer),
        clearTimeout(this.sealImpactTimer),
        this.setData({
          historyVisible: !1,
          sealAnimating: !1,
          shareCardVisible: !1,
          historyDates: k(this.data.latestDate, t),
        }),
        a && this.loadDigest());
    }
  },
  generateShareCard: function () {
    var e = this;
    if (!this.data.report || this.data.shareCardGenerating)
      return this.shareCardGeneratingPromise || Promise.resolve('');
    var t = L(this.data.report);
    if (this.data.shareCardPath && t === this.currentShareCardKey)
      return (
        this.setData({
          shareCardVisible: !0,
        }),
        Promise.resolve(this.data.shareCardPath)
      );
    this.setData({
      shareCardGenerating: !0,
    });
    var a = new Promise(function (t, a) {
      ('function' == typeof e.createSelectorQuery
        ? e.createSelectorQuery()
        : wx.createSelectorQuery()
      )
        .select('#digest-share-canvas')
        .fields({
          node: !0,
          size: !0,
        })
        .exec(function (r) {
          var n = r && r[0] ? r[0].node : null;
          if (n) {
            try {
              H(n, e.data.report);
            } catch (e) {
              return void a(e);
            }
            wx.canvasToTempFilePath(
              {
                canvas: n,
                x: 0,
                y: 0,
                width: 750,
                height: 1e3,
                destWidth: 750,
                destHeight: 1e3,
                fileType: 'png',
                quality: 1,
                success: function (e) {
                  return t(e.tempFilePath);
                },
                fail: a,
              },
              e
            );
          } else a(new Error('分享卡画布初始化失败'));
        });
    })
      .then(function (a) {
        return t !== e.currentShareCardKey
          ? ''
          : (wx.vibrateShort &&
              wx.vibrateShort({
                type: 'light',
                fail: function () {},
              }),
            e.setData({
              shareCardPath: a,
              shareCardVisible: !0,
            }),
            a);
      })
      .catch(function (e) {
        return (
          wx.showToast({
            title: e.message || '分享卡生成失败',
            icon: 'none',
          }),
          ''
        );
      })
      .finally(function () {
        ((e.shareCardGeneratingPromise = null),
          e.setData({
            shareCardGenerating: !1,
          }));
      });
    return ((this.shareCardGeneratingPromise = a), a);
  },
  closeShareCard: function () {
    this.setData({
      shareCardVisible: !1,
    });
  },
  keepShareCardOpen: function () {},
  previewShareCard: function () {
    var e = this.data.shareCardPath;
    e &&
      wx.previewImage({
        current: e,
        urls: [e],
      });
  },
  shareShareCard: function () {
    var a = this;
    return t(
      e().mark(function t() {
        var r;
        return e().wrap(function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                if (((e.t0 = a.data.shareCardPath), e.t0)) {
                  e.next = 5;
                  break;
                }
                return ((e.next = 4), a.generateShareCard());

              case 4:
                e.t0 = e.sent;

              case 5:
                if ((r = e.t0)) {
                  e.next = 8;
                  break;
                }
                return e.abrupt('return');

              case 8:
                if ('function' == typeof wx.showShareImageMenu) {
                  e.next = 11;
                  break;
                }
                return (a.previewShareCard(), e.abrupt('return'));

              case 11:
                wx.showShareImageMenu({
                  path: r,
                  fail: function (e) {
                    String((e && e.errMsg) || '').includes('cancel') || a.previewShareCard();
                  },
                });

              case 12:
              case 'end':
                return e.stop();
            }
        }, t);
      })
    )();
  },
  approveDigest: function () {
    var a = this;
    return t(
      e().mark(function t() {
        var r, n, o, l, c, u, h, f, m;
        return e().wrap(
          function (e) {
            for (;;)
              switch ((e.prev = e.next)) {
                case 0:
                  if (!a.data.sealAnimating) {
                    e.next = 2;
                    break;
                  }
                  return e.abrupt('return');

                case 2:
                  if (!a.data.isRead) {
                    e.next = 10;
                    break;
                  }
                  return (
                    wx.vibrateShort &&
                      wx.vibrateShort({
                        type: 'light',
                        fail: function () {},
                      }),
                    a.setData({
                      sealAnimating: !0,
                    }),
                    clearTimeout(a.sealImpactTimer),
                    (a.sealImpactTimer = setTimeout(function () {
                      wx.vibrateShort &&
                        wx.vibrateShort({
                          type: 'medium',
                          fail: function () {},
                        });
                    }, 470)),
                    clearTimeout(a.sealTimer),
                    (a.sealTimer = setTimeout(function () {
                      a.setData({
                        sealAnimating: !1,
                      });
                    }, 980)),
                    e.abrupt('return')
                  );

                case 10:
                  return (
                    (r = a.data.report.date),
                    (n = a.digestSource),
                    wx.vibrateShort &&
                      wx.vibrateShort({
                        type: 'light',
                        fail: function () {},
                      }),
                    clearTimeout(a.sealImpactTimer),
                    (a.sealImpactTimer = setTimeout(function () {
                      wx.vibrateShort &&
                        wx.vibrateShort({
                          type: 'medium',
                          fail: function () {},
                        });
                    }, 470)),
                    a.setData({
                      sealAnimating: !0,
                    }),
                    (o = Date.now()),
                    (e.prev = 17),
                    (l = Math.floor(Date.now() / 1e3)),
                    (e.next = 21),
                    s.markDailyDigestRead(r)
                  );

                case 21:
                  if (
                    ((c = e.sent),
                    (u = c && c.data ? c.data : {}),
                    (l = Number(u.read_at || l)),
                    (a.confirmedReadStreak = Number(u.read_streak || 0)),
                    (h = Math.max(
                      1,
                      Number(a.confirmedReadStreak || (n && n.next_read_streak) || 1)
                    )),
                    (f = i(
                      i({}, n || {}),
                      {},
                      {
                        is_read: !0,
                        unread: !1,
                        read_at: l,
                        read_streak: h,
                        next_read_streak: h,
                      }
                    )),
                    d.write(p(r), f),
                    a.data.report && a.data.report.date === r)
                  ) {
                    e.next = 31;
                    break;
                  }
                  return ((a.confirmedReadStreak = 0), e.abrupt('return'));

                case 31:
                  ((m = Math.max(0, 980 - (Date.now() - o))),
                    clearTimeout(a.sealTimer),
                    (a.sealTimer = setTimeout(function () {
                      if (a.data.report && a.data.report.date === r) {
                        var e = i(
                          i({}, a.data.report),
                          {},
                          {
                            is_read: !0,
                            unread: !1,
                            read_at: l,
                            readTimeText: x(l),
                            readStreak: h,
                            nextReadStreak: h,
                            readStreakText: '连续批阅 '.concat(h, ' 天'),
                          }
                        );
                        ((a.digestSource = f),
                          (a.confirmedReadStreak = 0),
                          (a.currentShareCardKey = L(e)),
                          a.setData({
                            report: e,
                            isRead: !0,
                            sealAnimating: !1,
                            shareCardPath: '',
                            shareCardVisible: !1,
                          }));
                      }
                    }, m)),
                    (e.next = 43));
                  break;

                case 36:
                  if (
                    ((e.prev = 36),
                    (e.t0 = e.catch(17)),
                    clearTimeout(a.sealImpactTimer),
                    a.data.report && a.data.report.date === r)
                  ) {
                    e.next = 41;
                    break;
                  }
                  return e.abrupt('return');

                case 41:
                  (a.setData({
                    sealAnimating: !1,
                  }),
                    wx.showToast({
                      title: e.t0.message || '批阅失败，请重试',
                      icon: 'none',
                    }));

                case 43:
                case 'end':
                  return e.stop();
              }
          },
          t,
          null,
          [[17, 36]]
        );
      })
    )();
  },
});
