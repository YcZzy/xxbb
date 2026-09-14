'use strict';

var n = require('../@babel/runtime/helpers/slicedToArray'),
  e = function (n) {
    return Number.isSafeInteger(n) && n >= 1 && n <= 2147483647;
  },
  r = function (n) {
    return ''.concat(Math.floor(n / 100), '.').concat(String(n % 100).padStart(2, '0'));
  };

module.exports = {
  MAX_COINS: 2147483647,
  validCoins: e,
  yuan: r,
  limits: function (n) {
    var r = n && n.custom_recharge;
    if (!n || 100 !== n.coins_per_yuan || !r || !0 !== r.enabled) return null;
    var i = Object.prototype.hasOwnProperty.call(r, 'extended_max_coins'),
      t = i ? r.extended_max_coins : r.max_coins;
    return !e(r.min_coins) || r.min_coins < 100 || !e(t) || t < r.min_coins || 1 !== r.step_coins
      ? null
      : {
          min_coins: r.min_coins,
          max_coins: t,
          extended: i,
        };
  },
  parse: function (r, i) {
    if (!i || 'string' != typeof r || !/^\d+(?:\.\d{1,2})?$/.test(r)) return null;
    var t = r.split('.'),
      c = n(t, 2),
      o = c[0],
      a = c[1],
      s = void 0 === a ? '' : a,
      u = 100 * Number(o) + Number(s.padEnd(2, '0'));
    return e(u) && u >= i.min_coins && u <= i.max_coins ? u : null;
  },
  rangeText: function (n) {
    return n
      ? n.extended
        ? ''.concat(r(n.min_coins).replace(/\.00$/, ''), ' 元起')
        : ''
            .concat(r(n.min_coins).replace(/\.00$/, ''), '～')
            .concat(r(n.max_coins).replace(/\.00$/, ''), ' 元')
      : '';
  },
};
