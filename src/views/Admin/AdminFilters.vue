

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
    <div class="filters-container">
      <div class="header-section">
        <h2 class="page-title">
          <span class="icon">🧩</span>
          User Filters
        </h2>
      </div>

      <div class="table-wrapper">
        <table class="filters-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Filter Details</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="filter in filters" :key="filter.id">
              <td>{{ filter.user?.name }}</td>
              <td class="filter-details">
                <pre>{{ JSON.stringify(JSON.parse(filter.filters_json), null, 2) }}</pre>
              </td>
              <td>{{ new Date(filter.created_at).toLocaleString() }}</td>
              <td>
                <button @click="deleteFilter(filter.id)" class="delete-btn">
                  <FontAwesomeIcon :icon="['fas', 'trash-alt']" />
                  Delete
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

const filters = ref([]);
const message = ref('');

const navItems = [
 { path: '/admin/dashboard', title: 'Dashboard', icon: 'tachometer-alt' },
    { path: '/admin/jobs', title: 'Jobs', icon: 'briefcase' },
    { path: '/admin/applications', title: 'Applications', icon: 'file-alt' },
    { path: '/admin/payments', title: 'Payments', icon: 'credit-card' },
      { path: '/admin/analytics', title: 'Analytics', icon: 'chart-bar' },
    { path: '/admin/filters', title: 'Users', icon: 'users' }
];

const fetchFilters = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get('/api/admin/filters', {
      headers: { Authorization: `Bearer ${token}` }
    });
    filters.value = res.data;
  } catch (e) {
    console.error('Fetch failed', e);
  }
};

const deleteFilter = async (id) => {
  const token = localStorage.getItem('token');
  try {
    await axios.delete(`/api/admin/filters/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    message.value = 'Filter deleted successfully';
    fetchFilters();
  } catch (e) {
    console.error('Delete failed', e);
    message.value = 'An error occurred during deletion';
  }
};

const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

onMounted(fetchFilters);
</script>

<style scoped>
/* Navbar Styles */
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
.filters-container {
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

.filters-table {
  width: 100%;
  border-collapse: collapse;
}

.filters-table th {
  background-color: #2f93f7;
  color: white;
  padding: 12px 15px;
  text-align: left;
  font-weight: 500;
}

.filters-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #e0e6f1;
  color: #2a3f54;
  vertical-align: top;
}

.filters-table tr:last-child td {
  border-bottom: none;
}

.filters-table tr:hover {
  background-color: rgba(0, 188, 212, 0.05);
}

.filter-details pre {
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-width: 500px;
  max-height: 150px;
  overflow: auto;
  padding: 8px;
  background-color: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e0e6f1;
}

.delete-btn {
  padding: 6px 12px;
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s;
}

.delete-btn:hover {
  background-color: rgba(220, 53, 69, 0.2);
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
  
  .filter-details pre {
    max-width: 200px;
  }
}
</style>