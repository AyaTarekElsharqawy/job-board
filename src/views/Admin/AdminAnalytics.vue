<template>
  <div class="admin-dashboard">
    <!-- Navbar -->
    <nav class="main-navbar">
      <div class="navbar-brand">
        <router-link to="/dashboard">
          <img src="../../assets/logo.png" alt="Logo" class="logo">
        </router-link>
      </div>
      
      <div class="navbar-menu">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-link"
          active-class="active"
        >
          <font-awesome-icon :icon="['fas', item.icon]" />
          <span>{{ item.title }}</span>
        </router-link>
      </div>

      <div class="navbar-user">
        <span>Welcome, {{ user?.name || '—' }}</span>
        <button @click="logout">
          <font-awesome-icon :icon="['fas', 'sign-out-alt']" />
          Logout
        </button>
      </div>
    </nav>

    <!-- Analytics Table -->
    <div class="analytics-container">
      <h2>📊 Job Analytics</h2>
      <table>
        <thead>
          <tr>
            <th>Job</th>
            <th>Views</th>
            <th>Applications</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in analytics" :key="item.id">
            <td>{{ item.job?.title || '—' }}</td>
            <td>{{ item.views_count }}</td>
            <td>{{ item.applications_count }}</td>
            <td>{{ item.updated_at ? new Date(item.updated_at).toLocaleString() : '—' }}</td>
          </tr>
          <tr v-if="analytics.length === 0">
            <td colspan="4">No analytics data found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '../../../axios'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const analytics = ref([])

const logout = () => {
  localStorage.removeItem('token')
  window.location.href = '/login'
}

const fetchAnalytics = async () => {
  try {
    const response = await axios.get('/api/admin/jobs')
    analytics.value = response.data.data
  } catch (error) {
    console.error('Error fetching analytics:', error)
    if (error.response?.status === 401) {
      logout()
    }
  }
}

onMounted(() => {
  fetchAnalytics()
})

const user = ref({ name: 'Admin' }) 
const navItems = [
  { title: 'Dashboard', path: '/dashboard', icon: 'tachometer-alt' },
  { title: 'Jobs', path: '/admin/jobs', icon: 'briefcase' },
  { title: 'Users', path: '/admin/users', icon: 'users' },
  { title: 'Analytics', path: '/admin/analytics', icon: 'chart-bar' },
]
</script>



<style scoped>
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

.navbar-brand {
  display: flex;
  align-items: center;
}

.logo {
  height: 40px;
  margin-right: 10px;
  border-radius: 4px;
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

.analytics-container {
  flex: 1;
  padding: 20px;
  background-color: #f8f9fa;
  min-height: calc(100vh - 60px);
}

.header-section {
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

.analytics-table {
  width: 100%;
  border-collapse: collapse;
}

.analytics-table th {
  background-color: #2f93f7;
  color: white;
  padding: 12px 15px;
  text-align: left;
  font-weight: 500;
}

.analytics-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #e0e6f1;
  color: #2a3f54;
  vertical-align: middle;
}

.analytics-table tr:last-child td {
  border-bottom: none;
}

.analytics-table tr:hover {
  background-color: rgba(0, 188, 212, 0.05);
}

.count-cell {
  font-weight: bold;
  color: #00bcd4;
  text-align: center;
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
  
  .analytics-table {
    min-width: 600px;
  }
}
</style>
