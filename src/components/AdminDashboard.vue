<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>Admin Dashboard</h1>
      <button @click="handleLogout" class="logout-btn">Logout</button>
    </header>
    
    <nav class="dashboard-nav">
      <router-link to="/dashboard/jobs">Jobs</router-link>
      <router-link to="/dashboard/users">Users</router-link>
      <router-link to="/dashboard/comments">Comments</router-link>
    </nav>
    <div class="stats-container">
      <div class="stat-card">
        <h3>Pending Jobs</h3>
        <p>{{ stats.pendingJobs }}</p>
      </div>
      <div class="stat-card">
        <h3>Total Users</h3>
        <p>{{ stats.totalUsers }}</p>
      </div>
      <div class="stat-card">
        <h3>New Comments</h3>
        <p>{{ stats.newComments }}</p>
      </div>
    </div>
    
    <router-view></router-view>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

export default {
  setup() {
    const router = useRouter()
    const stats = ref({
      pendingJobs: 0,
      totalUsers: 0,
      newComments: 0
    })

    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/admin/stats', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`
          }
        })
        stats.value = response.data
      } catch (err) {
        console.error('Failed to fetch stats:', err)
      }
    }

    const handleLogout = () => {
      localStorage.removeItem('adminToken')
      router.push('/login')
    }

    onMounted(() => {
      fetchStats()
    })

    return { stats, handleLogout }
  }
}
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.logout-btn {
  padding: 8px 15px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.dashboard-nav {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.dashboard-nav a {
  text-decoration: none;
  color: #2c3e50;
  padding: 8px 12px;
  border-radius: 4px;
}

.dashboard-nav a.router-link-active {
  background-color: #42b983;
  color: white;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
}

.stat-card h3 {
  margin-top: 0;
  color: #555;
}

.stat-card p {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 0;
}
</style>
