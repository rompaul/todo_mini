const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    // 示例：向 'users' 集合添加一条记录
    await db.collection('users').add({
      data: {
        name: 'Test User',
        createdAt: new Date()
      }
    })
    return { success: true, message: '数据初始化成功' }
  } catch (error) {
    console.error('数据初始化失败', error)
    return { success: false, error: error }
  }
}