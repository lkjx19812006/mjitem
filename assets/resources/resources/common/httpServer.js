//定义全局接口调用类
const conf = require('globalConf')
const axios = require('axios')
const http = {
  fetch(params) {
    if (params && typeof params === 'object') {
      //设置地址
      if (params.url) {
        params.url = conf.host + params.url;
      } else {
        return Promise.reject('参数错误')
      }
      //设置超时时间
      if (!params.timeout) {
        params.timeout = 1000 * 15
      }


      return new Promise((resolve, reject) => {
        axios(params).then(res => {
          if (res.data.ok) {
            //网络请求成功           
            if (res.data.code === '1c0e') {//成功的标志
              resolve(res.data.data)
            } else {
              reject(res.data.data)
            }
          } else {
            reject(res)
          }
        }, err => {
          //错误类型
          reject(err)
        })
      })
    } else {
      return Promise.reject('参数错误')
    }

  }

}

module.exports = http
