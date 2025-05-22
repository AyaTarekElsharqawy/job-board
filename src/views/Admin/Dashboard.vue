

<template>
  <div class="admin-dashboard">
      <font-awesome-icon :icon="['fas', 'tachometer-alt']" />
    <font-awesome-icon :icon="['fas', 'credit-card']" />
    <!-- Navigation Bar -->
    <nav class="navbar">
      <div class="navbar-left">
        <img src="../../assets/logo.png" alt="Logo" class="logo">
        <span class="app-name">Admin Panel</span>
      </div>
      <div class="navbar-right">
        <span class="welcome-msg">Welcome, {{ user?.name }}</span>
        <button @click="logout" class="logout-btn">
          Logout
          <FontAwesomeIcon :icon="['fas', 'sign-out-alt']" class="ml-1" />
        </button>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="dashboard-content">
      <h1 class="dashboard-title">Dashboard Overview</h1>
      
      <div class="cards-container">
        <router-link 
          v-for="card in cards" 
          :key="card.path" 
          :to="card.path" 
          class="dashboard-card"
        >
          <div class="card-icon" :style="{ backgroundColor: card.color }">
            <FontAwesomeIcon :icon="['fas', card.icon]" />
          </div>
          <h3>{{ card.title }}</h3>
          <p>{{ card.description }}</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '../../../axios';
import router from '../../router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const user = ref(null);

const cards = ref([
  {
    title: 'Jobs',
    description: 'Manage all job postings',
    path: '/admin/jobs',
    icon: 'briefcase',
    color: '#00bcd4'
  },
  {
    title: 'Applications',
    description: 'View and manage applications',
    path: '/admin/applications',
    icon: 'file-alt',
    color: '#2a3f54'
  },
  {
    title: 'Comments',
    description: 'Moderate user comments',
    path: '/admin/comments',
    icon: 'comment',
    color: '#00bcd4'
  },
  {
    title: 'Analytics',
    description: 'View system analytics',
    path: '/admin/analytics',
    icon: 'chart-line',
    color: '#2a3f54'
  },
  {
    title: 'Filters',
    description: 'Manage saved filters',
    path: '/admin/filters',
    icon: 'filter',
    color: '#00bcd4'
  },
  {
    title: 'Payments',
    description: 'View payment records',
    path: '/admin/payments',
    icon: 'money-bill-wave',
    color: '#2a3f54'
  }
]);

onMounted(async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get('/api/user', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    user.value = res.data;
  } catch (err) {
   router.push('/admin/login');
  }
});

const logout = async () => {
  const token = localStorage.getItem('token');
  await axios.post('/api/logout', {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  localStorage.removeItem('token');
 // router.push('/login');
};
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background-color: rgb(250, 252, 253);
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #2a3f54;
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  height: 40px;
  width: auto;
}

.app-name {
  font-size: 1.2rem;
  font-weight: 600;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.welcome-msg {
  font-weight: 500;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #00bcd4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.logout-btn:hover {
  background-color: #00a4b8;
  transform: translateY(-2px);
}

.dashboard-content {
  padding: 2rem;
}

.dashboard-title {
  color: #2a3f54;
  margin-bottom: 2rem;
  font-size: 1.8rem;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.dashboard-card {
  background: rgb(66, 132, 255);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  text-decoration: none;
  color: #2a3f54;
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.card-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  color: white;
}

.dashboard-card h3 {
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.dashboard-card p {
  color: hsl(211, 24%, 81%);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .cards-container {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  
  .navbar {
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }
  
  .navbar-right {
    width: 100%;
    justify-content: space-between;
  }
}
</style>