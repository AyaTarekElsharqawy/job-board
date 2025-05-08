import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Public/Home.vue'
import Register from '../views/Auth/Register.vue'
import Login from '../views/Auth/Login.vue'
import JobDetails from '../views/jobs/JopDetails.vue'


const routes = [

  { path: '/login', component: Login, name: 'login' },
  { path: '/register', component: Register, name: 'register' },

  {
    path: '/',
    component: Home
  },
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

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
