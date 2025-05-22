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
  </template>

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

  const fetchUserData = async () => {
    // axios.get('http://localhost:8000/api/user', {
    //   headers: {
    //     'Authorization': `Bearer ${localStorage.getItem('token')}`
    //   }
    // }).then(response => {
    //   user.value = response.data.data
    //   console.log(user.value)
    // }).catch(error => {
    //   console.error('Error fetching user data:', error)
    //   message.value = 'Error fetching user data'
    // })
  }

  const acceptJob = (id) => {
    axios.put(`http://localhost:8000/api/jobs/${id}`, {
      status: 'published'
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).then(response => {
      console.log(response)
      fetchJobs();
    }).catch(error => {
      console.error('Error accepting job:', error)
      message.value = error.response?.data?.message || 'Error accepting job'
    })
  }

  const rejectJob = async (id) => {
  try {
    await axios.put(`http://localhost:8000/api/jobs/${id}`, {
      status: 'rejected'
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    await fetchJobs()

  } catch (error) {
    console.error('Error rejecting job:', error)
    message.value = error.response?.data?.message || 'Error rejecting job'
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
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      background-color: #2a3f54;
      color: white;
      height: 60px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .navbar-brand, .logo-link {
      display: flex;
      align-items: center;
    }
    
    .logo {
      height: 40px;
      margin-right: 10px;
      border-radius: 4px;
    }
    
    .app-name {
      font-weight: bold;
      font-size: 1.2rem;
    }
    
    .navbar-menu {
      display: flex;
      flex-grow: 1;
      justify-content: center;
    }
    
    .nav-link {
      padding: 0 15px;
      height: 60px;
      display: flex;
      align-items: center;
      text-decoration: none;
      color: rgba(255, 255, 255, 0.8);
      transition: all 0.3s;
    }
    
    .nav-link:hover, .nav-link.active {
      color: white;
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    .nav-link.active {
      border-bottom: 3px solid #00bcd4;
    }
    
    .nav-icon {
      margin-right: 8px;
      font-size: 0.9rem;
    }
    
    .nav-text {
      font-size: 0.9rem;
    }
    
    .navbar-user {
      display: flex;
      align-items: center;
    }
    
    .welcome-msg {
      margin-right: 15px;
      font-size: 0.9rem;
    }
    
    .logout-btn {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 8px 12px;
      border-radius: 4px;
      transition: background-color 0.3s;
    }
    
    .logout-btn:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    /* Jobs specific styles */
    .jobs-container {
      flex: 1;
      padding: 20px;
      background-color: #f8f9fa;
    }
    
    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .page-title {
      color: #2a3f54;
      font-size: 1.5rem;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .icon {
      font-size: 1.8rem;
    }
    
    .table-wrapper {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }
    
    .jobs-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .jobs-table th {
      background-color: #2f93f7;
      color: white;
      padding: 12px 15px;
      text-align: left;
      font-weight: 500;
    }
    
    .jobs-table td {
      padding: 12px 15px;
      border-bottom: 1px solid #e0e6f1;
      color: #2a3f54;
    }
    
    .jobs-table tr:last-child td {
      border-bottom: none;
    }
    
    .jobs-table tr:hover {
      background-color: rgba(0, 188, 212, 0.05);
    }
    
    .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
      text-transform: capitalize;
    }
    
    .status-badge.approved {
      background-color: rgba(40, 167, 69, 0.1);
      color: #28a745;
    }
    
    .status-badge.pending {
      background-color: rgba(255, 193, 7, 0.1);
      color: #ffc107;
    }
    
    .status-badge.rejected {
      background-color: rgba(220, 53, 69, 0.1);
      color: #dc3545;
    }
    
    .actions {
      display: flex;
      gap: 8px;
    }
    
    .action-btn {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 0.85rem;
      transition: all 0.2s;
    }
    
    .action-btn.approve {
      background-color: rgba(40, 167, 69, 0.1);
      color: #28a745;
    }
    
    .action-btn.approve:hover:not(:disabled) {
      background-color: rgba(40, 167, 69, 0.2);
    }
    
    .action-btn.reject {
      background-color: rgba(220, 53, 69, 0.1);
      color: #dc3545;
    }
    
    .action-btn.reject:hover:not(:disabled) {
      background-color: rgba(220, 53, 69, 0.2);
    }
    
    .action-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .message {
      margin-top: 20px;
      padding: 10px 15px;
      border-radius: 4px;
      background-color: rgba(40, 167, 69, 0.1);
      color: #28a745;
    }
    
    .message.error {
      background-color: rgba(220, 53, 69, 0.1);
      color: #dc3545;
    }
    
    @media (max-width: 768px) {
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