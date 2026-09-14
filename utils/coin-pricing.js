'use strict';

var r = require('../@babel/runtime/helpers/objectSpread2');

require('../@babel/runtime/helpers/Arrayincludes');

var n = 'soft_gold_90_v1',
  i = function (r) {
    return Math.max(1, Math.floor((9 * r + 5) / 10));
  };

function e(r, e, o) {
  if (!Number.isInteger(e) || e < 0 || !Number.isInteger(o) || o < 0) return !1;
  if (!r) return o === e;
  var c = r.policy === n && e > 0 ? i(e) : e;
  return (
    ['regular', n].includes(r.policy) &&
    r.original_coins === e &&
    r.coin_amount === o &&
    o === c &&
    r.discount_coins === e - o
  );
}

module.exports = {
  GOLD_POLICY: n,
  discounted: i,
  valid: e,
  pricedPacks: function (n, i) {
    return Array.isArray(i)
      ? n.map(function (n) {
          if (!n.coins) return r({}, n);
          var o = i.find(function (r) {
            return r.code === n.code;
          });
          if (!o || o.calls !== n.calls || !e(o.pricing, n.coins, o.coins))
            throw new Error('消费价格暂不可用，请刷新后再试');
          return r(
            r({}, n),
            {},
            {
              coins: o.coins,
              originalCoins: n.coins,
              discounted: o.coins < n.coins,
              price: ''.concat(o.coins, ' i币'),
            }
          );
        })
      : n.map(function (n) {
          return r({}, n);
        });
  },
};
