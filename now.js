const devicesId = "642695734" // 填写在OneNet上获得的devicesId 形式就是一串数字 例子:9939133
const api_key = "l=2m44rmjLjD4TBowUXZkVgjxNY=" // 填写在OneNet上的 api-key 例子: VeFI0HZ44Qn5dZO14AuLbWSlSlI=

Page({
  data:{
    temp:'',
    humidity:'',
    ppm:'',
    humtip:'',
    ppmtip:''
  },
  go: function() {
    wx.navigateTo({
        url: '../tianqi/tianqi',
    })
},
  onPullDownRefresh: function () {
    wx.showLoading({
      title: "正在获取"
    })
    this.getDatapoints().then(datapoints => {
      this.update(datapoints)
      wx.hideLoading()
    }).catch((error) => {
      wx.hideLoading()
      console.error(error)
    })
  },

  /**
   * @description 页面加载生命周期
   */
  onLoad: function () {
    console.log(`your deviceId: ${devicesId}, apiKey: ${api_key}`)

    //每隔6s自动获取一次数据进行更新
    const timer = setInterval(() => {
      this.getDatapoints().then(datapoints => {
        this.update(datapoints)
      })
    }, 5000)

    wx.showLoading({
      title: '加载中'
    })

    this.getDatapoints().then((datapoints) => {
      wx.hideLoading()
     
    }).catch((err) => {
      wx.hideLoading()
      console.error(err)
      clearInterval(timer) //首次渲染发生错误时禁止自动刷新
    })
  },

  /**
   * 向OneNet请求当前设备的数据点
   * @returns Promise
   */


 getDatapoints: function () {
   var that=this
    return new Promise((resolve, reject) => {
      wx.request({
        url: `https://api.heclouds.com/devices/${devicesId}/datapoints?datastream_id=Temperature,Humidity,PPM&limit=20`,
        /**
         * 添加HTTP报文的请求头, 
         * 其中api-key为OneNet的api文档要求我们添加的鉴权秘钥
         * Content-Type的作用是标识请求体的格式, 从api文档中我们读到请求体是json格式的
         * 故content-type属性应设置为application/json
         */
        header: {
          'content-type': 'application/json',
          'api-key': api_key
        },
        success: (res) => {
          const status = res.statusCode
          const response = res.data
          if (status !== 200) { // 返回状态码不为200时将Promise置为reject状态
            reject(res.data)
            return ;
          }
          if (response.errno !== 0) { //errno不为零说明可能参数有误, 将Promise置为reject
            reject(response.error)
            return ;
          }

          if (response.data.datastreams.length === 0) {
            reject("当前设备无数据, 请先运行硬件实验")
          }

          //程序可以运行到这里说明请求成功, 将Promise置为resolve状态
          resolve({
            temperature: response.data.datastreams[0].datapoints[19].value,
            humidity: response.data.datastreams[1].datapoints[19].value,
            ppm: response.data.datastreams[2].datapoints[19].value
          }),
        
          that.setData({
            temp: response.data.datastreams[0].datapoints[19].value,
            humidity:response.data.datastreams[1].datapoints[19].value,
            ppm:response.data.datastreams[2].datapoints[19].value
          })

          //出行条件判断
            var hum=response.data.datastreams[1].datapoints[19].value
            var ppm=response.data.datastreams[2].datapoints[19].value
            var humtip
            var ppmtip
            if(hum<40)
          humtip="环境干燥，急需加湿"
          else if(hum>40&&hum<60)
          humtip="湿度适宜"
          else humtip="环境过湿，需要通风"
       
        if(ppm<450)
        ppmtip="室内空气质量良好"
        else ppmtip="空气不佳，需通风"
        that.setData({
          humtip:humtip,
          ppmtip:ppmtip
        })
           

        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  }
  



})