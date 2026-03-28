<template>
  <el-table border :data="dataTable">
    <el-table-column
      label="序号"
      type="index"
      align="center"
      width="80px"
    ></el-table-column>
    <el-table-column
      label="名称"
      width="150px"
      show-overflow-tooltip
      prop="skuName"
    ></el-table-column>
    <el-table-column
      label="描述"
      width="150px"
      show-overflow-tooltip
      prop="skuDesc"
    ></el-table-column>
    <el-table-column label="图片" width="150px">
      <template #="{ row }">
        <img :src="row.skuDefaultImg" />
      </template>
    </el-table-column>
    <el-table-column label="重量" width="150px" prop="weight"></el-table-column>
    <el-table-column label="价格" width="150px" prop="price"></el-table-column>
    <el-table-column label="操作" width="250px" fixed="right">
      <template #="{ row }">
        <el-button
          type="primary"
          size="small"
          :icon="row.isSale === 1 ? 'bottom' : 'top'"
          @click="handleClick(row)"
        ></el-button>
        <el-button type="primary" size="small" icon="Edit"></el-button>
        <el-button
          type="primary"
          size="small"
          icon="InfoFilled"
          @click="handleSkuDetail(row)"
        ></el-button>
        <el-popconfirm title="你确定删除吗" @confirm="handleDeleteThis(row)">
          <template #reference>
            <el-button type="primary" size="small" icon="Delete"></el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :page-sizes="[10, 20, 30, 40]"
    :background="true"
    layout="prev, pager, next, jumper,->,total,sizes"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    style="margin-top: 20px"
  />
  <el-drawer v-model="drawer">
    <template #header>
      <h4>查看商品的详情</h4>
    </template>
    <el-row style="margin: 10px 0px">
      <el-col :span="6">名称</el-col>
      <el-col :span="18">{{ skuData.skuName }}</el-col>
    </el-row>
    <el-row style="margin: 10px 0px">
      <el-col :span="6">描述</el-col>
      <el-col :span="18">{{ skuData.skuDesc }}</el-col>
    </el-row>
    <el-row style="margin: 10px 0px">
      <el-col :span="6">价格</el-col>
      <el-col :span="18">{{ skuData.price }}</el-col>
    </el-row>
    <el-row style="margin: 10px 0px">
      <el-col :span="6">平台属性</el-col>
      <el-col :span="18">
        <el-tag v-for="item in skuData.skuAttrValueList" style="margin: 5px">
          {{ item.valueName }}
        </el-tag>
      </el-col>
    </el-row>
    <el-row style="margin: 10px 0px">
      <el-col :span="6">111</el-col>
      <el-col :span="18">
        <el-tag
          v-for="item in skuData.skuSaleAttrValueList"
          style="margin: 5px"
        >
          {{ item.saleAttrValueName }}
        </el-tag>
      </el-col>
    </el-row>
    <el-carousel :interval="4000" type="card" height="200px">
      <el-carousel-item v-for="item in skuData.skuImageList" :key="item">
        <img :src="item.imgUrl" style="width: 100%; height: 100%" />
      </el-carousel-item>
    </el-carousel>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  getAllSkuList,
  upDateList,
  downList,
  getSkuData,
  deleteSkuData,
} from '../../../api/product/sku/index'
import { ElMessage } from 'element-plus'
let skuData = ref<any>({})
let drawer = ref<boolean>(false)
let currentPage = ref(1)
let pageSize = ref(10)
let dataTable = ref<any[]>([])
let total = ref<number>()
const getAllList = async () => {
  let result: any = await getAllSkuList(currentPage.value, pageSize.value)
  if (result.code === 200) {
    console.log(result)
    dataTable.value = result.data.records
    total.value = result.data.total
  }
}
const handleSizeChange = () => {
  currentPage.value = 1
  getAllList()
}
const handleCurrentChange = () => {
  getAllList()
}
const handleClick = async (row: any) => {
  console.log(row)
  if (row.isSale === 1) {
    let result: any = await upDateList(row.id)
    if (result.code === 200) {
      ElMessage({
        type: 'success',
        message: '上架成功',
      })
      getAllList()
    } else {
      ElMessage({
        type: 'error',
        message: '上架失败',
      })
    }
  } else {
    let result1 = await downList(row.spuID)
    if (result1.code === 200) {
      ElMessage({
        type: 'success',
        message: '下架成功',
      })
      getAllList()
    } else {
      ElMessage({
        type: 'error',
        message: '下架失败',
      })
    }
  }
}
const handleDeleteThis = async (row: any) => {
  let result: any = await deleteSkuData(row.id)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getAllList()
  }
}
const handleSkuDetail = async (row: any) => {
  drawer.value = true
  let result: any = await getSkuData(row.id)
  console.log(result)
  skuData.value = result.data
}
onMounted(() => {
  getAllList()
})
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
