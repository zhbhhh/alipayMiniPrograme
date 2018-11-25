const wx = my;

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logo:"/images/app_logo.png",
    jj:"1111111111111111111"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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

  login:function(e){
    
    var that = this;

    // my.showLoading({
    //   success: (res) => {

    //   },
    // });
    // my.httpRequest({
    //   url: app.constants.ip + "/alipay/user/loginUser",
    //   // url: app.constants.ip,
    //   data: {
    //     code: "12356789",
    //   },
    //   // header: { 'Content-Type':'multipart/form-data'},
    //   method: 'POST',
    //   // dataType: 'json',
    //   success: (res) => {
    //     console.log("访问成功:" + JSON.stringify(res));
    //   }, fail: function(res) {
    //     console.log("访问错误：" + JSON.stringify(res));
    //   }, complete: function(res) {
    //     my.hideLoading();
    //   }
    // });


    
    
  },
  userLogin:function(userinfo){
    
  },
  creditBorrowTest:function(res){
    console.log("credit test");
    my.zmCreditBorrow({
      // credit_biz: "",
      // out_order_no: "2018103055555",
      // borrow_shop_name: "",
      // goods_name: "hhhh",
      // product_code: "w101010000000000285",
      // rent_unit: "HOUR_YUAN",
      // rent_amount: "0.10",
      // deposit_amount: "0.50",
      // deposit_state: "Y",
      // invoke_return_url: "",
      // invoke_type: "TINYAPP",
      // borrow_time: "2017-04-27 10:01:01",
      // expiry_time: "2017-05-27 10:01:01",
      // rent_info: "2hour-free",
      success: (res) => {
        console.log(res);
        try {
          const { resultStatus, result } = res;
          switch (resultStatus) {
            case '9000':
              const callbackData = res.result.callbackData;
              const decodedCallbackData = decodeURIComponent(callbackData)
              const json = JSON.parse(decodedCallbackData.match(/{.*}/));
              const jsonStr = JSON.stringify(json, null, 4);
              if (json.success === true || json.success === 'true') {
                // 创建订单成功, 此时可以跳转到订单详情页面
                my.alert({ content: '下单成功: ' + jsonStr })
              } else {
                // 创建订单失败, 请提示用户创建失败
                my.alert({ content: '下单失败: ' + jsonStr })
              }
              this.setData({
                callbackData: callbackData,
                decodedCallbackData: decodedCallbackData,
                parsedJSON: jsonStr,
              })
              break;
            case '6001':
              // 用户点击返回, 取消此次服务, 此时可以给提示
              my.alert({ content: '取消' })
              break;
            default:
              break;
          }
        } catch (error) {
          // 异常, 请在这里提示用户稍后重试
          my.alert({
            content: '异常' + JSON.stringify(error, null, 4)
          });
        }
      },
      fail: (error) => {
        console.log(error);
        // 调用接口失败, 请在这里提示用户稍后重试
        my.alert({
          content: '调用失败' + JSON.stringify(error, null, 4)
        });
      }
    }); 
  },
  login:function(res){
    var that = this;
    // my.getAuthCode({
    //   scopes: 'auth_user',
    //   success: (res) => {
        
    //   },
    // });
    // that.saveUesrInfo("23423434"); //审核用的
    my.getAuthCode({
      scopes: 'auth_user',
      success: (res) => {
        console.log("获取code成功过：" + JSON.stringify(res));
        var code = res.authCode;
        my.showLoading({
          success: (res) => {

          },
        });
        my.httpRequest({
          url: app.constants.ip + "/alipay/user/loginUser",
          data: {
            code: code,
          },
          header: {},
          method: 'POST',
          dataType: 'json',
          responseType: 'text',
          success: (res) => {
            console.log("访问成功:" + JSON.stringify(res));
            if(res.data !="undefined" && res.data.code =="1"){
              that.saveUesrInfo(res.data.data.skey);
            }
          }, fail: function(res) {
            console.log("访问错误：" + JSON.stringify(res));
          }, complete: function(res) {
            my.hideLoading();
          }
        });
      },
      fail: function(res) {
        console.log("获取code出错：" + JSON.stringify(res));
        my.alert({
          content: JSON.stringify(res)
        })
      }
    });
  },
  saveUesrInfo:function(skey){
    my.getAuthUserInfo({
      success: (res) => {
        console.log("userinfo:"+skey+"   userinfo:"+JSON.stringify(res))
        my.setStorage({
          key: app.constants.userinfo, // 缓存数据的key
          data: {
            nickName:res.nickName,
            avatar:res.avatar,
            skey:skey
          }, // 要缓存的数据
          success: (res) => {
            my.redirectTo({
              url: '/pages/index/index', // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
              success: (res) => {
                my.alert({
                  title: '登录成功'
                });
              },
            });
          },
        });
      },
    });
  }

})