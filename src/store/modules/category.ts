import { defineStore } from 'pinia'
import {
  getCategoryCone,
  getCategoryCtwo,
  getCategoryCthree,
} from '../../api/product/attr/index'
const useCategoryStore = defineStore('Category', {
  state: (): any => {
    return {
      c1Id: '',
      c1Arr: [],
      c2Id: '',
      c2Arr: [],
      c3Id: '',
      c3Arr: [],
    }
  },
  actions: {
    async getC1() {
      let result: any = await getCategoryCone()
      if (result.code === 200) {
        this.c1Arr = result.data
      }
    },
    async getC2() {
      let result = await getCategoryCtwo(this.c1Id)
      if (result.code === 200) {
        this.c2Arr = result.data
      }
    },
    async getC3() {
      let result = await getCategoryCthree(this.c2Id)
      if (result.code === 200) {
        this.c3Arr = result.data
      }
    },
  },
})

export default useCategoryStore
