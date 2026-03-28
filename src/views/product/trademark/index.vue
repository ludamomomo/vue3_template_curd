<template>
  <div>
    <el-card>
      <el-button type="primary" icon="Plus" @click="handleAdd">
        添加品牌
      </el-button>
      <el-table border style="margin: 20px 0" :data="trademarkArr">
        <el-table-column label="序号" width="80" align="center" type="index" />
        <el-table-column label="品牌名称">
          <template #default="{ row }">
            {{ row.tmName }}
          </template>
        </el-table-column>
        <el-table-column label="品牌LOGO">
          <template #default="{ row }">
            <img :src="row.logoUrl" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="品牌操作">
          <template #default="{ row }">
            <el-button
              type="primary"
              icon="Edit"
              @click="handleEdit(row)"
            ></el-button>
            <el-popconfirm
              :title="`确定删除${row.tmName}?`"
              @confirm="handleDeltePop(row.id)"
              width="250px"
            >
              <template #reference>
                <el-button type="primary" icon="Delete"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[3, 5, 7, 9]"
        background
        layout="prev, pager, next, jumper ,->,sizes, total"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
    <el-dialog
      v-model="dialogFormVisible"
      :title="trademarkParams.id ? '修改品牌' : '添加品牌'"
      width="600px"
    >
      <el-form ref="formRef" :model="trademarkParams" :rules="rules">
        <el-form-item
          label="品牌名称"
          style="margin-top: 20px"
          label-width="100px"
          prop="tmName"
        >
          <el-input
            placeholder="请您输入品牌名称"
            v-model="trademarkParams.tmName"
          />
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :headers="uploadHeaders"
          >
            <img
              v-if="trademarkParams.logoUrl"
              :src="trademarkParams.logoUrl"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleDelete">取消</el-button>
          <el-button type="primary" @click="handleConfirm">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import {
  getMarkList,
  addOrUpdateTradMark,
  deleteTradeMark,
} from '../../../api/product/trademark/index'
import type {
  TradeMarkResponseData,
  Trademark,
} from '../../../api/product/trademark/type'
import { ElMessage } from 'element-plus'
import type { UploadProps } from 'element-plus'
import useUserStore from '@/store/modules/user'

// 获取用户仓库，用于获取 token
const userStore = useUserStore()
// el-upload 上传请求头，携带 token
const uploadHeaders = { token: userStore.token }

let currentPage = ref<number>(1)
let pageSize = ref<number>(3)
let trademarkArr = ref<any>([])
let total = ref(0)
let formRef = ref()
let dialogFormVisible = ref(false)
let trademarkParams = reactive<Trademark>({
  logoUrl: '',
  tmName: '',
})
const validatorName = (rule: any, value: any, callback: any) => {
  console.log(rule, value, callback)
  if (value.trim().length >= 2) {
    callback()
  } else {
    callback(new Error('输入的名称长度要大于2'))
  }
}
const validatorLogo = (rule: any, value: any, callback: any) => {
  console.log(rule, value, callback)
  if (value) {
    callback()
  } else {
    callback(new Error('图片内容一定要上传'))
  }
}
let rules = {
  tmName: [{ required: true, trigger: 'blur', validator: validatorName }],
  logoUrl: [{ required: true, trigger: 'change', validator: validatorLogo }],
}
const getTradeMark = async () => {
  let result: TradeMarkResponseData = await getMarkList(
    currentPage.value,
    pageSize.value,
  )
  if (result.code === 200) {
    // console.log(result)
    trademarkArr.value = result.data.records
    total.value = result.data.total
  }
}

const handleSizeChange = () => {
  currentPage.value = 1
  getTradeMark()
}

const handleCurrentChange = () => {
  getTradeMark()
}
onMounted(() => {
  getTradeMark()
})
const handleAdd = () => {
  trademarkParams.logoUrl = ''
  trademarkParams.tmName = ''
  trademarkParams.id = 0
  dialogFormVisible.value = true
  formRef.value?.clearValidate('logoUrl')
  formRef.value?.clearValidate('tmName')
}
const handleDelete = () => {
  dialogFormVisible.value = false
}
const handleConfirm = async () => {
  await formRef.value.validate()
  formRef.value?.clearValidate('logoUrl')
  let result: any = await addOrUpdateTradMark(trademarkParams)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功',
    })
    getTradeMark()
    currentPage.value = trademarkParams.id ? currentPage.value : 1
  } else {
    ElMessage({
      type: 'error',
      message: trademarkParams.id ? '修改品牌失败' : '添加品牌失败',
    })
  }
  dialogFormVisible.value = false
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (
    rawFile.type === 'image/jpeg' ||
    rawFile.type === 'image/png' ||
    rawFile.type === 'image/gif'
  ) {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '文件要小于4m',
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '格式只能是jpg,png,gif',
    })
    return false
  }
}
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  // console.log(response)
  trademarkParams.logoUrl = response.data
  formRef.value.clearValidate('logoUrl')
}
const handleEdit = (row: Trademark) => {
  dialogFormVisible.value = true
  trademarkParams.logoUrl = row.logoUrl
  trademarkParams.tmName = row.tmName
  trademarkParams.id = row.id
  formRef.value?.clearValidate('logoUrl')
  formRef.value?.clearValidate('tmName')
}
const handleDeltePop = async (id: number) => {
  let result = await deleteTradeMark(id)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getTradeMark()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
