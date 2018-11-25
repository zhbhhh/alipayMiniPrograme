const wx = my;
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    user:"189",
    userinfo_src:"/images/no_user.png",
    integral:10,
    balance:0,
    deposit:"未交",
    personalInfo:{
      myCredits:19999,
      balance:99999,
      depositStatus:"已交99999"
    },
    depositStatus:"未交"

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var that = this;
    
    var userinfo = JSON.parse(options.userinfo);
    console.log(userinfo);
    if(userinfo != ""){
      this.setData({
        userinfo_src:userinfo.avatar,
        user:userinfo.nickName,
      })
    }
    //访问接口获取积分余额信息
    
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
    this.setData({
      integral: 100
    });
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
  //跳转至设置页面
  settings:function(e){
    wx.navigateTo({
      url: '/pages/settings/index',
    })
  },
  //点击我的钱包跳转到我的钱包页面
  wallet:function(e){
    // var personalInfo = JSON.stringify(this.data.personalInfo);
    // wx.navigateTo({
    //   url: '/pages/deposit/index?personalInfo=' + personalInfo,
    // })
  },
  rechargerecord:function(e){
    wx.navigateTo({
      url: '/pages/rechargerecord/index',
    })
  },
  help:function(e){
    wx.navigateTo({
      url: '/pages/help/index',
    })
  }
})