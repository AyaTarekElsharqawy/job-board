<template>
  <div class="admin-dashboard">
    
    <!-- Main Content -->
    <div class="jobs-container">
      <div v-if="message" class="message text-center text-danger" :class="{ error: message.includes('Error') }">
        {{ message }}
      </div>
      <div class="header-section">
        <h2 class="page-title">
          <span class="icon">💼</span>
          Job Management
        </h2>
      </div>

      <div class="table-wrapper">
        <table class="jobs-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Employer</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            
            <tr v-for="job in jobs" :key="job.id">
              <td>{{ job.title }}</td>
              <td>{{ job.employer?.name || 'N/A' }}</td>
              <td>
                <span 
                  :class="[
                    'status-badge', 
                    (job.status || '').toLowerCase()
                  ]"
                >
                  {{ job.status || '—' }}
                </span>
              </td>
              <td class="actions">
                <button 
                  @click="acceptJob(job.id)" 
                  :disabled="['closed', 'published'].includes(job.status?.toLowerCase())"
                  class="action-btn approve"
                >
                  <font-awesome-icon :icon="['fas', 'check']" />
                  Publish
                </button>
                <button 
                  
                  :disabled="['closed', 'rejected'].includes(job.status?.toLowerCase())"
                  class="btn btn-danger action-btn reject" data-bs-toggle="modal" :data-bs-target="'#rejectModal' + job.id "
                >
                  <font-awesome-icon :icon="['fas', 'times']" />
                  Reject
                </button>
              </td>
            </tr>
            <tr v-if="jobs.length === 0">
              <td colspan="4" class="no-jobs">No jobs to display.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-for="job in jobs" :key="'modal-' + job.id">
        <div class="modal fade" :id="'rejectModal' + job.id" tabindex="-1">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Reject Job</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <p>Are you sure you want to reject this job?</p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-danger" @click="rejectJob(job.id)" data-bs-dismiss="modal">Reject</button>
              </div>
            </div>
          </div>
        </div>
      </div>

          <div class="pagination-controls mt-4 text-center">
            <button 
              class="btn btn-sm btn-outline-primary mx-1"
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
            >
              Previous
            </button>

            <span class="mx-2">Page {{ currentPage }} of {{ lastPage }}</span>

            <button 
              class="btn btn-sm btn-outline-primary mx-1"
              :disabled="currentPage === lastPage"
              @click="goToPage(currentPage + 1)"
            >
              Next
            </button>
          </div>

    </div>

        <div class="pagination-controls mt-4 text-center">
          <button 
            class="btn btn-sm btn-outline-primary mx-1"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          >
            Previous
          </button>

  const jobs = ref([])
  const message = ref('')
  const user = ref({})
  const currentPage = ref(1)
  const lastPage = ref(1)


          <button 
            class="btn btn-sm btn-outline-primary mx-1"
            :disabled="currentPage === lastPage"
            @click="goToPage(currentPage + 1)"
          >
            Next
          </button>
        </div>

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/jobs?page=${currentPage.value}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.data.message === "No Jobs at the time!") {
        jobs.value = []
      } else {
        jobs.value = response.data.data
        lastPage.value = response.data.last_page
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
      message.value = 'Error fetching jobs'
    }
  }

  const goToPage = (page) => {
    if (page >= 1 && page <= lastPage.value) {
      currentPage.value = page
      fetchJobs()
    }
  }

<script setup>
import { ref, onMounted } from 'vue'
// import api from '../../../axios'
import axios from 'axios'
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const jobs = ref([])
const message = ref('')
const user = ref({})
const currentPage = ref(1)
const lastPage = ref(1)


// const navItems = [
//   { path: '/admin/dashboard', title: 'Dashboard', icon: 'tachometer-alt' },
//   { path: '/admin/jobs', title: 'Jobs', icon: 'briefcase' },
//   { path: '/admin/applications', title: 'Applications', icon: 'file-alt' },
//   { path: '/admin/payments', title: 'Payments', icon: 'credit-card' },
//   { path: '/admin/analytics', title: 'Analytics', icon: 'chart-bar' },
//   { path: '/admin/filters', title: 'Users', icon: 'users' }
// ]

const fetchJobs = async () => {
  try {
    const response = await axios.get(`http://localhost:8000/api/jobs?page=${currentPage.value}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    if (response.data.message === "No Jobs at the time!") {
      jobs.value = []
    } else {
      jobs.value = response.data.data
      lastPage.value = response.data.last_page
    }
  } catch (error) {
    console.error('Error fetching jobs:', error)
    message.value = 'Error fetching jobs'
  }
}

const goToPage = (page) => {
  if (page >= 1 && page <= lastPage.value) {
    currentPage.value = page
    fetchJobs()
  }
}

  onMounted(() => {
    fetchJobs()
    fetchUserData()
  })
  </script>
    
    <style scoped>
    .pagination-controls button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Reuse the navbar styles from payments page */
    .main-navbar {
      flex-direction: column;
      height: auto;
      padding: 10px;
    }
    
    .navbar-menu {
      flex-direction: column;
      width: 100%;
      margin: 10px 0;
    }
    
    .nav-link {
      width: 100%;
      justify-content: center;
      height: 45px;
    }
    
    .navbar-user {
      width: 100%;
      justify-content: center;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .table-wrapper {
      overflow-x: auto;
    }
    
    .jobs-table {
      min-width: 600px;
    }
    
    .actions {
      flex-direction: column;
    }
  }
  </style>