import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Public/Home.vue'
import Register from '../views/Auth/Register.vue'
import Login from '../views/Auth/Login.vue'

const routes = [
  { path: '/', name: 'register', component: Register },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  {
    path: '/candidate',
    children: [
      {
        path: 'dashboard',
        name: 'CandidateDashboard',
        component: () => import('@/views/Candidate/CandidateDashboard.vue')
      },
      {
        path: 'search',
        name: 'CandidateSearch',
        component: () => import('@/views/Candidate/CandidateSearch.vue')
      },
      {
        path: 'profile',
        name: 'CandidateProfile',
        component: () => import('@/views/Candidate/CandidateProfile.vue')
      },
      {
        path: '/candidate/resume',
        name: 'CandidateResume',
        component: () => import('@/views/Candidate/MyResume.vue')
      },
      {
        path: '/candidate/my-applications',
        name: 'MyApplications',
        component: () => import('@/views/candidate/MyApplications.vue') 
      }
      
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
