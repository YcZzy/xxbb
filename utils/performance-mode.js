'use strict';

var e = '',
  n = !1;

module.exports = {
  className: function () {
    if (n) return e;
    n = !0;
    try {
      var t = wx.getSystemInfoSync ? wx.getSystemInfoSync() : {},
        r = ('function' == typeof wx.getDeviceBenchmarkInfo && wx.getDeviceBenchmarkInfo()) || {},
        c = Number(r.benchmarkLevel || t.benchmarkLevel);
      e = c > 0 && c <= 12 ? 'performance-lite' : '';
    } catch (n) {
      e = '';
    }
    return e;
  },
};
