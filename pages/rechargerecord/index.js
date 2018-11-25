const wx = my;
// pages/rechargerecord/index.js
var app =getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chargingRecordList:[
      
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log("" + this.data.chargingRecordList.length);
    //访问后台获取充电记录
    my.getStorage({
      key: app.constants.userinfo,
      success: function (res) {
        var userinfo = res.data;
        
        //获取skey成功，访问接口获取数据
        my.showLoading({
          title: '',
        })
        my.httpRequest({
          url: app.constants.ip + "/alipay/user/firstPage/personalCenter/chargingRecord",
          data: {
            skey: userinfo.skey,
          },
          header: {},
          method: 'POST',
          dataType: 'json',
          responseType: 'text',
          success: function (res) {
            console.log(res);
            if(res.data.code == "1"){
              that.setData({
                chargingRecordList: res.data.data
              })
            }
          },
          fail: function (res) { 
            console.log(res);
          },
          complete: function (res) { my.hideLoading()},
        })
      },
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