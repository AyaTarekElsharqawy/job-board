<template>
    <div class="container">
      <h2 class="text-center mb-4">Job Listings</h2>
  
      <div v-if="jobs.length" class="row g-4">
        <div class="col-md-6" v-for="(job, index) in jobs" :key="index">
          <div class="card shadow-sm h-100">
            <div class="card-body">
              <h5 class="card-title">{{ job.title }}</h5>
              <h6 class="card-subtitle mb-2 text-muted">{{ job.location }} | {{ job.work_type }}</h6>
              <p class="card-text"> <strong>Job Description: </strong> {{ job.description }}</p>
              <ul class="list-unstyled">
                <li><strong>Salary:</strong> {{ job.salary }}</li>
                <li><strong>Technologies:</strong> {{ job.technologies }}</li>
                <li><strong>Category:</strong> {{ job.category.name }}</li>
              </ul>
              <button class="btn btn-outline-primary" @click="viewJobDetails(job)">View Details</button>
            </div>
          </div>
        </div>
      </div>
  
      <div v-else class="text-center">
        <p>No jobs available at the moment.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios';
  import { useRouter } from 'vue-router'
  const router = useRouter()
  // Simulated data — replace with API call if needed
  const jobs = ref([])
  
  onMounted(() => {
    const user = localStorage.getItem('user');
    axios.get('http://localhost:8000/api/employers/jobs/4',{
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => {
      console.log(response)
      if(response.message == "You don't have any jobs yet."){
        jobs.value = ["You don't have any jobs yet."];
      }else {
        jobs.value = response.data.data;
        
      }
      
    })
    .catch(error => {
      console.error(error)
    });


  })

  function viewJobDetails(job) {
    router.push({
      path: '/jobs/' + job.id,
    });
  }
  </script>
  
  <style scoped>
  .card {
    border-radius: 10px;
  }
  </style>
  