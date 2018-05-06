var http = require('httpServer')
var NetWorkManager = require('NetWorkManager')
class LoginManager {
    static weixinLogin() {

    }

    //调用服务器的测试登录接口，创建或者返回一个测试账号登录的结果
    static testLogin(account) {
        http.fetch({
            url: '/user/testLogin',
            data: {
                account: account
            },
            method: 'post'
        }).then(res => {
            //登陆成功
            cc.log('登陆成功')
            NetWorkManager.connectAndAuthToHall(res.account, res.pass, res.hallUrl);
            //校验成功 跳转到hall页面
            NetWorkManager.onConnectedToHall(() => {
                cc.director.loadScene("hall");
            })
        }, err => {
            console.log(err)
        })
    }
}
module.exports = LoginManager;