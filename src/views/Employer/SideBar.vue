<template>
  <div>
    <aside class="shadow-bg bg-white rounded-lg p-4 mb-4 dashboard">
      <router-link class="list-group-item list-group-item-action" :to="{ name: 'EmployerHome' }">Home</router-link>
      <router-link class="list-group-item list-group-item-action" :to="{ name: 'JobForm' }">Post a Job</router-link>
      <router-link class="list-group-item list-group-item-action" :to="{ name: 'JobList' }">Job Listings</router-link>
      <router-link class="list-group-item list-group-item-action" :to="{ name: 'EmployerApplications' }">Applications</router-link>
      <router-link class="list-group-item list-group-item-action" :to="{ name: 'EmployerProfile' }">My Profile</router-link>
    </aside>
  </div>
</template>

<script setup>
    import { RouterLink } from 'vue-router';
</script>

<style>
  .dashboard {
    min-height: 50vh;
  }

  .shadow-bg {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
    padding: 25px;
    margin-bottom: 30px;
    border: 1px solid var(--border-color);
    transition: all 0.3s;
  }
  
  /* This will style the active link */
  .router-link-active, .router-link-exact-active {
    
    color: #000;
    font-weight: bold;
  }
</style>