var http = require('httpServer')
class LoginManager {
    static weixinLogin() {

    }

    //调用服务器的测试登录接口，创建或者返回一个测试账号登录的结果
    static testLogin(account, cb) {
        if(!account || !cb)return
        http.fetch({
            url: '/user/testLogin',
            data: {
                account: account
            },
            method: 'post'
        }).then(res => {
            //登陆成功
            cc.log('登陆成功')
            cb && cb(res)         
        }, err => {
            console.log(err)
        })
    }

    static hallLogin(account, pass, cb){
        if(!account || !pass || !cb)return;
        http.fetch({
            url: '/user/hallLogin',
            data: {
                account: account,
                pass: pass
            },
            method: 'post'
        }).then(res => {
            cb && cb(res);
        }, err => {
            console.log(err)
        })
    }

    static gameLogin(account, pass, cb){
        if(!account || !pass || !cb)return;
        http.fetch({
            url: '/user/gameLogin',
            data: {
                account: account,
                pass: pass
            },
            method: 'post'
        }).then(res => {
            cb && cb(res);
        }, err => {
            console.log(err)
        })
    }

}
module.exports = LoginManager;