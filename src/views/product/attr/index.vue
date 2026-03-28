<template>
  <div>
    <Category :visible="visible"></Category>
    <div v-show="visible === 0">
      <el-card style="margin-top: 20px">
        <el-button
          type="primary"
          icon="Plus"
          style="margin-bottom: 20px"
          :disabled="!useStore.c3Id"
          @click="handleAddAttr"
        >
          添加属性
        </el-button>
        <el-table border :data="attrArr">
          <el-table-column
            label="序号"
            width="80px"
            align="center"
            type="index"
          ></el-table-column>
          <el-table-column label="属性名称" width="120px">
            <template #="{ row }">
              {{ row.attrName }}
            </template>
          </el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row }">
              <el-tag type="primary" v-for="item in row.attrValueList">
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140px">
            <template #="{ row, $index }">
              <el-button
                type="primary"
                icon="Edit"
                @click="handleAttrChange(row)"
              ></el-button>
              <el-button
                type="primary"
                icon="Delete"
                @click="handleDoneDelete(row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <div v-show="visible === 1">
      <el-card style="margin-top: 20px">
        <el-form inline="true">
          <el-form-item label="属性名称">
            <el-input
              placeholder="请你输入属性名称"
              v-model="attrParams.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="Plus" @click="addAttrValue">
          添加属性值
        </el-button>
        <el-button type="primary" @click="handleCancel">取消</el-button>
        <el-table
          border
          style="margin-top: 20px"
          :data="attrParams.attrValueList"
        >
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          ></el-table-column>
          <el-table-column label="属性值的名称">
            <template #="{ row, $index }">
              <el-input
                placeholder="请输入属性值的名称"
                v-model="row.valueName"
                v-if="row.isShow"
                @blur="handleMouseBlur(row, $index)"
                :ref="(vc: any) => (inputArr[$index] = vc)"
              />
              <div v-else @click="handleTouchDiv(row, $index)">
                {{ row.valueName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作">
            <template #="{ row, $index }">
              <el-button
                type="primary"
                icon="Delete"
                @click="handleDelete($index)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          style="margin-top: 20px"
          type="primary"
          @click="addNewAttrValue"
          :disabled="attrParams.attrValueList.length === 0 ? true : false"
        >
          保存
        </el-button>
        <el-button
          style="margin-top: 20px"
          type="primary"
          @click="handleCancel"
        >
          取消
        </el-button>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, reactive, nextTick } from 'vue'
import useCategoryStore from '../../../store/modules/category'
import {
  getAllCategory,
  reqAddOrUpdate,
  reqDeleteAll,
} from '../../../api/product/attr/index'
import type { Attr } from '../../../api/product/attr/type'
import { ElMessage } from 'element-plus'

let useStore = useCategoryStore()
let inputArr = ref<any>([])
let attrArr = ref<any[]>([])
let visible = ref<number>(0)
let attrParams = reactive<Attr>({
  attrName: '',
  attrValueList: [],
  categoryId: 0,
  categoryLevel: 3,
})

watch(
  () => useStore.c3Id,
  async () => {
    attrArr.value = []
    if (!useStore.c3Id) {
      return
    }
    const { c1Id, c2Id, c3Id } = useStore
    let result = await getAllCategory(c1Id, c2Id, c3Id)
    if (result.code === 200) {
      attrArr.value = result.data
    }
  },
)
const addAttrValue = () => {
  attrParams.attrValueList.push({
    valueName: '',
    //@ts-ignore
    isShow: true,
  })
  nextTick(() => {
    inputArr.value[inputArr.value.length - 1].focus()
  })
}
const handleAddAttr = () => {
  attrParams.attrName = ''
  attrParams.attrValueList = []
  attrParams.categoryId = ''
  attrParams.categoryId = useStore.c3Id
  visible.value = 1
}
const handleMouseBlur = (row: any, $index: number) => {
  if (row.valueName.trim() === '') {
    ElMessage({
      type: 'error',
      message: '输入的值不能为空',
    })
    attrParams.attrValueList.splice($index, 1)
    return
  }
  let resultTarget = attrParams.attrValueList.find((item) => {
    if (item !== row) {
      return item.valueName === row.valueName
    }
  })
  if (resultTarget) {
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值不能重复',
    })
    return
  }
  row.isShow = false
}
const handleTouchDiv = (row: any, $index: number) => {
  row.isShow = true
  nextTick(() => {
    inputArr.value[$index].focus()
  })
}
const handleAttrChange = (row: any) => {
  visible.value = 1
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}
const handleCancel = () => {
  visible.value = 0
}
const addNewAttrValue = async () => {
  let result = await reqAddOrUpdate(attrParams)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功' : '添加成功',
    })
    const { c1Id, c2Id, c3Id } = useStore
    let result = await getAllCategory(c1Id, c2Id, c3Id)
    if (result.code === 200) {
      attrArr.value = result.data
    }
    visible.value = 0
  } else {
    ElMessage({
      type: 'error',
      message: '添加失败',
    })
  }
}

const handleDelete = ($index: number) => {
  ElMessage({
    type: 'success',
    message: '删除成功',
  })
  attrParams.attrValueList.splice($index, 1)
}
const handleDoneDelete = async (row: any) => {
  let result = await reqDeleteAll(row.id)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    const { c1Id, c2Id, c3Id } = useStore
    let result = await getAllCategory(c1Id, c2Id, c3Id)
    if (result.code === 200) {
      attrArr.value = result.data
    }
  }
}
</script>

<style scoped lang="scss"></style>
