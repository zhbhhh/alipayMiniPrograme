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
    this.mapCtx = my.createMapContext('shop-map')
    this.setData({
      systemInfo: my.getSystemInfoSync()
    })
    
    this.setMapControls()
    setTimeout(() => {
      this.mapCtx.moveToLocation()
    }, 100)
  },
  onReady(e) {
    
  },
  onHide:function(res){
    clearInterval(this.data.timer);
  },
  onShow:function(e){
    this.checkOrder();
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
  goTodos(e) {
    console.log(e);
    var that = this;
    switch (e.controlId){
      case 1:            //扫码充电
        my.getStorage({
          key: app.constants.userinfo, // 缓存数据的key
          success: (res) => {
            if (res.data != null) {
              // my.navigateTo({
              //   url: "/pages/scansucceed/index"
              // })
              if (that.data.chargingFlag) { // 表示正在充电
                my.navigateTo({
                  url: '/pages/billing/index?fromHome=' + true,
                })
              } else {
                my.scan({
                  type: 'qr',
                  success: (res) => {
                    var url = res.code;
                    var deviceNo = utils.getQueryString(url, 'sn');
                    console.log("url::" + url);
                    console.log("deviceNo::" + deviceNo);
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
                    console.log("erweima:" + JSON.stringify(res));
                  },
                })
              }
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
        
        break;
    }

    
    
  },
  goOrderList() {
    
  },
  movetoPosition: function() {
    this.mapCtx.moveToLocation();
  },
  checkOrder:function(res){
    var that = this;
    my.getStorage({
      key: app.constants.userinfo,
      success: function(res) { //表示用户已登录，可进行扫码
        var userinfo = res.data;
        //先访问接口是否正在充电，防止多次借用充电宝
        my.httpRequest({
          url: app.constants.ip + "/alipay/user/firstPage/userStatus/doesUserHaveOrderDoing",
          data: {
            // skey: "X6g2cuwKJpiTlcPazNE10A!!",
            skey: userinfo.skey,
          },
          header: {},
          method: 'POST',
          dataType: 'json',
          responseType: 'text',
          success: function(res) {
            // console.log(JSON.stringify(res));
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
              console.log("有正在进行的订单，开启定时器");
              that.startTimer();
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
        var userinfo = res.data;
        my.httpRequest({
          url: app.constants.ip + "/alipay/user/backPowerBank",
          data: {
            skey: userinfo.skey,
            // skey: "skey9876543222",
          },
          header: {},
          method: 'POST',
          dataType: 'json',
          responseType: 'text',
          success: function(res) {
            console.log("首页：："+JSON.stringify(res))
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
                  my.confirm({
                    title: '充电宝归还成功',
                    content: '本次消费' + res.data.data.payAmount + '元，已从余额扣除',
                  })
                } else if (res.data.data.transactionSource == "4") {//本次充电免费
                  my.confirm({
                    title: '充电宝归还成功',
                    content: '本次充电免费',
                  })
                } else if (res.data.data.transactionSource == "6") {//支付方式为资金冻结自动扣除
                  my.confirm({
                    title: '充电宝归还成功',
                    content: '本次消费' + res.data.data.payAmount + '元，已自动扣除，如有冻结的资金，将原路退回至您的账户中。',
                  })
                }
              } else { //表示未支付
                if (res.data.data.payAmount != "0") {
                  my.confirm({
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
        // skey: "X6g2cuwKJpiTlcPazNE10A!!",
        skey: skey,
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
