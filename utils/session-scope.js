'use strict';

module.exports = {
  current: function () {
    try {
      var e = wx.getStorageSync('miniappApiSession');
      return e && e.token && Number(e.expiresAt) > Date.now() / 1e3 + 60 ? String(e.token) : '';
    } catch (e) {
      return '';
    }
  },
};
