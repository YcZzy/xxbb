'use strict';

Component({
  properties: {
    name: {
      type: String,
      value: '星河加冕',
    },
    lite: {
      type: Boolean,
      value: !1,
    },
  },
  data: {
    moving: !1,
    artworkFailed: !1,
  },
  observers: {
    lite: function () {
      this.syncMotion();
    },
  },
  lifetimes: {
    attached: function () {
      ((this._attached = !0), (this._foreground = !0));
    },
    ready: function () {
      var t = this;
      ((this._visibility = this.createIntersectionObserver({
        thresholds: [0, 0.01],
      })),
        this._visibility.relativeToViewport().observe('.galaxy-honor', function (i) {
          t._attached && ((t._inView = i.intersectionRatio > 0), t.syncMotion());
        }));
    },
    detached: function () {
      ((this._attached = !1),
        this._visibility && this._visibility.disconnect(),
        (this._visibility = null));
    },
  },
  pageLifetimes: {
    show: function () {
      ((this._foreground = !0), this.syncMotion());
    },
    hide: function () {
      ((this._foreground = !1), this.syncMotion());
    },
  },
  methods: {
    syncMotion: function () {
      var t = Boolean(this._attached && this._foreground && this._inView && !this.data.lite);
      this._attached &&
        t !== this.data.moving &&
        this.setData({
          moving: t,
        });
    },
    onArtworkError: function () {
      this.setData({
        artworkFailed: !0,
      });
    },
  },
});
