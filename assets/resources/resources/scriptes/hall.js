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
        headSprite: cc.Sprite,//用户头像
        playerName: cc.Label,//用户名
        playerId: cc.Label,//用户id
        scoreNum: cc.Label,//分数
        createRoomBn: cc.Node,//创建房间
        enterRoomBn: cc.Node//加入房间
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        //进入大厅 调用服务器方法
        NetWorkManager.onConnectedToHall((hallService) => {
            this.hallService = hallService
            console.log('进入大厅界面成功')
            this.hallService.emit('getPlayerBaseInfo', User.account, User.pass, (data) => {
                if (data.ok && data.suc) {//获取信息成功
                    var baseInfo = data.data;
                    this.playerName.string = baseInfo.nickname;
                    this.playerId.string = baseInfo.id;
                    this.scoreNum.string = baseInfo.score;
                    //头像
                    CreatorHelper.changeSpriteFrameWithServerUrl(this.headSprite, baseInfo.headimgurl)
                    console.log('获取信息成功')
                    console.log(data)

                } else {//获取信息失败
                    console.log('获取信息失败')
                }
            })
        })

        //监听创建房间事件            
        this.createRoomBn.on(cc.Node.EventType.TOUCH_START, args => {
            this.createRoom()
        }, this)

        //监听加入房间事件
        this.enterRoomBn.on(cc.Node.EventType.TOUCH_START, args => {
            this.joinRoom()
        }, this)

    },

    createRoom() {
        if (!this.hallService) return;
        this.hallService.emit('createroom', (data) => {
            console.log(data)
        })
    },
    joinRoom() {
        if (!this.hallService) return;
        this.hallService.emit('joinroom', (data) => {
            console.log(data)
        })
    }



    // update (dt) {},
});
