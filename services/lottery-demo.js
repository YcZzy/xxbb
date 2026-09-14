'use strict';

var e = require('../@babel/runtime/helpers/objectSpread2');

require('../@babel/runtime/helpers/Arrayincludes');

var r = require('./lottery-clock').countdownView,
  t = ['60829777'];

function n(e) {
  try {
    var r = e.getAccountInfoSync().miniProgram.envVersion,
      t = e.getDeviceInfo ? e.getDeviceInfo() : e.getSystemInfoSync();
    return 'develop' === r && 'devtools' === t.platform;
  } catch (e) {
    return !1;
  }
}

module.exports = {
  canPreview: n,
  subscribeLotteryDemo: function (o, i, u) {
    var c = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {},
      a = c.api || ('undefined' == typeof wx ? null : wx);
    if (!n(a) || !t.includes(String(o)) || !i) return null;
    var l,
      m = c.now || Date.now,
      s = c.setTimer || setTimeout,
      d = c.clearTimer || clearTimeout,
      f = m() / 1e3 + 209,
      v = !1,
      p = function t() {
        v ||
          (m() / 1e3 > f + 3 && (f = m() / 1e3 + 209),
          u(
            e(
              e(
                {},
                r(
                  {
                    room_id: i,
                    draw_at: f,
                  },
                  i,
                  m()
                )
              ),
              {},
              {
                mock: !0,
              }
            )
          ),
          v || (l = s(t, 1e3)));
      };
    return (
      p(),
      function () {
        ((v = !0), d(l));
      }
    );
  },
};
