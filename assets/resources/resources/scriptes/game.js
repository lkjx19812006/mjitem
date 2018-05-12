// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var NetWorkManager = require('NetWorkManager')
var User = require('User')
var CreatorHelper = require('CreatorHelper')
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //获取房间信息
        this.roomId = User.roomId;
        var self = this;
        NetWorkManager.onConnectedToGame((gameService) => {
            this.gameService = gameService;
            cc.log(gameService)
            cc.log('进入游戏房间成功，房间号' + self.roomId)
            var playerInfo = {
                nickName: User.nickName,//名字
                headUrl: User.headUrl,//头像地址
                score: User.score,//分数
                playerId: User.playerId //玩家id
            }
            this.joinRoom(this.roomId, playerInfo, this.gameService.id)

            //初始化消息
            this.initMessage()

        })
    },

    initMessage() {
        if (!this.gameService) return;
        this.gameService.on('message', (data) => {
            console.log('接收到服务器端的消息了')
            console.log(data)
        })

    },


    joinRoom(roomId, playerInfo, socketid) {
        if (!this.gameService) return;
        this.gameService.emit('joinRoom', roomId, playerInfo, socketid, (data) => {
            cc.log('加入房间成功')
            cc.log(data)
        })
    },


    getRoomInfo() {
        if (!this.gameService) return;
        this.gameService.emit('getTableInfos', this.roomId, (data) => {
            cc.log(data)
        })

    },


    start() {

    },

    // update (dt) {},
});
