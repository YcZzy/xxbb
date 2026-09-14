'use strict';

var e = require('../@babel/runtime/helpers/objectSpread2'),
  i = '/assets/images/xuxu-app-icon.jpg';

module.exports = {
  enableShareMenu: function () {
    wx.showShareMenu &&
      wx.showShareMenu({
        menus: ['shareAppMessage', 'shareTimeline'],
        fail: function () {},
      });
  },
  appMessage: function () {
    var n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
    return e(
      {
        title: 'i播播了么｜开播与请假提醒',
        path: '/pages/index/index',
        imageUrl: i,
      },
      n
    );
  },
  timeline: function () {
    var n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
    return e(
      {
        title: 'i播播了么｜开播与请假提醒',
        query: '',
        imageUrl: i,
      },
      n
    );
  },
};
