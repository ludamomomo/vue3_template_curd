<template>
  <img src="../../assets/images/wangruiyang.png" alt="" />
  <h1>最近最近熬夜写代码好累。。。。。。。先放张图片在这吧嘿嘿</h1>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import useUserStore from '../../store/modules/user'
let useStore = useUserStore()
onMounted(() => {
  useStore.getUserInfo()
})
</script>

<style scoped lang="scss"></style>
