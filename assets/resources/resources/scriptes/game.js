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
var CreatorHelper = require('CreatorHelper')
var UnitTools = require('UnitTools')
var User = require('User')
var MsgHandler = require('MsgHandler')
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
        //--------------------------------初始化UI相关-----------------------
        MsgHandler.instance().logicCom = this;//将UI节点对象传递过去
        this.posCount = 4;
        this.headRoot = {};
        this.headSpUi = {};
        this.nameUi = {};
        this.scoreUi = {};

        for (var i = 0; i < this.posCount; i++) {
            this.headRoot[i] = cc.find('head' + i, this.node);
            this.headSpUi[i] = cc.find('head' + i + '/head/headframe/headImg', this.node);
            this.nameUi[i] = cc.find('head' + i + '/head/name', this.node)
            this.scoreUi[i] = cc.find('head' + i + '/head/score', this.node)
        }

        this.pInfos = {};//保存玩家信息

        this.clearToStart()
        //-------------------------------初始化UI相关结束-----------------------


        //-------------------------------获取房间信息---------------------------
        //获取房间信息
        this.roomId = User.roomId;
        var self = this;
        NetWorkManager.onConnectedToGame((gameService) => {
            this.gameService = gameService;
            this.MsgHandler = MsgHandler.instance();

            cc.log(gameService)
            cc.log('进入游戏房间成功，房间号' + self.roomId)
            var socketId = this.gameService.id
            var playerInfo = {
                gameUrl: User.gameUrl,//游戏服务器地址
                nickName: User.nickName,//名字
                headUrl: User.headUrl,//头像地址
                score: User.score,//分数
                playerId: User.playerId, //玩家id
                socketId: socketId,//客户端连接ID
                playerState: 0,//用户状态0未准备 1准备 2离开
                handCard: [],//用户手牌
                hitCard: [],//用户打的牌
                gang: [],//杠牌
                peng: []//碰牌
            }
            this.joinRoom(this.roomId, playerInfo)

            //初始化消息
            this.initMessage()

        })

        //-------------------------------获取房间信息结束---------------------------
    },

    //------------------------------游戏界面UI操作相关--------------------------------

    clearToStart() {
        for (var i = 0; i < this.posCount; i++) {
            this.headRoot[i].active = false;
            this.nameUi[i].getComponent(cc.Label).string = '';
            this.scoreUi[i].getComponent(cc.Label).string = '';
        }

    },

    getScreenPos(selfLogicPos, logicPos) {
        var myPos = selfLogicPos;
        var delta = Number(myPos) - 2;
        var screenPos = Number(logicPos) - delta;
        screenPos = screenPos < 0 ? 4 + screenPos : screenPos;
        screenPos = screenPos >= 4 ? screenPos - 4 : screenPos;
        return screenPos;
    },


    showHead(pId, srcPos, imgUrl, name, scorenum) {
        this.headRoot[srcPos].active = true;
        var sp = this.headSpUi[srcPos].getComponent(cc.Sprite);
        var nameLab = this.nameUi[srcPos].getComponent(cc.Label);
        var score = this.scoreUi[srcPos].getComponent(cc.Label);
        CreatorHelper.changeSpriteFrameWithServerUrl(sp, imgUrl);
        nameLab.string = name;
        score.string = scorenum;
        var info = UnitTools.getOrCreateJsonInJson(pId, this.pInfos);
        info.pos = srcPos
    },

    hideHead(pId) {
        var info = this.pInfos[pId];
        if (UnitTools.isNullOrUndefined(info)) return;
        var pos = info.pos;
        this.headRoot[pos].active = false;
    },

    //-------------------------------------游戏界面UI操作相关结束----------------------------


    //-------------------------------------游戏界面逻辑处理----------------------------------
    initMessage() {
        if (!this.gameService) return;
        this.gameService.on('message', (data) => {
            //消息执行
            this.MsgHandler.handlerMessage(data)
        })
    },


    joinRoom(roomId, playerInfo) {
        if (!this.gameService) return;
        this.gameService.emit('joinRoom', roomId, playerInfo, (data) => {
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
    //---------------------------------------游戏界面逻辑处理结束-----------------------------------

    start() {
        // this.test();
    },

    test() {
        this.showHead(2, 0, 'http://i4.cfimg.com/583278/00e2ef22ec67b9b0.jpg', '鸡蛋', '100')
        this.showHead(3, 1, 'http://i4.cfimg.com/583278/00e2ef22ec67b9b0.jpg', '鸡蛋', '100')
        this.showHead(4, 2, 'http://i4.cfimg.com/583278/00e2ef22ec67b9b0.jpg', '鸡蛋', '100')
        this.showHead(5, 3, 'http://i4.cfimg.com/583278/00e2ef22ec67b9b0.jpg', '鸡蛋', '100')
    }


    // update (dt) {},
});
