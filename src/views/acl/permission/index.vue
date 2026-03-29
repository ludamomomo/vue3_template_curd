<template>
  <el-table
    border
    style="width: 100%; margin-bottom: 20px"
    row-key="id"
    :data="dataArr"
  >
    <el-table-column prop="name" label="名称" />
    <el-table-column prop="code" label="权限值" />
    <el-table-column prop="updateTime" label="修改时间" />
    <el-table-column label="操作">
      <template #="{ row }">
        <el-button type="primary" size="small" @click="handleAdd(row)">
          {{ row.level == 3 ? '添加功能' : '添加菜单' }}
        </el-button>
        <el-button
          type="primary"
          size="small"
          :disabled="row.level === 1 ? true : false"
          @click="handleEdit(row)"
        >
          编辑
        </el-button>
        <el-button
          type="primary"
          size="small"
          :disabled="row.level == 1 ? true : false"
          @click="handleDeleteAll(row)"
        >
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog v-model="visible" title="添加菜单">
    <el-form>
      <el-form-item label="名称">
        <el-input
          placeholder="请输入菜单名称"
          v-model="userParams.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="权限">
        <el-input
          placeholder="请输入权限值"
          v-model="userParams.code"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button>取消</el-button>
      <el-button type="primary" @click="confirm">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import {
  getAllInfo,
  addOrUpdate,
  deleteData,
} from '../../../api/acl/permission/index'
import { ElMessage } from 'element-plus'
let dataArr = ref<any>([])
let visible = ref<boolean>(false)
let userParams = reactive<any>({
  code: '',
  level: 0,
  name: '',
  pid: 0,
})
const confirm = async () => {
  let result: any = await addOrUpdate(userParams)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '添加成功',
    })
    visible.value = false
    getAllMemu()
  } else {
    ElMessage({
      type: 'error',
      message: '添加失败',
    })
  }
}
const handleDeleteAll = async (row: any) => {
  let result: any = await deleteData(row.id)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getAllMemu()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
const getAllMemu = async () => {
  let result: any = await getAllInfo()
  if (result.code === 200) {
    console.log(result)
    dataArr.value = result.data
  }
}
const handleAdd = (row: any) => {
  Object.assign(userParams, {
    id: 0,
    code: '',
    level: 0,
    name: '',
    pid: 0,
  })
  visible.value = true
  userParams.id = row.id
  userParams.pid = row.level + 1
}
const handleEdit = (row: any) => {
  Object.assign(userParams, row)
  visible.value = true
}
onMounted(() => {
  getAllMemu()
})
</script>

<style scoped lang="scss"></style>
