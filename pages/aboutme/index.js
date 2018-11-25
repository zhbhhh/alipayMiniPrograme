const wx = my;
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // logo: "http://qdtechwx.com/file/shop/pic/1.png",
    logo: "/images/app_logo.png",
    hind:true,
    wxgzh:"Q电",
    phone: app.constants.serverPhoneNo,
    email:"qdtech2018@163.com",
    net:"www.qdtechwx.com",
    name:"东莞市九瀚智能科技有限公司",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '关于我们',
    })
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
    
  }
})