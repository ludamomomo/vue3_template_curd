import request from '@/utils/request'
import type { CategoryResponseData, Attr } from './type'
//@ts-ignore
enum API {
  GETC1_URL = '/admin/product/getCategory1',
  GETC2_URL = '/admin/product/getCategory2/',
  GETC3_URL = '/admin/product/getCategory3/',
  ATTR_URL = '/admin/product/attrInfoList/',
  ADDORUPDATEATTR_URL = '/admin/product/saveAttrInfo',
  DELETEATTR_URL = '/admin/product/deleteAttr/',
}

export const getCategoryCone = () => {
  return request.get<any, CategoryResponseData>(API.GETC1_URL)
}

export const getCategoryCtwo = (cateGory1Id: string | number) => {
  return request.get<any, CategoryResponseData>(API.GETC2_URL + cateGory1Id)
}

export const getCategoryCthree = (cateGory2Id: string | number) => {
  return request.get<any, CategoryResponseData>(API.GETC3_URL + cateGory2Id)
}

export const getAllCategory = (
  cateGory1Id: string | number,
  cateGory2Id: string | number,
  cateGory3Id: string | number,
) => {
  return request.get<any, any>(
    API.ATTR_URL + `${cateGory1Id}/${cateGory2Id}/${cateGory3Id}`,
  )
}

export const reqAddOrUpdate = (data: Attr) => {
  return request.post<any, any>(API.ADDORUPDATEATTR_URL, data)
}

export const reqDeleteAll = (id: number) => {
  return request.delete<any, any>(API.DELETEATTR_URL + id)
}
