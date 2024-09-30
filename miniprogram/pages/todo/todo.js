const app = getApp()

Page({
  data: {
    todos: [],
    newTodo: '',
    currentDate: new Date().toISOString().split('T')[0],
    isLoading: true
  },

  onLoad() {
    this.fetchTodos()
  },

  onDateChange(e) {
    this.setData({ currentDate: e.detail.date })
    this.fetchTodos()
  },

  onInputTodo(e) {
    this.setData({ newTodo: e.detail.value })
  },

  async addTodo() {
    if (!this.data.newTodo.trim()) return
  
    const db = wx.cloud.database()
    try {
      wx.showLoading({ title: '添加中...' })
      await db.collection('todos').add({
        data: {
          userId: app.globalData.user._id,
          content: this.data.newTodo,
          completed: false,
          date: this.data.currentDate,
          createdAt: db.serverDate()
        }
      })
      this.setData({ newTodo: '' })
      this.fetchTodos()
      wx.hideLoading()
      wx.showToast({ title: '添加成功', icon: 'success' })
    } catch (error) {
      console.error('添加待办事项失败', error)
      wx.hideLoading()
      wx.showToast({ title: '添加失败，请重试', icon: 'none' })
    }
  },

  async fetchTodos() {
    this.setData({ isLoading: true })
    const db = wx.cloud.database()
    try {
      const { data } = await db.collection('todos')
        .where({
          userId: app.globalData.user._id,
          date: this.data.currentDate
        })
        .orderBy('createdAt', 'desc')
        .get()
      this.setData({ todos: data, isLoading: false })
    } catch (error) {
      console.error('获取待办事项失败', error)
      wx.showToast({ title: '获取待办事项失败', icon: 'none' })
    }
  },

  async toggleTodo(e) {
    const { id } = e.currentTarget.dataset
    const todo = this.data.todos.find(t => t._id === id)
    const db = wx.cloud.database()
    try {
      await db.collection('todos').doc(id).update({
        data: { completed: !todo.completed }
      })
      this.fetchTodos()
    } catch (error) {
      console.error('更新待办事项状态失败', error)
      wx.showToast({ title: '更新失败，请重试', icon: 'none' })
    }
  },

  async deleteTodo(e) {
    const { id } = e.currentTarget.dataset
    const db = wx.cloud.database()
    try {
      await db.collection('todos').doc(id).remove()
      this.fetchTodos()
    } catch (error) {
      console.error('删除待办事项失败', error)
      wx.showToast({ title: '删除失败，请重试', icon: 'none' })
    }
  }
})
