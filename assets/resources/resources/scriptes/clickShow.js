// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

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
        showNode: cc.Node,
        showAnimationClip: cc.AnimationClip
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //创建一个动画组建
        var animation = this.showNode.addComponent(cc.Animation);
        //添加动画
        animation.addClip(this.showAnimationClip, 'show');

        this.node.on(cc.Node.EventType.TOUCH_START, function (args) {
            this.showNode.active = true;
            animation.play('show')
        }, this)

    },

    start() {

    },

    // update (dt) {},
});
