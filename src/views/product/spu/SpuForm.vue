<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input
        placeholder="请你输入spu名称"
        v-model="attrAllParams.spuName"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select style="width: 240px" v-model="attrAllParams.tmId">
        <el-option
          v-for="item in allTradeMark"
          :key="item.id"
          :label="item.tmName"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input
        type="textarea"
        placeholder="请你输入SPU描述"
        v-model="attrAllParams.description"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <el-upload
        v-model:file-list="allImgList"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-upload="handleUpdate"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>

      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <el-select style="width: 240px" v-model="connectAttr">
        <el-option
          v-for="item in unSelectedAllData"
          :key="item.id"
          :label="item.name"
          :value="`${item.id}-${item.name}`"
        ></el-option>
      </el-select>
      <el-button
        icon="Plus"
        type="primary"
        style="margin-left: 10px"
        :disabled="unSelectedAllData.length ? false : true"
        @click="handleAddAttr"
      >
        添加属性
      </el-button>
      <el-table border style="margin-top: 10px" :data="someSales">
        <el-table-column
          type="index"
          label="序号"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="销售属性名字"
          width="120px"
          prop="saleAttrName"
        ></el-table-column>
        <el-table-column label="销售属性值">
          <template #="{ row, $index }">
            <el-tag
              v-for="tag in row.spuSaleAttrValueList"
              :key="tag.id"
              closable
              style="margin: 10px"
              @close="() => row.spuSaleAttrValueList.splice($index, 1)"
            >
              {{ tag.saleAttrValueName }}
            </el-tag>
            <el-input
              v-if="row.flag"
              style="width: 100px"
              size="small"
              @blur="handleBlur(row)"
              v-model="row.saleAttrValue"
            ></el-input>
            <el-button
              type="primary"
              icon="Plus"
              size="small"
              v-else
              @click="handleAddAttrSmallSales(row)"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px"></el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button type="primary" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  getAllMark,
  getAllImage,
  getSomeSales,
  getAllSales,
  getOrUpdate,
} from '../../../api/product/spu/index'
import { ElMessage } from 'element-plus'
let emit = defineEmits(['sendState'])
let attrAllParams = ref<any>({
  category3Id: '',
  spuName: '',
  description: '',
  tmId: '',
  spuImageList: [],
  spuSaleAttrList: [],
})
let connectAttr = ref<any[]>([])
let someSales = ref<any[]>([])
let allSales = ref<any[]>([])
let dialogImageUrl = ref<string>('')
let dialogVisible = ref<boolean>(false)
let allImgList = ref<any[]>([])
let allTradeMark = ref<any[]>([])
const save = async () => {
  attrAllParams.value.spuImageList = allImgList.value.map((item: any) => {
    return {
      imgName: item.name,
      imgUrl: (item.response && item.response.data) || item.url,
    }
  })
  attrAllParams.value.spuSaleAttrList = someSales.value

  let result = await getOrUpdate(attrAllParams.value)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: attrAllParams.value.id ? '更新成功' : '添加成功',
    })
    emit('sendState', {
      flag: 0,
      params: attrAllParams.value.id ? 'update' : 'add',
    })
  } else {
    ElMessage({
      type: 'error',
      message: attrAllParams.value.id ? '更新失败' : '添加失败',
    })
  }
}

const cancel = () => {
  emit('sendState', {
    flag: 0,
    params: attrAllParams.value.id ? 'update' : 'add',
  })
}
const initData = async (row: any) => {
  attrAllParams.value = row
  let result: any = await getAllMark()
  if (result.code === 200) {
    console.log(result)
    allTradeMark.value = result.data
  }
  let result1: any = await getAllImage(row.id)
  if (result1.code === 200) {
    console.log(result1)
    allImgList.value = result1.data.map((item: any) => {
      return {
        name: item.imgName,
        url: item.imgUrl,
      }
    })
  }
  let result2: any = await getSomeSales(row.id)
  if (result2.code === 200) {
    console.log(result2)
    someSales.value = result2.data
  }
  let result3: any = await getAllSales()
  if (result.code === 200) {
    console.log(result3)
    allSales.value = result3.data
  }
}

let unSelectedAllData = computed(() => {
  let unSelectedData = allSales.value.filter((item: any) => {
    return someSales.value.every((itemT: any) => {
      return item.name !== itemT.saleAttrName
    })
  })
  return unSelectedData
})

const handlePictureCardPreview = (file: any) => {
  dialogVisible.value = true
  dialogImageUrl.value = file.url
}
const handleRemove = (file: any) => {
  console.log(file)
  // file.url = ''
}
const handleUpdate = (file: any) => {
  if (
    file.type === 'image/png' ||
    file.type === 'image/jpeg' ||
    file.type === 'image/gif'
  ) {
    if (file.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传的要小于4',
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传的格式只能是png/jpg/gif',
    })
    return false
  }
}
const handleAddAttr = () => {
  //@ts-ignore
  const [baseSaleAttrId, saleAttrName] = connectAttr.value.split('-')
  let newObjectAttr: any = {
    baseSaleAttrId: Number(baseSaleAttrId),
    saleAttrName,
    spuSaleAttrValueList: [],
  }
  someSales.value.push(newObjectAttr)
  connectAttr.value = []
}

const handleAddAttrSmallSales = (row: any) => {
  console.log(row)
  row.flag = true
  row.saleAttrValue = ''
}
const handleBlur = (row: any) => {
  row.flag = false
  const { baseSaleAttrId, saleAttrValue } = row
  let newObj = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue,
  }
  if (saleAttrValue.trim() === '') {
    ElMessage({
      type: 'error',
      message: '输入的值不能是有空的',
    })
    return
  }
  let target = row.spuSaleAttrValueList.find((item: any) => {
    return item.saleAttrValueName === saleAttrValue
  })
  if (target) {
    ElMessage({
      type: 'error',
      message: '两次输入的值不能是一样的',
    })
    return
  }
  row.spuSaleAttrValueList.push(newObj)
}
const addSpuParams = async (id: number | string) => {
  Object.assign(attrAllParams, {
    category3Id: '',
    spuName: '',
    description: '',
    tmId: '',
    spuImageList: [],
    spuSaleAttrList: [],
  })
  allImgList.value = []
  someSales.value = []
  //@ts-ignore
  connectAttr.value = ''
  //console.log('jiehsou')
  let result: any = await getAllMark()
  if (result.code === 200) {
    allTradeMark.value = result.data
  }
  let result1: any = await getAllSales()
  if (result1.code === 200) {
    allSales.value = result1.data
  }
  attrAllParams.value.category3Id = id
}
defineExpose({ initData, addSpuParams })
</script>

<style scoped lang="scss"></style>
