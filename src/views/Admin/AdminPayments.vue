<!-- src/views/Admin/AdminPayments.vue -->
<template>
  <div class="admin-dashboard">
    <font-awesome-icon :icon="['fas', 'tachometer-alt']" />
    <font-awesome-icon :icon="['fas', 'credit-card']" />

    <!-- Navbar -->
    <nav class="main-navbar">
      <!-- … (كما في القالب الأصلي) … -->
    </nav>

    <!-- Main Content -->
    <div class="payments-container">
      <div class="header-section">
        <h2 class="page-title">
          <span class="icon">💳</span>
          Payments
        </h2>
      </div>

      <div class="table-wrapper">
        <table class="payments-table">
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Job</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="payment in payments" :key="payment.id">
              <td>{{ payment.application?.candidate?.user?.name || 'N/A' }}</td>
              <td>{{ payment.application?.job?.title || 'N/A' }}</td>
              <td class="amount">{{ payment.amount || 0 }} $</td>
              <td>{{ payment.payment_method || '—' }}</td>
              <td>
                <span :class="['status-badge', (payment.status || '').toLowerCase()]">
                  {{ payment.status }}
                </span>
              </td>
              <td>{{ formatDate(payment.created_at) }}</td>
            </tr>
            <tr v-if="payments.length === 0">
              <td colspan="6" style="text-align: center;">No payments found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '../../../axios'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const payments = ref([])
const user = ref({})

const navItems = [
  { path: '/admin/dashboard', title: 'Dashboard', icon: 'tachometer-alt' },
  { path: '/admin/jobs', title: 'Jobs', icon: 'briefcase' },
  { path: '/admin/applications', title: 'Applications', icon: 'file-alt' },
  { path: '/admin/payments', title: 'Payments', icon: 'credit-card' },
  { path: '/admin/analytics', title: 'Analytics', icon: 'chart-bar' },
  { path: '/admin/filters', title: 'Users', icon: 'users' }
]

const fetchPayments = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get('/api/admin/payments', {
      headers: { Authorization: `Bearer ${token}` }
    })
    payments.value = res.data.data || []
  } catch (e) {
    console.error("Fetch failed", e)
    payments.value = []
  }
}

const fetchUserData = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get('/api/user', {
      headers: { Authorization: `Bearer ${token}` }
    })
  
    user.value = res.data.user || res.data || {}
  } catch (e) {
    console.error("Failed to fetch user data", e)
    user.value = {}
  }
}

const formatDate = (dateString) => {
  return dateString ? new Date(dateString).toLocaleString() : '—'
}

const logout = () => {
  localStorage.removeItem('token')
  window.location.href = '/login'
}

onMounted(() => {
  fetchPayments()
  fetchUserData()
})
</script>

  
  <style scoped>
  .admin-dashboard {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
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
  
  .logo-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: white;
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
  
  .logout-icon {
    margin-right: 5px;
  }
  
  .payments-container {
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
  
  .payments-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .payments-table th {
    background-color: #2f93f7;
    color: white;
    padding: 12px 15px;
    text-align: left;
    font-weight: 500;
  }
  
  .payments-table td {
    padding: 12px 15px;
    border-bottom: 1px solid #e0e6f1;
    color: #2a3f54;
  }
  
  .payments-table tr:last-child td {
    border-bottom: none;
  }
  
  .payments-table tr:hover {
    background-color: rgba(0, 188, 212, 0.05);
  }
  
  .amount {
    font-weight: bold;
    color: #00bcd4;
  }
  
  .status-badge {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 500;
  }
  
  .status-badge.completed,
  .status-badge.success,
  .status-badge.approved {
    background-color: rgba(40, 167, 69, 0.1);
    color: #28a745;
  }
  
  .status-badge.pending {
    background-color: rgba(255, 193, 7, 0.1);
    color: #ffc107;
  }
  
  .status-badge.failed,
  .status-badge.rejected {
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
    
    .payments-table {
      min-width: 600px;
    }
  }
  </style>