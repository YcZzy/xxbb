'use strict';

var e = require('../../@babel/runtime/helpers/defineProperty'),
  t = require('../../@babel/runtime/helpers/regeneratorRuntime'),
  a = require('../../@babel/runtime/helpers/slicedToArray'),
  n = require('../../@babel/runtime/helpers/asyncToGenerator'),
  i = require('../../services/api');

function r(e) {
  return String(e).padStart(2, '0');
}

function s(e) {
  var t = Number(e || 0);
  return ''.concat(r(Math.floor(t / 60)), ':').concat(r(t % 60));
}

Component({
  properties: {
    motionEnabled: {
      type: Boolean,
      value: !0,
    },
    skin: {
      type: String,
      value: 'classic',
    },
  },
  data: {
    quietVisible: !1,
    loading: !0,
    loadError: '',
    workLoadError: '',
    saving: '',
    dndEnabled: !1,
    dndStartMinute: 1380,
    dndEndMinute: 480,
    dndStartText: '23:00',
    dndEndText: '08:00',
    dndCrossesMidnight: !0,
    dndAllDay: !1,
    studentModeEnabled: !1,
    workNotificationsEnabled: !1,
    linkmicNotificationsEnabled: !1,
    workNotificationsReady: !1,
    timePickerVisible: !1,
    timePickerClosing: !1,
    activeTimeField: 'start',
    pickerValue: [23, 0],
    draftStartMinute: 1380,
    draftEndMinute: 480,
    draftStartText: '23:00',
    draftEndText: '08:00',
    draftCrossesMidnight: !0,
    hourOptions: Array.from(
      {
        length: 24,
      },
      function (e, t) {
        return r(t);
      }
    ),
    minuteOptions: Array.from(
      {
        length: 60,
      },
      function (e, t) {
        return r(t);
      }
    ),
  },
  lifetimes: {
    attached: function () {
      ((this._pageHasShown = !1), this.loadPreferences());
    },
    detached: function () {
      ((this.disposed = !0), clearTimeout(this.timePickerTimer));
    },
  },
  pageLifetimes: {
    show: function () {
      this._pageHasShown ? this.loadPreferences() : (this._pageHasShown = !0);
    },
  },
  methods: {
    touchFeedback: function () {
      wx.vibrateShort &&
        wx.vibrateShort({
          type: 'light',
          fail: function () {},
        });
    },
    openQuietSettings: function () {
      this.data.loading ||
        this.data.loadError ||
        (this.touchFeedback(),
        this.setData({
          quietVisible: !0,
        }));
    },
    closeQuietSettings: function () {
      this.data.saving ||
        this.setData({
          quietVisible: !1,
        });
    },
    openAccountSettings: function () {
      this.triggerEvent('accountsettings');
    },
    loadPreferences: function () {
      var e = this;
      return n(
        t().mark(function n() {
          var r, s, o, d, c, u;
          return t().wrap(
            function (t) {
              for (;;)
                switch ((t.prev = t.next)) {
                  case 0:
                    if (!(e._loadingPreferences || e.disposed || e.data.saving)) {
                      t.next = 2;
                      break;
                    }
                    return t.abrupt('return');

                  case 2:
                    return (
                      (e._loadingPreferences = !0),
                      e.setData({
                        loading: !0,
                        loadError: '',
                        workLoadError: '',
                      }),
                      (r = function (e) {
                        return e.then(
                          function (e) {
                            return {
                              response: e,
                            };
                          },
                          function (e) {
                            return {
                              error: e,
                            };
                          }
                        );
                      }),
                      (t.prev = 5),
                      (t.next = 8),
                      Promise.all([r(i.fetchPreferences()), r(i.fetchWorkSubscription())])
                    );

                  case 8:
                    if (((s = t.sent), (o = a(s, 2)), (d = o[0]), (c = o[1]), !e.disposed)) {
                      t.next = 14;
                      break;
                    }
                    return t.abrupt('return');

                  case 14:
                    (!d.error && d.response && d.response.data
                      ? e.applyPreferences(d.response.data)
                      : e.setData({
                          loadError: '提醒状态读取失败，开关状态未知',
                        }),
                      !c.error && c.response && c.response.data
                        ? ((u = c.response.data),
                          e.setData({
                            workNotificationsEnabled: Boolean(u.enabled),
                            workNotificationsReady: Boolean(u.template_ready),
                          }))
                        : e.setData({
                            workLoadError: '作品提醒读取失败，开关状态未知',
                          }),
                      (t.next = 21));
                    break;

                  case 18:
                    ((t.prev = 18),
                      (t.t0 = t.catch(5)),
                      e.disposed ||
                        e.setData({
                          loadError: '提醒状态读取失败，请重新读取',
                          workLoadError: '作品提醒状态未知',
                        }));

                  case 21:
                    return (
                      (t.prev = 21),
                      (e._loadingPreferences = !1),
                      e.disposed ||
                        e.setData({
                          loading: !1,
                        }),
                      t.finish(21)
                    );

                  case 25:
                  case 'end':
                    return t.stop();
                }
            },
            n,
            null,
            [[5, 18, 21, 25]]
          );
        })
      )();
    },
    onToggleDnd: function (e) {
      (this.touchFeedback(), this.savePreference('dnd', Boolean(e.detail.value)));
    },
    onToggleStudentMode: function (e) {
      (this.touchFeedback(), this.savePreference('student', Boolean(e.detail.value)));
    },
    onToggleWorkNotifications: function (e) {
      (this.touchFeedback(), this.saveWorkNotificationSwitch(Boolean(e.detail.value)));
    },
    onToggleLinkmicNotifications: function (e) {
      (this.touchFeedback(), this.savePreference('linkmic', Boolean(e.detail.value)));
    },
    onOpenAnchorVisibility: function () {
      this.data.loading ||
        this.data.saving ||
        (wx.vibrateShort &&
          wx.vibrateShort({
            type: 'light',
            fail: function () {},
          }),
        this.triggerEvent('anchorvisibility'));
    },
    saveWorkNotificationSwitch: function (a) {
      var r = this;
      return n(
        t().mark(function n() {
          var s, o, d, c, u;
          return t().wrap(
            function (t) {
              for (;;)
                switch ((t.prev = t.next)) {
                  case 0:
                    if (
                      !(r.data.saving || r.data.loading || r.data.workLoadError) &&
                      r.data.workNotificationsReady
                    ) {
                      t.next = 2;
                      break;
                    }
                    return t.abrupt('return');

                  case 2:
                    return (
                      (o = 'workNotificationsEnabled'),
                      (d = r.data[o]),
                      r.setData((e((s = {}), o, a), e(s, 'saving', 'work'), s)),
                      (t.prev = 5),
                      (t.next = 8),
                      i.setWorkSubscriptionEnabled(a)
                    );

                  case 8:
                    ((c = t.sent),
                      (u = c && c.data ? c.data : {}),
                      r.setData(e({}, o, Boolean(u.enabled))),
                      wx.showToast({
                        title: a ? '已开启' : '已关闭',
                        icon: 'none',
                      }),
                      (t.next = 18));
                    break;

                  case 14:
                    ((t.prev = 14),
                      (t.t0 = t.catch(5)),
                      r.setData(e({}, o, d)),
                      wx.showToast({
                        title: t.t0.message || '保存失败',
                        icon: 'none',
                      }));

                  case 18:
                    return (
                      (t.prev = 18),
                      r.setData({
                        saving: '',
                      }),
                      t.finish(18)
                    );

                  case 21:
                  case 'end':
                    return t.stop();
                }
            },
            n,
            null,
            [[5, 14, 18, 21]]
          );
        })
      )();
    },
    applyPreferences: function (e) {
      var t = Number.isInteger(e.dnd_start_minute) ? e.dnd_start_minute : 1380,
        a = Number.isInteger(e.dnd_end_minute) ? e.dnd_end_minute : 480;
      this.setData({
        dndEnabled: Boolean(e.dnd_enabled),
        dndStartMinute: t,
        dndEndMinute: a,
        dndStartText: s(t),
        dndEndText: s(a),
        dndCrossesMidnight: t > a,
        dndAllDay: t === a,
        studentModeEnabled: Boolean(e.student_mode_enabled),
        linkmicNotificationsEnabled: Boolean(e.linkmic_enabled),
      });
    },
    savePreference: function (r, s) {
      var o = this;
      return n(
        t().mark(function n() {
          var d, c, u, l, f, h, p, m;
          return t().wrap(
            function (t) {
              for (;;)
                switch ((t.prev = t.next)) {
                  case 0:
                    if (!(o.data.saving || o.data.loading || o.data.loadError)) {
                      t.next = 2;
                      break;
                    }
                    return t.abrupt('return');

                  case 2:
                    if (
                      (c = {
                        dnd: ['dndEnabled', 'dnd_enabled'],
                        student: ['studentModeEnabled', 'student_mode_enabled'],
                        linkmic: ['linkmicNotificationsEnabled', 'linkmic_enabled'],
                      }[r])
                    ) {
                      t.next = 5;
                      break;
                    }
                    return t.abrupt('return');

                  case 5:
                    return (
                      (u = a(c, 2)),
                      (l = u[0]),
                      (f = u[1]),
                      (h = o.data[l]),
                      o.setData((e((d = {}), l, s), e(d, 'saving', r), d)),
                      (t.prev = 8),
                      (t.next = 11),
                      i.updatePreferences(e({}, f, s))
                    );

                  case 11:
                    ((p = t.sent),
                      (m = p && p.data ? p.data : {}),
                      o.applyPreferences(m),
                      wx.showToast({
                        title: s ? '已开启' : '已关闭',
                        icon: 'none',
                      }),
                      (t.next = 21));
                    break;

                  case 17:
                    ((t.prev = 17),
                      (t.t0 = t.catch(8)),
                      o.setData(e({}, l, h)),
                      wx.showToast({
                        title: t.t0.message || '保存失败',
                        icon: 'none',
                      }));

                  case 21:
                    return (
                      (t.prev = 21),
                      o.setData({
                        saving: '',
                      }),
                      t.finish(21)
                    );

                  case 24:
                  case 'end':
                    return t.stop();
                }
            },
            n,
            null,
            [[8, 17, 21, 24]]
          );
        })
      )();
    },
    openDndTimePicker: function () {
      if (!(this.data.loading || this.data.saving || this.data.loadError)) {
        var e = this.data.dndStartMinute === this.data.dndEndMinute,
          t = e ? 1380 : this.data.dndStartMinute,
          a = e ? 480 : this.data.dndEndMinute;
        this.setData({
          timePickerVisible: !0,
          timePickerClosing: !1,
          activeTimeField: 'start',
          pickerValue: [Math.floor(t / 60), t % 60],
          draftStartMinute: t,
          draftEndMinute: a,
          draftStartText: s(t),
          draftEndText: s(a),
          draftCrossesMidnight: t > a,
        });
      }
    },
    closeDndTimePicker: function () {
      var e = this;
      this.data.timePickerVisible &&
        'dnd-time' !== this.data.saving &&
        (this.setData({
          timePickerClosing: !0,
        }),
        clearTimeout(this.timePickerTimer),
        (this.timePickerTimer = setTimeout(function () {
          e.setData({
            timePickerVisible: !1,
            timePickerClosing: !1,
          });
        }, 220)));
    },
    stopPickerTap: function () {},
    selectTimeField: function (e) {
      var t = 'end' === e.currentTarget.dataset.field ? 'end' : 'start',
        a = 'end' === t ? this.data.draftEndMinute : this.data.draftStartMinute;
      this.setData({
        activeTimeField: t,
        pickerValue: [Math.floor(a / 60), a % 60],
      });
    },
    onTimePickerChange: function (e) {
      var t = e.detail.value || [0, 0],
        a = 60 * Number(t[0] || 0) + Number(t[1] || 0),
        n = 'end' === this.data.activeTimeField,
        i = n ? this.data.draftStartMinute : a,
        r = n ? a : this.data.draftEndMinute;
      this.setData({
        pickerValue: t,
        draftStartMinute: i,
        draftEndMinute: r,
        draftStartText: s(i),
        draftEndText: s(r),
        draftCrossesMidnight: i > r,
      });
    },
    saveDndTime: function () {
      var e = this;
      return n(
        t().mark(function a() {
          var n, r, s, o;
          return t().wrap(
            function (t) {
              for (;;)
                switch ((t.prev = t.next)) {
                  case 0:
                    if (!(e.data.loading || e.data.saving || e.data.loadError)) {
                      t.next = 2;
                      break;
                    }
                    return t.abrupt('return');

                  case 2:
                    if (((n = e.data.draftStartMinute), (r = e.data.draftEndMinute), n !== r)) {
                      t.next = 7;
                      break;
                    }
                    return (
                      wx.showToast({
                        title: '开始和结束时间不能相同',
                        icon: 'none',
                      }),
                      t.abrupt('return')
                    );

                  case 7:
                    return (
                      e.setData({
                        saving: 'dnd-time',
                      }),
                      (t.prev = 8),
                      (t.next = 11),
                      i.updatePreferences({
                        dnd_start_minute: n,
                        dnd_end_minute: r,
                      })
                    );

                  case 11:
                    ((s = t.sent),
                      (o = s && s.data ? s.data : {}),
                      e.applyPreferences(o),
                      e.setData({
                        timePickerClosing: !0,
                      }),
                      clearTimeout(e.timePickerTimer),
                      (e.timePickerTimer = setTimeout(function () {
                        e.setData({
                          timePickerVisible: !1,
                          timePickerClosing: !1,
                        });
                      }, 220)),
                      wx.showToast({
                        title: '免打扰时间已保存',
                        icon: 'success',
                      }),
                      (t.next = 23));
                    break;

                  case 20:
                    ((t.prev = 20),
                      (t.t0 = t.catch(8)),
                      wx.showToast({
                        title: t.t0.message || '保存失败',
                        icon: 'none',
                      }));

                  case 23:
                    return (
                      (t.prev = 23),
                      e.setData({
                        saving: '',
                      }),
                      t.finish(23)
                    );

                  case 26:
                  case 'end':
                    return t.stop();
                }
            },
            a,
            null,
            [[8, 20, 23, 26]]
          );
        })
      )();
    },
  },
});
