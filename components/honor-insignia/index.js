'use strict';

Component({
  properties: {
    badge: {
      type: Object,
      value: null,
    },
    active: {
      type: Boolean,
      value: !1,
    },
    lite: {
      type: Boolean,
      value: !1,
    },
  },
  data: {
    artworkFailed: !1,
  },
  observers: {
    'badge.code': function () {
      this.setData({
        artworkFailed: !1,
      });
    },
  },
  methods: {
    onArtworkError: function () {
      this.setData({
        artworkFailed: !0,
      });
    },
  },
});
