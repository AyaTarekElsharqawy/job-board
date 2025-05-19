
<template>
  <div class="admin-dashboard">
    <!-- Navbar -->
    <nav class="main-navbar">
      <div class="navbar-brand">
        <router-link to="/dashboard" class="logo-link">
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
          <FontAwesomeIcon :icon="['fas', item.icon]" class="nav-icon" />
          <span class="nav-text">{{ item.title }}</span>
        </router-link>
      </div>
      
      <div class="navbar-user">
        <span class="welcome-msg">Welcome, Admin</span>
        <button @click="logout" class="logout-btn">
          <FontAwesomeIcon :icon="['fas', 'sign-out-alt']" class="logout-icon" />
          <span class="logout-text">Logout</span>
        </button>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="applications-container">
      <div class="header-section">
        <h2 class="page-title">
          <span class="icon">📄</span>
          Manage Applications
        </h2>
      </div>

      <div class="table-wrapper">
        <table class="applications-table">
          <thead>
            <tr>
              <th>Job</th>
              <th>Candidate</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="app in applications" :key="app.id">
              <td>{{ app.job?.title }}</td>
              <td>{{ app.candidate?.user?.name }}</td>
              <td>{{ app.contact_email }}</td>
              <td>{{ app.contact_phone }}</td>
              <td>
                <span :class="['status-badge', app.status.toLowerCase()]">
                  {{ app.status }}
                </span>
              </td>
              <td class="actions">
                <button 
                  @click="updateStatus(app.id, 'accepted')" 
                  :disabled="app.status === 'accepted'"
                  class="action-btn accept"
                >
                  <FontAwesomeIcon :icon="['fas', 'check']" />
                  Accept
                </button>
                <button 
                  @click="updateStatus(app.id, 'rejected')" 
                  :disabled="app.status === 'rejected'"
                  class="action-btn reject"
                >
                  <FontAwesomeIcon :icon="['fas', 'times']" />
                  Reject
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-if="message" class="message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '../../../axios';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const applications = ref([]);
const message = ref('');

const navItems = [
{ path: '/admin/dashboard', title: 'Dashboard', icon: 'tachometer-alt' },
    { path: '/admin/jobs', title: 'Jobs', icon: 'briefcase' },
    { path: '/admin/applications', title: 'Applications', icon: 'file-alt' },
    { path: '/admin/payments', title: 'Payments', icon: 'credit-card' },
      { path: '/admin/analytics', title: 'Analytics', icon: 'chart-bar' },
    { path: '/admin/filters', title: 'Users', icon: 'users' }
];

const fetchApplications = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get('/api/admin/applications', {
      headers: { Authorization: `Bearer ${token}` }
    });
    applications.value = res.data;
  } catch (e) {
    console.error('Fetch error', e);
    message.value = 'Error fetching applications';
  }
};

const updateStatus = async (id, status) => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.patch(
      `/api/admin/applications/${id}/status`, 
      { status }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    message.value = res.data.message;
    fetchApplications();
  } catch (e) {
    console.error('Update error', e);
    message.value = 'Error updating application status';
  }
};

const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

onMounted(() => {
  fetchApplications();
});
</script>

<style scoped>
/* Navbar Styles - Same as previous */
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

/* Main Content Styles */
.applications-container {
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

.applications-table {
  width: 100%;
  border-collapse: collapse;
}

.applications-table th {
  background-color: #2f93f7;
  color: white;
  padding: 12px 15px;
  text-align: left;
  font-weight: 500;
}

.applications-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #e0e6f1;
  color: #2a3f54;
  vertical-align: middle;
}

.applications-table tr:last-child td {
  border-bottom: none;
}

.applications-table tr:hover {
  background-color: rgba(0, 188, 212, 0.05);
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-badge.accepted {
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

.action-btn.accept {
  background-color: rgba(40, 167, 69, 0.1);
  color: #28a745;
}

.action-btn.accept:hover:not(:disabled) {
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
  
  .applications-table {
    min-width: 800px;
  }
  
  .actions {
    flex-direction: column;
  }
}
</style>