import SvgIcon from '../components/SvgIcon/index.vue'
import Pagination from '../components/Pagination/index.vue'
import Category from '../components/Category/index.vue'
const allGloablComponent: any = { SvgIcon, Pagination, Category }

export default {
  install(app: any) {
    const keys = Object.keys(allGloablComponent)
    keys.forEach((key) => {
      app.component(key, allGloablComponent[key])
    })
  },
}
