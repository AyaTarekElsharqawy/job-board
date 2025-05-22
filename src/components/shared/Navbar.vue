<template>
  <nav class="navbar">
    <RouterLink to="/" class="logo-link">
      <img src="@/assets/ll.png" alt="Job Board Logo" class="logo">
    </RouterLink>

    <button class="mobile-menu-btn" @click="toggleMenu">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    </button>

    <div class="nav-links" :class="{ 'active': isMenuOpen }">
    
      <template v-if="userRole === 'candidate'">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/candidate/dashboard">Dashboard</RouterLink>
      </template>

      <template v-else-if="userRole === 'employer'">
        <RouterLink to="/employer">Dashboard</RouterLink>
      </template>

      <template v-else-if="userRole === 'admin'">
        <RouterLink to="/admin/dashboard">Dashboard</RouterLink>
      </template>

      <template v-else>
        <RouterLink to="/">Home</RouterLink>
      </template>

      <div class="auth-buttons">
        <button v-if="isLoggedIn" @click="handleLogout" class="logout-btn">Log out</button>
        <RouterLink v-else to="/login" class="login-btn">Log in</RouterLink>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isMenuOpen = ref(false)

const isLoggedIn = computed(() => !!localStorage.getItem('token'))
const userRole = computed(() => localStorage.getItem('role'))

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  router.push('/login')
  isMenuOpen.value = false
}
</script>

<style scoped>
/* باقي الستايل يبقى كما هو بدون تغيير */
.navbar {
  background: #047fec;
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 0 2rem;
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.logo {
  height: 110px;
  width: auto;
}

.logo-link {
  display: flex;
  align-items: center;
  height: 100%;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.3s;
}

.nav-links a:hover {
  opacity: 0.8;
}

.auth-buttons {
  display: flex;
  gap: 1.5rem;
  margin-left: 1rem;
  align-items: center;
}

.login-btn {
  background: transparent;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 0.25rem;
  border: 2px solid white;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.login-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.logout-btn {
  background: transparent;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 0.25rem;
  border: 2px solid white;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

@media (max-width: 992px) {
  .navbar {
    padding: 0 1rem;
    position: relative;
  }
  
  .logo {
    height: 90px;
  }
  
  .mobile-menu-btn {
    display: block;
    z-index: 1001;
  }
  
  .nav-links {
    position: fixed;
    top: 0;
    right: -100%;
    width: 70%;
    max-width: 300px;
    height: 100vh;
    background: #047fec;
    flex-direction: column;
    justify-content: flex-start;
    padding-top: 80px;
    gap: 1rem;
    transition: right 0.3s ease;
  }
  
  .nav-links.active {
    right: 0;
  }
  
  .nav-links a {
    padding: 1rem;
    width: 100%;
    text-align: center;
  }
  
  .auth-buttons {
    flex-direction: column;
    margin-left: 0;
    width: 100%;
  }
  
  .login-btn, .logout-btn {
    width: 80%;
    margin: 0 auto;
    text-align: center;
  }
}

@media (max-width: 576px) {
  .logo {
    height: 70px;
  }
  
  .nav-links {
    width: 80%;
  }
}
</style>