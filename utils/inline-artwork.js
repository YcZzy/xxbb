'use strict';

var t = require('../@babel/runtime/helpers/defineProperty'),
  e = require('../@babel/runtime/helpers/objectSpread2'),
  i = require('../@babel/runtime/helpers/slicedToArray'),
  n = require('./remote-art');

module.exports = {
  loadInlineArtwork: function (r) {
    var a = this,
      s = r.currentTarget.dataset.art;
    this.disposed ||
      this.mascotArtworkDisposed ||
      this.inlineArtStopped ||
      ((this.inlineArtPending = this.inlineArtPending || new Set()),
      this.inlineArtPending.has(s) ||
        (this.data.inlineArt && this.data.inlineArt[s]) ||
        (this.inlineArtPending.add(s),
        n
          .loadGroup([s])
          .then(function (n) {
            var r = i(n, 1)[0];
            a.disposed ||
              a.mascotArtworkDisposed ||
              a.inlineArtStopped ||
              a.setData({
                inlineArt: e(e({}, a.data.inlineArt || {}), {}, t({}, s, r)),
              });
          })
          .catch(function () {})
          .finally(function () {
            return a.inlineArtPending.delete(s);
          })));
  },
  onInlineArtworkError: function (i) {
    var r = i.currentTarget.dataset.art;
    this.data.inlineArt &&
      this.data.inlineArt[r] &&
      (n.invalidate(r),
      this.setData({
        inlineArt: e(e({}, this.data.inlineArt), {}, t({}, r, '')),
      }));
  },
};
