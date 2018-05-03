var User = require("User");
var EventEmitter = require("EventEmitter");
var Handler = require("Handler");

class NetWorkManager {

  //校验并连接到大厅服务
  static connectAndAuthToHall(account, pass, hallUrl) {
    if (NetWorkManager.g_HallService == null) {
      NetWorkManager.g_HallService = io('ws://' + hallUrl);
      //开启关闭时的事件监听
      NetWorkManager.g_HallService.on('close', function () {
        //连接中断
        NetWorkManager.g_HallServiceIsLogin = false;
        NetWorkManager.emit("closeFromHall");//发送客户端关闭事件
        NetWorkManager.connectAndAuthToHall(account, pass, url);
      })
    }
    NetWorkManager.g_HallService.on('connect', (socket) => {
      //连接成功
      console.log('连接成功');
      console.log(socket)
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