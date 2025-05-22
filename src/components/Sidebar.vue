```vue
<template>
  <div class="dashboard-sidebar">
    <div class="user-image">
      <img :src="candidate.profile_picture || 'https://i.ibb.co/0jQ7J3T/candidate-avatar.jpg'" 
           alt="User Image" 
           class="user-avatar">
      <h3 class="user-name">{{ candidate.name }}</h3>
      <p class="user-email">{{ candidate.email }}</p>
    </div>
    
    <div class="dashboard-menu">
      <ul class="menu-list">
        <li v-for="(item, index) in menuItems" :key="index" :class="{ 'active': $route.path === item.path }">
          <router-link :to="item.path" class="menu-item">
            <i :class="item.icon"></i> {{ item.title }}
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'Sidebar',
  setup() {
    const route = useRoute();
    const candidate = ref({
      name: "",
      email: "",
      profile_picture: "https://i.ibb.co/0jQ7J3T/candidate-avatar.jpg",
    });

    const menuItems = ref([
      { path: '/candidate/dashboard', icon: 'lni lni-dashboard', title: 'Dashboard' },
    { path: '/candidate/add-profile', icon: 'lni lni-plus', title: 'Add Profile' },
      { path: '/candidate/profile', icon: 'lni lni-user', title: 'Profile' },
      { path: '/candidate/my-applications', icon: 'lni lni-list', title: 'My Applications' },
    ]);

    const loadCandidateData = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          if (userData) {
            candidate.value.name = userData.name || "Unknown";
            candidate.value.email = userData.email || "No Email";
            candidate.value.profile_picture = userData.profile_picture || candidate.value.profile_picture;
          }
        } catch (error) {
          console.error("Error parsing user data from localStorage:", error);
        }
      } else {
        console.warn("No user data found in localStorage.");
      }
    };

    onMounted(() => {
      loadCandidateData();
    });

    return {
      candidate,
      menuItems,
      $route: route,
    };
  }
};
</script>

<style scoped>
@import url('https://cdn.lineicons.com/3.0/lineicons.css');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

:root {
  --sidebar-bg: #2D3748; /* Dark gray for sidebar */
  --text-primary: #FFFFFF; /* White for text */
  --text-secondary: #A0AEC0; /* Light gray for email */
  --accent-color: #63B3ED; /* Light blue for icons */
  --active-gradient: linear-gradient(90deg, #3182CE, #4A90E2); /* Blue gradient */
  --border-color: #E2E8F0; /* Border color */
}

.dashboard-sidebar {
  background: var(--sidebar-bg);
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: box-shadow 0.3s ease;
  font-family: 'Inter', sans-serif;
}

.dashboard-sidebar:hover {
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
}

.user-image {
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 25px;
}

.user-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--border-color);
  transition: transform 0.3s ease, border-color 0.3s ease;
  margin: 0 auto 15px;
}

.user-avatar:hover {
  transform: scale(1.05);
  border-color: var(--accent-color);
}

.user-name {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.user-email {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 400;
}

.dashboard-menu {
  margin-top: 10px;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px; /* 12px spacing between items */
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: var(--text-primary);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 15px;
  font-weight: 500;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
  color: var(--accent-color);
}

.menu-item i {
  font-size: 18px;
  margin-right: 12px;
  width: 24px;
  text-align: center;
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

.menu-item:hover i {
  color: var(--accent-color);
}

.active .menu-item {
  background: var(--active-gradient);
  color: var(--text-primary);
  font-weight: 600;
}

.active .menu-item i {
  color: var(--text-primary);
}

@media (max-width: 768px) {
  .dashboard-sidebar {
    padding: 20px;
    margin-bottom: 20px;
  }

  .user-avatar {
    width: 100px;
    height: 100px;
  }

  .user-name {
    font-size: 18px;
  }

  .menu-item {
    padding: 10px 15px;
    font-size: 14px;
  }
}
</style>
```