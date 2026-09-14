'use strict';

var e = '',
  n = 0,
  t = '';

function r(e) {
  return String(e || '');
}

function c(n) {
  e = r(n);
}

module.exports = {
  begin: function (c, o) {
    var a = r(o || c);
    return ((e = a), (t = a), (n += 1));
  },
  confirm: c,
  getPreferred: function (n) {
    return e || r(n);
  },
  rollback: function (c, o) {
    ((e = r(c)), (o && o !== n) || (t = ''));
  },
  sync: function (e, n) {
    var t = r(n);
    if ((c(t), e && 'function' == typeof e.getTabBar)) {
      var o = e.getTabBar();
      o &&
        ('function' != typeof o.syncSelection
          ? o.data.selected !== t &&
            o.setData({
              selected: t,
            })
          : o.syncSelection(t));
    }
  },
  takeFeedback: function (e) {
    var n = r(e);
    return !(!t || t !== n) && ((t = ''), !0);
  },
};
