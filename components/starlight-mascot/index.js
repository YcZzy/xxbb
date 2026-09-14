'use strict';

var t = require('../../utils/mascot-art'),
  a = require('../../utils/remote-art');

Component({
  properties: {
    state: {
      type: String,
      value: 'normal',
    },
    active: {
      type: Boolean,
      value: !0,
    },
    lite: {
      type: Boolean,
      value: !1,
    },
  },
  data: {
    foreground: !0,
    waitArt: '/assets/images/remote-fallback/starlightWait.png',
    liveArt: '/assets/images/remote-fallback/starlightLive.png',
  },
  lifetimes: {
    attached: function () {
      this.loadArtwork();
    },
    detached: function () {
      this.disposed = !0;
    },
  },
  observers: {
    active: function (t) {
      t && this.loadArtwork();
    },
  },
  pageLifetimes: {
    show: function () {
      (this.setData({
        foreground: !0,
      }),
        this.loadArtwork());
    },
    hide: function () {
      this.setData({
        foreground: !1,
      });
    },
  },
  methods: {
    loadArtwork: function () {
      var a = this;
      !this.disposed &&
        !this.artRequest &&
        this.data.active &&
        this.data.foreground &&
        (this.artRequest = t
          .load('ibo_starlight')
          .then(function (t) {
            var i = t.frames;
            a.disposed ||
              a.setData({
                waitArt: i[0],
                liveArt: i[6],
              });
          })
          .catch(function () {})
          .finally(function () {
            a.artRequest = null;
          }));
    },
    onArtworkError: function () {
      (this.data.waitArt === a.fallback('starlightWait') &&
        this.data.liveArt === a.fallback('starlightLive')) ||
        (t.invalidate('ibo_starlight'),
        this.setData({
          waitArt: a.fallback('starlightWait'),
          liveArt: a.fallback('starlightLive'),
        }));
    },
  },
});
