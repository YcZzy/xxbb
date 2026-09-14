'use strict';

var i = require('./draw').drawSilk;

Component({
  properties: {
    active: {
      type: Boolean,
      value: !1,
    },
    lite: {
      type: Boolean,
      value: !1,
    },
  },
  observers: {
    'active, lite': function () {
      this.syncMotion();
    },
  },
  lifetimes: {
    attached: function () {
      ((this.alive = !0),
        (this.foreground = !0),
        (this.inViewport = !0),
        (this.phase = 0),
        (this.initVersion = 0));
    },
    ready: function () {
      var i = this;
      (this.measure(),
        this.createIntersectionObserver &&
          ((this.visibilityObserver = this.createIntersectionObserver()),
          this.visibilityObserver.relativeToViewport().observe('.silk', function (t) {
            i.alive && ((i.inViewport = t.intersectionRatio > 0), i.syncMotion());
          })));
    },
    detached: function () {
      ((this.alive = !1),
        this.initVersion++,
        this.stopMotion(),
        this.visibilityObserver && this.visibilityObserver.disconnect(),
        (this.visibilityObserver = this.canvas = this.ctx = null));
    },
  },
  pageLifetimes: {
    show: function () {
      ((this.foreground = !0), this.syncMotion());
    },
    hide: function () {
      ((this.foreground = !1), this.stopMotion());
    },
    resize: function () {
      this.measure();
    },
  },
  methods: {
    measure: function () {
      var i = this;
      if (this.alive) {
        var t = ++this.initVersion;
        (this.stopMotion(),
          this.createSelectorQuery()
            .select('#silk')
            .fields({
              node: !0,
              size: !0,
            })
            .exec(function (e) {
              if (i.alive && t === i.initVersion) {
                var s = e && e[0];
                if (s && s.node && s.width && s.height)
                  try {
                    var n = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
                    ((i.width = s.width), (i.height = s.height));
                    var r = Math.min(Number(n.pixelRatio) || 1, 1.5);
                    ((i.canvas = s.node),
                      (i.canvas.width = Math.round(i.width * r)),
                      (i.canvas.height = Math.round(i.height * r)),
                      (i.ctx = i.canvas.getContext('2d')),
                      i.ctx.scale(r, r),
                      i.drawFrame(),
                      i.syncMotion());
                  } catch (t) {
                    (i.stopMotion(), (i.ctx = null));
                  }
              }
            }));
      }
    },
    canRun: function () {
      return (
        this.alive &&
        this.ctx &&
        this.foreground &&
        this.inViewport &&
        this.properties.active &&
        !this.properties.lite
      );
    },
    drawFrame: function () {
      i(this.ctx, this.width, this.height, this.phase);
    },
    syncMotion: function () {
      this.canRun()
        ? this.frameTimer ||
          null != this.raf ||
          ((this.lastFrame = Date.now()), this.scheduleFrame())
        : this.stopMotion();
    },
    scheduleFrame: function () {
      var i = this;
      this.frameTimer = setTimeout(function () {
        ((i.frameTimer = null),
          i.canRun() &&
            (i.raf = i.canvas.requestAnimationFrame(function () {
              if (((i.raf = null), i.canRun())) {
                var t = Date.now();
                ((i.phase += Math.min((t - i.lastFrame) / 1e3, 0.1)), (i.lastFrame = t));
                try {
                  i.drawFrame();
                } catch (t) {
                  return void (i.ctx = null);
                }
                i.scheduleFrame();
              }
            })));
      }, 50);
    },
    stopMotion: function () {
      (clearTimeout(this.frameTimer),
        null != this.raf && this.canvas && this.canvas.cancelAnimationFrame(this.raf),
        (this.frameTimer = this.raf = null));
    },
  },
});
