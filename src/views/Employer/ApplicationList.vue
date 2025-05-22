<template>
  <div class="container">
    <h2 class="text-center mb-4">Job Applications</h2>

    <div v-if="applications.length" class="table-responsive">
      <table class="table table-bordered table-hover">
        <thead class="table-primary">
          <tr>
            <th>#</th>
            <th>Applicant Name</th>
            <th>Email</th>
            <th>Job Title</th>
            <th>Status</th>
            <th>Resume</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(app, index) in applications" :key="app.id">
            <td>{{ index + 1 }}</td>
            <td>{{ app.user.name }}</td>
            <td>{{ app.user.email }}</td>
            <td>{{ app.job.title }}</td>
            <td>
              <a :href="'http://localhost:8000/'+app.resume_snapshot" target="_blank" class="btn btn-sm btn-outline-primary">View Resume</a>
            </td>
            <td>
              <span class="badge"
                    :class="{
                      'bg-warning text-dark': app.status === 'pending',
                      'bg-success': app.status === 'accepted',
                      'bg-danger': app.status === 'rejected'
                    }">
                {{ app.status }}
              </span>
            </td>
            <td>
              <button class="btn btn-sm btn-outline-success me-2" 
                      @click="updateStatus(app.id, 'accepted')"
                      :disabled="['accepted'].includes(app.status)">
                      Accept
              </button>
              <button class="btn btn-sm btn-outline-danger"
                      @click="updateStatus(app.id, 'rejected')"
                      :disabled="['rejected'].includes(app.status)"        
              >
              Reject
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="text-center">
      <p>No applications received yet.</p>
    </div>
  </div>
</template>

<script setup>

import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter();
if (localStorage.getItem('role') !== 'employer') {
        router.push({ path: '/' });
    }
const applications = ref([])
const currUser = JSON.parse(localStorage.getItem('user'));

if (!currUser) {
  router.push('/login')
}

onMounted(() => {
  fetchApps(); 

  return () => clearInterval(interval)
})

async function updateStatus(id, newStatus) {
  

  try {
    await axios.put(`http://localhost:8000/api/applications/${id}/status`, {
      status: newStatus
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).then(() => {
      fetchApps() 
    })

  } catch (error) {
    console.error('Failed to update status:', error)
    alert('Failed to update status. Please try again.')
  }
}

const fetchApps = async () => {
  try {
    const response = await axios.get(`http://localhost:8000/api/employer/applcations/${currUser.id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    if(response.data.message === 'No applications found for this employer.'){
      applications.value = []
    }else{
      applications.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching applications:', error)
  }
}
</script>

<style scoped>
table {
  border-radius: 8px;
  overflow: hidden;
}
</style>
