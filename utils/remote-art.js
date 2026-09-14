'use strict';

var e = require('../@babel/runtime/helpers/toConsumableArray');

require('../@babel/runtime/helpers/Arrayincludes');

var r = require('../@babel/runtime/helpers/createForOfIteratorHelper'),
  t = require('../@babel/runtime/helpers/regeneratorRuntime'),
  n = require('../@babel/runtime/helpers/asyncToGenerator'),
  a = require('../@babel/runtime/helpers/slicedToArray');

require('../@babel/runtime/helpers/Objectentries');

var c = require('../@babel/runtime/helpers/typeof'),
  s = require('../@babel/runtime/helpers/objectSpread2'),
  o = require('../config/env'),
  i = require('./remote-art-manifest'),
  u = s({}, i),
  l = null,
  h = 0,
  f = 0,
  p = !1,
  w = new Map(),
  m = new Map(),
  d = new Map(),
  b = [],
  y = 0,
  v = function (e, r, t) {
    return new Promise(function (n, a) {
      return e[r](
        s(
          s({}, t),
          {},
          {
            success: n,
            fail: a,
          }
        )
      );
    });
  },
  g = function (e) {
    if (!Object.prototype.hasOwnProperty.call(u, e)) throw new Error('Unknown artwork');
    return u[e];
  },
  x = function (e) {
    return ''.concat(wx.env.USER_DATA_PATH, '/ibo-remote-art-').concat(e.name);
  };

function k(e) {
  if (!e || 1 !== e.schema || !e.assets || 'object' !== c(e.assets) || Array.isArray(e.assets))
    throw new Error('Invalid artwork catalog');
  for (var r = s({}, i), t = 0, n = Object.entries(i); t < n.length; t++) {
    var o = a(n[t], 2),
      u = o[0],
      l = o[1],
      h = e.assets[u];
    if (
      !h ||
      !Number.isInteger(h.bytes) ||
      h.bytes <= 0 ||
      h.bytes > 4194304 ||
      h.width !== l.width ||
      h.height !== l.height ||
      !/^[a-f0-9]{32}$/.test(h.md5) ||
      !/^[a-f0-9]{64}$/.test(h.sha256) ||
      h.name !== ''.concat(u, '-').concat(h.sha256.slice(0, 16), '.png')
    )
      throw new Error('Invalid artwork descriptor');
    r[u] = s(
      s({}, l),
      {},
      {
        name: h.name,
        bytes: h.bytes,
        md5: h.md5,
        sha256: h.sha256,
      }
    );
  }
  return r;
}

function A() {
  if (!p) {
    p = !0;
    try {
      var e = wx.getStorageSync('iboArtworkCatalogV1');
      ((u = k(e)), Number.isFinite(e.checkedAt) && e.checkedAt <= Date.now() && (h = e.checkedAt));
    } catch (e) {}
  }
}

function E() {
  return (
    A(),
    l ||
      ((h && Date.now() - h < 3e5) || Date.now() < f
        ? Promise.resolve(!1)
        : (l = n(
            t().mark(function e() {
              var r, n;
              return t().wrap(
                function (e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        return (
                          (e.prev = 0),
                          (e.next = 3),
                          v(wx, 'request', {
                            url: ''
                              .concat(
                                o.API_BASE_URL,
                                '/static/tutorials/miniapp-art/catalog-v1.json?v='
                              )
                              .concat(Math.floor(Date.now() / 3e5)),
                            method: 'GET',
                            dataType: 'json',
                            timeout: 2500,
                            header: {
                              'Cache-Control': 'no-cache',
                            },
                          })
                        );

                      case 3:
                        if (200 === (r = e.sent).statusCode) {
                          e.next = 6;
                          break;
                        }
                        throw new Error('Artwork catalog unavailable');

                      case 6:
                        ((n = k(r.data)), (u = n), (h = Date.now()));
                        try {
                          wx.setStorageSync('iboArtworkCatalogV1', {
                            schema: 1,
                            assets: n,
                            checkedAt: h,
                          });
                        } catch (e) {}
                        return e.abrupt('return', !0);

                      case 13:
                        return (
                          (e.prev = 13),
                          (e.t0 = e.catch(0)),
                          (f = Date.now() + 3e4),
                          e.abrupt('return', !1)
                        );

                      case 17:
                      case 'end':
                        return e.stop();
                    }
                },
                e,
                null,
                [[0, 13]]
              );
            })
          )().finally(function () {
            l = null;
          })))
  );
}

function S(e, r) {
  try {
    e.unlinkSync(r);
  } catch (e) {}
}

function P(e, r, t) {
  return q.apply(this, arguments);
}

function q() {
  return (q = n(
    t().mark(function e(r, n, a) {
      var c, s;
      return t().wrap(function (e) {
        for (;;)
          switch ((e.prev = e.next)) {
            case 0:
              return (
                (e.next = 2),
                v(r, 'getFileInfo', {
                  filePath: n,
                  digestAlgorithm: 'md5',
                })
              );

            case 2:
              if ((c = e.sent).size === a.bytes && c.digest === a.md5) {
                e.next = 5;
                break;
              }
              throw new Error('Artwork checksum mismatch');

            case 5:
              return (
                (e.next = 7),
                v(wx, 'getImageInfo', {
                  src: n,
                })
              );

            case 7:
              if ((s = e.sent).width === a.width && s.height === a.height) {
                e.next = 10;
                break;
              }
              throw new Error('Artwork dimensions mismatch');

            case 10:
            case 'end':
              return e.stop();
          }
      }, e);
    })
  )).apply(this, arguments);
}

function T(e, r) {
  return _.apply(this, arguments);
}

function _() {
  return (_ = n(
    t().mark(function n(a, c) {
      var s, i, u, l, h, f, p, m, d;
      return t().wrap(
        function (t) {
          for (;;)
            switch ((t.prev = t.next)) {
              case 0:
                return (
                  (s = wx.getFileSystemManager()),
                  (i = x(c)),
                  (u = i + '.part'),
                  (t.prev = 1),
                  (t.next = 4),
                  P(s, i, c)
                );

              case 4:
                return (w.set(c.name, i), t.abrupt('return', i));

              case 8:
                ((t.prev = 8), (t.t0 = t.catch(1)), S(s, i));

              case 11:
                return (
                  (t.next = 13),
                  v(wx, 'request', {
                    url: ''.concat(o.API_BASE_URL, '/static/tutorials/miniapp-art/').concat(c.name),
                    method: 'GET',
                    responseType: 'arraybuffer',
                    timeout: 12e3,
                  })
                );

              case 13:
                if (200 === (l = t.sent).statusCode && l.data && l.data.byteLength === c.bytes) {
                  t.next = 16;
                  break;
                }
                throw new Error('Artwork download incomplete');

              case 16:
                return (
                  (t.prev = 16),
                  (t.next = 19),
                  v(s, 'writeFile', {
                    filePath: u,
                    data: l.data,
                  })
                );

              case 19:
                return ((t.next = 21), P(s, u, c));

              case 21:
                return (
                  (t.next = 23),
                  v(s, 'rename', {
                    oldPath: u,
                    newPath: i,
                  })
                );

              case 23:
                (w.set(c.name, i),
                  (h = new RegExp('^ibo-remote-art-'.concat(a, '-[a-f0-9]{16}\\.png$'))));
                try {
                  f = r(s.readdirSync(wx.env.USER_DATA_PATH));
                  try {
                    for (f.s(); !(p = f.n()).done; )
                      ((m = p.value),
                        (d = ''.concat(wx.env.USER_DATA_PATH, '/').concat(m)),
                        h.test(m) && d !== i && !e(w.values()).includes(d) && S(s, d));
                  } catch (e) {
                    f.e(e);
                  } finally {
                    f.f();
                  }
                } catch (e) {}
                return t.abrupt('return', i);

              case 27:
                return ((t.prev = 27), S(s, u), t.finish(27));

              case 30:
              case 'end':
                return t.stop();
            }
        },
        n,
        null,
        [
          [1, 8],
          [16, , 27, 30],
        ]
      );
    })
  )).apply(this, arguments);
}

function D(e, r) {
  var a = r.name,
    c = w.get(a);
  if (c)
    try {
      wx.getFileSystemManager().accessSync(c);
    } catch (e) {
      w.delete(a);
    }
  if (w.has(a)) return Promise.resolve(c);
  if (m.has(a)) return m.get(a);
  if (Date.now() < (d.get(a) || 0)) return Promise.reject(new Error('Artwork retry delayed'));
  var s = n(
    t().mark(function n() {
      var c;
      return t().wrap(
        function (t) {
          for (;;)
            switch ((t.prev = t.next)) {
              case 0:
                if (!(y >= 2)) {
                  t.next = 5;
                  break;
                }
                return (
                  (t.next = 3),
                  new Promise(function (e) {
                    return b.push(e);
                  })
                );

              case 3:
                t.next = 6;
                break;

              case 5:
                y++;

              case 6:
                return ((t.prev = 6), (t.next = 9), T(e, r));

              case 9:
                return t.abrupt('return', t.sent);

              case 12:
                throw ((t.prev = 12), (t.t0 = t.catch(6)), d.set(a, Date.now() + 3e4), t.t0);

              case 16:
                return ((t.prev = 16), (c = b.shift()) ? c() : y--, t.finish(16));

              case 20:
              case 'end':
                return t.stop();
            }
        },
        n,
        null,
        [[6, 12, 16, 20]]
      );
    })
  )();
  return (
    m.set(a, s),
    s.then(
      function () {
        (m.delete(a), d.delete(a));
      },
      function () {
        return m.delete(a);
      }
    ),
    s
  );
}

function I() {
  return (I = n(
    t().mark(function e(r) {
      var n;
      return t().wrap(function (e) {
        for (;;)
          switch ((e.prev = e.next)) {
            case 0:
              return (r.forEach(g), (e.next = 3), E());

            case 3:
              return (
                (n = r.map(g)),
                e.abrupt(
                  'return',
                  Promise.all(
                    r.map(function (e, r) {
                      return D(e, n[r]);
                    })
                  )
                )
              );

            case 5:
            case 'end':
              return e.stop();
          }
      }, e);
    })
  )).apply(this, arguments);
}

module.exports = {
  load: function (e) {
    return (A(), D(e, g(e)));
  },
  loadGroup: function (e) {
    return I.apply(this, arguments);
  },
  refreshManifest: E,
  cached: function (e) {
    A();
    var r = g(e).name,
      t = w.get(r);
    if (!t) return '';
    try {
      return (wx.getFileSystemManager().accessSync(t), t);
    } catch (e) {
      return (w.delete(r), '');
    }
  },
  invalidate: function (e) {
    var r = g(e);
    w.delete(r.name);
    try {
      S(
        wx.getFileSystemManager(),
        (function (e) {
          return x(g(e));
        })(e)
      );
    } catch (e) {}
  },
  url: function (e) {
    return ''.concat(o.API_BASE_URL, '/static/tutorials/miniapp-art/').concat(g(e).name);
  },
  fallback: function (e) {
    if (!Object.prototype.hasOwnProperty.call(i, e) || !i[e].fallback)
      throw new Error('No offline artwork');
    return i[e].fallback;
  },
};
