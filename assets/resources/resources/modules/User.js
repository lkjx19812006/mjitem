class User {

}

User.account = null;//账号
User.pass = null;//密码
User.playerId = null;//玩家账号
User.nickName = "";//名字
User.headUrl = "";//头像地址
User.score = null;//分数
User.sex = null;//性别
User.pos = null;//位置
User.loginToGameData = null;//登录到游戏服务器的数据
User.roomId = null;//当前房间号
User.hallUrl = null;//大厅服务地址
User.gameUrl = null;//游戏房间地址

User.isSelfPos = function (pos) {//是不是自己的位置
    if (User.pos == pos) return true;
    return false;
}

User.isSelfPId = function (playerId) {
    if (User.playerId == playerId) return true;
    return false;
}
module.exports = User;