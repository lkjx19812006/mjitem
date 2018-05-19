//开发环境或者生产环境 进行的一些相关配置
const pro = {
  env: 'pro',//dev or pro
};
module.exports = {
  host: pro.env === 'dev' ? 'http://127.0.0.1:39000' : 'http://192.168.1.104:39000'
};




