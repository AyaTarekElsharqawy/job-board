// src/main.js
import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App    from './App.vue'
import router from './router'


import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { 
  faBriefcase, 
  faFileAlt, 
  faComment, 
  faChartLine, 
  faFilter, 
  faMoneyBillWave,
  faSignOutAlt 
} from '@fortawesome/free-solid-svg-icons'

import { 
  faTachometerAlt,   
  faCreditCard,      
  faChartBar,        
  faUsers            
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faBriefcase,
  faFileAlt,
  faComment,
  faChartLine,
  faFilter,
  faMoneyBillWave,
  faSignOutAlt,
  faTachometerAlt,  // ✅ إضافة tachometer-alt
  faCreditCard,     // ✅ إضافة credit-card
  faChartBar,       // ✅ إضافة chart-bar
  faUsers           // ✅ إضافة users
)

const app = createApp(App)

app.use(createPinia())

app.component('FontAwesomeIcon', FontAwesomeIcon)

app.use(router)

app.mount('#app')
