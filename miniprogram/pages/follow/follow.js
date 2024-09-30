const app = getApp()

Page({
  data: {
    searchQuery: '',
    users: []
  },

  onSearchInput(e) {
    this.setData({ searchQuery: e.detail.value })
  },

  async searchUsers() {
    if (!this.data.searchQuery.trim()) return

    const db = wx.cloud.database()
    try {
      const { data } = await db.collection('users')
        .where({
          username: db.RegExp({
            regexp: this.data.searchQuery,
            options: 'i'
          }),
          _id: db.command.neq(app.globalData.user._id)
        })
        .limit(20)
        .get()

      const followingIds = new Set(app.globalData.user.following || [])
      const users = data.map(user => ({
        ...user,
        isFollowing: followingIds.has(user._id)
      }))

      this.setData({ users })
    } catch (error) {
      console.error('搜索用户失败', error)
      wx.showToast({ title: '搜索失败，请重试', icon: 'none' })
    }
  },

  async toggleFollow(e) {
    const { id } = e.currentTarget.dataset
    const db = wx.cloud.database()
    const _ = db.command

    try {
      const user = this.data.users.find(u => u._id === id)
      const isFollowing = user.isFollowing

      await db.collection('users').doc(app.globalData.user._id).update({
        data: {
          following: isFollowing
            ? _.pull(id)
            : _.addToSet(id)
        }
      })

      // 更新本地状态
      this.setData({
        users: this.data.users.map(u => 
          u._id === id ? { ...u, isFollowing: !isFollowing } : u
        )
      })

      // 更新全局用户数据
      app.globalData.user.following = isFollowing
        ? app.globalData.user.following.filter(fId => fId !== id)
        : [...(app.globalData.user.following || []), id]

      wx.showToast({
        title: isFollowing ? '已取消关注' : '已关注',
        icon: 'success'
      })
    } catch (error) {
      console.error('更新关注状态失败', error)
      wx.showToast({ title: '操作失败，请重试', icon: 'none' })
    }
  }
})
