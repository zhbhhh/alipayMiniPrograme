const wx = my;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money:99,
    killShake:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var depositStatus = options.depositStatus;
    var depositStatusValue = "";
    if (depositStatus === "1") {
      depositStatusValue = "退押金";
      this.setData({
        depositStatusValue: "退押金",
        money:100,
        depositStatus:1
      })
    } else {
      this.setData({
        depositStatusValue: "立即充值",
        money: 0,
        depositStatus: 0
      })
    }

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
  recharge:function(e){
    var that = this;
    that.setData({
      killShake:true,
    })
    //退押金
    if (this.data.depositStatus=="1"){
      console.log("退押金");
      wx.getStorage({
        key: app.constants.userinfo,
        success: function (res) {
          var userinfo = JSON.parse(res.data);
          
          wx.showModal({
            title: '退押金申请',
            content: '退押金后，需要再充值押金才能借用充电宝',
            success:function(e){
              if(e.confirm){
                wx.showLoading({
                  title: '',
                })
                //退押金逻辑应该是，先判断是否有欠单的，如有，则先让其支付后，再允许退押金
                //查询是否有欠单
                wx: wx.request({
                  url: app.constants.ip + "/wechat/user/firstPage/scanBorrow",
                  data: {
                    skey: userinfo.skey,
                    // deviceNO: "dfdf"
                  },
                  header: {},
                  method: 'POST',
                  dataType: 'json',
                  responseType: 'text',
                  success: function (res) {
                    console.log(res)
                    if (res.data.flag == "1") { //用户无欠单情况
                      console.log("允许退押金");
                      //无欠单，则允许退押金
                      wx.showLoading({
                        title: '',
                      })
                      wx: wx.request({
                        url: app.constants.ip + "/wechat/user/firstPage/personalCenter/myWallet/refund",
                        data: {
                          skey: userinfo.skey,
                        },
                        header: {},
                        method: 'POST',
                        dataType: 'json',
                        responseType: 'text',
                        success: function (res) {  //访问后台退款接口成功，不需要小程序端再去请求微信后台
                          if (res.data.code == "1") { //退款成功
                            console.log(res);
                            that.setData({    //推押金成功后，更换状态为未充值状态
                              depositStatusValue: "充值",
                              money: 0,
                              depositStatus: 0
                            })
                            wx.showModal({
                              title: '退押金申请成功',
                              content: '押金将在1-5个工作日内，退还到您的微信账户',
                              success: function (res) {
                                wx.navigateBack({
                                  delta: 99
                                })
                              }
                            })
                          } else {  //访问后台失败，即退押金失败
                            console.log(res);
                            wx.showModal({
                              title: res.data.msg,
                              content: '',
                            })
                          }
                        },
                        fail: function (res) {
                          wx.showToast({
                            title: '网络访问失败，请稍后重试....',
                            duration: 2000
                          })
                        },
                        complete: function (res) { 
                          wx.hideLoading()
                          that.setData({
                            killShake: false,
                          })
                        },
                      })
                    } else if (res.data.flag == "0") {  //用户不能借用充电宝，1.用户未交押金，2.用户有未支付的订单，3.用户有正在借用的订单。
                      if (res.data.data == null || res.data.data == '') { //如果data数据为空，则表示押金未交或无充电宝可借
                        if (res.data.msg === '当前充电箱无法借出充电宝') {//无充电宝可借
                          //无欠单，则允许退押金
                          wx.showLoading({
                            title: '',
                          })
                          wx: wx.request({
                            url: app.constants.ip + "/wechat/user/firstPage/personalCenter/myWallet/refund",
                            data: {
                              skey: userinfo.skey,
                            },
                            header: {},
                            method: 'POST',
                            dataType: 'json',
                            responseType: 'text',
                            success: function (res) {  //访问后台退款接口成功，不需要小程序端再去请求微信后台
                              if (res.data.code == "1") { //退款成功
                                console.log(res);
                                that.setData({    //推押金成功后，更换状态为未充值状态
                                  depositStatusValue: "充值",
                                  money: 0,
                                  depositStatus: 0
                                })
                                wx.showModal({
                                  title: '退押金申请成功',
                                  content: '押金将在1-5个工作日内，退还到您的微信账户',
                                  success: function (res) {
                                    wx.navigateBack({
                                      delta: 99
                                    })
                                  }
                                })
                              } else {  //访问后台失败，即退押金失败
                                console.log(res);
                                wx.showModal({
                                  title: res.data.msg,
                                  content: '',
                                })
                              }
                            },
                            fail: function (res) {
                              wx.showToast({
                                title: '网络访问失败，请稍后重试....',
                                duration: 2000
                              })
                            },
                            complete: function (res) { 
                              wx.hideLoading()
                              that.setData({
                                killShake: false,
                              })   
                            },
                          })
                        } else {  //押金未交
                          wx.redirectTo({
                            url: '/pages/deposit/index',
                          })
                        }

                      } else {
                        if (res.data.data.order != undefined && res.data.data.order.powerBankStatus == "0") { //powerBankStatus=0表示正在充电
                         wx.hideLoading();
                          wx.showModal({
                            title: '退押金失败',
                            content: '您正在充电，请归还充电宝后，再进行此操作！',
                            success: function (e) {
                            }
                          })
                          //powerBankStatus=1用户已还充电宝，payStatus=0表示有未支付
                          ////powerBankStatus=1并且payStatus=0表示有未支付的订单
                        } else if (res.data.data.powerBankStatus == "1" && res.data.data.payStatus == "0") {
                          if (res.data.data.payAmount != "0") {
                            wx.showModal({
                              title: '退押金失败',
                              content: '您有未支付的订单,支付后即可退押金，是否立即支付',
                              success: function (e) {
                                if (e.confirm) //用户点击了确定按钮
                                  that.handleOrder(res.data.data.payAmount);
                              }
                            })
                          }
                        }
                      }
                    } else {
                      wx.showModal({
                        title: res.data.msg,
                        content: '',
                      })
                    }
                  },
                  fail: function (res) { wx.hideLoading() },
                  complete: function (res) { 
                    that.setData({
                      killShake: false,
                    })
                   },
                })
              }
            }
          })
          
        },
        fail:function(res){
          that.setData({
            killShake: false,
          })
        }

      })
    }else{ //冲押金
      console.log("立即充值");
      wx.getStorage({
        key: app.constants.userinfo,
        success: function (res) {
          var userinfo = JSON.parse(res.data);
          wx.showLoading({
            title: '',
            mask:true,
          })
          //获取skey成功，访问接口获取数据
          wx: wx.request({
            url: app.constants.ip + "/wechat/user/firstPage/personalCenter/myWallet/recharge",
            data: {
              skey: userinfo.skey,
              rechargeType: "2",  //0表示处理订单 ,2表示押金，1 表示余额充值
              amount: "100"
            },
            header: {},
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            success: function (res) {
              if (res.data.code == "1") {
                console.log(res);
                wx.requestPayment({
                  timeStamp: res.data.data.timeStamp,
                  nonceStr: res.data.data.nonceStr,
                  package: res.data.data.package,
                  signType: res.data.data.signType,
                  paySign: res.data.data.paySign,
                  success: function (e) {
                    console.log(e)
                    that.setData({
                      depositStatus:"1",
                      depositStatusValue: "退押金",
                      money: 100,
                      killShake: false,
                    })
                    wx.showModal({
                      title: '恭喜您',
                      content: '押金充值成功!由于网络问题，可能会导致押金到账延迟，如押金状态未更新，请稍后再试！',
                      success:function(e){
                        var t = getCurrentPages()
                        // console.log(t[0].);
                        if (t.length > 1) {
                          wx.navigateBack({
                            delta: 99
                          })
                        } else {
                          wx.redirectTo({
                            url: '../index/index'
                          })
                        }
                      }
                    }) 
                  },
                  fail: function (e) {
                    console.log(e)
                    wx.showToast({
                      title: '充值失败',
                      duration: 2000,
                    })
                    that.setData({
                      killShake: false,
                    })
                  }
                })
              } else {
                console.log(res);
                wx.showToast({
                  title: '支付失败',
                  duration: 2000
                })
                that.setData({
                  killShake: false,
                })
              }
            },
            fail: function (res) {
              that.setData({
                killShake: false,
              })
            },
            complete: function (res) {
              
              wx.hideLoading();
            },
              
          })
        },
        fail:function(res){
          that.setData({
            killShake: false,
          })
        }
      })
    }
  },
  handleOrder: function (money) {
    wx.getStorage({
      key: app.constants.userinfo,
      success: function (res) {
        var userinfo = JSON.parse(res.data);
        //获取skey成功，访问接口获取数据
        wx: wx.request({
          url: app.constants.ip + "/wechat/user/firstPage/personalCenter/myWallet/recharge",
          data: {
            skey: userinfo.skey,
            rechargeType: "0",  //0 表示处理支付订单
            amount: money
          },
          header: {},
          method: 'POST',
          dataType: 'json',
          responseType: 'text',
          success: function (res) {
            if (res.data.code == "1") {
              console.log(res);
              wx.requestPayment({
                timeStamp: res.data.data.timeStamp,
                nonceStr: res.data.data.nonceStr,
                package: res.data.data.package,
                signType: res.data.data.signType,
                paySign: res.data.data.paySign,
                success: function (e) { //支付成功
                  console.log(e)

                  // wx.redirectTo({
                  //   url: '/pages/rechargesucced/index?amount=' + that.data.money,
                  // })
                },
                fail: function (e) { //支付失败
                  console.log(e)
                  wx.showToast({
                    title: '支付失败',
                    duration: 2000,
                  })
                }
              })
            } else { //接口返回code=0 失败
              console.log(res);
              wx.showToast({
                title: '支付失败',
                duration: 2000
              })
            }
          },
          fail: function (res) {

          },
          complete: function (res) { },
        })
      },
    })
  },
})