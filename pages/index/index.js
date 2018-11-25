const app = getApp()
var utils = require('../../utils/util')
Page({
  data: {
    systemInfo: {},
    longitude: '',
    latitude: '',
    markers: [],
    controls: [],
    mapCtx:""
  },
  onLoad() {
    
  },
  onReady(e) {
    this.mapCtx = my.createMapContext('shop-map')
    this.setData({
      systemInfo: my.getSystemInfoSync()
    })
    this.setMapControls()
    setTimeout(() => {
      this.mapCtx.moveToLocation()
    }, 100)

    
    
  },
  setMapControls() {
    this.setData({
      controls: [{
        id: 1,            //扫码充电
        iconPath: '/images/scan.png',
        position: {
          top: this.data.systemInfo.windowHeight - 80,
          left: this.data.systemInfo.windowWidth / 2 - 70,
          width: 154,
          height: 50
        },
        clickable: true
      },
        {
          id: 2,            //用户个人中心
          iconPath: '/images/user.png',
          position: {
            left: this.data.systemInfo.windowWidth - 70,
            top: this.data.systemInfo.windowHeight - 80,
            width: 50,
            height: 50
          },
          clickable: true
        },
        {
          id: 3,           //回到当前位置
          iconPath: '/images/location.png',
          position: {
            left: 20,
            top: this.data.systemInfo.windowHeight - 80,
            width: 50,
            height: 50
          },
          clickable: true
        },
        {
          id: 4,       //当前位置标记
          iconPath: '/images/marker.png',
          position: {
            left: this.data.systemInfo.windowWidth / 2 - 11,
            top: this.data.systemInfo.windowHeight / 2 - 32,
            width: 21,
            height: 32
          },
          clickable: true
        },]
    })
  },
  // goTodos:function(res){
  //   console.log("scan"+res);
  // },
  goRentalPoint(e) {
    my.navigateTo({ url: `../rental-point/rental-point?storeId=${e.markerId}` })
  },
  goTodos(e) {
    console.log(e);
    switch (e.controlId){
      case 1:            //扫码充电
        my.getStorage({
          key: app.constants.userinfo, // 缓存数据的key
          success: (res) => {
            if (res.data != null) {
              // my.navigateTo({
              //   url: "/pages/scansucceed/index"
              // })
              my.scan({
                type: 'qr',
                success: (res) => {
                  var url = res.code;
                  var deviceNo = utils.getQueryString(url, 'sn');
                  console.log("url::"+url);
                  console.log("deviceNo::"+deviceNo);
                  if (deviceNo == null) {
                    my.confirm({
                      title: '非法的二维码',
                      content: '',
                    })
                    return;
                  }
                  my.navigateTo({
                    url: "/pages/scansucceed/index?q=" + encodeURIComponent(url),
                    // url: "/pages/scansucceed/index",
                  })
                  console.log("erweima:"+JSON.stringify(res));
                },
              })
            } else {
              my.navigateTo({
                url: "/pages/login/index"
              })
            }
          },
        });
        break;
      case 2:           //用户个人中心
        my.getStorage({
          key: app.constants.userinfo, // 缓存数据的key
          success: (res) => {
            console.log(res);
            if (res.data != null) {
              my.navigateTo({        //传递会员信息
                url: "/pages/userinfo/index?userinfo=" + JSON.stringify(res.data)
              })
            } else {
              my.navigateTo({
                url: "/pages/login/index"
              })
            }
          },
        });
        break;
      case 3:   //回到当前位置
        this.movetoPosition();
        // this.alipayTest();
        this.checkOrder();
        break;
    }

    
    
  },
  goOrderList() {
    
  },
  movetoPosition: function() {
    this.mapCtx.moveToLocation();
  },
  alipayTest:function(res){
    my.tradePay({
      orderStr: 'alipay_sdk=alipay-sdk-java-3.4.27.ALL&app_id=2018093061569203&biz_content=%7B%22amount%22%3A%220.02%22%2C%22extra_param%22%3A%22%7B%5C%22category%5C%22%3A%5C%22CHARGE_PILE_CAR%5C%22%2C%5C%22outStoreCode%5C%22%3A%5C%22charge001%5C%22%2C%5C%22outStoreAlias%5C%22%3A%5C%22%E5%85%85%E7%94%B5%E6%A1%A9%E5%8C%97%E4%BA%AC%E8%B7%AF%E7%82%B9%5C%22%7D%22%2C%22order_title%22%3A%22%E6%94%AF%E4%BB%98%E5%AE%9D%E8%B5%84%E9%87%91%E6%8E%88%E6%9D%83%22%2C%22out_order_no%22%3A%222018077735255938025%22%2C%22out_request_no%22%3A%2220180777352559382323%22%2C%22payee_user_id%22%3A%222088231967527813%22%2C%22product_code%22%3A%22PRE_AUTH_ONLINE%22%7D&charset=utf-8&format=json&method=alipay.fund.auth.order.app.freeze&notify_url=qdtechwx.com&sign=f1ZjhTrPZesmwwED%2BSGxcFVwgaHvQ3%2F2OipN9bgZ6BnA6qoorQ2cvFgHYgtJHf5ov9kEO6ZrsmiGtkKDteaSeOQ8FR9owY4RqnnPJXo2hwykj3dO1XOlJROuyUYUXTW5WlBFE%2B6wnnjawvj%2BAcVyw32USSzVJ5pkrQtqbyAe6X8p1OyPAqmcmrm5HbdjVjp5sIMG83%2FfepWQG%2FiYSepx%2B%2BmmDwkLtbVCzkGFYPChegHItjpwFWDVbA2FYPVOkGAes2wt8qh8tXvI%2BYTqgOEyxL%2F%2Fc8kyd2rzq%2F1fPGDt9hhUreYnrT46TcvEqrQPxVZxz7gq7aayIQeRs4V5Hh9bUQ%3D%3D&sign_type=RSA2&timestamp=2018-11-10+14%3A55%3A28&version=1.0',
      success: (res) => {
        my.alert({
          content: JSON.stringify(res),
        });
      },fail:function(res){
        my.alert({
          content: JSON.stringify(res),
        });
      }
    });
  },
  checkOrder:function(res){
    var that = this;
    my.getStorage({
      key: app.constants.userinfo,
      success: function(res) { //表示用户已登录，可进行扫码
        // console.log(res)
        // var userinfo = JSON.parse(res.data);
        var userinfo = res.data;
        //先访问接口是否正在充电，防止多次借用充电宝
        my.httpRequest({
          url: app.constants.ip + "/alipay/user/firstPage/userStatus/doesUserHaveOrderDoing",
          data: {
            skey: "X6g2cuwKJpiTlcPazNE10A!!",
            // skey: userinfo.skey,
          },
          header: {},
          method: 'POST',
          dataType: 'json',
          responseType: 'text',
          success: function(res) {
            console.log(JSON.stringify(res));
            if (res.data.flag == "0") { //没有正在进行的订单
              var cc = that.data.controls;
              cc[0].iconPath = "/images/scan.png";
              that.setData({
                controls: cc,
                chargingFlag: false
              })
              that.checkPayStatus(userinfo.skey);
            } else if (res.data.flag == "1") { //有正在进行的订单
              var cc = that.data.controls;
              cc[0].iconPath = "/images/charging.png";
              that.setData({
                controls: cc,
                chargingFlag: true
              })
              // that.startTimer();
            }
          },
          fail: function(res) { },
          complete: function(res) { },
        })

      },
      fail: function() {    //用户未登录，跳转到登录界面

      }
    })
  },
  //开启计时器
  startTimer: function(currentTime) {
    var s = 0;
    //先结束已开启的定时器
    if (this.data.timer != '') {
      clearInterval(this.data.timer);
    }
    // 计时开始
    this.data.timer = setInterval(() => {
      s++;
      if (s % 5 == 0) {
        this.checkBackPowerBank();
      }
    }, 1000)
  },
  //动态检测充电宝是否归还
  checkBackPowerBank: function(e) {
    var that = this;
    my.getStorage({
      key: app.constants.userinfo,
      success: function(res) {
        var userinfo = JSON.parse(res.data);
        // wx.showLoading({
        //   title: '',
        // })
        //获取skey成功，访问接口获取数据
        my.httpRequest({
          url: app.constants.ip + "/wechat/user/backPowerBank",
          data: {
            skey: userinfo.skey,
            // skey: "skey9876543222",
          },
          header: {},
          method: 'POST',
          dataType: 'json',
          responseType: 'text',
          success: function(res) {
            console.log(res)
            if (res.data.flag == "1") { //用户可借用充电宝,表示充电宝已归还
              clearInterval(that.data.timer);//清楚计时器
              //恢复扫码充电图标
              var cc = that.data.controls;
              cc[0].iconPath = "/images/scan.png";
              that.setData({
                controls: cc,
                chargingFlag: false
              })
              //处理订单结果
              if (res.data.data.payStatus == "1") {  //表示已支付
                if (res.data.data.transactionSource == "3") {//3表示交易源为余额,4表示免费
                  wx.showModal({
                    title: '充电宝归还成功',
                    content: '本次消费' + res.data.data.payAmount + '元，已从余额扣除',
                  })
                } else if (res.data.data.transactionSource == "4") {//本次充电免费
                  wx.showModal({
                    title: '充电宝归还成功',
                    content: '本次充电免费',
                  })
                }
              } else { //表示未支付
                if (res.data.data.payAmount != "0") {
                  wx.showModal({
                    title: '充电完成',
                    content: '本次消费' + res.data.data.payAmount + '元，是否立即支付',
                    success: function(e) {
                      if (e.confirm) //用户点击了确定按钮,再调用支付接口
                        that.handleOrder(res.data.data.payAmount);
                    }
                  })
                }
              }
            } else {  //用户不能借用充电宝，1.用户未交押金，2.用户有未支付的订单，3.用户有正在借用的订单。

            }
          },
          fail: function(res) { },
          complete: function(res) { },
        })
      },
    })
  },
  //检测是否有未支付的订单
  checkPayStatus: function(skey) {
    var that = this;
    my.httpRequest({
      url: app.constants.ip + "/alipay/user/firstPage/userStatus/doesUserHaveOrderUnpaid",
      data: {
        skey: "X6g2cuwKJpiTlcPazNE10A!!",
        // skey: skey,
      },
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log(res);
        if (res.data.flag == "0") { //没有欠费的订单，即可退押金

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
});
