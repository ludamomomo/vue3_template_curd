import request from '@/utils/request'

//@ts-ignore
enum API {
  // 获取全部的角色接口
  ALLROLE_URL = '/admin/acl/role/',
  // 新增角色的接口地址
  ADDROLE_URL = '/admin/acl/role/save',
  // 更新已有的角色
  UPDATEROLE_URL = '/admin/acl/role/update',
  // 获取全部菜单与按钮数据
  ALLPERMISSION_URL = '/admin/acl/permission/toAssign/',
  // 给响应的角色分配权限
  SETPERMISSION_URL = '/admin/acl/permission/doAssign?',
  // 删除已有的角色
  REMOVEROLE_URL = '/admin/acl/role/remove/',
}

export const getAllInfo = (page: number, limit: number, roleName: string) => {
  return request.get<any, any>(
    API.ALLROLE_URL + `${page}/${limit}?roleName=${roleName}`,
  )
}

export const addOrUpdate = (data: any) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEROLE_URL, data)
  } else {
    return request.post<any, any>(API.ADDROLE_URL, data)
  }
}

export const getAllMemberRole = (roleId: number) => {
  return request.get(API.ALLPERMISSION_URL + roleId)
}

export const updatePerission = (roleId: number, permissionId: number[]) => {
  return request.post<any, any>(
    API.SETPERMISSION_URL + `roleId=${roleId}&permissionId=${permissionId}`,
  )
}

export const deleteMember = (roleId: number) => {
  return request.delete<any, any>(API.REMOVEROLE_URL + roleId)
}
