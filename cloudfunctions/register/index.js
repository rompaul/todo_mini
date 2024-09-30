const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  console.log('注册函数被调用，参数：', event)
  try {
    // 检查用户是否已存在
    const { username, password } = event
    const userCheck = await db.collection('users').where({
      username: username
    }).get()
    
    console.log('用户检查结果：', userCheck)

    if (userCheck.data.length > 0) {
      console.log('用户已存在')
      return { success: false, message: '用户已存在' }
    }

    // 创建新用户
    const result = await db.collection('users').add({
      data: {
        username,
        password, // 注意：实际应用中应该对密码进行加密
        createdAt: new Date()
      }
    })

    console.log('用户创建结果：', result)

    return { success: true, message: '注册成功' }
  } catch (error) {
    console.error('注册过程中发生错误：', error)
    return { success: false, message: '注册失败', error: error }
  }
}