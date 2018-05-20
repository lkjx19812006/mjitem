/**
 * Created by litengfei on 2018/3/3.
 */
var User = require("User");
var Majiang = require("Chess").Majiang;
var EventEmitter = require("EventEmitter");
class MsgHandler {
    constructor() {
        this.logicCom = null;//游戏组件  在game 文件中 已经赋值
        this.eventQueue = [];//消息队列
    }

    static instance() {
        if (MsgHandler.g_instance == null) {
            MsgHandler.g_instance = new MsgHandler();
        };
        return MsgHandler.g_instance;
    }


    //消息执行函数
    handlerMessage(data) {
        if (this[data.event]) {
            this[data.event](data.data)
        }
    }

    //获取用户在服务器中的位置
    getUserPos(data) {
        var rooms = data.rooms;
        var flag = -1;
        if (rooms && typeof rooms === 'object') {
            for (var i = 0; i < rooms.length; i++) {
                var item = rooms[i];
                if (item.playerId === User.playerId) {
                    flag = i;
                    break;
                }
            }
        }
        return flag;
    }


    //--------------------------------------服务器消息执行事件开始---------------------------------------------

    //触发消息 名称必须和服务端响应的事件名称一致 
    /**
     * data 服务器返回的消息数据
     */
    joinRoom(data) {
        console.log('===============================收到服务器消息：%o', data)
        var rooms = data.rooms
        //获取用户pos
        User.pos = this.getUserPos(data);
        cc.log('用户当前位置 :' + User.pos)
        if (rooms && typeof rooms === 'object') {
            rooms.forEach((item, index) => {
                var pId = User.playerId;
                var srcpos = this.logicCom.getScreenPos(User.pos, index);
                var imgUrl = item.headUrl;
                var pname = item.nickName;
                var scorenum = item.score
                this.logicCom.showHead(pId, srcpos, imgUrl, pname, scorenum)
            });
        }
        cc.log('用户加入房间')
        cc.log(data);
    }

    startCard(data) {//发送手牌消息
        console.log('绘制自己手牌UI：%o', data);
        var cardIndexs = data;
        for (var i = 0; i < 13; i++) {
            //自己的手牌
            var cardIndex = cardIndexs[i]
            var cardUi = this.logicCom.createHandCardUi(2, cardIndex);
            var pos = this.logicCom.handCardsPos[2][i];
            cardUi.x = pos.x;
            cardUi.y = pos.y;
            this.logicCom.handCardUi.addChild(cardUi);//添加节点

            var cardUi = this.logicCom.createHandCardUi(0);
            var pos = this.logicCom.handCardsPos[0][i];
            cardUi.x = pos.x;
            cardUi.y = pos.y;
            this.logicCom.handCardUi.addChild(cardUi);//添加节点

            var cardUi = this.logicCom.createHandCardUi(1);
            var pos = this.logicCom.handCardsPos[1][i];
            cardUi.x = pos.x;
            cardUi.y = pos.y;
            this.logicCom.handCardUi.addChild(cardUi);//添加节点

            var cardUi = this.logicCom.createHandCardUi(3);
            var pos = this.logicCom.handCardsPos[3][i];
            cardUi.x = pos.x;
            cardUi.y = pos.y;
            cardUi.setLocalZOrder(14 - i);
            this.logicCom.handCardUi.addChild(cardUi);//添加节点
        }

    }


    //--------------------------------------服务器消息事件结束-----------------------------------------------
}

MsgHandler.g_instance = null;
MsgHandler.events = new EventEmitter();
module.exports = MsgHandler;

