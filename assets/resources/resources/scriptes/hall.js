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
            cc.log('进入大厅界面成功')
            this.hallService.emit('getPlayerBaseInfo', User.account, User.pass, (data) => {
                if (data.ok && data.suc) {//获取信息成功
                    var baseInfo = data.data;
                    this.playerName.string = baseInfo.nickname;
                    this.playerId.string = baseInfo.id;
                    this.scoreNum.string = baseInfo.score;
                    //头像
                    CreatorHelper.changeSpriteFrameWithServerUrl(this.headSprite, baseInfo.headimgurl)
                    cc.log('获取信息成功')
                    cc.log(data)

                } else {//获取信息失败
                    cc.log('获取信息失败')
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


        // ------------------------------加入房间相关-----------------------------------
        this.HandlerinputRoomNum()

    },

    createRoom() {
        if (!this.hallService) return;
        this.hallService.emit('createroom', (data) => {
            cc.log(data)
        })
    },

    //加入房间界面逻辑
    HandlerinputRoomNum() {
        //初始化当前点击次数
        this.countIndex = 0;
        var self = this;
        //获取显示数字UI节点
        this.shownumUi = cc.find('joinmask/content/textwrap', this.node);
        //获取所有数字UI节点
        this.inputnumsUi = cc.find("joinmask/content/inputwrap", this.node);
        for (var num = 0; num <= 9; num++) {
            var numUi = cc.find("" + num, this.inputnumsUi);
            CreatorHelper.setNodeClickEvent(numUi, function (event) {
                if (self.countIndex >= 6) { return }//限制乱点
                cc.log('你当前点击了' + event.name);
                var numUi = cc.find('' + self.countIndex, self.shownumUi);
                var numLab = cc.find('txt', numUi).getComponent(cc.Label);
                numLab.string = event.name;
                self.countIndex += 1;

                //判断如果点击次数值大于或等于6次 加入房间
                if (self.countIndex === 6) {
                    cc.log('加入房间，房间号：')
                    var tableStr = '';
                    for (var i = 0; i <= 5; i++) {
                        var numUi = cc.find('' + i, self.shownumUi);
                        var numStr = cc.find("txt", numUi).getComponent(cc.Label);
                        tableStr += numStr.string
                    }
                    cc.log(tableStr)
                    self.joinRoom(tableStr)
                }

            })
        }

        //删除按钮
        var delbtn = cc.find('detel', this.inputnumsUi);
        CreatorHelper.setNodeClickEvent(delbtn, function () {
            if (self.countIndex === 0) { return };
            self.countIndex--;
            var numUi = cc.find('' + self.countIndex, self.shownumUi);
            var numLab = cc.find('txt', numUi).getComponent(cc.Label);
            numLab.string = '';            
            if (self.countIndex <= 0) { self.countIndex = 0 };
        })

        //重输按钮
        var reset = cc.find('reset', this.inputnumsUi);
        CreatorHelper.setNodeClickEvent(reset, function () {
            self.resetShowNumUi()
        })

    },
    //重置房间显示UI
    resetShowNumUi() {
        //获取显示数字UI节点
        this.shownumUi = cc.find('joinmask/content/textwrap', this.node);
        for (var i = 0; i < this.countIndex || 0; i++) {
            var numUi = cc.find('' + i, this.shownumUi);
            var numStr = cc.find("txt", numUi).getComponent(cc.Label);
            numStr.string = ''
        }
        this.countIndex = 0;
    },



    joinRoom(roomNum) {
        if (!this.hallService) return;
        this.hallService.emit('joinroom', roomNum, (data) => {
            cc.log(data)
        })
    }



    // update (dt) {},
});
