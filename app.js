'use strict';

var n = require('./services/call-broadcast');

App({
  onShow: function () {
    n.foreground(!0);
  },
  onHide: function () {
    n.foreground(!1);
  },
  onLaunch: function () {
    this.checkForUpdate();
  },
  checkForUpdate: function () {
    if ('function' == typeof wx.getUpdateManager) {
      var n = wx.getUpdateManager();
      (n.onUpdateReady(function () {
        wx.showModal({
          title: '发现新版本',
          content: '新版本已经准备好，立即重启更新吗？',
          confirmText: '立即更新',
          cancelText: '稍后',
          success: function (e) {
            e.confirm && n.applyUpdate();
          },
        });
      }),
        n.onUpdateFailed(function () {
          wx.showToast({
            title: '新版本下载失败，请重新打开小程序',
            icon: 'none',
            duration: 3e3,
          });
        }));
    }
  },
  globalData: {
    appName: 'i播播了么',
  },
});
