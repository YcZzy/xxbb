'use strict';

var a = require('../../@babel/runtime/helpers/slicedToArray');

module.exports = {
  drawSilk: function (r, e, t) {
    var o = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 0;
    function l(a, r, l) {
      var i = 0.1 * Math.sin(6.6 * a + 0.24 * o + l),
        n = Math.sin(a * Math.PI) * Math.cos(0.16 * o) * 0.14,
        h = 0.17 * Math.sin(4.8 * a + 1.3 * l + 0.12 * o);
      return [
        e * (l ? 1.68 * a - 0.24 + i + r * h : 1.22 - 1.8 * a + i + n + r * h),
        t * (l ? 0.11 + 0.6 * a : 0.96 * a - 0.08) +
          15 * Math.sin(8 * a + 0.2 * o) +
          r * (25 + 30 * a),
      ];
    }
    function i(e, t) {
      r.beginPath();
      for (var o = 0; o <= 60; o++) {
        var i = l(o / 60, e, t),
          n = a(i, 2),
          h = n[0],
          s = n[1];
        o ? r.lineTo(h, s) : r.moveTo(h, s);
      }
      r.stroke();
    }
    r.clearRect(0, 0, e, t);
    for (
      var n = r.createLinearGradient(e, 0, 0, t),
        h = 0,
        s = [
          [0, '#c6b08c00'],
          [0.12, '#bdab8899'],
          [0.28, '#b49b72d9'],
          [0.43, '#dfceb499'],
          [0.7, '#baa78266'],
          [1, '#baa78200'],
        ];
      h < s.length;
      h++
    ) {
      var b = a(s[h], 2),
        d = b[0],
        v = b[1];
      n.addColorStop(d, v);
    }
    for (
      var f = r.createLinearGradient(0, 0, e, t),
        c = 0,
        M = [
          [0, '#85af9f00'],
          [0.35, '#7ea896b3'],
          [0.75, '#aabdaf33'],
          [1, '#aabdaf00'],
        ];
      c < M.length;
      c++
    ) {
      var p = a(M[c], 2),
        g = p[0],
        u = p[1];
      f.addColorStop(g, u);
    }
    for (var k = 0; k < 2; k++) {
      r.strokeStyle = k ? f : n;
      for (var A = 0; A < 38; A++) {
        var P = A / 37;
        ((r.lineWidth = 1 + 2.7 * Math.sin(P * Math.PI)),
          (r.globalAlpha =
            (k ? 0.035 : 0.055) + Math.pow(Math.sin(P * Math.PI * 2.5), 8) * (k ? 0.09 : 0.2)),
          i(P, k));
      }
      ((r.lineWidth = 0.7), (r.globalAlpha = k ? 0.26 : 0.6), i(0.08, k), i(0.94, k));
    }
    (r.save(),
      r.translate(0.76 * e, 0.48 * t),
      r.rotate(0.08 * Math.sin(0.12 * o) - 0.36),
      (r.strokeStyle = '#b9a67f'));
    for (var S = 0; S < 3; S++)
      ((r.globalAlpha = 0.21 - 0.045 * S),
        (r.lineWidth = 0.6),
        r.beginPath(),
        r.ellipse(0, 0, e * (0.3 + 0.028 * S), e * (0.105 + 0.014 * S), 0, 0.25 + S, 4.8 + 0.4 * S),
        r.stroke());
    (r.restore(), (r.globalAlpha = 1));
  },
};
