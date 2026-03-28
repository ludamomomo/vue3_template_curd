import { defineStore } from 'pinia'
import { reqLogin, reqUserInfo, reqLogOut } from '../../api/user/index'
import { constantRoute } from '../../router/routes'
import type { UserState } from './type/type'
import type {
  loginFormData,
  loginResponse,
  userInfoResponseData,
} from '../../api/user/type'
const useUserStore = defineStore('Use', {
  state: (): UserState => {
    return {
      token: localStorage.getItem('token'),
      menuRoutes: constantRoute,
      username: '',
      avatar: '',
    }
  },
  actions: {
    async userLogin(data: loginFormData) {
      let result: loginResponse = await reqLogin(data)
      if (result.code === 200) {
        this.token = result.data
        localStorage.setItem('token', result.data)
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    async getUserInfo() {
      let result: userInfoResponseData = await reqUserInfo()
      if (result.code === 200) {
        this.username = result.data.name
        //@ts-ignore
        this.avatar = result.data.avatar
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },

    async userLogOut() {
      let result: any = await reqLogOut()
      if (result.code === 200) {
        this.token = ''
        this.username = ''
        this.avatar = ''
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
  },
})

export default useUserStore
