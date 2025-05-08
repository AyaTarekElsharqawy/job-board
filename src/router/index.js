import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Public/Home.vue';
import Register from '../views/Auth/Register.vue';
import Login from '../views/Auth/Login.vue';
import JobDetails from '@/components/jobs/JobDetails.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  {
    path: '/job-details/:id',
    name: 'JobDetails',
    component: JobDetails
  },
  {
    path: '/candidate',
    children: [
      {
        path: 'dashboard',
        name: 'CandidateDashboard',
        component: () => import('@/views/Candidate/CandidateDashboard.vue')
      },
      {
        path: 'job-details/:id',
        name: 'JobDetails',
        component: JobDetails
      },
      {
        path: 'job/:id/apply',
        name: 'JobApply',
        component: () => import('@/views/Candidate/JobApplyForm.vue')
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
        path: 'resume',
        name: 'CandidateResume',
        component: () => import('@/views/Candidate/MyResume.vue')
      },
      {
        path: 'my-applications',
        name: 'MyApplications',
        component: () => import('@/views/Candidate/MyApplications.vue')
      },
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;