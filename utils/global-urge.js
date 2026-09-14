'use strict';

var t = Date.UTC(2026, 7, 20, 16, 0, 0),
  e = (function () {
    for (var t = [0], e = 1831565813, r = 0; r < 1024; r += 1)
      ((e = (Math.imul(e, 1664525) + 1013904223) >>> 0), t.push(t[r] + (e % 10) + 1));
    return t;
  })(),
  r = e[1024];

module.exports = {
  GLOBAL_URGE_EPOCH_MS: t,
  GLOBAL_URGE_TICK_MS: 2e3,
  countAt: function () {
    var n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : Date.now(),
      o = Math.max(0, Number(n) - t),
      u = Math.floor(o / 2e3),
      a = Math.floor(u / 1024),
      i = u % 1024;
    return a * r + e[i];
  },
  millisecondsUntilNextTick: function () {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : Date.now(),
      r = Number(e);
    if (r < t) return t - r;
    var n = r - t;
    return 2e3 - (n % 2e3);
  },
};
