var User = require("User");
var EventEmitter = require("EventEmitter");
var LoginManager = require('LoginManager');


class NetWorkManager {
  //---------------------------------大厅服务相关----------------------------------------
  //校验并连接到大厅服务
  static connectAndAuthToHall(account, pass) {
    LoginManager.hallLogin(account, pass, (data)=>{
      //执行校验登陆成功
      if (data) {
        cc.log("执行校验登陆成功")
        NetWorkManager.g_HallServiceIsLogin = true;
        User.playerId = data.id
        User.account = account;
        User.pass = pass;
        User.nickName = data.nickname;
        User.headUrl =data.headimgurl;
        User.score = data.score;
        User.sex = data.sex;
        User.hallUrl = data.hallUrl;
        //校验成功 链接到大厅服务
        if (NetWorkManager.g_HallService == null) {
          NetWorkManager.g_HallService = window.io('ws://' + User.hallUrl);
        }
        NetWorkManager.g_HallService.on('connect', () => {
          //连接成功
          cc.log('连接成功');          
        });
        NetWorkManager.events.emit("loginToHall");
        return;
      }
      cc.log("执行校验失败")
    })  
   
  }

  //监听连接成功后事件
  static onConnectedToHall(cb) {//cb 1param service
    if (NetWorkManager.g_HallServiceIsLogin) {
      cb(NetWorkManager.g_HallService);
      return;
    }
    NetWorkManager.events.on("loginToHall", cb);
  }

  //----------------------------------游戏服务相关---------------------------------------
  //链接到游戏服务
  static connectAndAuthToGame(account, pass) {
    LoginManager.gameLogin(account, pass, (data)=>{
      if (data) {
        cc.log("执行校验登陆成功")
        NetWorkManager.g_GameServiceIsLogin = true;
        User.playerId = data.id
        User.account = account;
        User.pass = pass;
        User.nickName = data.nickname;
        User.headUrl = data.headimgurl;
        User.score = data.score;
        User.sex = data.sex;
        User.gameUrl = data.gameUrl
        if (NetWorkManager.g_GameService == null) {
          NetWorkManager.g_GameService = window.io('ws://' +  User.gameUrl);
        }
        NetWorkManager.g_GameService.on('connect', () => {
          cc.log('链接到游戏服务器成功')    
        });
        NetWorkManager.gamevents.emit("loginToGame");
        return;
      }
      cc.log("执行校验失败")
    })

  }

  static onConnectedToGame(cb) {//cb 1param service
    if (NetWorkManager.g_GameServiceIsLogin) {
      cb(NetWorkManager.g_GameService);
      return;
    }
    NetWorkManager.gamevents.on("loginToGame", cb);
  }

}

//大厅服务
NetWorkManager.g_HallService = null;
NetWorkManager.g_HallServiceIsLogin = false;
NetWorkManager.events = new EventEmitter();


//游戏服务
NetWorkManager.g_GameService = null;
NetWorkManager.g_GameServiceIsLogin = false;
NetWorkManager.gamevents = new EventEmitter();

module.exports = NetWorkManager