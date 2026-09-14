'use strict';

require('../@babel/runtime/helpers/Arrayincludes');

var e = require('../@babel/runtime/helpers/regeneratorRuntime'),
  n = require('../@babel/runtime/helpers/asyncToGenerator'),
  t = require('../@babel/runtime/helpers/createForOfIteratorHelper'),
  r = require('./api'),
  a = new Set(),
  c = new Set(),
  u = null,
  i = !1,
  l = !0,
  o = !1,
  s = 0,
  f = null,
  d = null,
  p = null,
  m = null,
  b = 2e3,
  h = null,
  k = [],
  _ = !1;

function v(e) {
  var n,
    r = t(a);
  try {
    for (r.s(); !(n = r.n()).done; ) {
      (0, n.value)(e);
    }
  } catch (e) {
    r.e(e);
  } finally {
    r.f();
  }
}

function y() {
  (s++,
    (o = !1),
    clearTimeout(f),
    clearTimeout(p),
    clearTimeout(m),
    (f = p = m = null),
    (k = []),
    (h = null),
    v(null));
  var e = u;
  ((u = null),
    e &&
      e.close({
        code: 1e3,
        reason: 'inactive',
      }));
}

function T() {
  if ((clearTimeout(p), (h = null), !i || !l || !a.size)) return ((k = []), void v(null));
  for (; k.length; ) {
    var e = k.shift();
    if (Date.now() / 1e3 - e.created_at <= 60) {
      h = e;
      break;
    }
  }
  (v(h),
    (p = h
      ? setTimeout(function () {
          ((h = null), v(null), (p = setTimeout(T, 2e3)));
        }, 3200)
      : null));
}

function x(e) {
  if (
    !(
      !Number.isSafeInteger(e.id) ||
      !Number.isInteger(e.calls) ||
      e.calls < 1 ||
      !Number.isFinite(e.created_at) ||
      Date.now() / 1e3 - e.created_at > 60 ||
      'string' != typeof e.nickname ||
      'string' != typeof e.anchor_name ||
      c.has(e.id)
    )
  ) {
    (c.add(e.id), c.size > 300 && c.delete(c.values().next().value));
    var n = {
        id: e.id,
        actor: String(e.actor || ''),
        nickname: e.nickname.slice(0, 24),
        anchor_account: String(e.anchor_account || ''),
        anchor_name: e.anchor_name.slice(0, 32),
        calls: e.calls,
        created_at: e.created_at,
      },
      t = k.find(function (e) {
        return e.actor === n.actor && e.anchor_account === n.anchor_account;
      });
    (t
      ? ((t.calls += n.calls), (t.created_at = n.created_at))
      : (k.push(n), k.length > 3 && k.shift()),
      h || p || T());
  }
}

function g() {
  i &&
    l &&
    a.size &&
    !f &&
    !_ &&
    ((f = setTimeout(function () {
      ((f = null), w());
    }, b)),
    (b = Math.min(6e4, 2 * b)));
}

function w() {
  return N.apply(this, arguments);
}

function N() {
  return (N = n(
    e().mark(function n() {
      var t, c, f, d, p, h;
      return e().wrap(
        function (e) {
          for (;;)
            switch ((e.prev = e.next)) {
              case 0:
                if (i && l && a.size && !u && !o && !_) {
                  e.next = 2;
                  break;
                }
                return e.abrupt('return');

              case 2:
                return (
                  (o = !0),
                  (t = ++s),
                  (e.prev = 4),
                  (c = function () {
                    t === s && ((h = !0), clearTimeout(m), (m = null), u === p && (u = null), g());
                  }),
                  (e.next = 8),
                  r.fetchCallChannel()
                );

              case 8:
                if (((f = e.sent), t === s && i && l)) {
                  e.next = 11;
                  break;
                }
                return e.abrupt('return');

              case 11:
                if ((d = f.data || {}).enabled) {
                  e.next = 15;
                  break;
                }
                return ((_ = !0), e.abrupt('return'));

              case 15:
                if (/^wss:\/\//.test(d.url) && d.ticket && 'function' == typeof wx.connectSocket) {
                  e.next = 18;
                  break;
                }
                return ((_ = !0), e.abrupt('return'));

              case 18:
                if (
                  ((p = null),
                  (h = !1),
                  (p = wx.connectSocket({
                    url: d.url,
                    success: function () {},
                    fail: function () {
                      c();
                    },
                  })),
                  !h && p)
                ) {
                  e.next = 24;
                  break;
                }
                return (
                  p &&
                    p.close({
                      code: 1e3,
                    }),
                  e.abrupt('return')
                );

              case 24:
                ((u = p),
                  p.onOpen(function () {
                    t === s &&
                      p.send({
                        data: JSON.stringify({
                          type: 'auth',
                          ticket: d.ticket,
                        }),
                        fail: c,
                      });
                  }),
                  p.onMessage(function (e) {
                    if (t === s)
                      try {
                        var n = JSON.parse(e.data);
                        ('ready' === n.type && (clearTimeout(m), (m = null), (b = 2e3)),
                          'call' === n.type && x(n));
                      } catch (e) {}
                  }),
                  p.onClose(c),
                  p.onError(function () {
                    (p.close({
                      code: 1e3,
                    }),
                      c());
                  }),
                  (m = setTimeout(function () {
                    (p.close({
                      code: 1e3,
                    }),
                      c());
                  }, 1e4)),
                  (e.next = 37));
                break;

              case 32:
                if (((e.prev = 32), (e.t0 = e.catch(4)), t === s)) {
                  e.next = 36;
                  break;
                }
                return e.abrupt('return');

              case 36:
                ['NOT_FOUND', 'API_NOT_FOUND'].includes(e.t0.code) ? (_ = !0) : g();

              case 37:
                return ((e.prev = 37), t === s && (o = !1), e.finish(37));

              case 40:
              case 'end':
                return e.stop();
            }
        },
        n,
        null,
        [[4, 32, 37, 40]]
      );
    })
  )).apply(this, arguments);
}

module.exports = {
  foreground: function (e) {
    (i = Boolean(e)) ? ((_ = !1), w()) : y();
  },
  setEnabled: function (e) {
    (l = Boolean(e)) ? ((_ = !1), w()) : y();
  },
  subscribe: function (e) {
    return (
      clearTimeout(d),
      a.add(e),
      e(h),
      w(),
      function () {
        (a.delete(e),
          a.size ||
            (d = setTimeout(function () {
              a.size || y();
            }, 150)));
      }
    );
  },
  dismiss: function () {
    T();
  },
};
