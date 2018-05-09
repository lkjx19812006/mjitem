var User = require("User");
var EventEmitter = require("EventEmitter");
var Handler = require("Handler");

class NetWorkManager {

  //校验并连接到大厅服务
  static connectAndAuthToHall(account, pass, hallUrl) {
    cc.log(account, pass, hallUrl)
    if (NetWorkManager.g_HallService == null) {
      NetWorkManager.g_HallService = window.io('ws://' + hallUrl);

    }
    NetWorkManager.g_HallService.on('connect', () => {
      //连接成功
      cc.log('连接成功');
      //执行登陆校验逻辑
      //查看用户是否已经登陆，
      //1 如果已经登陆，不需要执行登陆请求
      //2 用户是否在进行游戏
      //3 
      if (User.playerId) {
        NetWorkManager.g_HallService.emit('getSession', User.playerId, (data) => {
          if (!data.isLogin) {//没有登陆 去登陆
            this.authLogin(account, pass, hallUrl)
            return
          }
          //已经登陆 
          //1.查看房间状态
          //2.如果正在游戏 加入到房间
        })
      } else {
        this.authLogin(account, pass, hallUrl)
      }
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

  //校验登陆
  static authLogin(account, pass, hallUrl) {
    NetWorkManager.g_HallService.emit('authLogin', account, pass, hallUrl, (data) => {
      //执行校验登陆成功
      if (data.ok && data.suc) {
        cc.log("执行校验登陆成功")
        NetWorkManager.g_HallServiceIsLogin = true;
        User.playerId = data.data.id
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
  }

}

//大厅服务
NetWorkManager.g_HallService = null;
NetWorkManager.g_HallServiceIsLogin = false;
NetWorkManager.events = new EventEmitter();


module.exports = NetWorkManager