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
var Majiang = require('Majiang').Majiang
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
        handCards: {
            default: [],
            type: cc.Prefab
        },
        cardImages: cc.SpriteAtlas
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

        this.handCardUi = cc.find('handCards', this.node)//获取手牌的UI根节点

        console.log(this.handCardUi)

        this.pInfos = {};//保存玩家信息

        this.clearToStart()
        this.handCardsPos = this.createHandCardPos()

        //自己手牌排序
        this.selfHandCards = new Array(34);
        for (var i = 0; i < 34; i++) {
            this.selfHandCards[i] = {}
        }

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

    createHandCardPos() {//创建四个位置 手里牌的位置
        var posArray = new Array(this.posCount);
        posArray[0] = { startPos: { x: 300, y: 190 }, offset: { x: -40, y: 0 }, lastOffset: { x: -20, y: 0 } };
        posArray[1] = { startPos: { x: -450, y: 290 }, offset: { x: 0, y: -30 }, lastOffset: { x: 0, y: -30 } };
        posArray[2] = { startPos: { x: -590, y: -340 }, offset: { x: 83, y: 0 }, lastOffset: { x: 20, y: 0 } };
        posArray[3] = { startPos: { x: 450, y: -180 }, offset: { x: 0, y: 30 }, lastOffset: { x: 0, y: 30 } }

        var handCardsPos = new Array(this.posCount);
        for (var pos = 0; pos < this.posCount; pos++) {
            var cardPos = new Array(14);
            handCardsPos[pos] = cardPos;
            for (var index = 0; index < 14; index++) {
                var position = cardPos[index] = {};
                var config = posArray[pos];
                position.x = config.startPos.x + index * config.offset.x;
                position.y = config.startPos.y + index * config.offset.y;
                if (index === 13) {
                    position.x += config.lastOffset.x;
                    position.y += config.lastOffset.y;
                }
            }
        }

        return handCardsPos;
    },

    createHandCardUi(pos, cardIndex) {
        var pfb = this.handCards[pos];//获取预制
        var cardUi = cc.instantiate(pfb);//实例化对象
        if (pos === 2) {
            //修改spriteFarm
            var sp = this.cardImages.getSpriteFrame(Majiang.smCard(cardIndex));
            cardUi.getComponent(cc.Sprite).spriteFrame = sp;
        }
        return cardUi;
    },

    //手牌排序
    adjustSelfHandCard() {
        var countIndex = 0;
        for (var i = 33; i >= 0; i--) {
            var card = this.selfHandCards[i];//从最后一个位置开始排 也就是从右往左
            for(var cardIndex in card){
                cardIndex = parseInt(cardIndex);
                var ui = card[cardIndex].ui;
                var index = 12 - countIndex;
                countIndex++
                var pos = this.handCardsPos[2][index];
                ui.x = pos.x; ui.y = pos.y;
            }
        }

    },

    createHitCardPos() {//创建四个位置 打出去牌的位置

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
        //----------------------创建头像测试------------------------------
        // this.showHead(2, 0, 'http://i4.cfimg.com/583278/00e2ef22ec67b9b0.jpg', '鸡蛋', '100')
        // this.showHead(3, 1, 'http://i4.cfimg.com/583278/00e2ef22ec67b9b0.jpg', '鸡蛋', '100')
        // this.showHead(4, 2, 'http://i4.cfimg.com/583278/00e2ef22ec67b9b0.jpg', '鸡蛋', '100')
        // this.showHead(5, 3, 'http://i4.cfimg.com/583278/00e2ef22ec67b9b0.jpg', '鸡蛋', '100')

        //----------------------手里牌测试--------------------------------
        for (var i = 0; i < 14; i++) {
            var cardUi = this.createHandCardUi(2, 19);
            var pos = this.handCardsPos[2][i];
            cardUi.x = pos.x;
            cardUi.y = pos.y;
            this.handCardUi.addChild(cardUi);//添加节点

            var cardUi = this.createHandCardUi(0, 19);
            var pos = this.handCardsPos[0][i];
            cardUi.x = pos.x;
            cardUi.y = pos.y;
            this.handCardUi.addChild(cardUi);//添加节点

            var cardUi = this.createHandCardUi(1, 19);
            var pos = this.handCardsPos[1][i];
            cardUi.x = pos.x;
            cardUi.y = pos.y;
            this.handCardUi.addChild(cardUi);//添加节点

            var cardUi = this.createHandCardUi(3, 19);
            var pos = this.handCardsPos[3][i];
            cardUi.x = pos.x;
            cardUi.y = pos.y;
            cardUi.setLocalZOrder(14 - i);
            this.handCardUi.addChild(cardUi);//添加节点
        }


    },


    update(dt) {



    },
});
