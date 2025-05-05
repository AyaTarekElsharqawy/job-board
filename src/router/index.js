import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Public/Home.vue')
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
        path: 'search',
        name: 'CandidateSearch',
        component: () => import('@/views/Candidate/CandidateSearch.vue')
      },
      {
        path: 'profile',
        name: 'CandidateProfile',
        component: () => import('@/views/Candidate/CandidateProfile.vue')
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;