var User = require("User");
var EventEmitter = require("EventEmitter");
var Handler = require("Handler");

class NetWorkManager {
  //---------------------------------大厅服务相关----------------------------------------
  //校验并连接到大厅服务
  static connectAndAuthToHall(account, pass, hallUrl) {
    cc.log(account, pass, hallUrl)
    if (NetWorkManager.g_HallService == null) {
      NetWorkManager.g_HallService = window.io('ws://' + hallUrl);
    }
    NetWorkManager.g_HallService.on('connect', () => {
      //连接成功
      cc.log('连接成功');
      NetWorkManager.g_HallService.emit('getSession', User.playerId, (data) => {
        // if (data.isLogin) {//登陆过直接跳转到大厅
        //   cc.director.loadScene("hall");
        // } else {
        //   this.authLogin(account, pass, hallUrl)
        // }
        this.authLogin(account, pass, hallUrl)
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


  //----------------------------------游戏服务相关---------------------------------------
  //链接到游戏服务
  static connectAndAuthToGame(account, pass, gameurl) {
    if (NetWorkManager.g_GameService == null) {
      NetWorkManager.g_GameService = window.io('ws://' + gameurl);
    }
    NetWorkManager.g_GameService.on('connect', () => {
      cc.log('链接到游戏服务器成功')

      NetWorkManager.g_HallService.emit('getSession', User.playerId, (data) => {
        // if (data.isInGame) {//已经进入游戏房间
        //   //直接跳转到
        //   cc.director.loadScene("game");
        // } else {
        //   this.gameLogin(account, pass, gameurl)
        // }
        this.gameLogin(account, pass, gameurl)
      })

    });

  }

  static onConnectedToGame(cb) {//cb 1param service
    if (NetWorkManager.g_GameServiceIsLogin) {
      cb(NetWorkManager.g_GameService);
      return;
    }
    NetWorkManager.gamevents.on("loginToGame", cb);
  }

  static gameLogin(account, pass, gameurl) {
    NetWorkManager.g_GameService.emit('gameLogin', account, pass, gameurl, (data) => {
      //执行校验登陆成功
      if (data.ok && data.suc) {
        cc.log("执行校验登陆成功")
        NetWorkManager.g_GameServiceIsLogin = true;
        User.playerId = data.data.id
        User.account = account;
        User.pass = pass;
        User.nickName = data.data.nickname;
        User.headUrl = data.data.headimgurl;
        User.score = data.data.score;
        User.sex = data.data.sex;
        NetWorkManager.gamevents.emit("loginToGame");
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


//游戏服务
NetWorkManager.g_GameService = null;
NetWorkManager.g_GameServiceIsLogin = false;
NetWorkManager.gamevents = new EventEmitter();

module.exports = NetWorkManager