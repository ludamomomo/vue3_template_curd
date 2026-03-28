<template>
  <div>一级路由home</div>
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
