var User = require("User");
var EventEmitter = require("EventEmitter");
var Handler = require("Handler");

class NetWorkManager {

  //校验并连接到大厅服务
  static connectAndAuthToHall(account, pass, hallUrl) {
    cc.log(account, pass, hallUrl)
    if (NetWorkManager.g_HallService == null) {
      NetWorkManager.g_HallService = window.io('ws://' + hallUrl);
      //开启关闭时的事件监听
      NetWorkManager.g_HallService.on('close', function () {
        //连接中断
        cc.log('链接中断')
        NetWorkManager.g_HallServiceIsLogin = false;
      })
    }
    NetWorkManager.g_HallService.on('connect', () => {
      //连接成功
      cc.log('连接成功');
      //执行登陆校验逻辑
      NetWorkManager.g_HallService.emit('authLogin', account, pass, (data) => {
        //执行校验登陆成功
        if (data.ok && data.code === '1c0e') {
          cc.log("执行校验登陆成功")
          NetWorkManager.g_HallServiceIsLogin = true;
          User.account = account;
          User.pass = pass;
          User.nickName = data.data.nickname;
          User.headUrl = data.data.headimgurl;
          User.score = data.data.score;
          User.sex = data.data.sex;
          NetWorkManager.events.emit("loginToHall");
          return;
        }
        cc.log("执行校验失败")
      })

    });
  }

  //监听连接成功后事件
  static onConnectedToHall(cb) {//cb 1param service
    if (NetWorkManager.g_HallServiceIsLogin) {
      cb(NetWorkManager.g_HallService);
      return;
    }
    NetWorkManager.events.on("loginToHall", cb);
  }


}

//大厅服务
NetWorkManager.g_HallService = null;
NetWorkManager.g_HallServiceIsLogin = false;
NetWorkManager.events = new EventEmitter();


module.exports = NetWorkManager