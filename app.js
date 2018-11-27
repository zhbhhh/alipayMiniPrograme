const wx = my;
//app.js
const AV = require('/utils/av-weapp-min.js'); 
AV.init({
  appId: 'pTf5kDMERjsFopcOt9mO4C3e-gzGzoHsz', 
  appKey: 'YRb4tW0mekPrVHpCHzokI3Bf',
})
App({

  constants:{
    userinfo:"userinfo",
    serverPhoneNo:"076985251988",
    version:"v1.0.7",
    ip:"http://www.qdtechwx.com:8081",
    // ip:"http://192.168.0.112:8081",
    // ip:"http://192.168.0.105:8081",
  // },
  },
  data:{
    networkStatus:false
  },

  getPermission: function (obj) {
    wx.chooseLocation({
      success: function (res) {
        obj.setData({
          addr: res.address      //调用成功直接设置地址
        })
      },
      fail: function () {
        wx.getSetting({
          success: function (res) {
            var statu = res.authSetting;
            if (!statu['scope.userLocation']) {
              wx.showModal({
                title: '是否授权当前位置',
                content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
                success: function (tip) {
                  if (tip.confirm) {
                    wx.openSetting({
                      success: function (data) {
                        if (data.authSetting["scope.userLocation"] === true) {
                          wx.showToast({
                            title: '授权成功',
                            icon: 'success',
                            duration: 1000
                          })
                          //授权成功之后，再调用chooseLocation选择地方
                          wx.chooseLocation({
                            success: function (res) {
                              obj.setData({
                                addr: res.address
                              })
                            },
                          })
                        } else {
                          wx.showToast({
                            title: '授权失败',
                            icon: 'success',
                            duration: 1000
                          })
                        }
                      }
                    })
                  }
                }
              })
            }
          },
          fail: function (res) {
            wx.showToast({
              title: '调用授权窗口失败',
              icon: 'success',
              duration: 1000
            })
          }
        })
      }
    })
  },

  getAuthor:function() {
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
      }
    })
  wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          this.openSetting();
        }
      }
    })
  },

  openSetting:function () {
    wx.openSetting({
      success: (res) => {
        if (!res.authSetting['scope.userLocation']) {
          this.showRemind();
        }
      }, fail: (res) => {
        if (!res.authSetting['scope.userLocation']) {
          this.showRemind();
        }
      }
    })
  },

  showRemind:function () {
    wx.showModal({
      title: '温馨提醒',
      content: '需要获取您的地理位置才能使用小程序',
      showCancel: false,
      confirmText: '获取位置',
      success: function (res) {
        if (res.confirm) {
          this.getAuthor();
        }
      }, fail: (res) => {
        this.getAuthor();
      }
    })
  },
  onLaunch: function(options){
    var that = this;
    wx.getNetworkType({
      success: function(res) {
        that.data.networkStatus = (res.networkType!='none');
        // console.log(res)
        // console.log(that.data.networkStatus)
      },
    })
    //监听网络变化
    wx.onNetworkStatusChange(function(res){
      // console.log("网络变化："+JSON.stringify(res))
      if (that.data.networkStatus != res.isConnected){
        that.data.networkStatus = res.isConnected;
      }
      console.log(that.data.networkStatus)
    })
    //获取二维码值
      // my.alert({
      //   title: 'app onLaunch',
      //   content: JSON.stringify(options),
      //   success: (res) => {
      //     //成功处理代码段
      //   },
      // });
      //获取关联普通二维码的码值，放到全局变量qrCode中
      if (options.query && options.query.qrCode) {
        console.log("qrCode:"+options.query.qrCode);
        this.data.qrCode = options.query.qrCode;
      }
  },
  checkVersion:function(){
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log("有版本更新:" + res.hasUpdate)
      if (res.hasUpdate) {
        updateManager.onUpdateReady(function () {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success: function (res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate()
              }
            }
          })
        })
      }
    })
  }

})