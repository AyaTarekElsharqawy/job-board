import { createRouter, createWebHistory } from 'vue-router'
import MainView from './views/MainView.vue'
import AdminDashboard from './components/AdminDashboard.vue'
import UserManagement from './components/UserManagement.vue'
import JobApprovalList from './components/JobApprovalList.vue'
import CommentManagement from './components/CommentManagement.vue'
import AnalyticsDashboard from './components/AnalyticsDashboard.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    component: MainView,
    children: [
      {
        path: '',
        name: 'dashboard',
        component: AdminDashboard
      },
      {
        path: 'users',
        name: 'users',
        component: UserManagement
      },
      {
        path: 'jobs',
        name: 'jobs',
        component: JobApprovalList
      },
      {
        path: 'comments',
        name: 'comments',
        component: CommentManagement
      },
      {
        path: 'analytics',
        name: 'analytics',
        component: AnalyticsDashboard
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router