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
      <RouterLink to="/">Home</RouterLink>
    
      
    
      
      <div class="auth-buttons">
        <RouterLink to="/login" class="login-btn">Log in</RouterLink>
        <RouterLink to="/employer/jobform" class="post-job-btn">Post A Job</RouterLink>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { ref } from 'vue'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<style scoped>
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
  gap: 1rem;
  margin-left: 1rem;
}

.login-btn {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  color: white;
}

.post-job-btn {
  background: #00e56c;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 0.25rem;
  transition: background 0.3s;
}

.post-job-btn:hover {
  background: #00c45a;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropbtn {
  color: white;
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem 0;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  border-radius: 0.25rem;
  top: 100%;
  left: 0;
}

.dropdown-content a {
  color: #333;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  transition: background-color 0.3s;
}

.dropdown-content a:hover {
  background-color: #f1f1f1;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown:hover .dropbtn {
  opacity: 0.8;
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
  
  .login-btn, .post-job-btn {
    width: 80%;
    margin: 0 auto;
    text-align: center;
  }
  
  .dropdown {
    width: 100%;
    text-align: center;
  }
  
  .dropdown-content {
    position: static;
    display: none;
    width: 100%;
    box-shadow: none;
  }
  
  .dropdown:hover .dropdown-content {
    display: none;
  }
  
  .dropdown.active .dropdown-content {
    display: block;
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