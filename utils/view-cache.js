'use strict';

var e = ''.concat('viewCacheV1:', 'index'),
  t = require('./session-scope');

function c(t) {
  try {
    wx.removeStorageSync(''.concat('viewCacheV1:').concat(t));
    var c = wx.getStorageSync(e);
    Array.isArray(c) &&
      wx.setStorageSync(
        e,
        c.filter(function (e) {
          return e && e.key !== t;
        })
      );
  } catch (e) {}
}

module.exports = {
  read: function (e, r) {
    try {
      var a = wx.getStorageSync(''.concat('viewCacheV1:').concat(e)),
        n = t.current();
      if (!n || !a || a.scope !== n) return null;
      if (!a || void 0 === a.data || !Number(a.cachedAt)) return null;
      var o = Math.max(0, Date.now() - Number(a.cachedAt));
      return Number(r) > 0 && o > Number(r)
        ? (c(e), null)
        : {
            data: a.data,
            cachedAt: Number(a.cachedAt),
            ageMs: o,
          };
    } catch (e) {
      return null;
    }
  },
  write: function (c, r) {
    try {
      var a = t.current();
      if (!a) return;
      var n = ''.concat('viewCacheV1:').concat(c),
        o = Date.now();
      wx.setStorageSync(n, {
        data: r,
        scope: a,
        cachedAt: o,
      });
      var u = wx.getStorageSync(e),
        i = (Array.isArray(u) ? u : []).filter(function (e) {
          return e && e.key !== c;
        });
      (i.unshift({
        key: c,
        cachedAt: o,
      }),
        i.splice(48).forEach(function (e) {
          e && e.key && wx.removeStorageSync(''.concat('viewCacheV1:').concat(e.key));
        }),
        wx.setStorageSync(e, i));
    } catch (e) {}
  },
  remove: c,
};
