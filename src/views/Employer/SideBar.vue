<template>
  <div>
    <aside >
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

</style>