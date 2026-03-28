import router from './router/index'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import useUserStore from './store/modules/user'
import pinia from './store'

nprogress.configure({ showSpinner: false })

const userStore = useUserStore(pinia)

router.beforeEach(async (to, from, next) => {
  nprogress.start()

  const token = userStore.token
  const username = userStore.username

  if (token) {
    // 已登录
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (username) {
        next()
      } else {
        // 刷新后 username 丢失，重新获取用户信息
        try {
          await userStore.getUserInfo()
          next({ ...to })
        } catch (error) {
          // token 过期，退出登录
          await userStore.userLogOut()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    // 未登录
    if (to.path === '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})

router.afterEach((to) => {
  nprogress.done()
  document.title = `硅谷甄选-${to.meta.title}`
})
