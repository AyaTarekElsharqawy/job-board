// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

/* استيراد مكوّنات عامّة */
import Home       from '@/views/Public/Home.vue'
import Register   from '@/views/Auth/Register.vue'
import Login      from '@/views/Auth/Login.vue'
import JobDetails from '@/views/jobs/JopDetails.vue'
import BrowseJobs from '@/views/jobs/BrowsJobs.vue'

/* استيراد مكوّنات أصحاب العمل (Employer) */
import EmployerDashboard from '@/views/Employer/EmployerDashboard.vue'
import EmployerHome      from '@/views/Employer/EmployerHome.vue'
import JobForm           from '@/views/Employer/JobForm.vue'
import JobList           from '@/views/Employer/JobList.vue'
import ApplicationList   from '@/views/Employer/ApplicationList.vue'

/* استيراد مكوّنات الإدارة (Admin) */
import AdminJobs         from '@/views/Admin/AdminJobs.vue'
import AdminApplications from '@/views/Admin/AdminApplications.vue'
import AdminComments     from '@/views/Admin/AdminComments.vue'
import AdminAnalytics    from '@/views/Admin/AdminAnalytics.vue'
import AdminFilters      from '@/views/Admin/AdminFilters.vue'
import AdminPayments     from '@/views/Admin/AdminPayments.vue'
import AdminDashboard    from '@/views/Admin/Dashboard.vue'

// ————————— تعريف المسارات —————————
const routes = [
  // الصفحة الرئيسة
  { path: '/', name: 'Home', component: Home },

  // تسجيل دخول وتسجيل جديد
  { path: '/login',    name: 'login',    component: Login },
  { path: '/register', name: 'register', component: Register },

  // تفاصيل وظيفة
  {
    path: '/job-details/:id',
    name: 'JobDetails',
    component: JobDetails,
    props: true
  },

  // تصفح الوظائف
  {
    path: '/browse-jobs',
    name: 'BrowseJobs',
    component: BrowseJobs
  },

  // لوحة أصحاب العمل مع مسارات فرعيّة
  {
    path: '/employer',
    name: 'EmployerDashboard',
    component: EmployerDashboard,
    children: [
      {
        path: '',
        name: 'EmployerDashboardHome',
        component: EmployerHome
      },
      {
        path: 'jobform',
        name: 'JobForm',
        component: JobForm
      },
      {
        path: 'joblist',
        name: 'JobList',
        component: JobList
      },
      {
        path: 'applications',
        name: 'EmployerApplications',
        component: ApplicationList
      }
    ]
  },

  // مسارات الإدارة
  {
    path: '/admin/jobs',
    name: 'AdminJobs',
    component: AdminJobs,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/applications',
    name: 'AdminApplications',
    component: AdminApplications,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/comments',
    name: 'AdminComments',
    component: AdminComments,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/analytics',
    name: 'AdminAnalytics',
    component: AdminAnalytics,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/filters',
    name: 'AdminFilters',
    component: AdminFilters,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/payments',
    name: 'AdminPayments',
    component: AdminPayments,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true },
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('token')
      if (token) next()
      else next('/login')
    }
  }
]

// في حال أردت إضافة صفحة لاستقبال أي مسار خاطئ:
routes.push({
  path: '/:catchAll(.*)',
  redirect: '/'    // أو يمكن عرض صفحة 404 خاصّة
})

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
