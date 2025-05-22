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
            <th>Resume</th>
            <th>Status</th>
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
              <a :href="getResumeUrl(app.resume_snapshot)" target="_blank" download>View Resume</a>
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
                      :disabled="['rejected'].includes(app.status)"
                      data-bs-toggle="modal" :data-bs-target="'#rejectModal' + app.id"> 
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

    <!-- Reject Modal -->
    <div v-for="app in applications" :key="'modal-' + app.id">
      <div class="modal fade" :id="'rejectModal' + app.id" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Reject Job</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p>Are you sure you want to reject this job?</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-danger" @click="updateStatus(app.id, 'rejected')" data-bs-dismiss="modal">Reject</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter();
const applications = ref([]);
const currUser = JSON.parse(localStorage.getItem('user'));

if (!currUser) {
  router.push('/login');
}
if (localStorage.getItem('role') !== 'employer') {
  router.push({ path: '/' });
}

onMounted(() => {
  fetchApps(); 
})

async function fetchApps() {
  try {
    const response = await axios.get(`http://localhost:8000/api/employer/applications/${currUser.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.data.message === 'No applications found for this employer.') {
      applications.value = [];
    } else {
      applications.value = response.data.data; // pagination: data موجودة جوا key اسمه data
    }

  } catch (error) {
    console.error('Error fetching applications:', error);
  }
}

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
    });
    fetchApps(); // refresh
  } catch (error) {
    console.error('Failed to update status:', error);
    alert('Failed to update status. Please try again.');
  }
}

function getResumeUrl(filename) {
  return `http://localhost:8000/storage/${filename}`;
}
</script>

<style scoped>
table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

thead th {
  background-color: #007bff;
  color: #fff;
  text-align: center;
  vertical-align: middle;
}

tbody td {
  vertical-align: middle;
  text-align: center;
}

.badge {
  font-size: 0.9rem;
  padding: 0.5em 0.75em;
  border-radius: 0.75rem;
}

button.btn {
  min-width: 80px;
}

.table td, .table th {
  padding: 1rem;
}

.table-hover tbody tr:hover {
  background-color: #f1f1f1;
}

.modal-title {
  font-weight: bold;
}
</style>