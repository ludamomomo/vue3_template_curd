<template>
  <Category :visible="visible"></Category>
  <el-card style="margin-top: 20px">
    <div v-show="scene === 0">
      <el-button
        icon="Plus"
        type="primary"
        :disabled="useStore.c3Id ? false : true"
        @click="handleAddSpu"
      >
        添加SPU
      </el-button>
      <el-table border style="margin-top: 20px" :data="allData">
        <el-table-column
          label="序号"
          width="80px"
          align="center"
          type="index"
        ></el-table-column>
        <el-table-column label="SPU名称" prop="spuName"></el-table-column>
        <el-table-column
          label="SPU描述"
          prop="description"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="SPU操作">
          <template #="{ row }">
            <el-button
              type="primary"
              icon="Plus"
              size="small"
              @click="handleAddSKu(row)"
            ></el-button>
            <el-button
              type="primary"
              icon="Edit"
              size="small"
              @click="handleEditSpu(row)"
            ></el-button>
            <el-button
              type="primary"
              icon="Watch"
              size="small"
              @click="handleWatchSpu(row)"
            ></el-button>
            <el-popconfirm
              title="你确定删除吗"
              @confirm="handleDeleteSpu(row.id)"
            >
              <template #reference>
                <el-button
                  type="primary"
                  icon="Delete"
                  size="small"
                ></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[3, 5, 7, 9]"
        :background="true"
        style="margin-top: 20px"
        layout="prev, pager, next, jumper,->,sizes, total"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <SpuForm
      v-show="scene === 1"
      @sendState="handleApplyState"
      ref="FormVaue"
    ></SpuForm>
    <SkuForm
      v-show="scene === 2"
      ref="SkuFormData"
      @sendState="handleApplyState"
    ></SkuForm>
    <el-dialog title="SKU列表" v-model="dialogVisible">
      <el-table border :data="watchSpuData">
        <el-table-column label="sku名字" prop="skuName"></el-table-column>
        <el-table-column label="sku价格" prop="price"></el-table-column>
        <el-table-column label="sku重量" prop="weight"></el-table-column>
        <el-table-column label="sku图片">
          <template #="{ row }">
            <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'
import type { HasSpuResponseData } from '../../../api/product/spu/type'
import { reqHasSpu, watchSpu, deleteSpu } from '../../../api/product/spu/index'
import useCategoryStore from '../../../store/modules/category'
import SpuForm from './SpuForm.vue'
import SkuForm from './SkuForm.vue'
import { ElMessage } from 'element-plus'
let scene = ref(0)
let dialogVisible = ref<boolean>(false)
let visible = ref<number>(0)
let currentPage = ref<number>(1)
let pageSize = ref<number>(3)
let useStore = useCategoryStore()
let allData = ref<any[]>([])
let total = ref()
let SkuFormData = ref()
let FormVaue = ref()
let watchSpuData = ref<any[]>([])
const initGetSpu = async () => {
  let result: HasSpuResponseData = await reqHasSpu(
    currentPage.value,
    pageSize.value,
    useStore.c3Id,
  )
  console.log(result)
  allData.value = result.data.records
  total.value = result.data.total
}
watch(
  () => useStore.c3Id,
  () => {
    initGetSpu()
  },
)
const handleSizeChange = () => {
  initGetSpu()
}
const handleCurrentChange = (page = 1) => {
  currentPage.value = page
  initGetSpu()
}
const handleAddSKu = (row: any) => {
  console.log(row)
  scene.value = 2
  SkuFormData.value.initGetSku(useStore.c1Id, useStore.c2Id, row)
}
const handleAddSpu = () => {
  FormVaue.value.addSpuParams(useStore.c3Id)
  scene.value = 1
}
const handleDeleteSpu = async (spuId: number) => {
  let result = await deleteSpu(spuId)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    initGetSpu()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
const handleEditSpu = (row: any) => {
  scene.value = 1
  FormVaue.value.initData(row)
}
const handleWatchSpu = async (row: any) => {
  let result: any = await watchSpu(row.id)
  if (result.code === 200) {
    console.log(result)
    watchSpuData.value = result.data
  }
  dialogVisible.value = true
}
const handleApplyState = (state: any) => {
  let { flag, params } = state
  scene.value = flag
  if (params === 'update') {
    handleCurrentChange(currentPage.value)
  } else {
    handleCurrentChange()
  }
}
</script>

<style scoped lang="scss"></style>
