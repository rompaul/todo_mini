const app = getApp()

Page({
  data: {
    userInfo: {},
    todoCount: 0,
    followingCount: 0
  },

  onShow() {
    this.setData({ userInfo: app.globalData.user })
    this.fetchUserStats()
  },

  async fetchUserStats() {
    const db = wx.cloud.database()
    try {
      const todoCount = await db.collection('todos').where({
        userId: app.globalData.user._id
      }).count()

      const userInfo = await db.collection('users').doc(app.globalData.user._id).get()

      this.setData({
        todoCount: todoCount.total,
        followingCount: userInfo.data.following ? userInfo.data.following.length : 0
      })
    } catch (error) {
      console.error('获取用户统计信息失败', error)
      wx.showToast({ title: '获取信息失败', icon: 'none' })
    }
  },

  handleLogout() {
    wx.showModal({
      title: '确认退出',
      content: '您确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          app.globalData.user = null
          wx.removeStorageSync('user')
          wx.reLaunch({ url: '/pages/login/login' })
        }
      }
    })
  }
})
