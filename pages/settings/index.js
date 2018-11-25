const wx = my;

var app =getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    version: app.constants.version
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
        title:"设置"
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  quite_login:function(e){
    my.confirm({
      content: '确定退出吗？',
      confirmButtonText:"确定",
      success: (res) => {
        if (res.confirm) {
          console.log("确定")
         /* wx.navigateTo({
            url: '/pages/index/index',
          })*/
          my.removeStorage({
            key: app.constants.userinfo,
            success: function(res) {},
          })
          my.navigateBack({
            delta:99
          })
         
        } else {
          console.log("cancel")
          
        }

      }
    })
  },
  about:function(e){
    wx.navigateTo({
      url: '/pages/aboutme/index',
    })
  }
})