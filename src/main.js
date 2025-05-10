import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
  faBriefcase, 
  faFileAlt, 
  faComment, 
  faChartLine, 
  faFilter, 
  faMoneyBillWave,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons'

// Add icons to library
library.add(
  faBriefcase, 
  faFileAlt, 
  faComment, 
  faChartLine, 
  faFilter, 
  faMoneyBillWave,
  faSignOutAlt
)

const app = createApp(App)

// Use Pinia for state management
app.use(createPinia())

// Set up router
app.use(router)

// Register FontAwesomeIcon component globally
app.component('FontAwesomeIcon', FontAwesomeIcon)

// Mount the app to the DOM
app.mount('#app')
