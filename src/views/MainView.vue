<template>
  <div class="main-layout">
    <!-- Top Navigation Bar -->
    <nav class="navbar">
      <div class="navbar-brand">Admin Panel</div>
      <div class="navbar-actions">
        <NotificationCenter />
      </div>
    </nav>

    <!-- Sidebar and Main Content -->
    <div class="content-wrapper">
      <!-- Sidebar -->
      <aside class="sidebar">
        <ul class="menu">
          <li>
            <router-link to="/dashboard" active-class="active">
              <i class="fas fa-tachometer-alt"></i> Dashboard
            </router-link>
          </li>
          <li>
            <router-link to="/dashboard/users" active-class="active">
              <i class="fas fa-users"></i> User Management
            </router-link>
          </li>
          <li>
            <router-link to="/dashboard/jobs" active-class="active">
              <i class="fas fa-briefcase"></i> Job Approvals
            </router-link>
          </li>
          <li>
            <router-link to="/dashboard/comments" active-class="active">
              <i class="fas fa-comments"></i> Comments
            </router-link>
          </li>
          <li>
            <router-link to="/dashboard/analytics" active-class="active">
              <i class="fas fa-chart-line"></i> Analytics
            </router-link>
          </li>
        </ul>
      </aside>

      <!-- Main Content Area -->
      <main class="main-content">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script>
import NotificationCenter from '@/components/NotificationCenter.vue'

export default {
  name: 'MainView',
  components: {
    NotificationCenter
  }
}
</script>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.navbar {
  background-color: #2c3e50;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-brand {
  font-size: 1.5rem;
  font-weight: bold;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.content-wrapper {
  display: flex;
  flex: 1;
}

.sidebar {
  width: 250px;
  background-color: #34495e;
  color: white;
  padding: 1rem 0;
}

.menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu li a {
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
}

.menu li a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.menu li a.active {
  background-color: #42b983;
}

.menu li a i {
  width: 20px;
  text-align: center;
}

.main-content {
  flex: 1;
  padding: 2rem;
  background-color: #f5f7fa;
}
</style>