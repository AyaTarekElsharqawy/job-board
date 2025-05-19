import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Public/Home.vue'
import Register from '../views/Auth/Register.vue'
import Login from '../views/Auth/Login.vue'
import EmployerDashboard from '@/views/Employer/EmployerDashboard.vue'
import JobForm from '@/views/Employer/JobForm.vue'
import EmployerHome from '@/views/Employer/EmployerHome.vue'
import JobDetails from '../views/jobs/JopDetails.vue'
import AdminLogin from '../views/Admin/Login_test.vue';
import AdminJobs from '../views/Admin/AdminJobs.vue';
import Dashboard from '../views/Admin/Dashboard.vue';  
import AdminComments from '../views/Admin/AdminComments.vue';
import AdminApplications from '../views/Admin/AdminApplications.vue';
import AdminAnalytics from '../views/Admin/AdminAnalytics.vue';
import AdminFilters from '../views/Admin/AdminFilters.vue';
import AdminPayments from '../views/Admin/AdminPayments.vue';


const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login, name: 'login' },
  { path: '/register', component: Register, name: 'register' },
  {
    path: '/job-details/:id',
    name: 'JobDetails',
    component: JobDetails
  },

  {
    path: '/browse-jobs',
    name: 'BrowseJobs',
    component: () => import('@/views/jobs/BrowsJobs.vue')
  }
  
  // {
  //   path: '/job-details',
  //   name: 'job-details',
  //   component: JobDetails
  // }
  , {
    path: '/jobs/:id',
    name: 'JobDetails',
    component: JobDetails,
    props: true
  }

,
  
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
        component: () => import('@/views/Employer/JobList.vue')
      },
      {
        path: 'applications',
        name: 'Applications',
        component: () => import('@/views/Employer/ApplicationList.vue')
      }
            
    ]
  },
  {
    path: '/candidate',
    children: [
      {
        path: 'dashboard',
        name: 'CandidateDashboard',
        component: () => import('@/views/Candidate/CandidateDashboard.vue')
      },
      // {
      //   path: 'job-details/:id',
      //   name: 'JobDetails',
      //   component: JobDetails
      // },
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
  },
  {
   path: '/admin/login',
  name: 'AdminLogin',
  component: AdminLogin,
},
   { path: '/admin/jobs',
    component: AdminJobs,
    meta: { requiresAuth: true } 
},
 { path: '/admin/applications',
     component: AdminApplications,
      meta: { requiresAuth: true } 
},

{ path: '/admin/comments',
     component: AdminComments,
      meta: { requiresAuth: true } },

      { path: '/admin/analytics',
         component: AdminAnalytics,
          meta: { requiresAuth: true } 
        },

          { path: '/admin/filters', 
            component: AdminFilters,
             meta: { requiresAuth: true } 
            },


  
  { path: '/admin/payments',
     component: AdminPayments,
      meta: { requiresAuth: true } },


      
        

  {
    path: '/admin/dashboard',
    name: 'Dashboard',
    component: Dashboard, 
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('token');
      if (token) {
        next();  
      } else {
        next('/login');  
      }
    }
  }

];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;