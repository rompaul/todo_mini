const app = getApp()

Page({
  data: {
    username: '',
    password: '',
    confirmPassword: ''
  },

  onRegister: function() {
    if (this.data.password !== this.data.confirmPassword) {
      wx.showToast({
        title: '两次输入的密码不一致',
        icon: 'none'
      })
      return
    }

    wx.request({
      url: 'YOUR_API_URL/register',
      method: 'POST',
      data: {
        username: this.data.username,
        password: this.data.password
      },
      success: (res) => {
        console.log('注册响应:', res.data)
        if (res.data.success) {
          wx.showToast({
            title: '注册成功',
            icon: 'success'
          })
          // 注册成功后的操作，如跳转到登录页面
        } else {
          wx.showToast({
            title: '注册失败: ' + (res.data.message || '未知错误'),
            icon: 'none'
          })
        }
      },
      fail: (err) => {
        console.error('注册请求失败:', err)
        wx.showToast({
          title: '注册失败，请检查网络',
          icon: 'none'
        })
      }
    })
  },

  onInputUsername(e) {
    this.setData({ username: e.detail.value })
  },

  onInputPassword(e) {
    this.setData({ password: e.detail.value })
  },

  onInputConfirmPassword(e) {
    this.setData({ confirmPassword: e.detail.value })
  },

  async handleRegister() {
    const { username, password, confirmPassword } = this.data
    if (!username || !password || !confirmPassword) {
      wx.showToast({ title: '请填写所有字段', icon: 'none' })
      return
    }

    if (password !== confirmPassword) {
      wx.showToast({ title: '两次输入的密码不一致', icon: 'none' })
      return
    }

    try {
      const db = wx.cloud.database()
      const { data } = await db.collection('users').where({ username }).get()

      if (data.length > 0) {
        wx.showToast({ title: '用户名已存在', icon: 'none' })
        return
      }

      await db.collection('users').add({
        data: { username, password }  // 注意：实际应用中应该使用加密的密码
      })

      wx.showToast({ title: '注册成功', icon: 'success' })
      setTimeout(() => wx.navigateBack(), 1500)
    } catch (error) {
      console.error('注册失败', error)
      wx.showToast({ title: '注册失败，请重试', icon: 'none' })
    }
  }
})
