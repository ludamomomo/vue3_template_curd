import request from '@/utils/request'
//@ts-ignore
enum API {
  // 获取全部已有用户
  ALLUSER_URL = '/admin/acl/user/',
  // 添加一个新的用户
  ADDUSER_URL = '/admin/acl/user/save',
  // 更新已有用户账号
  UPDATEUSER_URL = '/admin/acl/user/update',
  // 获取全部角色，当前账号拥有的角色接口
  ALLROLEURL = '/admin/acl/user/toAssign/',
  // 已有用户分配角色接口
  SETROLE_URL = '/admin/acl/user/doAssignRole',
  // 删除某一个账号
  DELETEUSER_URL = '/admin/acl/user/remove/',
  // 批量删除用户接口
  DELETEALLUSER_URL = '/admin/acl/user/batchRemove',
}

export const getAllUser = (page: number, limit: number, username: string) => {
  return request.get<any, any>(
    API.ALLUSER_URL + `${page}/${limit}?username=${username}`,
  )
}

export const addOrUpdateUser = (data: any) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEUSER_URL, data)
  } else {
    return request.post<any, any>(API.ADDUSER_URL, data)
  }
}

export const getUserInfoPage = (userId: number) => {
  return request.get(API.ALLROLEURL + userId)
}

export const handleRole = (data: any) => {
  return request.post(API.SETROLE_URL, data)
}

export const handleDeleteOne = (userId: number) => {
  return request.delete<any, any>(API.DELETEUSER_URL + userId)
}

export const handleDeleteAll = (idList: number) => {
  return request.delete<any, any>(API.DELETEALLUSER_URL, { data: idList })
}
