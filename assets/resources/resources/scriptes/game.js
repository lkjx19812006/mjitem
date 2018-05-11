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
            console.log(gameService)
            console.log('进入游戏房间成功，房间号' + self.roomId)
            //获取房间信息
            //1.如果自己不在房间信息中，加入到房间

            //2.如果在
        })


    },

    getRoomInfo() {
        if (!this.gameService) return;
        this.gameService.emit('getTableInfos', this.roomId, (data) => {
            console.log(data)
        })

    },


    start() {

    },

    // update (dt) {},
});
