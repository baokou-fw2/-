// start.js

Page({
    data: {

    },
    //跳转到居家页面
    navigate: function() {
        wx.navigateTo({
            url: '../wifi_station/huanjingnow/now?id='+this.data.id+'&apik='+this.data.apik,
        })
    },
    
    //跳转至出行模式
    navi: function() {
        wx.navigateTo({
            url: '../wifi_station/forecast/forecast',
        })
    }

   


})