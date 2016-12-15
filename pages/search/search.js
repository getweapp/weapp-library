var app = getApp();
Page({
    data: {
        book_name: "",
        is_alot: false,
        books: [],
        book_count: -1,
        loading: false,
        scroll_height: 0,
        button_bcolor: "#b2b2b2",
        has_school: false,
        choose_school: false,
        school: "",
        school_name: "",
        provinces: [],
        province_index: 0,
        schools: [],
        school_index: 0,
    },
    bindSearchInput: function (e) {
        this.setData({
            book_name: e.detail.value,
            book_count: -1,
            is_alot: false
        });
        if (this.data.book_name.replace(/\s+/g, "") == "") {
            this.setData({
                button_bcolor: "#b2b2b2"
            });
        } else {
            this.setData({
                button_bcolor: "#04BE02"
            });
        }
    },
    searchBooks: function (e) {
        var that = this;
        if (that.data.book_name === "") return;
        that.setData({ loading: true });
        console.log(e.detail.value)
        that.searchRequest(that.data.book_name)
    },
    searchRequest: function (book_name) {
        var that = this
        wx.request({
            url: 'https://api.getweapp.com/vendor/cornerapp/api/search',
            data: 'book=' + book_name + '&school=' + that.data.school,
            header: {
                'Content-Type': 'application/json'
            },
            success: function (res) {
                if (res.statusCode == 500) {
                    wx.showToast({
                        title: '服务器连接错误',
                        icon: 'loading',
                        duration: 1500
                    });
                    that.setData({
                        loading: false,
                    });
                } else if (res.statusCode == 200) {
                    console.log(JSON.stringify(res.data))
                    that.setData({
                        loading: false,
                        books: res.data.books,
                        is_alot: res.data.is_alot,
                        book_count: res.data.book_count
                    });
                }
            }
        })
    },
    changeSchoolRequest: function () {
        var that = this;
        that.setData({
            provinces: app.provinces,
            schools: app.schools[app.provinces[that.data.province_index]]
        });
        setTimeout(function () {
            that.setData({
                choose_school: true
            });
        }, 200);

        wx.setNavigationBarTitle({ title: "选择学校" });
    },
    cancelChangeSchool: function () {
        this.setData({
            choose_school: false
        });
        wx.setNavigationBarTitle({ title: this.data.school_name + "图书馆查询" });
    },
    bindProvinceChange: function (e) {
        this.setData({
            province_index: e.detail.value,
            schools: app.schools[app.provinces[e.detail.value]],
            school_index: 0
        })
    },
    bindSchoolChange: function (e) {
        this.setData({
            school_index: e.detail.value,
        })
    },
    confirmChooseSchool: function () {
        wx.setStorageSync('school', app.codes[this.data.schools[this.data.school_index]]);
        wx.setStorageSync('school_name', this.data.schools[this.data.school_index]);
        wx.setStorageSync('school_index', this.data.school_index);
        wx.setStorageSync('province_index', this.data.province_index);
        this.setData({
            choose_school: false,
            has_school: true,
            school: wx.getStorageSync('school'),
            school_name: wx.getStorageSync('school_name')
        });
        wx.setNavigationBarTitle({ title: this.data.school_name + "图书馆查询" });
        this.setData({
            book_name: "",
            book_count: -1,
            is_alot: false,
            button_bcolor: "#b2b2b2"
        });
    },
    onShow: function () {
        var that = this;
        wx.getStorage({
            key: 'school',
            success: function (res) {
                that.setData({
                    has_school: true,
                    choose_school: false,
                    school: wx.getStorageSync('school'),
                    school_name: wx.getStorageSync('school_name'),
                })
                wx.setNavigationBarTitle({ title: that.data.school_name + "图书馆查询" });
            },
            fail: function (res) {
                that.setData({
                    has_school: false,
                    choose_school: true,
                });
                wx.setNavigationBarTitle({ title: "选择学校" });
            },
        });
    },
    onLoad: function () {
        var that = this;
        wx.getStorage({
            key: 'school',
            success: function (res) {
                that.setData({
                    has_school: true,
                    choose_school: false,
                    school: wx.getStorageSync('school'),
                    school_name: wx.getStorageSync('school_name'),
                })
                wx.setNavigationBarTitle({ title: that.data.school_name + "图书馆查询" });
            },
            fail: function (res) {
                that.setData({
                    has_school: false,
                    choose_school: true,
                });
                wx.setNavigationBarTitle({ title: "选择学校" });
            },
        });
        wx.getStorage({
            key: 'school_index',
            success: function (res) {
                that.setData({
                    school_index: res.data,
                })
            },
            fail: function () {
                that.setData({
                    school_index: 0,
                })
            },
        });
        wx.getStorage({
            key: 'province_index',
            success: function (res) {
                that.setData({
                    province_index: res.data,
                })
            },
            fail: function () {
                that.setData({
                    province_index: 0,
                })
            },
        });
        if (!that.data.has_school) {
            that.setData({
                provinces: app.provinces,
                schools: app.schools[app.provinces[0]]
            })
        };
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    scroll_height: res.windowHeight * 0.67
                })
            }
        });
    }
});
