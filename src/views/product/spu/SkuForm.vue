<template>
  <el-form label-width="100px">
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称" v-model="paramsSku.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input placeholder="价格(元)" v-model="paramsSku.price"></el-input>
    </el-form-item>
    <el-form-item label="重量(g)">
      <el-input placeholder="重量(g)" v-model="paramsSku.weight"></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input
        type="textarea"
        placeholder="SKU描述"
        v-model="paramsSku.skuDesc"
      ></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true">
        <el-form-item
          v-for="item in allCateGory"
          :key="item.id"
          :label="item.attrName"
        >
          <el-select
            placeholder="请选择"
            style="width: 240px"
            v-model="item.attrUnitId"
          >
            <el-option
              v-for="data in item.attrValueList"
              :label="data.valueName"
              :key="data.id"
              :value="`${item.id}-${data.id}`"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true">
        <el-form-item
          v-for="item in allSales"
          :key="item.id"
          :label="item.saleAttrName"
        >
          <el-select
            placeholder="请选择"
            style="width: 240px"
            v-model="item.salesUnitId"
          >
            <el-option
              v-for="data1 in item.spuSaleAttrValueList"
              :label="data1.saleAttrValueName"
              :key="data1.id"
              :value="`${item.id}-${data1.id}`"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table border :data="allImageList" ref="tableForm">
        <el-table-column type="selection" width="80px"></el-table-column>
        <el-table-column label="图片">
          <template #="{ row }">
            <img :src="row.imgUrl" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template #="{ row }">
            <el-button type="primary" size="small" @click="handleMoRen(row)">
              设置默认
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button type="primary" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { getAllCategory } from '../../../api/product/attr/index'
import {
  getAllImage,
  getSomeSales,
  addSku,
} from '../../../api/product/spu/index'
import { ElMessage } from 'element-plus'
let emit = defineEmits(['sendState'])
let allCateGory = ref<any[]>([])
let allImageList = ref<any[]>([])
let allSales = ref<any[]>([])
let tableForm = ref()
let paramsSku = reactive({
  category3Id: '', //三级分类的ID
  spuId: '', //已有的SPU的ID
  tmId: '', //SPU品牌的ID
  //v-model收集
  skuName: '',
  price: '',
  weight: '',
  skuDesc: '',

  skuAttrValueList: [],
  skuSaleAttrValueList: [],
  skuDefaultImg: '',
})
const initGetSku = async (
  category1Id: number | string,
  category2Id: number | string,
  row: any,
) => {
  paramsSku.category3Id = row.category3Id
  paramsSku.spuId = row.id
  paramsSku.tmId = row.tmId
  let result = await getAllCategory(category1Id, category2Id, row.category3Id)
  if (result.code === 200) {
    allCateGory.value = result.data
  }
  let result1 = await getAllImage(row.id)
  if (result1.code === 200) {
    console.log(result1)
    allImageList.value = result1.data
  }
  let result2 = await getSomeSales(row.id)
  if (result2.code === 200) {
    console.log(result2)
    allSales.value = result2.data
  }
}

const handleMoRen = (row: any) => {
  allImageList.value.forEach((item: any) => {
    tableForm.value.toggleRowSelection(item, false)
  })
  tableForm.value.toggleRowSelection(row, true)
  paramsSku.skuDefaultImg = row.imgUrl
}
const save = async () => {
  paramsSku.skuAttrValueList = allCateGory.value.reduce(
    (prev: any, next: any) => {
      if (next.attrUnitId) {
        let [attrId, valueId] = next.attrUnitId.split('-')
        prev.push({
          attrId,
          valueId,
        })
      }
      return prev
    },
    [],
  )
  paramsSku.skuSaleAttrValueList = allSales.value.reduce(
    (prev: any, next: any) => {
      if (next.salesUnitId) {
        let [saleAttrId, saleAttrValueId] = next.salesUnitId.split('-')
        prev.push({
          saleAttrId,
          saleAttrValueId,
        })
      }
      return prev
    },
    [],
  )
  console.log('发送的SKU数据:', paramsSku)
  let result: any = await addSku(paramsSku as any)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '添加sku成功',
    })
    emit('sendState', { flag: 0 })
  } else {
    ElMessage({
      type: 'error',
      message: '添加成员失败',
    })
  }
}
const cancel = () => {
  emit('sendState', { flag: 0 })
}
defineExpose({ initGetSku })
</script>

<style scoped lang="scss"></style>
