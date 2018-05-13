// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var CreatorHelper = require('CreatorHelper')
var UnitTools = require('UnitTools')
var User = require('User')
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
        this.posCount = 4;
        this.headRoot = {};
        this.headSpUi = {};
        this.nameUi = {};
        this.scoreUi = {};

        for (var i = 0; i < this.posCount; i++) {
            this.headRoot[i] = cc.find('head' + i,this.node);
            this.headSpUi[i] = cc.find('head' + i + '/head/headframe/headImg', this.node);
            this.nameUi[i] = cc.find('head' + i + '/head/name', this.node)
            this.scoreUi[i] = cc.find('head' + i + '/head/score', this.node)
        }
        
        this.pInfos = {};//保存玩家信息

        this.clearToStart()
    },

    clearToStart(){
        for(var i = 0; i < this.posCount; i++){
            this.headRoot[i].active  = false;
            this.nameUi[i].getComponent(cc.Label).string = '';
            this.scoreUi[i].getComponent(cc.Label).string = '';
        }
        
    },

    getScreenPos(selfLogicPos, logicPos){
        var myPos = selfLogicPos;
        var delta = Number(myPos) -2;
        var screenPos = Number(logicPos) - delta;
        screenPos = screenPos < 0 ? 4 + screenPos:screenPos;
        screenPos = screenPos >= 4 ? screenPos - 4:screenPos;
        return screenPos;
    },
    
    showHead(pId, srcPos, imgUrl, name, scorenum){
       this.headRoot[srcPos].active  = true;
       var sp = this.headSpUi[srcPos].getComponent(cc.Sprite);
       var nameLab = this.nameUi[srcPos].getComponent(cc.Label);
       var score = this.scoreUi[srcPos].getComponent(cc.Label);
       CreatorHelper.changeSpriteFrameWithServerUrl(sp, imgUrl);
       nameLab.string = name;
       score.string = scorenum;
       var info =  UnitTools.getOrCreateJsonInJson(pId, this.pInfos);        
       info.pos = srcPos
    },

    hideHead(pId){
        var info = this.pInfos[pId];
        if(UnitTools.isNullOrUndefined(info))return;
        var pos = info.pos;
        this.headRoot[pos].active = false;
    },

    start() {
        // this.test();
    },

    test(){
        this.showHead(2, 0, 'http://i4.cfimg.com/583278/00e2ef22ec67b9b0.jpg', '鸡蛋', '100')
        this.showHead(3, 1, 'http://i4.cfimg.com/583278/00e2ef22ec67b9b0.jpg', '鸡蛋', '100')
        this.showHead(4, 2, 'http://i4.cfimg.com/583278/00e2ef22ec67b9b0.jpg', '鸡蛋', '100')
        this.showHead(5, 3, 'http://i4.cfimg.com/583278/00e2ef22ec67b9b0.jpg', '鸡蛋', '100')
    }

    // update (dt) {},
});
