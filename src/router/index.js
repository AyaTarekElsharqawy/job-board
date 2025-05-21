// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// Public & Auth
import Home from '@/views/Public/Home.vue'
import Register from '@/views/Auth/Register.vue'
import Login from '@/views/Auth/Login.vue'

// Jobs
import JobDetails from '@/views/jobs/JobDetails.vue'
import BrowseJobs from '@/views/jobs/BrowseJobs.vue'

// Candidate
import CandidateDashboard from '@/views/Candidate/CandidateDashboard.vue'
import AddCandidate from '@/views/Candidate/AddCandidate.vue'

// Employer
import EmployerDashboard from '@/views/Employer/EmployerDashboard.vue'
import EmployerHome from '@/views/Employer/EmployerHome.vue'
import JobForm from '@/views/Employer/JobForm.vue'
import JobList from '@/views/Employer/JobList.vue'
import ApplicationList from '@/views/Employer/ApplicationList.vue'
import EmployerProfile from '@/views/Employer/EmployerProfile.vue'
import AddProfile from '@/views/Employer/AddProfile.vue'

// Admin
import AdminDashboard from '@/views/Admin/Dashboard.vue'
import AdminJobs from '@/views/Admin/AdminJobs.vue'
import AdminApplications from '@/views/Admin/AdminApplications.vue'
import AdminComments from '@/views/Admin/AdminComments.vue'
import AdminAnalytics from '@/views/Admin/AdminAnalytics.vue'
import AdminFilters from '@/views/Admin/AdminFilters.vue'
import AdminPayments from '@/views/Admin/AdminPayments.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/job-details/:id', name: 'JobDetails', component: JobDetails, props: true },
  { path: '/browse-jobs', name: 'BrowseJobs', component: BrowseJobs },

  {
    path: '/employer',
    component: EmployerDashboard,
    children: [
      { path: '', name: 'EmployerHome', component: EmployerHome },
      { path: 'jobform', name: 'JobForm', component: JobForm },
      { path: 'joblist', name: 'JobList', component: JobList },
      { path: 'applications', name: 'EmployerApplications', component: ApplicationList },
      { path: 'profile', name: 'EmployerProfile', component: EmployerProfile },
      { path: 'add-employer-profile', name: 'AddProfile', component: AddProfile }
    ]
  },

  {
    path: '/candidate',
    children: [
      { path: 'dashboard', name: 'CandidateDashboard', component: CandidateDashboard },
      { path: 'job/:id/apply', name: 'JobApply', component: () => import('@/views/Candidate/JobApplyForm.vue') },
      { path: 'search', name: 'CandidateSearch', component: () => import('@/views/Candidate/CandidateSearch.vue') },
      { path: 'profile', name: 'CandidateProfile', component: () => import('@/views/Candidate/CandidateProfile.vue') },
      { path: 'add-profile', name: 'addCandidateProfile', component: AddCandidate },
      { path: 'my-applications', name: 'MyApplications', component: () => import('@/views/Candidate/MyApplications.vue') }
    ]
  },

  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true },
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('token')
      if (token) next()
      else next('/admin/login')
    }
  },
  { path: '/admin/jobs', name: 'AdminJobs', component: AdminJobs, meta: { requiresAuth: true } },
  { path: '/admin/applications', name: 'AdminApplications', component: AdminApplications, meta: { requiresAuth: true } },
  { path: '/admin/comments', name: 'AdminComments', component: AdminComments, meta: { requiresAuth: true } },
  { path: '/admin/analytics', name: 'AdminAnalytics', component: AdminAnalytics, meta: { requiresAuth: true } },
  { path: '/admin/filters', name: 'AdminFilters', component: AdminFilters, meta: { requiresAuth: true } },
  { path: '/admin/payments', name: 'AdminPayments', component: AdminPayments, meta: { requiresAuth: true } },

  { path: '/:catchAll(.*)', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
