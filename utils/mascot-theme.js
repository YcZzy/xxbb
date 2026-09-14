'use strict';

var e,
  t = require('../@babel/runtime/helpers/defineProperty'),
  o = '',
  s =
    (t(
      (e = {
        classic: 'theme-classic',
      }),
      'siwuliu_ice',
      'theme-siwuliu-ice'
    ),
    t(e, 'xiaoyu_moon_tide', 'theme-xiaoyu-moon-tide'),
    t(e, 'ibo_soft_gold', 'theme-ibo-soft-gold'),
    e);

function a() {
  try {
    var e = wx.getStorageSync('miniappApiSession');
    return Boolean(e && e.token && !0 === e.isAdmin && Number(e.expiresAt) > Date.now() / 1e3 + 60);
  } catch (e) {
    return !1;
  }
}

function i() {
  try {
    var e = wx.getStorageSync('miniappApiSession');
    return e && e.token && Number(e.expiresAt) > Date.now() / 1e3 + 60 ? e.token : '';
  } catch (e) {
    return '';
  }
}

function n() {
  return Boolean(o && o === i());
}

function c() {
  try {
    var e = String(wx.getStorageSync('mascotThemeV1') || '');
    return ('ibo_soft_gold' !== e || a() || n()) && s[e] ? e : 'classic';
  } catch (e) {
    return 'classic';
  }
}

function m() {
  var e = c();
  return {
    mascotThemeSkin: e,
    mascotThemeClass: s[e],
    mascotThemeIsIce: 'siwuliu_ice' === e,
    mascotThemeIsMoonTide: 'xiaoyu_moon_tide' === e,
    mascotThemeIsSoftGold: 'ibo_soft_gold' === e,
  };
}

module.exports = {
  setGoldOwnership: function (e) {
    o = !0 === e ? i() : '';
  },
  ownsGold: n,
  canPreviewSoftGold: a,
  selectedTheme: c,
  state: m,
  sync: function (e) {
    var t = m();
    return e && 'function' == typeof e.setData
      ? ((e.data.mascotThemeSkin === t.mascotThemeSkin &&
          e.data.mascotThemeClass === t.mascotThemeClass &&
          e.data.mascotThemeIsIce === t.mascotThemeIsIce &&
          e.data.mascotThemeIsMoonTide === t.mascotThemeIsMoonTide &&
          e.data.mascotThemeIsSoftGold === t.mascotThemeIsSoftGold) ||
          e.setData(t),
        t)
      : t;
  },
};
