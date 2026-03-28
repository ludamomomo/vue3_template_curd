export interface loginFormData {
  username: string
  password: string
}

export interface responseData {
  code: number
  message: string
  ok: boolean
}
export interface loginResponse extends responseData {
  data: string
}

export interface userInfoResponseData extends responseData {
  data: {
    avater: string
    buttons: string[]
    name: string
    roles: string[]
    rotes: string[]
  }
}
