var app = getApp();
Page({
  data: {
    favs: [],
    is_empty: false
  },
  reverse_codes: function () {
    var codes = app.codes;
    var reverse_codes = {}
    for (var x in codes) {
      reverse_codes[codes[x]] = x
    };
    return reverse_codes;
  },
  getSchoolName: function (favs) {
    var reverse_codes = this.reverse_codes();
    for (var i = 0; i < favs.length; i++) {
      favs[i]['school_name'] = reverse_codes[favs[i].school]
    }
    return favs;
  },
  onLoad: function (options) {
    var that = this;
    var favs = wx.getStorageSync('favs') || [];
    favs = that.getSchoolName(favs);
    that.setData({
      favs: favs,
      is_empty: favs != []
    });
    wx.setNavigationBarTitle({ title: "我的图书收藏" })
  },
  onReady: function(){
    wx.setNavigationBarTitle({ title: "我的图书收藏" })
  },
  onShow: function () {
    wx.setNavigationBarTitle({ title: "我的图书收藏" })
    var that = this;
    var favs = wx.getStorageSync('favs') || [];
    favs = that.getSchoolName(favs);
    that.setData({
      favs: favs,
      is_empty: (favs.length == 0)
    });
  },
})