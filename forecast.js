Page({

  /**
   * 页面的初始数据
   */
  data: {
    search_city: '',
    imgsrc:100,
    showModal: false,
humtip:""
  },

  submit: function() {
    this.setData({
    showModal: true
    })
},

preventTouchMove: function() {

},


go: function() { 
    this.setData({
    showModal: false
    })
},

  /**
   * 根据城市获取天气预报
   */
  getWeather(city) {
    let that = this
    //获取实况天气
    wx.request({
      url: 'https://free-api.heweather.net/s6/weather/now?key=5627f594ccba408f84f79a2bf1e7f6dc&location=' + city,
      success: function(res) {
        if (res.data.HeWeather6[0].status == 'unknown location') {
          wx.showToast({
            title: '抱歉！没有该城市的天气预报',
            icon: 'none',
            duration: 2000
          })
          return;
        }
        console.log(res)
        var hum=res.data.HeWeather6[0].now.hum
        that.setData({
          city: city,
          tmp: res.data.HeWeather6[0].now.tmp,
          imgsrc: res.data.HeWeather6[0].now.cond_code,
          wind_dir: res.data.HeWeather6[0].now.wind_dir,
          wind_sc: res.data.HeWeather6[0].now.wind_sc,
          hum: res.data.HeWeather6[0].now.hum,
          pres: res.data.HeWeather6[0].now.pres
        })

        //出行建议
    var humtip
    if(hum<40)
    humtip="空气又干燥了，你的皮肤需要保护"
    else humtip="湿度适宜，放心出门吧";
      
        that.setData({
          humtip:humtip
        })

          //获取当前空气质量
       wx.request({
         url:'https://devapi.qweather.com/v7/air/now?location=101010100&key=5627f594ccba408f84f79a2bf1e7f6dc&location=',
         success:function(res){
           console.log(res)
           that.setData({
            aqi:res.data.now.aqi
           })
         }
        
       })
       //出行指shu
      wx.request({
        url:'https://devapi.qweather.com/v7/indices/1d?type=0&location=101010100&key=5627f594ccba408f84f79a2bf1e7f6dc&location=',
        success:function(res)
        {
          console.log(res)
          console.log(res.data.daily[15].text)
          that.setData({
            yundong:res.data.daily[15].text,
            chuanyi:res.data.daily[10].text,
            kongqi:res.data.daily[9].text
          })
        }
      })
       
        //获取24小时天气预报
        wx.request({
          url: 'https://free-api.heweather.net/s6/weather/hourly?key=5627f594ccba408f84f79a2bf1e7f6dc&location=' + city,
          success: function(res) {
            var arr = res.data.HeWeather6[0].hourly
            var hourly = []
            for (var i = 0; i < arr.length; i++) {
              hourly[i] = {
                "imgsrc": arr[i].cond_code,
                "tmp": arr[i].tmp,
                "time": arr[i].time.substring(11),
                "wind_dir": arr[i].wind_dir,
                "wind_sc": arr[i].wind_sc
              }
            }
            that.setData({
              hourly: hourly
            })

            var weekArray = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六");
            //获取未来7天天气预报
            wx.request({
              url: 'https://free-api.heweather.net/s6/weather/forecast?key=5627f594ccba408f84f79a2bf1e7f6dc&location=' + city,
              success: function(result) {
                //console.log(result)
                var arr = result.data.HeWeather6[0].daily_forecast
                var daily_forecast = []
                for (var i = 0; i < arr.length; i++) {
                  daily_forecast[i] = {
                    d_txt: i == 0 ? "今天" : weekArray[new Date(arr[i].date).getDay()],
                    d_date: arr[i].date.substring(5),
                    imgsrc_d: arr[i].cond_code_d,
                    imgsrc_n: arr[i].cond_code_n,
                    wind_dir: arr[i].wind_dir,
                    wind_sc: arr[i].wind_sc,
                    tmp_max: arr[i].tmp_max,
                    tmp_min: arr[i].tmp_min,
                    cond_txt_d: arr[i].cond_txt_d
                  }
                }
                that.setData({
                  daily_forecast: daily_forecast
                })
              }
            })

          }
        })

      }
    })
  },
  humtip:function(hum){
    console.log(hum)
    
  },
  bindKeyInput(e) {
    this.setData({
     search_city:  e.detail.value
    })
  },
  search() {
    this.getWeather(this.data.search_city)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getWeather("北京")
  },

  
})
