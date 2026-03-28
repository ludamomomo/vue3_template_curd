import request from '@/utils/request'
import type { SkuResponseData } from './type'
//@ts-ignore
enum API {
  SKU_URL = '/admin/product/list/',
  //上架
  SALE_URL = '/admin/product/onSale/',
  //下架的接口
  CANCELSALE_URL = '/admin/product/cancelSale/',
  //获取商品详情的接口
  SKUINFO_URL = '/admin/product/getSkuInfo/',
  //删除已有的商品
  DELETESKU_URL = '/admin/product/deleteSku/',
}

export const getAllSkuList = (page: number, limit: number) => {
  return request.get<any, SkuResponseData>(API.SKU_URL + `${page}/${limit}`)
}

export const upDateList = (spuId: number) => {
  return request.get(API.SALE_URL + spuId)
}

export const downList = (spuId: number) => {
  return request.get<any, any>(API.CANCELSALE_URL + spuId)
}

export const getSkuData = (skuId: number) => {
  return request.get(API.SKUINFO_URL + skuId)
}

export const deleteSkuData = (skuId: number) => {
  return request.delete(API.DELETESKU_URL + skuId)
}
