<template>
  <div class="container">
    <h2 class="text-center mb-4">Job Listings</h2>

    <div v-if="jobs.length && jobs[0] !== 'You don\'t have any jobs yet.'" class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th scope="col">Job Title</th>
            <th scope="col">Technologies</th>
            <th scope="col">Salary</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(job, index) in jobs" :key="index">
            <td>
              <div>
                <strong>{{ job.title }}</strong>
                <br>
                <small class="text-muted">{{ job.location }} | {{ job.work_type }}</small>
              </div>
            </td>
            <td>
              <span class="badge bg-secondary me-1" v-for="tech in getTechnologiesArray(job.technologies)" :key="tech">
                {{ tech }}
              </span>
            </td>
            <td>{{ job.salary }}</td>
            <td>
              <span class="badge" :class="getStatusBadgeClass(job.status)">
                {{ job.status || 'Active' }}
              </span>
            </td>
            <td>
              <button class="btn btn-outline-primary btn-sm" @click="viewJobDetails(job)">
                <i class="fas fa-eye me-1"></i>View Details
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="text-center">
      <div class="alert alert-info" role="alert">
        <i class="fas fa-info-circle me-2"></i>
        {{ jobs[0] === "You don't have any jobs yet." ? jobs[0] : "No jobs available at the moment." }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios';
import { useRouter } from 'vue-router'
const router = useRouter()

const jobs = ref([])
const currUser = JSON.parse(localStorage.getItem('user'))
onMounted(() => {
  const user = localStorage.getItem('user');
  axios.get(`http://localhost:8000/api/employers/jobs/${currUser.id}`,{
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

function getTechnologiesArray(technologies) {
  if (!technologies) return [];
  if (typeof technologies === 'string') {
    return technologies.split(',').map(tech => tech.trim());
  }
  return Array.isArray(technologies) ? technologies : [];
}

function getStatusBadgeClass(status) {
  const statusLower = (status || 'active').toLowerCase();
  switch(statusLower) {
    case 'active':
      return 'bg-success';
    case 'closed':
      return 'bg-danger';
    case 'paused':
      return 'bg-warning';
    case 'draft':
      return 'bg-secondary';
    default:
      return 'bg-primary';
  }
}
</script>

<style scoped>
.table {
  border-radius: 10px;
  overflow: hidden;
}

.table th {
  border-top: none;
  font-weight: 600;
}

.badge {
  font-size: 0.75em;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .table-responsive {
    font-size: 0.875rem;
  }
  
  .btn-sm {
    padding: 0.2rem 0.4rem;
    font-size: 0.75rem;
  }
}
</style>