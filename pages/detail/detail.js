var app = getApp();
Page({
    data: {
        book_author: "",
        code: "",
        books: [],
        book_name: "加载中...",
        mounted: false,
        school: "",
        is_faved: false,
        marc_no: ""
    },
    favBook: function () {
        this.setData({
            is_faved: true
        });
        var fav = {}
        fav["marc_no"] = this.data.marc_no;
        fav["book_name"] = this.data.book_name;
        fav["book_author"] = this.data.book_author;
        fav["school"] = this.data.school;
        fav["code"] = this.data.code;
        var favs = wx.getStorageSync('favs') || []
        favs.unshift(fav)
        wx.setStorageSync('favs', favs)
        wx.showToast({
            title: '收藏成功',
            icon: 'success',
            duration: 1500
        });
    },
    unfavBook: function () {
        var favs = wx.getStorageSync('favs') || [];
        for (var i = favs.length - 1; i >= 0; i--) {
            if (favs[i].marc_no === this.data.marc_no && favs[i].school === this.data.school) {
                favs.splice(i, 1);
            }
        };
        wx.setStorageSync('favs', favs);
        this.setData({
            is_faved: false
        });
        wx.showToast({
            title: '取消收藏',
            icon: 'success',
            duration: 1500
        });
    },
    searchFav: function (marc_no, favs) {
        for (var i = 0; i < favs.length; i++) {
            if (favs[i].marc_no === marc_no) {
                return true;
            }
        };
        return false;
    },
    onLoad: function (options) {
        var that = this;
        var favs = wx.getStorageSync('favs') || []
        that.setData({
            marc_no: options.marc_no,
            is_faved: that.searchFav(options.marc_no, favs),
            school: options.school
        });

        setTimeout(function () {
            wx.request({
                url: 'https://api.getweapp.com/vendor/cornerapp/api/detail',
                data: 'marc_no=' + options.marc_no + '&school=' + that.data.school,
                header: {
                    'Content-Type': 'application/json'
                },
                success: function (res) {
                    console.log(JSON.stringify(res.data))
                    that.setData({
                        books: res.data.books,
                        code: res.data.code,
                        book_author: res.data.book_author,
                        book_name: res.data.book_name,
                        mounted: true
                    });
                }
            });
        }, 1000);
    },
    returnIndex: function () {
        wx.navigateBack()
    }
})