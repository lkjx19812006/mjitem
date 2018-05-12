// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var LoginManager = require("LoginManager")
var NetWorkManager = require('NetWorkManager')
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
        xieyiCheck: cc.Toggle,//协议按钮
        weixinLoginBn: cc.Node,
        testLoginCom: ''
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.testLoginCom.setLoginEvents(function (account) {
            LoginManager.testLogin(account, function(res){
                NetWorkManager.connectAndAuthToHall(res.account, res.pass, res.hallUrl);
                //校验成功 跳转到hall页面
                NetWorkManager.onConnectedToHall(() => {
                    cc.director.loadScene("hall");
                })
            })
        })

        // console.log(this.testLoginCom.setLoginEvents)
        // this.weixinLoginBn.on(cc.Node.EventType.TOUCH_START, args => {
        //     if (!this.xieyiCheck.isChecked) return;
        //     cc.log('执行登陆')
        // }, this)

    },

    start() {

    },

    // update (dt) {},
});
