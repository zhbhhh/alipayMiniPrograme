const wx = my;
// pages/borrowdetail/index.js
var utils = require('../../utils/util')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shop: {
      shopPosition: ["114.0226364136", "22.5737552844"],
      shopPhoto: "",
      shopStatus: 1,                         //1为营业中
      shopName: "088酒吧",
      businessTime: "02:00-00:00",
      address: "虎门镇不夜城，来玩呀",
      distance: 34,
      canBorrowNum: 8,
      canBackNum: 2,
      shopTel: "158909898909"
    },
    money:1,
    freeMin:5,
    maxCost:10,
    killShake:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // this.checkSession();
    // var q = "";
    if (JSON.stringify(options) == "{}"){
     var q = app.data.qrCode;
    }else{
     var q = options.q;
    }
    // var q = options.q;
    if (q != "undefined" && q !="") {
      // console.log("全局onLaunch onload url=" + q)
      // console.log("全局onLaunch onload 参数 flag=" + utils.getQueryString(q, 'sn'))
      var deviceNo = utils.getQueryString(q, 'sn');
      that.setData({
        deviceNo:deviceNo
      });
      
      my.httpRequest({
        url: app.constants.ip + "/alipay/user/scanGetPrice",
        data: {
          deviceNO: deviceNo
        },
        header: {},
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          if (res.data.code == "1") {
            that.setData({
              money: res.data.data.pricePerHour,
              freeMin: res.data.data.freeTime,
              maxCost: res.data.data.topPricePerDay,
            })
          }
        },
        fail: function (res) {
          console.log("错误："+res);
         },
        complete: function (res) {
          my.hideLoading();
        },
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
  handleOrder:function(money){
    my.getStorage({
      key: app.constants.userinfo,
      success: function (res) {
        var userinfo = JSON.parse(res.data);
        //获取skey成功，访问接口获取数据
        my.httpRequest({
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
              wx.requestPayment({
                timeStamp: res.data.data.timeStamp,
                nonceStr: res.data.data.nonceStr,
                package: res.data.data.package,
                signType: res.data.data.signType,
                paySign: res.data.data.paySign,
                success: function (e) { //支付成功
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
  getQrInfo: function (options){
    var q = decodeURIComponent(options.q)
    // var q = "http://www.joyfive.club/file/q?sn=1234"
    if (q) {
      // console.log("全局onLaunch onload url=" + q)
      // console.log("全局onLaunch onload 参数 flag=" + utils.getQueryString(q, 'flag'))
      
    }
    wx.showModal({
      title: q,
      content: utils.getQueryString(q, 'sn'),
    })

  },
  checkSession: function () {
    wx.checkSession({
      success: function (res) {//成功表示session_key未过期
        //未过期 则不用管
      },
      fail: function (res) {  //失败表示session_key过去，则清除存储的skey，让用户重新登录获取skey
        wx.removeStorage({
          key: app.constants.userinfo,
          success: function (res) { },
        })
      }
    })
  },
  backHome:function(res){
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },
  zjdj:function(res){
    var that = this;
    that.setData({
      killShake: true,
    })

    my.getStorage({
      key: app.constants.userinfo,
      success: function(res) {
        // var userinfo = JSON.parse(res.data);
        // console.log("userinfo:" + JSON.stringify(res.data));
        if (res.data != null) {
          my.showLoading({
            title: ""
          })
          my.httpRequest({
            url: app.constants.ip + "/alipay/user/firstPage/fundFreeze", // 目标服务器url
            data: {
              skey: res.data.skey,
              deviceNO: that.data.deviceNo
            },
            success: (res) => {
              if(res.data.code == 0 && res.data.flag == 0 && res.data.msg == "用户不存在"){
                my.removeStorage({
                  key: app.constants.userinfo, // 缓存数据的key
                  success: (res) => {
                    
                  },
                });
                my.redirectTo({
                  url:"/pages/login/index"
                })
                return;
              }
              that.alipayFreezing(res.data.data);
            },
          });
        }
      }, fail: function(res) {
        
        my.hideLoading();
      }
    })
  },
  alipayFreezing: function(orderStr) {
    var that = this;
    my.tradePay({
      orderStr: orderStr,
      success: (res) => {
        my.hideLoading();
        // my.alert({
        //   content: res,
        // });
        //资金冻结成功，申请借充电宝
        
        console.log("资金冻结成功："+res.result);

        var resultT = JSON.parse(res.result);
        console.log("资金冻结成功info：" + resultT.sign_type);
        console.log("资金冻结成功sign：" + resultT.alipay_fund_auth_order_app_freeze_response.auth_no);
        console.log("资金冻结成功sign：" + resultT.alipay_fund_auth_order_app_freeze_response.pre_auth_type);
        console.log("资金冻结成功sign：" + resultT.alipay_fund_auth_order_app_freeze_response.operation_id);

        console.log("资金冻结成功，用户借用充电宝");
        if(res.resultCode == 9000){
          that.borrowCB(resultT.alipay_fund_auth_order_app_freeze_response.auth_no, resultT.alipay_fund_auth_order_app_freeze_response.pre_auth_type, resultT.alipay_fund_auth_order_app_freeze_response.operation_id);
        }else{  //支付失败，恢复状态
          that.setData({
            killShake: false,
          })
        }
        
      }, fail: function(res) {
        my.hideLoading();
        my.alert({
          content: JSON.stringify(res),
        });
      }
    });
  },
  borrowCB:function(auth_no,pre_auth_type,operation_id){
    var that = this;
    my.showLoading();
    my.getStorage({
      key: app.constants.userinfo,
      success:function(res){
        if(res.data==null)return;
        my.httpRequest({
          url: app.constants.ip + "/alipay/user/firstPage/scanBorrow",
          data: {
            skey: res.data.skey,
            deviceNO: that.data.deviceNo,
            formId1: that.data.formId1,
            formId2: that.data.formId2,
            auth_no:auth_no,
            pre_auth_type:pre_auth_type,
            operation_id:operation_id,
          },
          success: function(res) {
            // console.log("借用充电宝借口访问成功：" + JSON.stringify(res));
            if (res.data.flag == "1" && res.data.code == "1") { //用户可借用充电宝
              console.log("弹出充电宝成功");
              my.redirectTo({
                url: '/pages/billing/index',
              })
              my.confirm({
                title: '温馨提示',
                content: '充电宝已弹出，请及时取走您的充电宝!',
              })
            } else if (res.data.flag == "0" && res.data.code == "1") {  //用户不能借用充电宝，1.用户未交押金，2.用户有未支付的订单，3.用户有正在借用的订单。
              console.log("用户不能借用充电宝");
              that.setData({
                killShake: false,
              })
              if (res.data.data == null || res.data.data == '') { //如果data数据为空，则表示押金未交或无充电宝可借
                if (res.data.msg === '当前充电箱无法借出充电宝') {//无充电宝可借
                  my.confirm({
                    title: res.data.msg,
                    content: '',
                  })
                } else {  //押金未交
                  my.redirectTo({
                    url: '/pages/deposit/index',
                  })
                }

              } else {
                if (res.data.data.order != undefined && res.data.data.order.powerBankStatus == "0") { //powerBankStatus=0表示正在充电
                  my.confirm({
                    title: '借用充电宝失败',
                    content: '您有正在进行的订单',
                  })
                  //powerBankStatus=1用户已还充电宝，payStatus=0表示有未支付
                  ////powerBankStatus=1并且payStatus=0表示有未支付的订单
                } else if (res.data.data.powerBankStatus == "1" && res.data.data.payStatus == "0") {
                  if (res.data.data.payAmount != "0") {
                    my.confirm({
                      title: '您有未支付的订单',
                      content: '是否立即支付',
                      success: function(e) {
                        if (e.confirm) //用户点击了确定按钮
                          that.handleOrder(res.data.data.payAmount);
                      }
                    })
                  }
                }
              }
            } else if (res.data.flag == "0" && res.data.code == "0") {
              my.confirm({
                title: '借出充电宝失败',
                content: res.data.msg,
              })
              that.setData({
                killShake: false,
              })
            } else {
              that.setData({
                killShake: false,
              })
              my.confirm({
                title: res.data.msg,
                content: 'jjjj',
              })
            }
          },
          fail: function(res) {
            console.log(res)
            that.setData({
              killShake: false,
            })
            my.confirm({
              title: '借用充电宝失败，请稍后重试',
              duration: 3000,
            })
          },
          complete: function(res) {
            my.hideLoading();
          },
        });
      },fail:function(res){

      }
    })
  },
  submitInfo: function(e) {
    var that = this;
    var formId = e.detail.formId;
    this.data.formId2 = formId;
    console.log("submitInfo," + formId);
    // this.zjdj();  //获取formId 后再告诉后台借用充电宝
    //检测是否有正在进行的订单
    that.checkOrder();
  },
  formSubmit: function(e) {
    var formId = e.detail.formId;
    this.data.formId1 = formId;
    console.log("formSubmit," + formId);
  },
  checkOrder: function(res) {
    var that = this;
    my.getStorage({
      key: app.constants.userinfo,
      success: function(res) { //表示用户已登录，可进行扫码
        var userinfo = res.data;
        if(userinfo == null){
          my.redirectTo({
            url: '/pages/login/index', // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
            success: (res) => {
              
            },
          });
          return;
        }
        //先访问接口是否正在充电，防止多次借用充电宝
        my.showLoading({
          success: (res) => {
            
          },
        });
        my.httpRequest({
          url: app.constants.ip + "/alipay/user/firstPage/userStatus/doesUserHaveOrderDoing",
          data: {
            skey: userinfo.skey,
          },
          header: {},
          method: 'POST',
          dataType: 'json',
          responseType: 'text',
          success: function(res) {
            // console.log(JSON.stringify(res));
            if (res.data.flag == "0") { //没有正在进行的订单
              that.checkPayStatus(userinfo.skey);
            } else if (res.data.flag == "1") { //有正在进行的订单
              my.confirm({
                title:"温馨提示",
                content:"您有正在借用的充电宝，不能重复借用"
              })
            }
          },
          fail: function(res) { },
          complete: function(res) { my.hideLoading();},
        })

      },
      fail: function() {    //用户未登录，跳转到登录界面

      }
    })
  },
  checkPayStatus: function(skey) {
    var that = this;
    my.httpRequest({
      url: app.constants.ip + "/alipay/user/firstPage/userStatus/doesUserHaveOrderUnpaid",
      data: {
        skey: skey,
      },
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        // console.log(res);
        if (res.data.flag == "0") { //没有欠费的订单，即可退押金
          console.log("用户没有欠费的订单");
          that.zjdj();
        } else if (res.data.flag == "1") { //有欠费的订单，调起支付接口

          my.confirm({
            title: '温馨提示',
            content: '您有未支付的订单,是否立即支付',
            confirmButtonText: "确定",
            success: function(e) {
              if (e.confirm) { //用户点击了确定按钮
                that.handleOrder(res.data.data.payAmount);
              } else {
                that.setData({
                  killShake: false,
                })
              }
            }
          })

        }
      },
      fail: function(res) {
        wx.hideLoading();
        that.setData({
          killShake: false,
        })
      },
      complete: function(res) {
      },
    })
  }
})