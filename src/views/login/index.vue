<template>
  <div class="container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form
          class="elFrom"
          :model="userLoginData"
          :rules="rules"
          ref="loginFormRef"
        >
          <h1>Hello</h1>
          <h2>欢迎来到我的项目</h2>
          <el-form-item prop="userName">
            <el-input
              :prefix-icon="User"
              v-model="userLoginData.userName"
            ></el-input>
          </el-form-item>
          <el-form-item prop="passWord">
            <el-input
              :prefix-icon="Lock"
              show-password
              v-model="userLoginData.passWord"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              class="elButton"
              @click="handleLogin"
              :loading="loading"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'
import useUserStore from '../../store/modules/user'
import { getTime } from '../../utils/time'

let loading = ref(false)
const loginFormRef = ref()
const userLoginData = reactive({ userName: '', passWord: '' })
const router = useRouter()
const userStore = useUserStore()
//@ts-ignore
const validatorName = (rule: any, value: any, callback: any) => {
  if (value.length >= 5) {
    callback()
  } else {
    callback(new Error('输入的账号长度不能小于5位'))
  }
}
//@ts-ignore
const validatorPassWord = (rule: any, value: any, callback: any) => {
  if (value.length >= 6) {
    callback()
  } else {
    callback(new Error('输入的密码长度不能小于6位'))
  }
}
const rules = {
  userName: [{ validator: validatorName, trigger: 'blur' }],
  passWord: [{ validator: validatorPassWord, trigger: 'blur' }],
}
const handleLogin = async () => {
  await loginFormRef.value.validate()
  loading.value = true
  try {
    //@ts-ignore
    await userStore.userLogin(userLoginData)
    router.push('/')
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `Hi,${getTime()}`,
    })
    loading.value = false
  } catch (error) {
    loading.value = false
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
  }
}
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100vh;
  background: url('../../assets/images/background.jpg') no-repeat;
  background-size: cover;
  .elFrom {
    padding: 40px;
    position: relative;
    background-size: cover;
    width: 80%;
    height: 45vh;
    top: 30vh;
    background: url('../../assets/images/login_form.png') no-repeat;
    h1 {
      font-size: 40px;
      color: white;
      margin-bottom: 20px;
    }
    h2 {
      font-size: 20px;
      color: white;
      margin-bottom: 20px;
    }
    .elButton {
      width: 100%;
    }
  }
}
</style>
