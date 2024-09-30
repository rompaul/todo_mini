const app = getApp()

Page({
  data: {
    username: '',
    password: ''
  },

  onInputUsername(e) {
    this.setData({ username: e.detail.value })
  },

  onInputPassword(e) {
    this.setData({ password: e.detail.value })
  },

  async handleLogin() {
    const { username, password } = this.data
    if (!username || !password) {
      wx.showToast({ title: '请输入用户名和密码', icon: 'none' })
      return
    }

    try {
      const db = wx.cloud.database()
      const { data } = await db.collection('users').where({
        username,
        password  // 注意：实际应用中应该使用加密的密码
      }).get()

      if (data.length > 0) {
        const user = data[0]
        app.globalData.user = user
        wx.setStorageSync('user', user)
        wx.switchTab({ url: '/pages/todo/todo' })
      } else {
        wx.showToast({ title: '用户名或密码错误', icon: 'none' })
      }
    } catch (error) {
      console.error('登录失败', error)
      wx.showToast({ title: '登录失败，请重试', icon: 'none' })
    }
  },

  goToRegister() {
    wx.navigateTo({ url: '/pages/register/register' })
  }
})
