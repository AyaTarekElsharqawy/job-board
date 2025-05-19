// src/main.js
import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App    from './App.vue'
import router from './router'

/* ============================== */
/* 1) استيراد FontAwesome Vue component ومكتبة الأيقونات */
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* 2) استيراد الأيقونات التي يستخدمها مشروعك */
// الأيقونات التي سجلتها سابقًا:
import { 
  faBriefcase, 
  faFileAlt, 
  faComment, 
  faChartLine, 
  faFilter, 
  faMoneyBillWave,
  faSignOutAlt 
} from '@fortawesome/free-solid-svg-icons'

// بالإضافة إلى الأيقونات المفقودة المذكورة في الأخطاء:
import { 
  faTachometerAlt,   // الأيقونة: tachometer-alt
  faCreditCard,      // الأيقونة: credit-card
  faChartBar,        // الأيقونة: chart-bar
  faUsers            // الأيقونة: users
} from '@fortawesome/free-solid-svg-icons'

// 3) إضافة كلّ الأيقونات إلى مكتبة FontAwesome
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

// استخدام Pinia
app.use(createPinia())

// تسجيل مكوّن FontAwesomeIcon عالميًا
app.component('FontAwesomeIcon', FontAwesomeIcon)

// استخدام Vue Router
app.use(router)

app.mount('#app')
