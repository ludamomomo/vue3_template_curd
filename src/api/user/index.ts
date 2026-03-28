import request from '@/utils/request'
import type { loginFormData, loginResponse, userInfoResponseData } from './type'
//@ts-ignore
enum API {
  LOGIN_API = '/admin/acl/index/login',
  USERINFO_API = '/admin/acl/index/info',
  USERLOGOUT_API = '/admin/acl/index/logout',
}

export const reqLogin = (data: loginFormData) =>
  request.post<any, loginResponse>(API.LOGIN_API, data)

export const reqUserInfo = () =>
  request.get<any, userInfoResponseData>(API.USERINFO_API)

export const reqLogOut = () => request.post<any, any>(API.USERLOGOUT_API)
