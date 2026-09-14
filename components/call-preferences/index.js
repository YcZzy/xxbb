'use strict';

require('../../@babel/runtime/helpers/Arrayincludes');

var e = require('../../@babel/runtime/helpers/defineProperty'),
  r = require('../../@babel/runtime/helpers/objectSpread2'),
  t = require('../../@babel/runtime/helpers/regeneratorRuntime'),
  a = require('../../@babel/runtime/helpers/asyncToGenerator'),
  n = require('../../services/api'),
  s = require('../../services/call-broadcast'),
  i = require('../../utils/session-scope'),
  o = function (e) {
    return (
      e &&
      'string' == typeof e.public_id &&
      e.public_id &&
      'string' == typeof e.nickname &&
      e.nickname.trim() &&
      'boolean' == typeof e.public_calls &&
      'boolean' == typeof e.show_broadcasts
    );
  };

Component({
  properties: {
    visible: Boolean,
    lite: Boolean,
    active: {
      type: Boolean,
      value: !0,
    },
    skin: {
      type: String,
      value: 'classic',
    },
  },
  data: {
    profile: null,
    loading: !1,
    saving: !1,
    error: '',
    saved: !1,
  },
  observers: {
    'visible, active': function (e, r) {
      e && r
        ? this.load()
        : ((this.readRequest = null),
          this.setData({
            loading: !1,
          }));
    },
  },
  lifetimes: {
    detached: function () {
      ((this.disposed = !0), (this.readRequest = null));
    },
  },
  methods: {
    load: function () {
      var e = this;
      return a(
        t().mark(function r() {
          var a, s, o, u;
          return t().wrap(
            function (r) {
              for (;;)
                switch ((r.prev = r.next)) {
                  case 0:
                    if (!e.disposed && e.data.visible && e.data.active && !e.data.saving) {
                      r.next = 2;
                      break;
                    }
                    return r.abrupt('return');

                  case 2:
                    if (((a = i.current()), !e.readRequest || e.readRequest.scope !== a)) {
                      r.next = 5;
                      break;
                    }
                    return r.abrupt('return');

                  case 5:
                    return (
                      (s = e.readRequest =
                        {
                          scope: a,
                        }),
                      (o = function () {
                        return !e.disposed && e.readRequest === s && s.scope === i.current();
                      }),
                      e.setData({
                        profile: null,
                        loading: !0,
                        error: '',
                        saved: !1,
                      }),
                      (r.prev = 8),
                      (r.next = 11),
                      n.ensureSession()
                    );

                  case 11:
                    if (!e.disposed && e.readRequest === s) {
                      r.next = 13;
                      break;
                    }
                    return r.abrupt('return');

                  case 13:
                    return ((s.scope = i.current()), (r.next = 16), n.fetchMyCallProfile());

                  case 16:
                    if (((u = r.sent), o())) {
                      r.next = 19;
                      break;
                    }
                    return r.abrupt('return');

                  case 19:
                    (e.accept(u.data), (r.next = 25));
                    break;

                  case 22:
                    ((r.prev = 22),
                      (r.t0 = r.catch(8)),
                      o() &&
                        e.setData({
                          error: r.t0.message || '设置读取失败，请重试',
                        }));

                  case 25:
                    return (
                      (r.prev = 25),
                      e.readRequest === s &&
                        ((e.readRequest = null),
                        e.disposed ||
                          e.setData({
                            loading: !1,
                          })),
                      r.finish(25)
                    );

                  case 28:
                  case 'end':
                    return r.stop();
                }
            },
            r,
            null,
            [[8, 22, 25, 28]]
          );
        })
      )();
    },
    accept: function (e) {
      if (!o(e)) throw new Error('设置未能确认，请重新读取');
      ((this.profileScope = i.current()),
        this.setData({
          profile: e,
        }),
        s.setEnabled(e.show_broadcasts),
        this.triggerEvent('profile', {
          profile: e,
        }));
    },
    changePreference: function (s) {
      var u = this;
      return a(
        t().mark(function a() {
          var c, l, p, d, f;
          return t().wrap(
            function (t) {
              for (;;)
                switch ((t.prev = t.next)) {
                  case 0:
                    if (
                      !u.disposed &&
                      u.data.visible &&
                      u.data.active &&
                      !u.data.saving &&
                      !u.data.loading &&
                      u.data.profile
                    ) {
                      t.next = 2;
                      break;
                    }
                    return t.abrupt('return');

                  case 2:
                    if (u.profileScope === i.current()) {
                      t.next = 4;
                      break;
                    }
                    return t.abrupt('return', u.load());

                  case 4:
                    if (
                      ((c = s.currentTarget.dataset.key),
                      (l = s.detail.value),
                      ['public_calls', 'show_broadcasts'].includes(c) && 'boolean' == typeof l)
                    ) {
                      t.next = 8;
                      break;
                    }
                    return t.abrupt('return');

                  case 8:
                    return (
                      (p = u.data.profile),
                      (d = u.profileScope),
                      (u.readRequest = null),
                      u.setData({
                        saving: !0,
                        error: '',
                        saved: !1,
                        profile: r(r({}, p), {}, e({}, c, l)),
                      }),
                      (t.prev = 12),
                      (t.next = 15),
                      n.updateMyCallProfile(e({}, c, l))
                    );

                  case 15:
                    if (((f = t.sent), !u.disposed && d === i.current())) {
                      t.next = 18;
                      break;
                    }
                    return t.abrupt('return');

                  case 18:
                    if (o(f.data) && f.data.public_id === p.public_id) {
                      t.next = 20;
                      break;
                    }
                    throw new Error('设置未能确认，请重新读取');

                  case 20:
                    if ((u.accept(f.data), f.data[c] === l)) {
                      t.next = 23;
                      break;
                    }
                    throw new Error('设置未保存，请重试');

                  case 23:
                    (u.setData({
                      saved: !0,
                    }),
                      wx.vibrateShort &&
                        wx.vibrateShort({
                          type: 'light',
                          fail: function () {},
                        }),
                      (t.next = 30));
                    break;

                  case 27:
                    ((t.prev = 27),
                      (t.t0 = t.catch(12)),
                      u.disposed ||
                        d !== i.current() ||
                        (u.setData({
                          profile: null,
                          error: t.t0.message || '设置未保存，请重新读取',
                        }),
                        u.triggerEvent('unconfirmed')));

                  case 30:
                    return (
                      (t.prev = 30),
                      u.disposed ||
                        (u.setData({
                          saving: !1,
                        }),
                        d !== i.current() &&
                          (u.setData({
                            profile: null,
                            error: '',
                          }),
                          u.load())),
                      t.finish(30)
                    );

                  case 33:
                  case 'end':
                    return t.stop();
                }
            },
            a,
            null,
            [[12, 27, 30, 33]]
          );
        })
      )();
    },
    close: function () {
      this.data.saving || this.triggerEvent('close');
    },
    noop: function () {},
  },
});
