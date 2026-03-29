<template>
  <el-card style="height: 80px">
    <el-form class="form">
      <el-form-item label="角色搜索">
        <el-input placeholder="请输入搜索角色名称" v-model="keyWord"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button type="primary" @clck="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin-top: 20px">
    <el-button type="primary" icon="Plus" @click="addRole">添加角色</el-button>
    <el-table border style="margin: 20px 0" :data="allData">
      <el-table-column label="#" type="index" align="center"></el-table-column>
      <el-table-column label="id" align="center" prop="id"></el-table-column>
      <el-table-column
        label="角色名称"
        align="center"
        prop="roleName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        prop="updateTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="操作" align="center" width="300px">
        <template #="{ row }">
          <el-button
            type="primary"
            size="small"
            icon="User"
            @click="handlePermissionRole(row)"
          >
            分配权限
          </el-button>
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="handleRolePermission(row)"
          >
            编辑
          </el-button>
          <el-popconfirm title="你确认删除吗?" @confirm="handleDelete(row)">
            <template #reference>
              <el-button type="primary" size="small" icon="Delete">
                删除
              </el-button>
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
      layout="prev, pager, next, jumper,->,total,sizes"
      :total="total"
      @size-change="getALlData"
      @current-change="getALlData"
    />
    <el-dialog
      v-model="visible"
      :title="userParams.id ? '更新角色' : '添加角色'"
    >
      <el-form ref="formRef" :model="userParams" :rules="rules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            placeholder="请输入角色名称"
            v-model="userParams.roleName"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" size="default" @click="visible = false">
          取消
        </el-button>
        <el-button type="primary" size="default" @click="handleConfirm">
          确定
        </el-button>
      </template>
    </el-dialog>
    <el-drawer v-model="drawer1">
      <template #header>
        <h4>分配菜单与按钮权限</h4>
      </template>
      <template #default>
        <el-tree
          ref="tree"
          style="max-width: 600px"
          :data="allPermission"
          show-checkbox
          node-key="id"
          :default-expand-all="true"
          :default-checked-keys="selectedArr"
          :props="defaultProps"
        />
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancelClick">取消</el-button>
          <el-button type="primary" @click="handlePermissionChanged">
            确认
          </el-button>
        </div>
      </template>
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import {
  getAllInfo,
  addOrUpdate,
  getAllMemberRole,
  updatePerission,
  deleteMember,
} from '../../../api/acl/role/index'
import useLayOutSettingStore from '../../../store/modules/setting'
import { ElMessage } from 'element-plus'
let currentPage = ref<number>(1)
let pageSize = ref<number>(3)
let keyWord = ref<string>('')
let allData = ref<any[]>([])
let total = ref<number>()
let visible = ref<boolean>(false)
let formRef = ref()
let drawer1 = ref<boolean>(false)
let selectedArr = ref<any[]>([])
let tree = ref()
let useStore = useLayOutSettingStore()
let allPermission = ref<any[]>([])
let userParams = reactive<any>({
  roleName: '',
})
const validatorName = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 2) {
    callback()
  } else {
    callback(new Error('长度要求大于等于2'))
  }
}
let rules = {
  roleName: [{ required: true, trigger: 'blur', validator: validatorName }],
}
const defaultProps = {
  children: 'children',
  label: 'name',
}
const handlePermissionRole = async (row: any) => {
  Object.assign(userParams, row)
  drawer1.value = true
  let result: any = await getAllMemberRole(userParams.id)
  if (result.code === 200) {
    console.log(result)
    allPermission.value = result.data
    selectedArr.value = filterPermission(allPermission.value, [])
  }
}
const filterPermission = (allPermission: any, initArr: number[]) => {
  allPermission.forEach((item: any) => {
    if (item.level === 4 && item.select) {
      initArr.push(item.id)
    }
    if (item.children) {
      filterPermission(item.children, initArr)
    }
  })
  return initArr
}
const handlePermissionChanged = async () => {
  let arr = tree.value.getCheckedKeys()
  let arr1 = tree.value.getHalfCheckedKeys()
  let arrConCat = arr.concat(arr1)
  let result: any = await updatePerission(userParams.id, arrConCat)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '权限分配成功',
    })
    window.location.reload()
  } else {
    ElMessage({
      type: 'error',
      message: '权限分配失败',
    })
  }
}
const cancelClick = () => {
  drawer1.value = false
}
const getALlData = async (pager = 1) => {
  currentPage.value = pager
  let result: any = await getAllInfo(
    currentPage.value,
    pageSize.value,
    keyWord.value,
  )
  if (result.code === 200) {
    console.log(result)
    allData.value = result.data.records
    total.value = result.data.total
  }
}
const handleDelete = async (row: any) => {
  let result: any = await deleteMember(row.id)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getALlData()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
const handleReset = () => {
  useStore.refsh = !useStore.refsh
}
const handleSearch = () => {
  getALlData()
  keyWord.value = ''
}
const addRole = async () => {
  Object.assign(userParams, {
    roleName: '',
    id: 0,
  })
  visible.value = true
  formRef.value?.clearValidate('roleName')
}
const handleRolePermission = (row: any) => {
  visible.value = true
  Object.assign(userParams, row)
}
const handleConfirm = async () => {
  await formRef.value.validate()
  let result: any = await addOrUpdate(userParams)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: userParams.id ? '修改成功' : '添加成功',
    })
    visible.value = false
    getALlData()
  } else {
    ElMessage({
      type: 'error',
      message: userParams.id ? '修改失败' : '添加失败',
    })
    visible.value = false
  }
}
onMounted(() => {
  getALlData()
})
</script>

<style scoped lang="scss">
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
