const wx = my;
// pages/billing/index.js
var app = getApp();
Page({
  data:{
    hours: 0,
    minuters: 0,
    seconds: 0,
    billing: "正在计费",
    powerbankNumber:"sdfsdfsdfdf",
    backType:"本次充电免费",
    seconds: 0,
    minuters: 0,
    hours: 0,
    timer:"",
    isLocalPage:false,
  },
// 页面加载
  onLoad:function(options){
    
      // this.startTimer();
  },
  onShow:function(e){
    var that = this;
    console.log("onshow");
    this.getChargingTime();
  },
  onHide:function(e){
    console.log("页面隐藏");
    clearInterval(this.data.timer);
    this.data.isLocalPage = true;
  },
  onUnload:function(e){
    clearInterval(this.data.timer);
  },
// 结束充电，清除定时器
  endRide: function(){
    clearInterval(this.data.timer);
    this.timer = "";
    this.setData({
      billing: "本次充电耗时",
      disabled: true
    })
  },
// 携带定时器内容回到地图
  moveToIndex: function(){
      // 关闭计费页跳到地图
      // wx.navigateTo({
      //   url: '../index/index'
      // })
    var t = getCurrentPages()
    // console.log(t[0].);
    if(t.length > 1){
      wx.navigateBack({
        delta: 99
      })
    }else{
      wx.redirectTo({
        url: '../index/index'
      })
    }
      
  },
  //开启计时器
  startTimer:function(currentTime){
    this.setData({
      number: currentTime,
      // timer: this.timer
    })
    // 初始化计时器
    if (this.data.number != undefined && this.data.number !="") {
      var numbers = parseInt(this.data.number);
      var s = (numbers % 3600)%60;
      var m = Math.floor((numbers % 3600) / 60);
      var h = Math.floor(numbers/3600);
    } else {
      var s = 0;
      var m = 0;
      var h = 0;
    }
    
    
    // 计时开始
    this.data.timer = setInterval(() => {
      this.setData({
        seconds: s++,
        minuters:m,
        hours: h
      })
 
      if(s%5 == 0){
        this.checkBackPowerBank();
      }
      if (s == 60) {
        s = 0;
        m++;
        setTimeout(() => {
          this.setData({
            minuters: m
          });
        }, 1000)
        if (m == 60) {
          m = 0;
          h++
          setTimeout(() => {
            this.setData({
              hours: h
            });
          }, 1000)
        }
      };
    }, 1000)
  },
  //实时访问是否归还充电宝
  checkBackPowerBank:function(e){
    var that = this;
    my.getStorage({
      key: app.constants.userinfo,
      success: function (res) {
        var userinfo = res.data;
        if(userinfo==null || userinfo == undefined) return;
        // wx.showLoading({
        //   title: '',
        // })
        //获取skey成功，访问接口获取数据
        my.httpRequest({
          url: app.constants.ip + "/wechat/user/backPowerBank",
          data: {
            skey: userinfo.skey,
          },
          header: {},
          method: 'POST',
          dataType: 'json',
          responseType: 'text',
          success: function (res) {
            console.log(res)
            if (res.data.flag == "1") { //用户可借用充电宝,表示充电宝已归还
              clearInterval(that.data.timer);//清楚计时器
              that.setData({
                billing: "本次充电耗时",
                disabled: true
              })
              //处理订单结果
              if (res.data.data.payStatus == "1") {  //表示已支付
                if (res.data.data.transactionSource == "3") {//3表示交易源为余额,4表示免费
                      my.confirm({
                        title: '支付宝归还成功',
                        content: '本次消费'+res.data.data.payAmount+'元，已从余额扣除',
                      })
                } else if (res.data.data.transactionSource == "4"){//本次充电免费
                  my.confirm({
                    title: '支付宝归还成功',
                    content: '本次充电免费',
                  })
                }
              }else{ //表示未支付
                if (res.data.data.payAmount != "0") {
                  my.confirm({
                    title: '充电完成',
                    content: '本次消费' + res.data.data.payAmount +'元，是否立即支付',
                    success: function (e) {
                      console.log(e);
                      if (e.confirm) //用户点击了确定按钮,再调用支付接口
                      that.handleOrder(res.data.data.payAmount);
                    }
                  })
                }
              } 
            } else {  //用户不能借用充电宝，1.用户未交押金，2.用户有未支付的订单，3.用户有正在借用的订单。
              
            }
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      },
    })
  },
  handleOrder: function (money) {
    my.getStorage({
      key: app.constants.userinfo,
      success: function (res) {
        var userinfo = res.data;
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
              console.log(res);
              //调用支付

            } else { //接口返回code=0 失败
              console.log(res);
              my.confirm({
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
  getChargingTime:function(res){
    var that = this;
    my.getStorage({
      key: app.constants.userinfo, // 缓存数据的key
      success: (res) => {
        if(res.data != null){
          console.log("请求后台获取时间:" + app.constants.ip + "/alipay/user/firstPage/userStatus/userOrderDoing");
          my.httpRequest({
            url: app.constants.ip + "/alipay/user/firstPage/userStatus/userOrderDoing", // 目标服务器url
            data:{
              skey:res.data.skey,
            },
            success: (res) => {
              console.log("shijian:"+JSON.stringify(res));
              if (res.data.data.status == 1){
                that.startTimer(res.data.data.useTime);
              }else{
                my.navigateBack({
                  delta:99
                });
              }
            },fail:function(res){
              console.log("fail:" + JSON.stringify(res));
            }
          });
        }
      },
    });
  }
})