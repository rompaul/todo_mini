App({
    globalData: {
      user: null
    },
  
    onLaunch: function () {
        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                env: 'todo-mini-7gam0cvy301442e3', // 替换为您的云开发环境ID
                traceUser: true
            })
        }
        this.autoLogin()
    },
  
    autoLogin: function () {
      const storedUser = wx.getStorageSync('user')
      if (storedUser) {
        this.globalData.user = storedUser
        this.refreshUserInfo(storedUser._id)
      } else {
        wx.redirectTo({ url: '/pages/login/login' })
      }
    },
  
    refreshUserInfo: async function (userId) {
      try {
        const db = wx.cloud.database()
        const { data } = await db.collection('users').doc(userId).get()
        this.globalData.user = data
        wx.setStorageSync('user', data)
      } catch (error) {
        console.error('刷新用户信息失败', error)
        wx.showToast({ title: '获取用户信息失败', icon: 'none' })
      }
    }
  })