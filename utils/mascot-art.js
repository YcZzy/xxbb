'use strict';

var e = require('../@babel/runtime/helpers/regeneratorRuntime'),
  r = require('../@babel/runtime/helpers/asyncToGenerator'),
  t = require('../@babel/runtime/helpers/toConsumableArray'),
  a = require('./remote-art'),
  i = {
    classic: [
      'monkeyIdle',
      'monkeyWaveUp',
      'monkeyWaveIn',
      'monkeyWaveOut',
      'monkeyRestA',
      'monkeyRestB',
      'monkeyLiveA',
      'monkeyLiveB',
    ],
    ibo_starlight: [].concat(t(Array(6).fill('starlightWait')), t(Array(2).fill('starlightLive'))),
    siwuliu_ice: [
      'iceWaitA',
      'iceWaitB',
      'iceWaitA',
      'iceWaitB',
      'iceWaitA',
      'iceWaitB',
      'iceLiveA',
      'iceLiveB',
    ],
    xiaoyu_moon_tide: [].concat(t(Array(6).fill('moonWait')), t(Array(2).fill('moonLive'))),
  },
  n = function (e) {
    return i[e] || i.classic;
  };

function o() {
  return (o = r(
    e().mark(function r(i) {
      var o, c, u;
      return e().wrap(function (e) {
        for (;;)
          switch ((e.prev = e.next)) {
            case 0:
              return (
                (o = t(new Set([].concat(t(n(i)), t('classic' === i ? ['monkeyZap'] : []))))),
                (e.next = 3),
                a.loadGroup(o)
              );

            case 3:
              return (
                (c = e.sent),
                (u = Object.fromEntries(
                  o.map(function (e, r) {
                    return [e, c[r]];
                  })
                )),
                e.abrupt('return', {
                  frames: n(i).map(function (e) {
                    return u[e];
                  }),
                  zap: u.monkeyZap,
                })
              );

            case 6:
            case 'end':
              return e.stop();
          }
      }, r);
    })
  )).apply(this, arguments);
}

module.exports = {
  fallbackFrames: function (e) {
    return n(e).map(a.fallback);
  },
  load: function (e) {
    return o.apply(this, arguments);
  },
  invalidate: function (e) {
    t(new Set([].concat(t(n(e)), t('classic' === e ? ['monkeyZap'] : [])))).forEach(a.invalidate);
  },
};
