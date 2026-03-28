import request from '@/utils/request'
import type { TradeMarkResponseData, Trademark } from './type'
//@ts-ignore
enum API {
  //获取已有品牌接口
  TRADEMARK_URL = '/admin/product/baseTrademark/',
  ADDTRADMARK_URL = '/admin/product/baseTrademark/save',
  UPDATETRADMARK_URL = '/admin/product/baseTrademark/update',
  DELTETRADEMARK_URL = '/admin/product/baseTrademark/remove/',
}
export const getMarkList = (page: number, limit: number) =>
  request.get<any, TradeMarkResponseData>(
    API.TRADEMARK_URL + `${page}/${limit}`,
  )

export const addOrUpdateTradMark = (data: Trademark) => {
  if (data.id) {
    // 有id是更新
    return request.put<any, any>(API.UPDATETRADMARK_URL, data)
  } else {
    // 没有id是新增
    return request.post<any, any>(API.ADDTRADMARK_URL, data)
  }
}

export const deleteTradeMark = (id: number) => {
  return request.delete<any, any>(API.DELTETRADEMARK_URL + id)
}
