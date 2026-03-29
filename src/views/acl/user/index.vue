<template>
  <el-card style="height: 80px">
    <el-form class="form">
      <el-form-item label="用户名">
        <el-input placeholder="请输入搜索用户名" v-model="keyWord"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button type="primary" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin-top: 20px">
    <el-button type="primary" @click="handleAdd">添加用户</el-button>
    <el-button type="primary" @click="handleDeleteDataAll">批量删除</el-button>
    <el-table
      border
      style="margin-top: 20px"
      :data="userArr"
      @selection-change="handleSelection"
    >
      <el-table-column align="center" type="selection"></el-table-column>
      <el-table-column align="center" label="#" type="index"></el-table-column>
      <el-table-column align="center" label="ID" prop="id"></el-table-column>
      <el-table-column
        align="center"
        label="用户名字"
        prop="username"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        label="用户名称"
        prop="name"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        label="用户角色"
        prop="roleName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        label="创建时间"
        prop="createTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        label="更新时间"
        prop="updateTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        label="操作"
        width="300px"
        show-overflow-tooltip
      >
        <template #="{ row }">
          <el-button
            type="primary"
            size="small"
            icon="User"
            @click="handleRoles(row)"
          >
            分配角色
          </el-button>
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="handleEdit(row)"
          >
            编辑
          </el-button>
          <el-popconfirm
            title="你确定删除吗?"
            width="200px"
            @confirm="handleDeleteDataOne(row)"
          >
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
      style="margin-top: 20px"
      :page-sizes="[3, 5, 7, 9]"
      :background="true"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
  <el-drawer v-model="drawer">
    <template #header>
      <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
    </template>
    <template #default>
      <el-form :model="userParams" :rules="rules" ref="formRef">
        <el-form-item label="用户姓名" prop="username">
          <el-input
            placeholder="请输入用户姓名"
            v-model="userParams.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input
            placeholder="请输入用户昵称"
            v-model="userParams.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
          <el-input
            placeholder="请输入用户密码"
            v-model="userParams.password"
          ></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </template>
  </el-drawer>
  <el-drawer v-model="drawer1">
    <template #header>
      <h4>分配角色</h4>
    </template>
    <template #default>
      <el-form>
        <el-form-item label="用户姓名">
          <el-input v-model="userParams.username" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <el-checkbox
        v-model="checkAll"
        :indeterminate="isIndeterminate"
        @change="handleCheckAllChange"
      >
        全选
      </el-checkbox>
      <el-checkbox-group
        v-model="checkedCities"
        @change="handleCheckedCitiesChange"
      >
        <el-checkbox
          v-for="city in cities"
          :key="city"
          :label="city"
          :value="city"
        >
          {{ city.roleName }}
        </el-checkbox>
      </el-checkbox-group>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer1 = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  getAllUser,
  addOrUpdateUser,
  getUserInfoPage,
  handleRole,
  handleDeleteOne,
  handleDeleteAll,
} from '../../../api/acl/user/index'
import { ElMessage } from 'element-plus'
import type { CheckboxValueType } from 'element-plus'
import useLayOutSettingStore from '../../../store/modules/setting'
let useStore = useLayOutSettingStore()
const checkAll = ref(false)
const isIndeterminate = ref(true)
const checkedCities = ref<any[]>([])
let cities: any = []
let keyWord = ref<string>('')
let currentPage = ref<number>(1)
let pageSize = ref<number>(3)
let userArr = ref<any[]>([])
let total = ref<number>()
let drawer = ref<boolean>(false)
let drawer1 = ref<boolean>(false)
let formRef = ref<any>()
let selectionArr = ref<any[]>([])
let userParams = reactive<any>({
  username: '',
  name: '',
  password: '',
})
const getAllInit = async (pager = 1) => {
  currentPage.value = pager
  let result: any = await getAllUser(
    currentPage.value,
    pageSize.value,
    keyWord.value,
  )
  if (result.code === 200) {
    console.log(result)
    userArr.value = result.data.records
    total.value = result.data.total
  }
}
//复选框的逻辑
const handleCheckAllChange = (val: CheckboxValueType) => {
  checkedCities.value = val ? cities : []
  isIndeterminate.value = false
}
const handleCheckedCitiesChange = (value: CheckboxValueType[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === cities.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < cities.length
}

const handleRoles = async (row: any) => {
  Object.assign(userParams, row)
  let result: any = await getUserInfoPage(userParams.id)
  if (result.code === 200) {
    console.log(result)
    cities = result.data.allRolesList
    checkedCities.value = result.data.assignRoles
  }
  drawer1.value = true
}
//@ts-ignore
const validatorUsername = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 5) {
    callback()
  } else {
    callback(new Error('输入的长度要大于等于五'))
  }
}
//@ts-ignore
const validatorName = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 5) {
    callback()
  } else {
    callback(new Error('输入的长度要大于等于五'))
  }
}
//@ts-ignore
const validatorPassword = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 5) {
    callback()
  } else {
    callback(new Error('输入的长度要大于等于五'))
  }
}
let rules = {
  username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
  name: [{ required: true, trigger: 'blur', validator: validatorName }],
  password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
}
const handleCurrentChange = () => {
  getAllInit(currentPage.value)
}
const handleSizeChange = () => {
  getAllInit()
}
const handleAdd = () => {
  Object.assign(userParams, {
    id: 0,
    username: '',
    name: '',
    password: '',
  })
  drawer.value = true
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('password')
  })
}
const handleEdit = (row: any) => {
  Object.assign(userParams, row)
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
  })
  drawer.value = true
}
const cancel = () => {
  drawer.value = false
}
const confirm = async () => {
  let result = await addOrUpdateUser(userParams)
  if (result.code === 200) {
    console.log(result)
    ElMessage({
      type: 'success',
      message: userParams.id ? '修改成功' : '添加成功',
    })
    getAllInit()
  } else {
    ElMessage({
      type: 'error',
      message: userParams.id ? '修改失败' : '添加失败',
    })
  }
  drawer.value = false
}
const handleConfirm = async () => {
  let params = {
    userId: userParams.id,
    roleIdList: checkedCities.value.map((item) => item.id),
  }
  let result: any = await handleRole(params)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '分配角色成功',
    })
    drawer1.value = false
    getAllInit()
  } else {
    ElMessage({
      type: 'success',
      message: '分配角色失败',
    })
  }
}
const handleSelection = (val: any) => {
  //console.log(val)
  selectionArr.value = val
}
const handleDeleteDataOne = async (row: any) => {
  let result = await handleDeleteOne(row.id)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getAllInit()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
const handleDeleteDataAll = async () => {
  let selectedIds: any = selectionArr.value.map((item: any) => {
    return item.id
  })
  let result = await handleDeleteAll(selectedIds)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getAllInit()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
const handleSearch = () => {
  getAllInit()
  keyWord.value = ''
}
const handleReset = () => {
  useStore.refsh = !useStore.refsh
}
onMounted(() => {
  getAllInit()
})
</script>

<style scoped lang="scss">
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
