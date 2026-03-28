import request from '@/utils/request'
import type {
  AllTradeMark,
  HasSpuResponseData,
  SpuHasImg,
  SaleAttrResponseData,
  SpuData,
} from './type'
//@ts-ignore
enum API {
  //获取已有的SPU的数据
  HASSPU_URL = '/admin/product/',
  //获取全部品牌的数据
  ALLTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
  //获取某个SPU下的全部的售卖商品的图片数据
  IMAGE_URL = '/admin/product/spuImageList/',
  //获取某一个SPU下全部的已有的销售属性接口地址
  SPUHASSALEATTR_URL = '/admin/product/spuSaleAttrList/',
  //获取整个项目全部的销售属性[颜色、版本、尺码]
  ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',
  //追加一个新的SPU
  ADDSPU_URL = '/admin/product/saveSpuInfo',
  //更新已有的SPU
  UPDATESPU_URL = '/admin/product/updateSpuInfo',
  //追加一个新增的SKU地址
  ADDSKU_URL = '/admin/product/saveSkuInfo',
  //查看某一个已有的SPU下全部售卖的商品
  SKUINFO_URL = '/admin/product/findBySpuId/',
  //删除已有的SPU
  REMOVESPU_URL = '/admin/product/deleteSpu/',
}

export const reqHasSpu = (
  page: number,
  limit: number,
  category3Id: number | string,
) =>
  request.get<any, HasSpuResponseData>(
    API.HASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`,
  )

export const getAllMark = () => {
  return request.get<any, AllTradeMark>(API.ALLTRADEMARK_URL)
}

export const getAllImage = (spuId: number) => {
  return request.get<any, SpuHasImg>(API.IMAGE_URL + spuId)
}

export const getSomeSales = (spuId: number) => {
  return request.get<any, SaleAttrResponseData>(API.SPUHASSALEATTR_URL + spuId)
}

export const getAllSales = () => {
  return request.get(API.ALLSALEATTR_URL)
}

export const getOrUpdate = (data: SpuData) => {
  if (data.id) {
    return request.post<any, any>(API.UPDATESPU_URL, data)
  } else {
    return request.post<any, any>(API.ADDSPU_URL, data)
  }
}

export const addSku = (data: SpuData) => {
  return request.post(API.ADDSKU_URL, data)
}

export const watchSpu = (spuId: number | string) => {
  return request.get<any, any>(API.SKUINFO_URL + spuId)
}

export const deleteSpu = (spuId: string | number) => {
  return request.delete<any, any>(API.REMOVESPU_URL + spuId)
}
