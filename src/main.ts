import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
// 配置 element-plus 国际化
import zhCn from 'element-plus/es/locale/lang/zh-cn'
//@ts-expect-error
import 'virtual:svg-icons-register'
import gloablComponent from './components/index'
import './style/index.scss'
import router from '../src/router/index'
import pinia from './store'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './permission'
const app = createApp(App)

app.use(ElementPlus, {
  locale: zhCn,
})
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(gloablComponent)
app.use(router)
app.use(pinia)
app.mount('#app')
