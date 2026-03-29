import request from '@/utils/request'
//@ts-ignore
enum API {
  // 获取全部菜单与按钮的标识数据
  ALLPERMISSION_URL = '/admin/acl/permission',
  // 新增子菜单
  ADDMENU_URL = '/admin/acl/permission/save',
  // 更新菜单
  UPDATEMENU_URL = '/admin/acl/permission/update',
  // 删除菜单
  REMOVEMENU_URL = '/admin/acl/permission/remove/',
}

export const getAllInfo = () => {
  return request.get<any, any>(API.ALLPERMISSION_URL)
}

export const addOrUpdate = (data: any) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEMENU_URL, data)
  } else {
    return request.post<any, any>(API.ADDMENU_URL, data)
  }
}

export const deleteData = (id: number) => {
  return request.delete(API.REMOVEMENU_URL + id)
}
